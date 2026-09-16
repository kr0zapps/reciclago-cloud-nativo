import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sector } from '../data/sectors.data';

@Component({
  selector: 'app-truck-tracking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-white rounded-3xl sm:rounded-[2.2rem] border border-[#E2E9E4] p-6 sm:p-10 shadow-xs relative card-hover anim-fade-up anim-delay-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#EAEFE8] gap-4">
        <div>
          <h3 class="font-heading font-extrabold text-2xl sm:text-3xl text-brand-navy">
            Seguimiento del camión recolector
          </h3>
          <p class="text-base text-brand-muted mt-1">Monitoreo cívico en tiempo real para {{ sector?.cuadrante }}</p>
        </div>

        <!-- Badge dinámico de recorrido -->
        <span *ngIf="isCamionEnRuta" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#E8F3F7] text-[#123F5B] border border-[#CFE4ED] self-start sm:self-auto shadow-2xs">
          <i class="fa-solid fa-truck-moving text-brand-lake text-sm"></i>
          <span>Recorrido en curso</span>
        </span>
        <span *ngIf="!isCamionEnRuta" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#F8FAF7] text-slate-600 border border-[#DFE8E1] self-start sm:self-auto shadow-2xs">
          <i class="fa-regular fa-clock text-slate-400 text-sm"></i>
          <span>Próximo recorrido: {{ sector?.dia }}</span>
        </span>
      </div>

      <!-- LÍNEA DE TIEMPO VISUAL AMPLIA (3 PASOS REACTIVOS A LA OPERACIÓN REAL) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
        <!-- PASO 1: COMPLETADO (Si está en ruta hoy) O AGENDADO (Si es otro día) -->
        <div *ngIf="isCamionEnRuta" class="p-5 sm:p-6 rounded-2xl bg-[#F4F9F2] border-2 border-[#CDE5C8] flex items-start gap-4 transition-transform hover:-translate-y-0.5 duration-200">
          <div class="w-12 h-12 rounded-2xl bg-brand-green text-white flex items-center justify-center text-xl flex-shrink-0 shadow-xs interactive-icon">
            <i class="fa-solid fa-check"></i>
          </div>
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-brand-green">Paso 1 • Completado</span>
            <h4 class="font-heading font-bold text-lg text-brand-navy mt-0.5">Retiro programado</h4>
            <p class="text-sm text-brand-muted mt-1 leading-relaxed">
              Tu sector está cargado en la hoja de ruta oficial del día.
            </p>
          </div>
        </div>

        <div *ngIf="!isCamionEnRuta" class="p-5 sm:p-6 rounded-2xl bg-[#F0F6F9] border-2 border-[#CFE4ED] flex items-start gap-4 transition-transform hover:-translate-y-0.5 duration-200">
          <div class="w-12 h-12 rounded-2xl bg-brand-lake text-white flex items-center justify-center text-xl flex-shrink-0 shadow-xs interactive-icon">
            <i class="fa-regular fa-calendar-check"></i>
          </div>
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-brand-lake">Paso 1 • Agendado</span>
            <h4 class="font-heading font-bold text-lg text-brand-navy mt-0.5">Retiro programado</h4>
            <p class="text-sm text-brand-muted mt-1 leading-relaxed">
              Ruta asignada para este <strong class="text-brand-navy">{{ sector?.dia }}</strong> ({{ sector?.horario }}).
            </p>
          </div>
        </div>

        <!-- PASO 2: EN RUTA (Si está activo hoy) O EN ESPERA (Si es otro día) -->
        <div *ngIf="isCamionEnRuta" class="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#EBF4F8] via-[#E2F0F5] to-[#D5E8F0] border-2 border-brand-lake shadow-md flex items-start gap-4 relative overflow-hidden">
          <div class="w-12 h-12 rounded-2xl bg-brand-lake text-white flex items-center justify-center text-xl flex-shrink-0 shadow-sm relative z-10">
            <i class="fa-solid fa-truck-moving anim-truck-gentle"></i>
          </div>
          <div class="flex-grow relative z-10">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-extrabold uppercase tracking-wider text-brand-lake">Paso 2 • En curso</span>
              <span class="px-2.5 py-0.5 rounded-md bg-brand-navy text-white text-[11px] font-bold uppercase tracking-wider">
                En ruta
              </span>
            </div>
            <h4 class="font-heading font-extrabold text-lg sm:text-xl text-brand-navy mt-0.5">Camión en ruta</h4>
            <div class="w-full h-1.5 bg-brand-lake/20 rounded-full mt-2 mb-2 overflow-hidden">
              <div class="anim-route-flow h-full w-1/3 bg-brand-lake rounded-full"></div>
            </div>
            <p class="text-sm text-brand-charcoal font-medium leading-tight">
              Recorriendo {{ sector?.cuadrante }}.<br/>
              <strong class="text-brand-navy font-bold text-sm">Estimado: {{ sector?.horario }}</strong>
            </p>
          </div>
        </div>

        <div *ngIf="!isCamionEnRuta" class="p-5 sm:p-6 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4] flex items-start gap-4 transition-transform hover:-translate-y-0.5 duration-200">
          <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center text-xl flex-shrink-0 interactive-icon">
            <i class="fa-solid fa-warehouse"></i>
          </div>
          <div class="flex-grow">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Paso 2 • En espera</span>
              <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                En base DIMAO
              </span>
            </div>
            <h4 class="font-heading font-bold text-lg text-slate-700 mt-0.5">Camión preparado</h4>
            <p class="text-sm text-brand-muted mt-1 leading-relaxed">
              Camión <strong class="text-slate-800">{{ sector?.patente || 'PV-RC-2028' }}</strong> iniciará recorrido este <strong>{{ sector?.dia }}</strong> a las 08:00 hrs.
            </p>
          </div>
        </div>

        <!-- PASO 3: PENDIENTE -->
        <div class="p-5 sm:p-6 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4] opacity-80 flex items-start gap-4 transition-transform hover:-translate-y-0.5 duration-200">
          <div class="w-12 h-12 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center text-xl flex-shrink-0 interactive-icon">
            <i class="fa-solid fa-recycle"></i>
          </div>
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Paso 3 • Pendiente</span>
            <h4 class="font-heading font-bold text-lg text-slate-700 mt-0.5">Retiro y pesaje</h4>
            <p class="text-sm text-brand-muted mt-1 leading-relaxed">
              Pesaje certificado en báscula del camión y traslado al centro de valorización.
            </p>
          </div>
        </div>
      </div>

      <!-- NOTA INFORMATIVA CON IDENTIDAD LOCAL -->
      <div class="mt-8 pt-6 border-t border-[#EEF3EF] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div class="flex items-center gap-2 text-brand-lake font-medium text-sm">
          <i class="fa-solid fa-satellite-dish text-base"></i>
          <span>Cuadrillas monitoreadas con telemetría GPS municipal en tiempo real.</span>
        </div>
        <div class="inline-flex items-center gap-2 text-xs font-semibold text-brand-navy bg-[#F4F8F4] px-3.5 py-1.5 rounded-xl border border-[#D8E6D9]">
          <i class="fa-solid fa-shield-halved text-brand-green"></i>
          <span>Trazabilidad certificada hacia planta de valorización</span>
        </div>
      </div>
    </section>
  `
})
export class TruckTrackingComponent {
  @Input() isCamionEnRuta: boolean = false;
  @Input() sector!: Sector | any;
}
