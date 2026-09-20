import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen"
         (click)="close.emit()"
         class="fixed inset-0 z-50 overflow-y-auto bg-[#041D2D]/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel text-slate-800 my-auto">
        
        <div class="h-1.5 w-full bg-gradient-to-r from-[#4F8A3D] via-[#38BDF8] to-[#123F5B]"></div>

        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-[#E2E9E4] flex items-center justify-between bg-[#F8FAF7]">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-[#EEF5EB] border border-[#D5E6D2] flex items-center justify-center text-[#4F8A3D] text-lg flex-shrink-0 shadow-xs">
              <i class="fa-solid fa-headset"></i>
            </div>
            <div>
              <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#4F8A3D] block">
                Atención Vecinal y Emergencias
              </span>
              <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#123F5B] leading-tight">
                Dirección de Medio Ambiente (DIMAO)
              </h3>
            </div>
          </div>
          <button (click)="close.emit()" type="button"
                  class="w-9 h-9 rounded-full bg-white border border-[#DFE8E1] hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm transition-colors shadow-xs cursor-pointer"
                  aria-label="Cerrar ventana">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-4 text-sm text-slate-600 leading-relaxed">
          <p class="text-xs text-slate-500">
            Canales oficiales de la Ilustre Municipalidad de Puerto Varas para consultas de recolección y denuncias ambientales:
          </p>

          <div class="space-y-3">
            <a href="tel:+56652361200"
               class="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4] hover:bg-[#EEF5EB] hover:border-[#4F8A3D]/40 transition-all group cursor-pointer">
              <div class="w-10 h-10 rounded-xl bg-white border border-[#DFE8E1] text-[#4F8A3D] flex items-center justify-center text-base shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
                <i class="fa-solid fa-phone"></i>
              </div>
              <div class="flex-grow min-w-0">
                <span class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mesa Telefónica Central</span>
                <strong class="text-sm sm:text-base text-[#123F5B] font-extrabold block truncate">+56 65 236 1200</strong>
              </div>
              <i class="fa-solid fa-arrow-up-right-from-square text-xs text-slate-400 group-hover:text-[#4F8A3D] transition-colors"></i>
            </a>

            <a href="mailto:medioambiente@ptovaras.cl"
               class="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4] hover:bg-[#EEF5EB] hover:border-[#4F8A3D]/40 transition-all group cursor-pointer">
              <div class="w-10 h-10 rounded-xl bg-white border border-[#DFE8E1] text-[#4F8A3D] flex items-center justify-center text-base shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
                <i class="fa-solid fa-envelope"></i>
              </div>
              <div class="flex-grow min-w-0">
                <span class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Correo Institucional</span>
                <strong class="text-sm sm:text-base text-[#123F5B] font-extrabold block truncate">medioambiente&#64;ptovaras.cl</strong>
              </div>
              <i class="fa-solid fa-arrow-up-right-from-square text-xs text-slate-400 group-hover:text-[#4F8A3D] transition-colors"></i>
            </a>

            <div class="flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
              <div class="w-10 h-10 rounded-xl bg-white border border-[#DFE8E1] text-[#123F5B] flex items-center justify-center text-base shadow-xs flex-shrink-0 mt-0.5">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <span class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Atención Presencial DIMAO</span>
                <strong class="text-sm text-[#123F5B] font-bold block">San Francisco 413, Puerto Varas</strong>
                <span class="text-xs text-slate-500 block mt-0.5">Horario de atención: Lunes a Viernes de 08:30 a 14:00 hrs</span>
              </div>
            </div>
          </div>

          <div class="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 flex items-start gap-3 text-xs text-[#123F5B]">
            <i class="fa-solid fa-shield-halved text-[#0284C7] text-base mt-0.5 flex-shrink-0"></i>
            <span>Para denuncias de microbasurales o emergencias ambientales en la cuenca, contactar a Seguridad Pública Municipal: <strong>Fono 1408</strong> (atención 24/7).</span>
          </div>
        </div>

        <div class="px-6 sm:px-8 py-4 bg-[#F8FAF7] border-t border-[#E2E9E4] flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-[#546571]">
            <img src="assets/escudo-puerto-varas.svg" alt="Puerto Varas" class="h-5 w-auto opacity-75">
            <span>DIMAO • Puerto Varas</span>
          </div>
          <button (click)="close.emit()" type="button"
                  class="bg-[#123F5B] hover:bg-[#0D3549] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-sm cursor-pointer">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  `
})
export class ContactModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
}
