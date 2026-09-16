import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BffService } from '../../../services/bff.service';
import { Pickup } from '../data/sectors.data';

@Component({
  selector: 'app-pickup-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-white rounded-3xl sm:rounded-[2.2rem] border border-[#E2E9E4] p-6 sm:p-10 shadow-xs card-hover anim-fade-up anim-delay-5"
             [ngClass]="{'ring-2 ring-[#123F5B]/20 bg-gradient-to-b from-[#FAFDF9] to-white': isStaff}">
      
      <!-- ENCABEZADO DIFERENCIADO: VECINO VS CONSOLA STAFF MUNICIPAL -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-4 border-b border-[#EAEFE8] gap-3">
        <div>
          <!-- Badge de Modo Staff para Admin / Coordinador -->
          <div *ngIf="isStaff" class="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#123F5B] text-white text-xs font-bold tracking-wide uppercase mb-2 shadow-2xs">
            <i class="fa-solid fa-clipboard-user text-sky-400"></i>
            <span>Consola de Despacho • DIMAO Puerto Varas</span>
          </div>

          <h3 class="font-heading font-extrabold text-2xl sm:text-3xl text-brand-navy">
            {{ isStaff ? 'Gestión y Trazabilidad de Retiros Comunales' : 'Mis retiros anteriores' }}
          </h3>
          <p class="text-base text-brand-muted mt-0.5">
            {{ isStaff ? 'Supervisión en tiempo real de cuadrillas y avance del ciclo de vida en la comuna.' : 'Historial transparente de aportes reciclables en tu domicilio.' }}
          </p>
        </div>

        <button (click)="openHistorialModal()" type="button" class="btn-action text-sm font-bold text-brand-lake hover:text-brand-navy flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer px-4 py-2 rounded-xl bg-[#F0F6F9] hover:bg-[#E2EFF5] border border-[#CCE1EC]">
          <i class="fa-solid fa-clock-rotate-left text-xs"></i>
          <span>{{ isStaff ? 'Auditoría Completa de la Comuna' : 'Ver todos los retiros' }}</span>
          <i class="fa-solid fa-chevron-right text-xs btn-arrow ml-1"></i>
        </button>
      </div>

      <!-- LISTA EDITORIAL ESPACIOSA Y CLARA -->
      <div class="divide-y divide-[#EEF3EF]">
        <div *ngFor="let pickup of pickups"
             class="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F9FAF8] px-3 rounded-2xl transition-all duration-200 group">
          
          <div class="flex items-center gap-4 min-w-0">
            <div class="w-12 h-12 rounded-2xl bg-[#EEF7EC] text-brand-green flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform shadow-2xs border border-[#CCE4C8]">
              <i class="fa-solid fa-recycle"></i>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-3 flex-wrap">
                <span class="font-heading font-bold text-lg sm:text-xl text-brand-navy">{{ pickup.fechaTexto || pickup.fecha || 'Fecha programada' }}</span>
                <span class="text-xs sm:text-sm font-bold text-brand-green px-2.5 py-0.5 rounded-lg bg-[#EBF5E7] border border-[#CDE8C7] truncate">
                  {{ pickup.residuoNombre || 'Reciclaje' }}
                </span>
                <span *ngIf="isStaff && pickup.id" class="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                  #{{ pickup.id }}
                </span>
              </div>
              <p class="text-sm sm:text-base text-brand-muted mt-0.5 truncate">
                {{ pickup.direccion }}
                <span *ngIf="pickup.pesoEstimadoKg && !pickup.kilosRecolectados" class="text-xs font-semibold text-slate-500">
                  • Est: {{ pickup.pesoEstimadoKg }} kg
                </span>
                • <strong class="text-brand-charcoal font-semibold">{{ (isRetiradoOPesado(pickup) && pickup.kilosRecolectados) ? (pickup.kilosRecolectados + ' kg certificados') : (pickup.estado || 'En proceso') }}</strong>
              </p>
            </div>
          </div>

          <!-- ESTADOS Y BOTONERA DE ACCIÓN MUNICIPAL -->
          <div class="self-start sm:self-center flex items-center gap-2 flex-wrap flex-shrink-0">
            <!-- Badge de Estado -->
            <span *ngIf="isRetiradoOPesado(pickup)" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-bold bg-[#EAF5E6] text-brand-green border border-[#CDE9C6] transition-colors">
              <i class="fa-solid fa-check text-xs"></i> {{ pickup.kilosRecolectados ? (pickup.kilosRecolectados + ' kg pesados') : 'Retirado (pendiente pesaje)' }}
            </span>
            <span *ngIf="!isRetiradoOPesado(pickup)" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-bold bg-slate-100 text-slate-600 border border-slate-200 transition-colors">
              <i class="fa-regular fa-clock text-xs"></i> {{ pickup.estado }}
            </span>

            <!-- BOTONERA OPERATIVA DESTACADA PARA STAFF (Admin / Coordinador) -->
            <div *ngIf="isStaff" class="flex items-center gap-1.5 ml-2 flex-wrap">
              <!-- Botón Programar -->
              <button *ngIf="pickup.estado === 'SOLICITADO' || pickup.estado === 'pendiente'"
                      (click)="requestAction(pickup, 'programar')"
                      type="button"
                      class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                      title="Asignar camión municipal y fecha de retiro">
                <i class="fa-solid fa-calendar-plus text-[11px]"></i>
                <span>Programar</span>
              </button>

              <!-- Botón Editar Programación -->
              <button *ngIf="pickup.estado === 'PROGRAMADO'"
                      (click)="requestAction(pickup, 'programar')"
                      type="button"
                      class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
                      title="Editar fecha, horario o camión asignado antes de iniciar ruta">
                <i class="fa-solid fa-pen-to-square text-[11px] text-sky-600"></i>
                <span>Editar</span>
              </button>

              <!-- Botón En Ruta -->
              <button *ngIf="pickup.estado === 'PROGRAMADO'"
                      (click)="requestAction(pickup, 'en-ruta')"
                      type="button"
                      class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                      title="Despachar camión recolector al domicilio">
                <i class="fa-solid fa-truck-moving text-[11px]"></i>
                <span>En Ruta</span>
              </button>

              <!-- Botón Retirar -->
              <button *ngIf="pickup.estado === 'EN_RUTA'"
                      (click)="requestAction(pickup, 'retirado')"
                      type="button"
                      class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                      title="Confirmar recolección de residuos en puerta">
                <i class="fa-solid fa-box-check text-[11px]"></i>
                <span>Retirar</span>
              </button>

              <!-- Botón Pesar (kg) -->
              <button *ngIf="pickup.estado === 'RETIRADO' || pickup.estado === 'EN_RUTA'"
                      (click)="requestAction(pickup, 'pesado')"
                      type="button"
                      class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                      title="Registrar pesaje oficial en la balanza digital">
                <i class="fa-solid fa-scale-balanced text-[11px]"></i>
                <span>Pesar (kg)</span>
              </button>

              <!-- Botón Cancelar -->
              <button *ngIf="pickup.estado !== 'completado' && pickup.estado !== 'PESADO' && pickup.estado !== 'CANCELADO'"
                      (click)="requestAction(pickup, 'cancelar')"
                      type="button"
                      class="w-7 h-7 inline-flex items-center justify-center text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                      title="Cancelar solicitud">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="pickups.length === 0" class="py-10 text-center text-slate-500 font-medium">
          <i class="fa-solid fa-box-open text-2xl text-slate-300 block mb-2"></i>
          <span>No hay solicitudes de retiro registradas en este momento.</span>
        </div>
      </div>

      <!-- PIE INFORMATIVO -->
      <div class="mt-6 pt-5 border-t border-[#EEF3EF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-muted">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-clipboard-check text-emerald-600"></i>
          <span>Registros oficiales sincronizados con la Dirección de Medio Ambiente (DIMAO).</span>
        </div>
        <a href="#solicitud-retiro" class="font-bold text-brand-lake hover:underline inline-flex items-center gap-1.5">
          <span>¿Necesitas registrar un aviso?</span>
          <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </a>
      </div>
    </section>

    <!-- ==================== MODAL: HISTORIAL COMPLETO Y AUDITORÍA ==================== -->
    <div *ngIf="showHistorialModal"
         (click)="closeHistorialModal()"
         class="fixed inset-0 z-[9999] overflow-y-auto bg-[#041D2D]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel text-slate-800 my-auto">
        
        <!-- Franja de acento superior -->
        <div class="h-1.5 w-full bg-gradient-to-r from-[#4F8A3D] via-[#38BDF8] to-[#123F5B]"></div>

        <!-- Encabezado del Modal -->
        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-[#E2E9E4] flex items-center justify-between bg-[#F8FAF7]">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-[#EEF5EB] border border-[#D5E6D2] flex items-center justify-center text-[#4F8A3D] text-lg flex-shrink-0 shadow-xs">
              <i class="fa-solid fa-clock-rotate-left"></i>
            </div>
            <div>
              <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#4F8A3D] block">
                {{ isStaff ? 'Auditoría Comunal • DIMAO Puerto Varas' : 'Trazabilidad Vecinal • Puerto Varas' }}
              </span>
              <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#123F5B] leading-tight">
                {{ isStaff ? 'Registro Histórico de Retiros en la Comuna' : 'Historial Completo de Retiros' }}
              </h3>
            </div>
          </div>
          <button (click)="closeHistorialModal()"
                  type="button"
                  class="w-9 h-9 rounded-full bg-white border border-[#DFE8E1] hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm transition-colors shadow-xs cursor-pointer"
                  aria-label="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Cuerpo del Modal -->
        <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-5">
          <!-- Tarjeta resumen acumulado -->
          <div class="bg-[#F8FAF7] rounded-2xl p-4 sm:p-5 border border-[#E2E9E4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span class="text-[11px] text-slate-500 uppercase font-bold tracking-wider block">Total reciclado acumulado</span>
              <p class="font-heading font-black text-2xl sm:text-3xl text-[#123F5B] mt-0.5">
                {{ getTotalKilos() }} <span class="text-base font-semibold text-slate-500">kg certificados</span>
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-3 py-1.5 rounded-lg bg-[#EEF5EB] text-[#4F8A3D] text-xs font-bold border border-[#D5E6D2] flex items-center gap-1.5">
                <i class="fa-solid fa-shield-halved text-[11px]"></i> Cuenca Protegida
              </span>
            </div>
          </div>

          <!-- Lista de retiros -->
          <div class="divide-y divide-[#E2E9E4] border border-[#E2E9E4] rounded-2xl overflow-hidden bg-white">
            <div *ngFor="let p of historialList" class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8FAF7] transition-colors">
              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-xl bg-slate-100 text-[#123F5B] flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                  <i class="fa-solid fa-box-archive"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-bold text-sm text-[#123F5B]">{{ p.fechaTexto || p.fecha || 'Fecha por confirmar' }}</span>
                    <span class="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                      {{ p.residuoNombre }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <i class="fa-solid fa-location-dot text-[11px] text-slate-400"></i>
                    <span>{{ p.direccion }}</span>
                  </p>
                </div>
              </div>
              <div class="sm:text-right flex items-center sm:flex-col sm:items-end justify-between gap-1 pl-12 sm:pl-0">
                <span class="text-xs font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1"
                      [ngClass]="isRetiradoOPesado(p) ? 'bg-[#EEF5EB] text-[#4F8A3D] border border-[#D5E6D2]' : 'bg-amber-50 text-amber-700 border border-amber-200'">
                  <i [class]="isRetiradoOPesado(p) ? 'fa-solid fa-check text-[10px]' : 'fa-solid fa-hourglass-half text-[10px]'"></i>
                  {{ (isRetiradoOPesado(p) && p.kilosRecolectados) ? (p.kilosRecolectados + ' kg pesados') : (p.pesoEstimadoKg ? (p.estado + ' • Est: ' + p.pesoEstimadoKg + ' kg') : (p.estado || 'En proceso')) }}
                </span>
                <span *ngIf="p.comentarios" class="text-[11px] text-slate-400 italic max-w-xs truncate">
                  "{{ p.comentarios }}"
                </span>
              </div>
            </div>

            <!-- Estado vacío -->
            <div *ngIf="historialList.length === 0" class="py-12 px-4 text-center">
              <div class="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-lg mb-3">
                <i class="fa-solid fa-calendar-xmark"></i>
              </div>
              <p class="font-semibold text-slate-700 text-sm">Aún no se registran retiros</p>
              <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {{ isStaff ? 'No hay solicitudes históricas ingresadas en la base de datos.' : 'Agenda un retiro especial arriba o espera el día correspondiente a tu cuadrante.' }}
              </p>
            </div>
          </div>

          <!-- Paginación de Historial -->
          <div *ngIf="historialTotalPages > 1" class="flex items-center justify-between pt-3 text-xs text-slate-600">
            <button (click)="loadHistorialPaginado(historialPage - 1)"
                    [disabled]="historialPage === 0"
                    type="button"
                    class="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium cursor-pointer">
              <i class="fa-solid fa-chevron-left text-[10px]"></i> Anterior
            </button>
            <span class="font-semibold">
              Página {{ historialPage + 1 }} de {{ historialTotalPages }} (Total: {{ historialTotalElements }} retiros)
            </span>
            <button (click)="loadHistorialPaginado(historialPage + 1)"
                    [disabled]="historialPage >= historialTotalPages - 1"
                    type="button"
                    class="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium cursor-pointer">
              Siguiente <i class="fa-solid fa-chevron-right text-[10px]"></i>
            </button>
          </div>
        </div>

        <!-- Pie del Modal -->
        <div class="px-6 sm:px-8 py-4 bg-[#F8FAF7] border-t border-[#E2E9E4] flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-[#546571]">
            <img src="assets/escudo-puerto-varas.svg" alt="Puerto Varas" class="h-5 w-auto opacity-75">
            <span class="hidden sm:inline">DIMAO • Municipalidad de Puerto Varas</span>
          </div>
          <button (click)="closeHistorialModal()"
                  type="button"
                  class="bg-[#123F5B] hover:bg-[#0D3549] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  `
})
export class PickupHistoryComponent {
  @Input() pickups: Pickup[] | any[] = [];
  @Input() isStaff: boolean = false;
  @Input() userEmail: string = '';

  @Output() actionRequested = new EventEmitter<{ pickup: any, action: 'programar' | 'en-ruta' | 'retirado' | 'pesado' | 'cancelar' }>();

  showHistorialModal = false;
  historialPage = 0;
  historialTotalPages = 1;
  historialTotalElements = 0;
  historialList: any[] = [];
  isLoadingHistorial = false;

  constructor(private bffService: BffService) {}

  isRetiradoOPesado(p: any): boolean {
    return p.estado === 'completado' || p.estado === 'PESADO' || p.estado === 'RETIRADO';
  }

  requestAction(pickup: any, action: 'programar' | 'en-ruta' | 'retirado' | 'pesado' | 'cancelar'): void {
    this.actionRequested.emit({ pickup, action });
  }

  openHistorialModal(): void {
    this.showHistorialModal = true;
    document.body.style.overflow = 'hidden';
    this.loadHistorialPaginado(0);
  }

  closeHistorialModal(): void {
    this.showHistorialModal = false;
    document.body.style.overflow = '';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  loadHistorialPaginado(page: number = 0): void {
    this.isLoadingHistorial = true;
    this.historialPage = page;
    const emailToQuery = this.isStaff ? '' : this.userEmail;
    this.bffService.getPickupsHistory(emailToQuery, '', page, 6).subscribe({
      next: (res) => {
        this.isLoadingHistorial = false;
        if (res && res.content) {
          this.historialList = res.content;
          this.historialTotalPages = res.totalPages || 1;
          this.historialTotalElements = res.totalElements || res.content.length;
        } else if (Array.isArray(res)) {
          this.historialList = res;
          this.historialTotalPages = 1;
          this.historialTotalElements = res.length;
        } else {
          this.historialList = this.pickups;
        }
      },
      error: () => {
        this.isLoadingHistorial = false;
        this.historialList = this.pickups;
      }
    });
  }

  getTotalKilos(): number {
    return this.pickups
      .filter(p => this.isRetiradoOPesado(p) && p.kilosRecolectados)
      .reduce((sum, p) => sum + (Number(p.kilosRecolectados) || 0), 0);
  }
}
