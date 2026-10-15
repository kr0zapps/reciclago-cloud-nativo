import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pickup } from '../data/sectors.data';

@Component({
  selector: 'app-auditoria-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen"
         (click)="modalClose.emit()"
         class="fixed inset-0 z-[9999] overflow-y-auto bg-[#041D2D]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel text-slate-800 my-auto">
        
        <div class="h-1.5 w-full bg-[#123F5B]"></div>

        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-[#E2E9E4] flex items-center justify-between bg-[#F8FAF7]">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-[#EEF5EB] border border-[#D5E6D2] flex items-center justify-center text-[#4F8A3D] text-lg flex-shrink-0 shadow-xs">
              <i class="fa-solid fa-clipboard-list"></i>
            </div>
            <div>
              <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#123F5B] leading-tight">
                Auditoría Histórica Comunal
              </h3>
            </div>
          </div>
          <button (click)="modalClose.emit()" type="button" class="w-9 h-9 rounded-full bg-white border border-[#DFE8E1] hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm transition-colors shadow-xs cursor-pointer" aria-label="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-4 text-sm text-slate-600 leading-relaxed">
          <div class="divide-y divide-[#E2E9E4] border border-[#E2E9E4] rounded-2xl overflow-hidden bg-white">
            <div *ngFor="let p of auditoriaList" class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8FAF7] transition-colors">
              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-xl bg-slate-100 text-[#123F5B] flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                  <i class="fa-solid fa-box-archive"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-bold text-sm text-[#123F5B]">{{ p.fechaTexto || p.fecha || 'Fecha' }}</span>
                    <span class="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                      {{ p.residuoNombre }}
                    </span>
                    <span class="text-[10px] font-mono text-slate-400">#{{ p.id }}</span>
                  </div>
                  <p class="text-xs text-slate-500 mt-1">
                    {{ p.direccion }}
                  </p>
                </div>
              </div>
              <div class="sm:text-right flex items-center sm:flex-col sm:items-end justify-between gap-1 pl-12 sm:pl-0">
                <span class="text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1"
                      [ngClass]="p.estado === 'PESADO' || p.estado === 'RETIRADO' ? 'bg-[#EEF5EB] text-[#4F8A3D] border border-[#D5E6D2]' : 'bg-slate-100 text-slate-600 border border-slate-200'">
                  {{ p.kilosRecolectados ? (p.kilosRecolectados + ' kg pesados') : p.estado }}
                </span>
              </div>
            </div>

            <div *ngIf="auditoriaList.length === 0" class="p-8 text-center text-slate-400">
              <p>No hay registros de auditoría disponibles.</p>
            </div>
          </div>

          <!-- Paginación -->
          <div *ngIf="totalPages > 1" class="flex items-center justify-between pt-2 text-xs text-slate-600">
            <button (click)="changePage.emit(currentPage - 1)"
                    [disabled]="currentPage === 0"
                    type="button"
                    class="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 font-medium cursor-pointer">
              <i class="fa-solid fa-chevron-left text-[10px]"></i> Anterior
            </button>
            <span class="font-semibold">
              Página {{ currentPage + 1 }} de {{ totalPages }} (Total: {{ totalElements }})
            </span>
            <button (click)="changePage.emit(currentPage + 1)"
                    [disabled]="currentPage >= totalPages - 1"
                    type="button"
                    class="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 font-medium cursor-pointer">
              Siguiente <i class="fa-solid fa-chevron-right text-[10px]"></i>
            </button>
          </div>
        </div>

        <div class="px-6 sm:px-8 py-4 bg-[#F8FAF7] border-t border-[#E2E9E4] flex items-center justify-between">
          <span class="text-xs text-slate-500 font-medium">Trazabilidad DIMAO Puerto Varas</span>
          <button (click)="modalClose.emit()" type="button" class="btn-stitch-primary px-5 py-2 text-xs font-bold cursor-pointer">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  `
})
export class AuditoriaModalComponent {
  @Input() isOpen: boolean = false;
  @Input() auditoriaList: Pickup[] = [];
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 1;
  @Input() totalElements: number = 0;

  @Output() modalClose = new EventEmitter<void>();
  @Output() changePage = new EventEmitter<number>();
}

