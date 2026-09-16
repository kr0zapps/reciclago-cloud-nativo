import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-special-service-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-3xl border border-[#E2E9E4] p-7 sm:p-9 flex flex-col justify-between shadow-xs card-hover h-full">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="w-12 h-12 rounded-2xl bg-[#EEF5EB] text-brand-green flex items-center justify-center text-2xl interactive-icon">
            <i class="fa-solid fa-couch"></i>
          </div>
          <span class="text-[11px] font-black uppercase tracking-wider text-[#437d32] bg-[#edf8ed] border border-[#d2ead0] px-3 py-1 rounded-full">
            Servicio Municipal Gratuito
          </span>
        </div>

        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-brand-green">Servicio a domicilio</span>
          <h3 class="font-heading font-extrabold text-2xl text-brand-navy mt-1">¿Necesitas un retiro especial?</h3>
        </div>

        <p class="text-sm sm:text-[15px] text-brand-muted leading-relaxed">
          ¿Tienes aparatos electrónicos, colchones, muebles u otros residuos voluminosos? Coordinamos el retiro directamente con la cuadrilla municipal de Puerto Varas en tu puerta.
        </p>

        <!-- Pasos del retiro -->
        <div class="space-y-3 pt-2">
          <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
            ¿Cómo funciona el retiro domiciliario?
          </span>

          <div class="space-y-2.5">
            <div class="flex items-start gap-3 p-3 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
              <div class="w-8 h-8 rounded-xl bg-[#EEF5EB] text-[#437d32] flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-2xs border border-[#d2ead0]">1</div>
              <div class="min-w-0">
                <h4 class="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                  <span>Ingresas tu solicitud</span>
                  <span class="text-[9px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-md">SOLICITADO</span>
                </h4>
                <p class="text-[11px] text-brand-muted leading-tight mt-0.5">Indicas tu dirección exacta y los materiales que necesitas entregar.</p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
              <div class="w-8 h-8 rounded-xl bg-[#E8F3F7] text-[#123F5B] flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-2xs border border-[#cfe2ec]">2</div>
              <div class="min-w-0">
                <h4 class="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                  <span>Coordinador asigna camión</span>
                  <span class="text-[9px] font-extrabold text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.2 rounded-md">PROGRAMADO</span>
                </h4>
                <p class="text-[11px] text-brand-muted leading-tight mt-0.5">El operador municipal revisa la capacidad disponible y fija tu fecha de retiro.</p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
              <div class="w-8 h-8 rounded-xl bg-[#EEF5EB] text-[#2b7239] flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-2xs border border-[#d2ead0]">3</div>
              <div class="min-w-0">
                <h4 class="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                  <span>Retiro en puerta y pesaje digital</span>
                  <span class="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-md">RETIRADO / PESADO</span>
                </h4>
                <p class="text-[11px] text-brand-muted leading-tight mt-0.5">La cuadrilla pasa a tu frontis, pesa los kilos y los traslada a valorización.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Materiales autorizados -->
        <div class="grid grid-cols-2 gap-2 pt-1">
          <div class="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAF7] border border-[#E2E9E4]">
            <i class="fa-solid fa-couch text-[#437d32] text-xs"></i>
            <span class="text-[11px] font-bold text-[#093554] truncate">Muebles y colchones</span>
          </div>
          <div class="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAF7] border border-[#E2E9E4]">
            <i class="fa-solid fa-tv text-[#1479b8] text-xs"></i>
            <span class="text-[11px] font-bold text-[#093554] truncate">Electrodomésticos</span>
          </div>
          <div class="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAF7] border border-[#E2E9E4]">
            <i class="fa-solid fa-tree text-[#c4871d] text-xs"></i>
            <span class="text-[11px] font-bold text-[#093554] truncate">Ramas y podas</span>
          </div>
          <div class="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAF7] border border-[#E2E9E4]">
            <i class="fa-solid fa-wrench text-[#c94b43] text-xs"></i>
            <span class="text-[11px] font-bold text-[#093554] truncate">Chatarra y fierros</span>
          </div>
        </div>
      </div>

      <div class="pt-5">
        <button (click)="scheduleRequested.emit()" type="button" class="btn-action inline-flex items-center justify-center gap-3 bg-brand-green hover:bg-brand-green-dark text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg w-full sm:w-auto text-center cursor-pointer">
          <i class="fa-regular fa-calendar-plus text-base"></i>
          <span>Agendar retiro a domicilio</span>
          <i class="fa-solid fa-arrow-right text-xs btn-arrow"></i>
        </button>
      </div>
    </div>
  `
})
export class SpecialServiceCardComponent {
  @Output() scheduleRequested = new EventEmitter<void>();
}
