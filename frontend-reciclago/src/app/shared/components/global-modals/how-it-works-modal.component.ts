import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-it-works-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen"
         (click)="close.emit()"
         class="fixed inset-0 z-50 overflow-y-auto bg-[#041D2D]/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel text-slate-800 my-auto">
        
        <div class="h-1.5 w-full bg-gradient-to-r from-[#4F8A3D] via-[#38BDF8] to-[#123F5B]"></div>

        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-[#E2E9E4] flex items-center justify-between bg-[#F8FAF7]">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-[#EEF5EB] border border-[#D5E6D2] flex items-center justify-center text-[#4F8A3D] text-lg flex-shrink-0 shadow-xs">
              <i class="fa-solid fa-leaf"></i>
            </div>
            <div>
              <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#4F8A3D] block">
                Guía Ciudadana • Puerto Varas
              </span>
              <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#123F5B] leading-tight">
                ¿Cómo funciona el reciclaje en tu hogar?
              </h3>
            </div>
          </div>
          <button (click)="close.emit()" type="button"
                  class="w-9 h-9 rounded-full bg-white border border-[#DFE8E1] hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm transition-colors shadow-xs cursor-pointer"
                  aria-label="Cerrar ventana">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-5 text-sm text-slate-600 leading-relaxed">
          <p class="text-slate-600 text-sm">
            RecicLaGo es el servicio municipal puerta a puerta de Puerto Varas diseñado para proteger la cuenca del Lago Llanquihue mediante un proceso trazable en 4 pasos:
          </p>

          <div class="relative pl-6 border-l-2 border-[#D5E6D2] space-y-6 ml-3 my-3">
            <div class="relative">
              <span class="absolute -left-[2.15rem] top-0 w-7 h-7 rounded-full bg-white border-2 border-[#4F8A3D] text-[#4F8A3D] font-black text-xs flex items-center justify-center shadow-xs">1</span>
              <h4 class="font-bold text-sm text-[#123F5B]">Separación limpia en origen</h4>
              <p class="text-xs text-slate-600 mt-1">Limpia, seca y enjuaga envases de vidrio, cartón, latas y botellas plásticas. Retira restos de alimentos y aplasta los envases para optimizar volumen.</p>
            </div>

            <div class="relative">
              <span class="absolute -left-[2.15rem] top-0 w-7 h-7 rounded-full bg-white border-2 border-[#123F5B] text-[#123F5B] font-black text-xs flex items-center justify-center shadow-xs">2</span>
              <h4 class="font-bold text-sm text-[#123F5B]">Conoce tu día de cuadrante</h4>
              <p class="text-xs text-slate-600 mt-1">El camión municipal recorre tu sector una vez por semana entre las 08:00 y 17:00 hrs. Deja tus materiales en cajas o bolsas identificadas antes de las 08:30 hrs.</p>
            </div>

            <div class="relative">
              <span class="absolute -left-[2.15rem] top-0 w-7 h-7 rounded-full bg-white border-2 border-[#0284C7] text-[#0284C7] font-black text-xs flex items-center justify-center shadow-xs">3</span>
              <h4 class="font-bold text-sm text-[#123F5B]">Retiro y pesaje certificado en ruta</h4>
              <p class="text-xs text-slate-600 mt-1">La cuadrilla pesa tus aportes en la balanza digital municipal. Los kilos quedan ingresados y asociados a tu cuenta vecinal.</p>
            </div>

            <div class="relative">
              <span class="absolute -left-[2.15rem] top-0 w-7 h-7 rounded-full bg-white border-2 border-[#72be36] text-[#4F8A3D] font-black text-xs flex items-center justify-center shadow-xs">4</span>
              <h4 class="font-bold text-sm text-[#123F5B]">Valorización y protección de la cuenca</h4>
              <p class="text-xs text-slate-600 mt-1">Tus reciclables se derivan a plantas de valorización certificadas, evitando que terminen en vertederos o en la ribera del lago.</p>
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-[#EEF5EB] border border-[#D5E6D2] flex items-start gap-3 text-xs text-[#123F5B]">
            <i class="fa-solid fa-lightbulb text-base text-[#4F8A3D] mt-0.5 flex-shrink-0"></i>
            <div>
              <strong class="font-bold block mb-0.5">¿Vives en condominio o pasaje estrecho?</strong>
              <span>Los camiones coordinan puntos de acopio comunitarios con las juntas de vecinos para facilitar la recolección sin entorpecer el tránsito.</span>
            </div>
          </div>
        </div>

        <div class="px-6 sm:px-8 py-4 bg-[#F8FAF7] border-t border-[#E2E9E4] flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-[#546571]">
            <img src="assets/escudo-puerto-varas.svg" alt="Puerto Varas" class="h-5 w-auto opacity-75">
            <span>DIMAO • Municipalidad de Puerto Varas</span>
          </div>
          <button (click)="close.emit()" type="button"
                  class="bg-[#4F8A3D] hover:bg-[#3D6E2E] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-sm cursor-pointer">
            Entendido, gracias
          </button>
        </div>
      </div>
    </div>
  `
})
export class HowItWorksModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
}
