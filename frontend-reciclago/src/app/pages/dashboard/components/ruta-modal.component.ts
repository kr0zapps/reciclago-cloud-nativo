import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sector } from '../data/sectors.data';

@Component({
  selector: 'app-ruta-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen"
         (click)="close.emit()"
         class="fixed inset-0 z-[9999] overflow-y-auto bg-[#041D2D]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel text-slate-800 my-auto">
        
        <div class="h-1.5 w-full bg-gradient-to-r from-[#4F8A3D] via-[#38BDF8] to-[#123F5B]"></div>

        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-[#E2E9E4] flex items-center justify-between bg-[#F8FAF7]">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-[#EEF5EB] border border-[#D5E6D2] flex items-center justify-center text-[#4F8A3D] text-lg flex-shrink-0 shadow-xs">
              <i class="fa-solid fa-map-location-dot"></i>
            </div>
            <div>
              <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#4F8A3D] block">
                Plan Comunal DIMAO • Puerto Varas
              </span>
              <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#123F5B] leading-tight">
                Recorrido y Cuadrantes
              </h3>
            </div>
          </div>
          <button (click)="close.emit()" type="button" class="w-9 h-9 rounded-full bg-white border border-[#DFE8E1] hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm transition-colors shadow-xs cursor-pointer" aria-label="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-4 text-sm text-slate-600 leading-relaxed">
          <p class="text-xs sm:text-sm text-slate-600">
            El servicio municipal cubre la cuenca urbana y rural dividida en 4 cuadrantes. Los camiones cuentan con pesaje digital y registro continuo de trazabilidad.
          </p>

          <div class="space-y-3 pt-1">
            <div *ngFor="let s of sectores"
                 (click)="selectSector.emit(s.nombre)"
                 class="p-4 rounded-2xl transition-all flex items-start gap-3.5 cursor-pointer"
                 [ngClass]="s.nombre === selectedSector ? 'bg-[#EEF5EB] border-2 border-[#4F8A3D]/40 shadow-xs' : 'bg-[#F8FAF7] border border-[#E2E9E4] hover:border-[#CBDCD1]'">
              <span class="px-2.5 py-1 rounded-lg text-white text-xs font-bold mt-0.5 tracking-wide flex-shrink-0"
                    [ngClass]="s.nombre === selectedSector ? 'bg-[#4F8A3D]' : 'bg-[#123F5B]'">
                {{ s.dia }}
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <h4 class="font-bold text-sm text-[#123F5B]">{{ s.cuadrante }}</h4>
                  <span *ngIf="s.nombre === selectedSector" class="px-2 py-0.5 rounded-md bg-[#4F8A3D] text-white text-[10px] font-bold">
                    Seleccionado
                  </span>
                </div>
                <p class="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>{{ s.material }}</span>
                  <span class="text-slate-300">•</span>
                  <span class="font-medium text-slate-700">{{ s.horario }}</span>
                </p>
              </div>
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-sky-50 border border-sky-100 flex items-start gap-2.5 text-xs text-[#123F5B]">
            <i class="fa-solid fa-clock text-sky-600 mt-0.5 flex-shrink-0"></i>
            <span>Recuerda dejar tus bolsas o contenedores en la entrada de tu domicilio antes de las <strong>08:30 hrs</strong> del día asignado.</span>
          </div>
        </div>

        <div class="px-6 sm:px-8 py-4 bg-[#F8FAF7] border-t border-[#E2E9E4] flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-[#546571]">
            <img src="assets/escudo-puerto-varas.svg" alt="Puerto Varas" class="h-5 w-auto opacity-75">
            <span class="hidden sm:inline">DIMAO • Municipalidad de Puerto Varas</span>
          </div>
          <button (click)="close.emit()" type="button" class="bg-[#4F8A3D] hover:bg-[#3D6E2E] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-sm cursor-pointer">
            Entendido, gracias
          </button>
        </div>
      </div>
    </div>
  `
})
export class RutaModalComponent {
  @Input() isOpen: boolean = false;
  @Input() sectores: Sector[] = [];
  @Input() selectedSector: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() selectSector = new EventEmitter<string>();
}
