import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BffService } from '../../services/bff.service';
import { MsalService } from '@azure/msal-angular';

import { HeroPickupComponent } from './components/hero-pickup.component';
import { TruckTrackingComponent } from './components/truck-tracking.component';
import { ImpactMetricsComponent } from './components/impact-metrics.component';
import { PickupHistoryComponent } from './components/pickup-history.component';
import { PickupFormComponent } from './components/pickup-form.component';
import { AdminDashboardComponent } from './components/admin-dashboard.component';
import { CoordinadorDashboardComponent } from './components/coordinador-dashboard.component';
import { ChoferDashboardComponent } from './components/chofer-dashboard.component';
import { SpecialServiceCardComponent } from './components/special-service-card.component';
import { InteractiveMapComponent } from './components/interactive-map.component';
import { RutaModalComponent } from './components/ruta-modal.component';
import { AuditoriaModalComponent } from './components/auditoria-modal.component';
import { ProgramarModalComponent } from './components/modals/programar-modal.component';
import { ChoferOperacionModalComponent } from './components/modals/chofer-operacion-modal.component';
import { PesajeModalComponent } from './components/modals/pesaje-modal.component';
import { CancelarModalComponent } from './components/modals/cancelar-modal.component';

import {
  Sector,
  Waypoint,
  Residuo,
  Camion,
  Pickup,
  DEFAULT_SECTORES,
  DEFAULT_RESIDUOS,
  DEFAULT_CAMIONES,
  DEFAULT_ROTACION_SEMANAL,
  RotacionSemanal,
  getNextDateForDay
} from './data/sectors.data';
import { DAY_NAME_TO_NUMBER } from './utils/sector.utils';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeroPickupComponent,
    TruckTrackingComponent,
    ImpactMetricsComponent,
    PickupHistoryComponent,
    PickupFormComponent,
    AdminDashboardComponent,
    CoordinadorDashboardComponent,
    ChoferDashboardComponent,
    SpecialServiceCardComponent,
    InteractiveMapComponent,
    RutaModalComponent,
    AuditoriaModalComponent,
    ProgramarModalComponent,
    ChoferOperacionModalComponent,
    PesajeModalComponent,
    CancelarModalComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  userName = '';
  userEmail = '';
  userRoles: string[] = [];

  sectores: Sector[] = [...DEFAULT_SECTORES];
  selectedSector = 'Costanera Sur y Llanquihue Sur';
  userActiveAddress = 'Calle Los Guindos 450, Costanera, Puerto Varas';

  residuos: Residuo[] = [...DEFAULT_RESIDUOS];
  pickups: Pickup[] = [];
  /**
   * Inicializado vacío: si el catálogo responde, se reemplaza con datos reales de PostgreSQL.
   * Si falla, loadCamiones() carga DEFAULT_CAMIONES como fallback offline explícito.
   */
  camionesDisponibles: Camion[] = [];

  /**
   * Rotación semanal de residuos desde ms-reciclago-catalog.
   * Inicializado con el fallback calculado localmente (misma lógica que el backend).
   * Se reemplaza con datos reales cuando el catálogo responde.
   */
  rotacionSemanal: RotacionSemanal = DEFAULT_ROTACION_SEMANAL;

  showRutaModal = false;
  showActionModal = false;
  selectedPickupForAction: Pickup | null = null;
  actionType: 'programar' | 'en-ruta' | 'retirado' | 'pesado' | 'cancelar' = 'programar';

  truckSimulationRunning = true;
  truckSpeed = 1;
  currentTruckIndex = 0;
  truckWaypoints: Waypoint[] = [];
  private truckTimer: ReturnType<typeof setInterval> | null = null;

  activeStaffRole: 'Admin' | 'Coordinador' | 'Chofer' = 'Admin';

  hasRole(role: string): boolean {
    return this.userRoles.some(r => r.toLowerCase() === role.toLowerCase());
  }

  get currentSectorInfo(): Sector | null {
    const sec = this.sectores.find(s => s.nombre === this.selectedSector) || this.sectores[0] || null;
    if (!sec) return null;
    return {
      ...sec,
      fechaTexto: getNextDateForDay(sec.dia)
    };
  }

  get isStaff(): boolean {
    return this.hasRole('Admin') || this.hasRole('Coordinador') || this.hasRole('Chofer');
  }

  get isCamionEnRuta(): boolean {
    const sec = this.currentSectorInfo;
    if (!sec) return false;
    if (typeof sec.enRuta === 'boolean') return sec.enRuta;
    const today = new Date().getDay();
    const isToday = (DAY_NAME_TO_NUMBER[(sec.dia || '').toLowerCase()] ?? 2) === today;
    const hour = new Date().getHours();
    return isToday && (hour >= 8 && hour < 17);
  }

  get activeWaypoint(): Waypoint {
    return this.truckWaypoints[this.currentTruckIndex] || this.truckWaypoints[0] || {
      name: 'Ruta activa', detail: 'Recorriendo cuadrante', eta: '5 min', distancia: '200 m', x: 50, y: 50, estado: 'En ruta'
    };
  }

  get activeCamionPatente(): string {
    const activeP = this.pickups.find(p => p.estado === 'EN_RUTA');
    return activeP?.camionPatente || this.currentSectorInfo?.patente || 'PV-RC-2026';
  }

  /**
   * Nombre del residuo que se recolecta esta semana según la rotación municipal.
   * Usa el dato real del catálogo; si no está disponible, usa el fallback local.
   */
  get materialSemanalNombre(): string {
    return this.rotacionSemanal?.residuoNombre || DEFAULT_ROTACION_SEMANAL.residuoNombre;
  }

  /**
   * Código del residuo semanal (ej: 'PLASTICO_PET').
   * Útil para lógica condicional en subcomponentes.
   */
  get materialSemanalCodigo(): string {
    return this.rotacionSemanal?.residuoCodigo || DEFAULT_ROTACION_SEMANAL.residuoCodigo;
  }

  constructor(
    private bffService: BffService,
    private authService: MsalService
  ) {}

  ngOnInit(): void {
    const account = this.authService.instance.getActiveAccount() || this.authService.instance.getAllAccounts()[0];
    if (account) {
      this.userName = account.name || account.username || '';
      const claims = account.idTokenClaims as Record<string, any> | undefined;
      if (claims) {
        if (Array.isArray(claims['roles'])) {
          this.userRoles = [...claims['roles']];
        } else if (typeof claims['roles'] === 'string') {
          this.userRoles = [claims['roles']];
        }
        this.userEmail = (claims['preferred_username'] || claims['upn'] || account.username || '') as string;
      } else {
        this.userEmail = account.username || '';
      }
    }

    this.syncDefaultStaffRole();

    // Sincronizar roles desde el Access Token a través de /api/me
    this.bffService.getProfile().subscribe({
      next: (profile) => {
        let changed = false;
        if (profile && Array.isArray(profile.roles) && profile.roles.length > 0) {
          this.userRoles = Array.from(new Set([...this.userRoles, ...profile.roles]));
          this.syncDefaultStaffRole();
          changed = true;
        }
        if (profile && (profile.email || profile.username) && !this.userEmail) {
          this.userEmail = profile.email || profile.username || '';
          changed = true;
        }
        if (profile && profile.name && !this.userName) {
          this.userName = profile.name;
        }
        if (changed) {
          this.loadPickups();
        }
      },
      error: () => {}
    });

    this.truckWaypoints = this.currentSectorInfo?.waypoints || [];
    this.loadResiduos();
    this.loadPickups();
    this.loadCuadrantes();
    this.loadCamiones();
    this.loadRotacionSemanal();
    this.loadLiveTracking();
    this.startTruckSimulation();
  }

  ngOnDestroy(): void {
    if (this.truckTimer) {
      clearInterval(this.truckTimer);
      this.truckTimer = null;
    }
    document.body.style.overflow = '';
  }

  syncDefaultStaffRole(): void {
    if (this.hasRole('Chofer') && !this.hasRole('Admin') && !this.hasRole('Coordinador')) {
      this.activeStaffRole = 'Chofer';
    } else if (this.hasRole('Coordinador') && !this.hasRole('Admin')) {
      this.activeStaffRole = 'Coordinador';
    } else {
      this.activeStaffRole = 'Admin';
    }
  }

  setActiveStaffRole(role: 'Admin' | 'Coordinador' | 'Chofer'): void {
    this.activeStaffRole = role;
  }

  onHeaderSectorChange(): void {
    this.onSectorSelect(this.selectedSector);
  }

  onSectorSelect(sector: string): void {
    this.selectedSector = sector;
    this.userActiveAddress = `${sector}, Puerto Varas`;
    this.truckWaypoints = this.currentSectorInfo?.waypoints || [];
    this.currentTruckIndex = 0;
    this.loadLiveTracking();
  }

  startTruckSimulation(): void {
    if (this.truckTimer) clearInterval(this.truckTimer);
    const intervalMs = this.truckSpeed === 2 ? 1800 : 3500;
    this.truckTimer = setInterval(() => {
      if (this.truckSimulationRunning && this.isCamionEnRuta && this.truckWaypoints.length > 0) {
        this.currentTruckIndex = (this.currentTruckIndex + 1) % this.truckWaypoints.length;
      }
    }, intervalMs);
  }

  toggleTruckSimulation(): void {
    this.truckSimulationRunning = !this.truckSimulationRunning;
  }

  toggleTruckSpeed(): void {
    this.truckSpeed = this.truckSpeed === 1 ? 2 : 1;
    this.startTruckSimulation();
  }

  resetTruckSimulation(): void {
    this.currentTruckIndex = 0;
    this.truckSimulationRunning = true;
    this.startTruckSimulation();
  }

  loadResiduos(): void {
    this.bffService.getResiduos().subscribe({
      next: (data) => this.residuos = (data && data.length > 0) ? data : [...DEFAULT_RESIDUOS],
      error: () => this.residuos = [...DEFAULT_RESIDUOS]
    });
  }

  loadPickups(): void {
    const emailFilter = !this.isStaff && this.userEmail ? this.userEmail : undefined;
    this.bffService.getPickups(emailFilter).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          const filtered = (!this.isStaff && this.userEmail)
            ? data.filter((p: any) => p.vecinoEmail && p.vecinoEmail.toLowerCase() === this.userEmail.toLowerCase())
            : data;
          this.pickups = filtered.map((p: any) => ({
            ...p,
            fecha: p.fechaSolicitud ? p.fechaSolicitud.split('T')[0] : (p.fecha || ''),
            fechaTexto: p.fechaProgramada 
              ? new Date(p.fechaProgramada).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
              : (p.fechaTexto || (p.fechaSolicitud ? new Date(p.fechaSolicitud).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Hoy')),
            kilosRecolectados: p.pesoRealKg != null ? p.pesoRealKg : (p.estado === 'PESADO' ? (p.kilosRecolectados || null) : null),
            pesoRealKg: p.pesoRealKg != null ? p.pesoRealKg : null,
            pesoEstimadoKg: p.pesoEstimadoKg != null ? p.pesoEstimadoKg : null,
            comentarios: p.observaciones || p.comentarios || ''
          }));
        } else {
          this.pickups = [];
        }
      },
      error: () => this.pickups = []
    });
  }

  loadCuadrantes(): void {
    this.bffService.getCuadrantes().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          data.forEach((c: any) => {
            const sec = this.sectores.find(s => s.numero === c.numero || s.nombre?.toLowerCase().includes(c.sector?.toLowerCase()));
            if (sec) {
              sec.id = c.id;
              sec.cuadrante = c.nombre;
              sec.dia = c.diaSemana ? (c.diaSemana.charAt(0).toUpperCase() + c.diaSemana.slice(1).toLowerCase()) : sec.dia;
              sec.horario = c.horario || sec.horario;
              if (c.camionPatente) sec.patente = c.camionPatente;
              if (c.callesPrincipales) sec.calles = c.callesPrincipales;
              (sec as any).enRuta = Boolean(c.camionEnRuta);
            }
          });
        }
      },
      error: () => {}
    });
  }

  loadCamiones(): void {
    this.bffService.getCamiones().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          // Mapear capacidadTotalKg -> capacidadKilos para compatibilidad con el template
          this.camionesDisponibles = data.map((c: any) => ({
            ...c,
            capacidadKilos: c.capacidadKilos ?? c.capacidadTotalKg ?? c.capacidadMaximaKg ?? 0
          }));
        } else {
          this.camionesDisponibles = [...DEFAULT_CAMIONES];
        }
      },
      // Fallback offline explícito: si el catálogo no responde, usar datos de demostración
      error: () => this.camionesDisponibles = [...DEFAULT_CAMIONES]
    });
  }

  /**
   * Carga la rotación semanal de residuos desde ms-reciclago-catalog vía BFF.
   * Si el catálogo no está disponible, mantiene el fallback calculado localmente
   * (DEFAULT_ROTACION_SEMANAL) que usa la misma lógica modular que el backend.
   */
  loadRotacionSemanal(): void {
    this.bffService.getRotacionSemanal().subscribe({
      next: (data) => {
        if (data && data.residuoCodigo && !data.error) {
          this.rotacionSemanal = data as RotacionSemanal;
        }
        // Si viene un objeto de error (503 del BFF), se mantiene el fallback local
      },
      error: () => {
        // Mantener rotacionSemanal = DEFAULT_ROTACION_SEMANAL (ya inicializado)
      }
    });
  }

  onCamionEstadoCambiado(camionActualizado: Camion): void {
    const index = this.camionesDisponibles.findIndex(c => c.id === camionActualizado.id || c.patente === camionActualizado.patente);
    if (index !== -1) {
      this.camionesDisponibles[index] = { ...this.camionesDisponibles[index], ...camionActualizado };
      this.camionesDisponibles = [...this.camionesDisponibles];
    }
  }

  loadLiveTracking(): void {
    const activeSec = this.sectores.find(s => s.nombre === this.selectedSector);
    const cuadranteId = activeSec?.id || 2;
    this.bffService.getTracking(cuadranteId).subscribe({
      next: (tracking) => {
        if (tracking && tracking.calleActual && this.truckWaypoints.length > 0) {
          this.truckWaypoints[0] = {
            name: tracking.calleActual,
            detail: `Camión ${tracking.camionPatente || 'PV-RC-2026'} en ${tracking.estado || 'EN_RUTA'} (${tracking.velocidad || 25} km/h)`,
            eta: 'En sector',
            distancia: 'En ruta',
            x: 50,
            y: 50,
            estado: tracking.estado || 'En ruta'
          };
        }
      },
      error: () => {}
    });
  }

  openActionModal(event: { pickup: Pickup, action: 'programar' | 'en-ruta' | 'retirado' | 'pesado' | 'cancelar' }): void {
    this.selectedPickupForAction = event.pickup;
    this.actionType = event.action;
    this.showActionModal = true;
  }

  onActionCompleted(): void {
    this.loadPickups();
  }

  onPickupCreated(nuevo: Pickup): void {
    this.pickups.unshift(nuevo);
    if (nuevo.direccion) {
      this.userActiveAddress = nuevo.direccion;
    }
    this.loadPickups();
  }

  onStaffPickupCreated(data: any): void {
    const resObj = this.residuos.find(r => r.id === Number(data.residuoId));
    const payload = {
      vecinoEmail: data.vecinoEmail || 'vecino.contacto@puertovaras.cl',
      vecinoNombre: data.vecinoNombre || 'Vecino Puerto Varas',
      direccion: data.direccion,
      comuna: data.comuna || 'Puerto Varas',
      residuoId: Number(data.residuoId || 1),
      residuoNombre: data.residuoNombre || (resObj ? resObj.nombre : 'Vidrio'),
      pesoEstimadoKg: Number(data.pesoEstimadoKg) || 5.0,
      comentarios: data.comentarios || '',
      observaciones: data.observaciones || data.comentarios || ''
    };
    this.bffService.createPickup(payload).subscribe({
      next: (created) => {
        this.pickups.unshift(created);
        this.loadPickups();
      },
      error: (err) => {
        console.error('Error al registrar solicitud en microservicio:', err);
      }
    });
  }

  openRutaModal(): void {
    this.showRutaModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeRutaModal(): void {
    this.showRutaModal = false;
    document.body.style.overflow = '';
  }

  showAuditoriaModal = false;
  auditoriaList: Pickup[] = [];
  auditoriaPage = 0;
  auditoriaTotalPages = 1;
  auditoriaTotalElements = 0;
  isLoadingAuditoria = false;

  openAuditoriaModal(): void {
    this.showAuditoriaModal = true;
    document.body.style.overflow = 'hidden';
    this.loadAuditoria(0);
  }

  closeAuditoriaModal(): void {
    this.showAuditoriaModal = false;
    document.body.style.overflow = '';
  }

  loadAuditoria(page: number = 0): void {
    this.isLoadingAuditoria = true;
    this.auditoriaPage = page;
    this.bffService.getPickupsHistory('', '', page, 8).subscribe({
      next: (res) => {
        this.isLoadingAuditoria = false;
        if (res && res.content) {
          this.auditoriaList = res.content;
          this.auditoriaTotalPages = res.totalPages || 1;
          this.auditoriaTotalElements = res.totalElements || res.content.length;
        } else if (Array.isArray(res)) {
          this.auditoriaList = res;
          this.auditoriaTotalPages = 1;
          this.auditoriaTotalElements = res.length;
        } else {
          this.auditoriaList = this.pickups;
        }
      },
      error: () => {
        this.isLoadingAuditoria = false;
        this.auditoriaList = this.pickups;
      }
    });
  }

  scrollToSolicitud(): void {
    document.getElementById('solicitud-retiro')?.scrollIntoView({ behavior: 'smooth' });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.showRutaModal = false;
    this.showActionModal = false;
    this.showAuditoriaModal = false;
    document.body.style.overflow = '';
  }
}
