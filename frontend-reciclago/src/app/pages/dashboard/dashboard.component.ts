import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BffService } from '../../services/bff.service';
import { MsalService } from '@azure/msal-angular';

import { HeroPickupComponent } from './components/hero-pickup.component';
import { TruckTrackingComponent } from './components/truck-tracking.component';
import { ImpactMetricsComponent } from './components/impact-metrics.component';
import { PickupHistoryComponent } from './components/pickup-history.component';
import { PickupFormComponent } from './components/pickup-form.component';
import { StaffModalComponent } from './components/staff-modal.component';
import { AdminDashboardComponent } from './components/admin-dashboard.component';
import { CoordinadorDashboardComponent } from './components/coordinador-dashboard.component';
import { ChoferDashboardComponent } from './components/chofer-dashboard.component';

import {
  Sector,
  Waypoint,
  Residuo,
  Camion,
  Pickup,
  DEFAULT_SECTORES,
  DEFAULT_PICKUPS,
  DEFAULT_RESIDUOS,
  DEFAULT_CAMIONES,
  getNextDateForDay
} from './data/sectors.data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HeroPickupComponent,
    TruckTrackingComponent,
    ImpactMetricsComponent,
    PickupHistoryComponent,
    PickupFormComponent,
    StaffModalComponent,
    AdminDashboardComponent,
    CoordinadorDashboardComponent,
    ChoferDashboardComponent
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
  camionesDisponibles: Camion[] = [...DEFAULT_CAMIONES];

  showRutaModal = false;
  showActionModal = false;
  selectedPickupForAction: any = null;
  actionType: 'programar' | 'en-ruta' | 'retirado' | 'pesado' | 'cancelar' = 'programar';

  truckSimulationRunning = true;
  truckSpeed = 1;
  currentTruckIndex = 0;
  truckWaypoints: Waypoint[] = [];
  private truckTimer: any = null;

  activeStaffRole: 'Admin' | 'Coordinador' | 'Chofer' = 'Admin';

  hasRole(role: string): boolean {
    return this.userRoles.some(r => r && r.trim().toLowerCase() === role.toLowerCase());
  }

  get isStaff(): boolean {
    return this.hasRole('Admin') || this.hasRole('Coordinador') || this.hasRole('Chofer');
  }

  get currentSectorInfo(): Sector {
    const sec = this.sectores.find(s => s.nombre === this.selectedSector) || this.sectores[0];
    return {
      ...sec,
      fechaTexto: getNextDateForDay(sec.dia)
    };
  }

  get isCamionEnRuta(): boolean {
    const sec = this.currentSectorInfo;
    if (!sec) return false;
    if (typeof (sec as any).enRuta === 'boolean') return (sec as any).enRuta;
    const dayMap: Record<string, number> = {
      'DOMINGO': 0, 'LUNES': 1, 'MARTES': 2, 'MIÉRCOLES': 3, 'MIERCOLES': 3, 'JUEVES': 4, 'VIERNES': 5, 'SÁBADO': 6, 'SABADO': 6
    };
    const today = new Date().getDay();
    const isToday = dayMap[(sec.dia || '').toUpperCase()] === today;
    const hour = new Date().getHours();
    return isToday && (hour >= 8 && hour < 17);
  }

  get activeWaypoint(): Waypoint {
    return this.truckWaypoints[this.currentTruckIndex] || this.truckWaypoints[0] || {
      name: 'Ruta activa', detail: 'Recorriendo cuadrante', eta: '5 min', distancia: '200 m', x: 50, y: 50, estado: 'En ruta'
    };
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
        if (claims['roles']) this.userRoles = [...claims['roles']];
        this.userEmail = (claims['preferred_username'] || claims['upn'] || account.username || '') as string;
      } else {
        this.userEmail = account.username || '';
      }
    }

    this.syncDefaultStaffRole();

    // Sincronizar roles desde el Access Token a través de /api/me
    this.bffService.getProfile().subscribe({
      next: (profile) => {
        if (profile && Array.isArray(profile.roles) && profile.roles.length > 0) {
          this.userRoles = Array.from(new Set([...this.userRoles, ...profile.roles]));
          this.syncDefaultStaffRole();
        }
        if (profile && profile.username && !this.userEmail) {
          this.userEmail = profile.username;
        }
        if (profile && profile.name && !this.userName) {
          this.userName = profile.name;
        }
        this.loadPickups();
      },
      error: () => {}
    });

    this.truckWaypoints = this.currentSectorInfo.waypoints || [];
    this.loadResiduos();
    this.loadPickups();
    this.loadCuadrantes();
    this.loadCamiones();
    this.loadLiveTracking();
    this.startTruckSimulation();
  }

  ngOnDestroy(): void {
    if (this.truckTimer) {
      clearInterval(this.truckTimer);
      this.truckTimer = null;
    }
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
    this.truckWaypoints = this.currentSectorInfo.waypoints || [];
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
            kilosRecolectados: p.pesoRealKg != null ? p.pesoRealKg : (p.pesoEstimadoKg != null ? p.pesoEstimadoKg : (p.kilosRecolectados || 0)),
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
      next: (data) => { if (data && data.length > 0) this.camionesDisponibles = data; },
      error: () => {}
    });
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

  openActionModal(event: { pickup: any, action: 'programar' | 'en-ruta' | 'retirado' | 'pesado' | 'cancelar' }): void {
    this.selectedPickupForAction = event.pickup;
    this.actionType = event.action;
    this.showActionModal = true;
  }

  onActionCompleted(): void {
    this.loadPickups();
  }

  onPickupCreated(nuevo: any): void {
    this.pickups.unshift(nuevo);
    if (nuevo.direccion) {
      this.userActiveAddress = nuevo.direccion;
    }
    this.loadPickups();
  }

  onStaffPickupCreated(data: any): void {
    const payload = {
      ciudadanoEmail: 'vecino.contacto@puertovaras.cl',
      direccion: data.direccion,
      residuoId: Number(data.residuoId),
      comentarios: data.comentarios || ''
    };
    this.bffService.createPickup(payload).subscribe({
      next: (created) => {
        this.pickups.unshift(created);
        this.loadPickups();
      },
      error: () => {
        const fallback: Pickup = {
          id: Math.floor(Math.random() * 9000) + 1000,
          direccion: data.direccion,
          residuoNombre: this.residuos.find(r => r.id === Number(data.residuoId))?.nombre || 'Reciclaje',
          estado: 'SOLICITADO',
          comentarios: data.comentarios,
          fechaTexto: 'Por confirmar',
          fecha: new Date().toISOString()
        };
        this.pickups.unshift(fallback);
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
