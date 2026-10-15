import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-materials-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen"
         (click)="modalClose.emit()"
         class="fixed inset-0 z-50 overflow-y-auto bg-[#041D2D]/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel text-slate-800 my-auto">
        
        <div class="h-1.5 w-full bg-[#22a652]"></div>

        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div class="flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-[#ecf7e6] border border-emerald-100 flex items-center justify-center text-[#22a652] text-base flex-shrink-0">
              <i class="fa-solid fa-boxes-stacked"></i>
            </div>
            <div>
              <span class="text-[11px] font-semibold text-[#22a652] block">
                Ordenanza Comunal • Clasificación Oficial
              </span>
              <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#123F5B] leading-tight">
                Materiales y Fracciones de Reciclaje
              </h3>
            </div>
          </div>
          <button (click)="modalClose.emit()" type="button"
                  class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center text-sm transition-colors cursor-pointer"
                  aria-label="Cerrar ventana">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-6 text-sm text-slate-600 leading-relaxed">
          <div>
            <div class="mb-3">
              <h4 class="font-bold text-xs uppercase tracking-wider text-[#123F5B]">4 Fracciones Recibidas en Ruta Puerta a Puerta</h4>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#22a652]/40 transition-colors">
                <div class="flex items-center gap-2.5 mb-1.5">
                  <div class="w-7 h-7 rounded-lg bg-[#ecf7e6] text-[#22a652] flex items-center justify-center text-xs font-bold">
                    <i class="fa-solid fa-wine-bottle"></i>
                  </div>
                  <h5 class="font-bold text-sm text-[#123F5B]">Vidrio Transparente y Color</h5>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">Botellas de vino, cerveza, jugos y frascos de conserva o mermelada. <em>Enjuagar y retirar tapas metálicas.</em></p>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#22a652]/40 transition-colors">
                <div class="flex items-center gap-2.5 mb-1.5">
                  <div class="w-7 h-7 rounded-lg bg-[#ecf7e6] text-[#22a652] flex items-center justify-center text-xs font-bold">
                    <i class="fa-solid fa-box-archive"></i>
                  </div>
                  <h5 class="font-bold text-sm text-[#123F5B]">Cartón y Papel Limpio</h5>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">Cajas de cartón corrugado, diarios, revistas, carpetas y papel kraft. <em>Desarmar cajas y mantener secas.</em></p>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#22a652]/40 transition-colors">
                <div class="flex items-center gap-2.5 mb-1.5">
                  <div class="w-7 h-7 rounded-lg bg-[#ecf7e6] text-[#22a652] flex items-center justify-center text-xs font-bold">
                    <i class="fa-solid fa-bottle-water"></i>
                  </div>
                  <h5 class="font-bold text-sm text-[#123F5B]">Plásticos (PET 1 y PEAD 2)</h5>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">Botellas de agua, gaseosas, envases de champú y bidones de detergente. <em>Lavar, aplastar y tapar.</em></p>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#22a652]/40 transition-colors">
                <div class="flex items-center gap-2.5 mb-1.5">
                  <div class="w-7 h-7 rounded-lg bg-[#ecf7e6] text-[#22a652] flex items-center justify-center text-xs font-bold">
                    <svg class="w-4 h-4 text-inherit" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                      <ellipse cx="12" cy="5" rx="5.5" ry="2"/>
                      <path d="M6.5 5v14c0 1.1 2.46 2 5.5 2s5.5-.9 5.5-2V5"/>
                      <path d="M6.5 13c0 1.1 2.46 2 5.5 2s5.5-.9 5.5-2"/>
                      <ellipse cx="12" cy="5" rx="1.8" ry="0.7"/>
                    </svg>
                  </div>
                  <h5 class="font-bold text-sm text-[#123F5B]">Latas y Metales de Consumo</h5>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">Latas de aluminio de bebidas y tarros de conserva de hojalata. <em>Enjuagadas y desinfectadas.</em></p>
              </div>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3.5">
            <i class="fa-solid fa-triangle-exclamation text-amber-600 text-lg mt-0.5 flex-shrink-0"></i>
            <div class="text-xs text-amber-900 leading-relaxed">
              <strong class="font-bold block mb-1">No se reciben en la ruta habitual:</strong>
              <span>Espejos, lozas o cerámicas, plumavit, envoltorios grasientos o con restos orgánicos. Para muebles en desuso, colchones o restos de poda, debes solicitar un <strong>"Retiro Especial"</strong> desde tu panel vecinal.</span>
            </div>
          </div>
        </div>

        <div class="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-slate-500">
            <img src="assets/escudo-puerto-varas.svg" alt="Puerto Varas" class="h-5 w-auto opacity-75">
            <span>DIMAO • Municipalidad de Puerto Varas</span>
          </div>
          <button (click)="modalClose.emit()" type="button"
                  class="bg-[#123F5B] hover:bg-[#0e2f44] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-lg transition-all shadow-xs cursor-pointer">
            Cerrar Guía
          </button>
        </div>
      </div>
    </div>
  `
})
export class MaterialsModalComponent {
  @Input() isOpen = false;
  @Output() modalClose = new EventEmitter<void>();
}
