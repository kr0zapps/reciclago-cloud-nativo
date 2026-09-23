import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BffService } from '../../../services/bff.service';
import { Pickup } from '../data/sectors.data';

@Component({
  selector: 'app-pickup-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8">
      
      <!-- ENCABEZADO -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-4 border-b border-[#E2E8F0] gap-3">
        <h3 class="font-heading font-extrabold text-2xl sm:text-3xl text-[#123F5B]">
          {{ isStaff ? 'Gestión de Retiros' : 'Mis retiros' }}
        </h3>

        <button (click)="openHistorialModal()" type="button" class="text-xs sm:text-sm font-bold text-[#123F5B] hover:text-[#1F6685] flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200">
          <i class="fa-solid fa-clock-rotate-left"></i>
          <span>Ver todos los retiros</span>
          <i class="fa-solid fa-chevron-right text-xs ml-1"></i>
        </button>
      </div>

      <!-- LISTA DE RETIROS -->
      <div class="divide-y divide-[#E2E8F0]">
        <div *ngFor="let pickup of pickups"
             (click)="pickupSelected.emit(pickup)"
             class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
             [ngClass]="{'bg-[#ecf7e6] hover:bg-[#ecf7e6] border-l-4 border-[#22a652] pl-4': selectedPickupId === pickup.id}">
          
          <div class="flex items-center gap-4 min-w-0">
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap text-gray-700">
                <span class="font-bold">{{ pickup.fechaTexto || pickup.fecha || 'Fecha programada' }}</span>
                <span>|</span>
                <span>{{ pickup.residuoNombre || 'Reciclaje' }}</span>
                <ng-container *ngIf="isRetiradoOPesado(pickup) && pickup.kilosRecolectados">
                  <span>|</span>
                  <span>{{ pickup.kilosRecolectados }} kg</span>
                </ng-container>
                <ng-container *ngIf="pickup.pesoEstimadoKg && !pickup.kilosRecolectados">
                  <span>|</span>
                  <span class="text-gray-500">Est: {{ pickup.pesoEstimadoKg }} kg</span>
                </ng-container>
              </div>
            </div>
          </div>

          <!-- ESTADOS Y BOTONERA -->
          <div class="flex items-center gap-4 flex-wrap flex-shrink-0">
            <span class="text-sm font-medium" [ngClass]="{
              'text-amber-600': pickup.estado === 'SOLICITADO' || pickup.estado === 'pendiente',
              'text-[#123F5B]': pickup.estado === 'PROGRAMADO',
              'text-blue-600': pickup.estado === 'EN_RUTA',
              'text-[#22a652]': pickup.estado === 'RETIRADO',
              'text-[#22a652] font-semibold': pickup.estado === 'PESADO' || pickup.estado === 'completado',
              'text-red-600 line-through': pickup.estado === 'CANCELADO'
            }">
              {{ pickup.estado }}
            </span>

            <div *ngIf="isStaff" class="flex items-center gap-2 flex-wrap">
              <button *ngIf="pickup.estado === 'SOLICITADO' || pickup.estado === 'pendiente' || pickup.estado === 'PROGRAMADO'"
                      (click)="requestAction(pickup, 'programar')"
                      type="button"
                      class="text-sm px-3 py-1.5 bg-[#22a652] text-white rounded-lg transition-colors cursor-pointer border-none">
                Programar
              </button>

              <button *ngIf="pickup.estado === 'PROGRAMADO'"
                      (click)="requestAction(pickup, 'en-ruta')"
                      type="button"
                      class="text-sm px-3 py-1.5 bg-[#123F5B] text-white rounded-lg transition-colors cursor-pointer border-none">
                En Ruta
              </button>

              <button *ngIf="pickup.estado === 'EN_RUTA'"
                      (click)="requestAction(pickup, 'retirado')"
                      type="button"
                      class="text-sm px-3 py-1.5 bg-[#22a652] text-white rounded-lg transition-colors cursor-pointer border-none">
                Retirar
              </button>

              <button *ngIf="pickup.estado === 'RETIRADO' || pickup.estado === 'EN_RUTA'"
                      (click)="requestAction(pickup, 'pesado')"
                      type="button"
                      class="text-sm px-3 py-1.5 bg-[#123F5B] text-white rounded-lg transition-colors cursor-pointer border-none">
                Pesar
              </button>

              <button *ngIf="pickup.estado !== 'completado' && pickup.estado !== 'PESADO' && pickup.estado !== 'CANCELADO'"
                      (click)="requestAction(pickup, 'cancelar')"
                      type="button"
                      class="text-sm px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg transition-colors cursor-pointer">
                Cancelar
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="pickups.length === 0" class="py-6 text-gray-500 font-medium">
          No hay solicitudes de retiro registradas en este momento.
        </div>
      </div>
    </section>

    <!-- MODAL HISTORIAL -->
    <div *ngIf="showHistorialModal"
         (click)="closeHistorialModal()"
         class="fixed inset-0 z-[9999] overflow-y-auto bg-gray-900/50 flex items-center justify-center p-4 sm:p-6 min-h-screen">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-[#E2E8F0] overflow-hidden text-gray-700 my-auto">
        
        <div class="h-1.5 w-full bg-[#123F5B]"></div>

        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#123F5B]">
            Historial de Retiros
          </h3>
          <button (click)="closeHistorialModal()"
                  type="button"
                  class="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-100 text-gray-500 flex items-center justify-center cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="px-6 sm:px-8 py-6 max-h-[70vh] overflow-y-auto space-y-4">
          <div class="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-xl bg-white">
            <div *ngFor="let p of historialList" class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex flex-col">
                <div class="flex items-center gap-2 text-gray-700">
                  <span class="font-bold">{{ p.fechaTexto || p.fecha || 'Fecha por confirmar' }}</span>
                  <span>|</span>
                  <span>{{ p.residuoNombre }}</span>
                </div>
                <p class="text-sm text-gray-500 mt-1">{{ p.direccion }}</p>
              </div>
              <div class="sm:text-right text-sm">
                <span [ngClass]="isRetiradoOPesado(p) ? 'text-[#22a652] font-semibold' : 'text-amber-600'">
                  {{ (isRetiradoOPesado(p) && p.kilosRecolectados) ? (p.kilosRecolectados + ' kg pesados') : (p.pesoEstimadoKg ? (p.estado + ' - Est: ' + p.pesoEstimadoKg + ' kg') : (p.estado || 'En proceso')) }}
                </span>
              </div>
            </div>

            <div *ngIf="historialList.length === 0" class="py-8 px-4 text-center text-gray-500">
              Aún no se registran retiros
            </div>
          </div>

          <div *ngIf="historialTotalPages > 1" class="flex items-center justify-between pt-3 text-sm text-gray-600">
            <button (click)="loadHistorialPaginado(historialPage - 1)"
                    [disabled]="historialPage === 0"
                    type="button"
                    class="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 cursor-pointer">
              Anterior
            </button>
            <span>Página {{ historialPage + 1 }} de {{ historialTotalPages }}</span>
            <button (click)="loadHistorialPaginado(historialPage + 1)"
                    [disabled]="historialPage >= historialTotalPages - 1"
                    type="button"
                    class="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 cursor-pointer">
              Siguiente
            </button>
          </div>
        </div>

        <div class="px-6 sm:px-8 py-4 bg-gray-50 border-t border-[#E2E8F0] flex justify-end">
          <button (click)="closeHistorialModal()"
                  type="button"
                  class="bg-[#123F5B] hover:bg-[#0D3549] text-white font-semibold text-sm px-6 py-2 rounded-lg cursor-pointer border-none">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  `
})
export class PickupHistoryComponent {
  @Input() pickups: Pickup[] = [];
  @Input() isStaff: boolean = false;
  @Input() userEmail: string = '';

  @Output() actionRequested = new EventEmitter<{ pickup: Pickup, action: 'programar' | 'en-ruta' | 'retirado' | 'pesado' | 'cancelar' }>();
  @Output() pickupSelected = new EventEmitter<Pickup>();

  @Input() selectedPickupId: number | null = null;

  showHistorialModal = false;
  historialPage = 0;
  historialTotalPages = 1;
  historialTotalElements = 0;
  historialList: Pickup[] = [];
  isLoadingHistorial = false;

  constructor(private bffService: BffService) {}

  isRetiradoOPesado(p: Pickup): boolean {
    return p.estado === 'completado' || p.estado === 'PESADO' || p.estado === 'RETIRADO';
  }

  requestAction(pickup: Pickup, action: 'programar' | 'en-ruta' | 'retirado' | 'pesado' | 'cancelar'): void {
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
