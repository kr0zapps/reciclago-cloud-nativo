import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-special-service-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-3xl border border-[#E2E9E4] p-7 sm:p-9 flex flex-col justify-between shadow-xs card-hover h-full">
      <div class="space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-[#EEF5EB] text-brand-green flex items-center justify-center text-2xl interactive-icon">
          <i class="fa-solid fa-couch"></i>
        </div>

        <div>
          <h3 class="font-heading font-extrabold text-2xl text-brand-navy">¿Necesitas un retiro especial?</h3>
        </div>

        <p class="text-sm sm:text-[15px] text-brand-muted leading-relaxed">
          Para aparatos electrónicos, colchones, muebles u otros residuos voluminosos, coordinamos el retiro directamente con la cuadrilla municipal en tu puerta.
        </p>

        <!-- Pasos del retiro -->
        <div class="space-y-2.5 pt-2">
          <p class="text-xs font-semibold text-slate-500">
            Etapas del retiro domiciliario:
          </p>

          <div class="space-y-2">
            <div class="flex items-start gap-3 p-3 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
              <div class="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
              <div class="min-w-0">
                <h4 class="text-xs font-bold text-brand-navy">
                  Ingresas tu aviso
                </h4>
                <p class="text-[11px] text-slate-500 leading-tight mt-0.5">Indicas tu dirección y los materiales que necesitas entregar.</p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
              <div class="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
              <div class="min-w-0">
                <h4 class="text-xs font-bold text-brand-navy">
                  Coordinación de ruta
                </h4>
                <p class="text-[11px] text-slate-500 leading-tight mt-0.5">El equipo municipal planifica la capacidad disponible del camión.</p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
              <div class="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
              <div class="min-w-0">
                <h4 class="text-xs font-bold text-brand-navy">
                  Retiro y pesaje
                </h4>
                <p class="text-[11px] text-slate-500 leading-tight mt-0.5">La cuadrilla retira en tu frontis, pesa los kilos y los traslada a valorización.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Materiales autorizados -->
        <div class="grid grid-cols-2 gap-2 pt-1">
          <div class="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAF7] border border-[#E2E9E4]">
            <i class="fa-solid fa-couch text-slate-500 text-xs"></i>
            <span class="text-xs font-medium text-slate-700 truncate">Muebles y enseres</span>
          </div>
          <div class="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAF7] border border-[#E2E9E4]">
            <i class="fa-solid fa-tv text-slate-500 text-xs"></i>
            <span class="text-xs font-medium text-slate-700 truncate">Electrodomésticos</span>
          </div>
          <div class="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAF7] border border-[#E2E9E4]">
            <i class="fa-solid fa-tree text-slate-500 text-xs"></i>
            <span class="text-xs font-medium text-slate-700 truncate">Ramas y podas</span>
          </div>
          <div class="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAF7] border border-[#E2E9E4]">
            <i class="fa-solid fa-wrench text-slate-500 text-xs"></i>
            <span class="text-xs font-medium text-slate-700 truncate">Chatarra y metales</span>
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
