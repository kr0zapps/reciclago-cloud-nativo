import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sector, Pickup } from '../data/sectors.data';

@Component({
  selector: 'app-truck-tracking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-white rounded-3xl sm:rounded-[2.2rem] border border-[#E2E9E4] p-6 sm:p-10 shadow-xs relative card-hover anim-fade-up anim-delay-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#EAEFE8] gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-[#4F8A3D]">
              Telemetría Operativa en Vivo
            </span>
            <span *ngIf="activePickup" class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Retiro #{{ activePickup.id }} • {{ activePickup.direccion }}
            </span>
          </div>
          <h3 class="font-heading font-extrabold text-2xl sm:text-3xl text-brand-navy">
            Seguimiento del camión recolector
          </h3>
          <p class="text-base text-brand-muted mt-1">
            Monitoreo cívico en tiempo real para {{ sector?.cuadrante || 'Puerto Varas' }}
          </p>
        </div>

        <!-- Badge dinámico de recorrido vinculado a la operación real -->
        <div class="self-start sm:self-auto flex items-center gap-2">
          <span *ngIf="effectiveEstado === 'EN_RUTA'" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#E8F3F7] text-[#123F5B] border border-[#CFE4ED] shadow-2xs animate-pulse">
            <i class="fa-solid fa-truck-moving text-brand-lake text-sm"></i>
            <span>Camión en ruta a tu frontis</span>
          </span>

          <span *ngIf="effectiveEstado === 'RETIRADO'" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs">
            <i class="fa-solid fa-box-open text-amber-600 text-sm"></i>
            <span>Retirado • En báscula digital</span>
          </span>

          <span *ngIf="effectiveEstado === 'PESADO'" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#EBF5E7] text-emerald-900 border border-[#CDE8C7] shadow-2xs">
            <i class="fa-solid fa-circle-check text-[#4F8A3D] text-sm"></i>
            <span>Pesaje oficial listo ({{ activePickup?.kilosRecolectados || activePickup?.pesoRealKg || 0 }} kg)</span>
          </span>

          <span *ngIf="effectiveEstado === 'PROGRAMADO'" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200 shadow-2xs">
            <i class="fa-regular fa-calendar-check text-sky-600 text-sm"></i>
            <span>Programado: {{ activePickup?.fechaTexto || sector?.dia }}</span>
          </span>

          <span *ngIf="effectiveEstado === 'SOLICITADO'" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
            <i class="fa-regular fa-clock text-amber-600 text-sm"></i>
            <span>Solicitud en revisión</span>
          </span>

          <span *ngIf="effectiveEstado === 'SIN_SOLICITUD'" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#F8FAF7] text-slate-600 border border-[#DFE8E1] shadow-2xs">
            <i class="fa-regular fa-clock text-slate-400 text-sm"></i>
            <span>Próximo recorrido: {{ sector?.dia }}</span>
          </span>
        </div>
      </div>

      <!-- LÍNEA DE TIEMPO VISUAL AMPLIA (3 PASOS REACTIVOS A LA OPERACIÓN REAL DEL CHOFER) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 relative">

        <!-- ==================== PASO 1 ==================== -->
        <!-- Paso 1: Completado si está programado, en ruta, retirado o pesado -->
        <div *ngIf="effectiveEstado === 'PROGRAMADO' || effectiveEstado === 'EN_RUTA' || effectiveEstado === 'RETIRADO' || effectiveEstado === 'PESADO'"
             class="p-5 sm:p-6 rounded-2xl bg-[#F4F9F2] border-2 border-[#CDE5C8] flex items-start gap-4 transition-transform hover:-translate-y-0.5 duration-200">
          <div class="w-12 h-12 rounded-2xl bg-[#4F8A3D] text-white flex items-center justify-center text-xl flex-shrink-0 shadow-xs interactive-icon">
            <i class="fa-solid fa-check"></i>
          </div>
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-[#4F8A3D]">Paso 1 • Completado</span>
            <h4 class="font-heading font-bold text-lg text-brand-navy mt-0.5">Retiro programado</h4>
            <p class="text-sm text-brand-muted mt-1 leading-relaxed">
              Camión <strong class="text-slate-800">{{ activePickup?.camionPatente || sector?.patente || 'PV-RC-2026' }}</strong> asignado para el <strong class="text-[#123F5B]">{{ activePickup?.fechaTexto || sector?.dia }}</strong>.
            </p>
          </div>
        </div>

        <!-- Paso 1: En Revisión (cuando está SOLICITADO) -->
        <div *ngIf="effectiveEstado === 'SOLICITADO'"
             class="p-5 sm:p-6 rounded-2xl bg-amber-50/60 border-2 border-amber-300 flex items-start gap-4 transition-transform hover:-translate-y-0.5 duration-200">
          <div class="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl flex-shrink-0 shadow-xs interactive-icon animate-pulse">
            <i class="fa-regular fa-clock"></i>
          </div>
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-amber-700">Paso 1 • En revisión</span>
            <h4 class="font-heading font-bold text-lg text-brand-navy mt-0.5">Solicitud ingresada</h4>
            <p class="text-sm text-brand-muted mt-1 leading-relaxed">
              El Coordinador de Despacho está revisando la capacidad de tolva para asignar fecha oficial.
            </p>
          </div>
        </div>

        <!-- Paso 1: Agendado para sector (cuando no hay solicitud individual) -->
        <div *ngIf="effectiveEstado === 'SIN_SOLICITUD'"
             class="p-5 sm:p-6 rounded-2xl bg-[#F0F6F9] border-2 border-[#CFE4ED] flex items-start gap-4 transition-transform hover:-translate-y-0.5 duration-200">
          <div class="w-12 h-12 rounded-2xl bg-brand-lake text-white flex items-center justify-center text-xl flex-shrink-0 shadow-xs interactive-icon">
            <i class="fa-regular fa-calendar-check"></i>
          </div>
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-brand-lake">Paso 1 • Agendado</span>
            <h4 class="font-heading font-bold text-lg text-brand-navy mt-0.5">Retiro regular comunal</h4>
            <p class="text-sm text-brand-muted mt-1 leading-relaxed">
              Cuadrante asignado para este <strong class="text-brand-navy">{{ sector?.dia }}</strong> ({{ sector?.horario }}).
            </p>
          </div>
        </div>

        <!-- ==================== PASO 2 ==================== -->
        <!-- Paso 2: EN CURSO (cuando el chofer pulsó Iniciar Ruta) -->
        <div *ngIf="effectiveEstado === 'EN_RUTA'"
             class="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#EBF4F8] via-[#E2F0F5] to-[#D5E8F0] border-2 border-brand-lake shadow-md flex items-start gap-4 relative overflow-hidden ring-2 ring-sky-300">
          <div class="w-12 h-12 rounded-2xl bg-brand-lake text-white flex items-center justify-center text-xl flex-shrink-0 shadow-sm relative z-10">
            <i class="fa-solid fa-truck-moving anim-truck-gentle"></i>
          </div>
          <div class="flex-grow relative z-10 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-extrabold uppercase tracking-wider text-brand-lake">Paso 2 • En curso</span>
              <span class="px-2.5 py-0.5 rounded-md bg-[#123F5B] text-white text-[11px] font-bold uppercase tracking-wider">
                En ruta
              </span>
            </div>
            <h4 class="font-heading font-extrabold text-lg sm:text-xl text-brand-navy mt-0.5 truncate">
              Camión en ruta al domicilio
            </h4>
            <div class="w-full h-1.5 bg-brand-lake/20 rounded-full mt-2 mb-2 overflow-hidden">
              <div class="anim-route-flow h-full w-1/3 bg-brand-lake rounded-full"></div>
            </div>
            <p class="text-xs sm:text-sm text-brand-charcoal font-medium leading-tight">
              Cuadrilla en trayecto hacia <strong class="text-[#123F5B]">{{ activePickup?.direccion || sector?.cuadrante }}</strong>.<br/>
              <span class="text-emerald-700 font-bold text-xs">Camión {{ activePickup?.camionPatente || 'PV-RC-2026' }} con telemetría activa.</span>
            </p>
          </div>
        </div>

        <!-- Paso 2: COMPLETADO (cuando ya fue retirado o pesado) -->
        <div *ngIf="effectiveEstado === 'RETIRADO' || effectiveEstado === 'PESADO'"
             class="p-5 sm:p-6 rounded-2xl bg-[#F4F9F2] border-2 border-[#CDE5C8] flex items-start gap-4 transition-transform hover:-translate-y-0.5 duration-200">
          <div class="w-12 h-12 rounded-2xl bg-[#4F8A3D] text-white flex items-center justify-center text-xl flex-shrink-0 shadow-xs interactive-icon">
            <i class="fa-solid fa-box-open"></i>
          </div>
          <div class="min-w-0 flex-1">
            <span class="text-xs font-bold uppercase tracking-wider text-[#4F8A3D]">Paso 2 • Completado</span>
            <h4 class="font-heading font-bold text-lg text-brand-navy mt-0.5">Retiro en puerta realizado</h4>
            <p class="text-sm text-brand-muted mt-1 leading-relaxed">
              La cuadrilla municipal recogió los residuos en <strong class="text-slate-800">{{ activePickup?.direccion || 'tu frontis' }}</strong>.
            </p>
          </div>
        </div>

        <!-- Paso 2: EN ESPERA (cuando está SOLICITADO, PROGRAMADO o SIN_SOLICITUD) -->
        <div *ngIf="effectiveEstado === 'SOLICITADO' || effectiveEstado === 'PROGRAMADO' || effectiveEstado === 'SIN_SOLICITUD'"
             class="p-5 sm:p-6 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4] flex items-start gap-4 transition-transform hover:-translate-y-0.5 duration-200">
          <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center text-xl flex-shrink-0 interactive-icon">
            <i class="fa-solid fa-warehouse"></i>
          </div>
          <div class="flex-grow min-w-0">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Paso 2 • En espera</span>
              <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                En base DIMAO
              </span>
            </div>
            <h4 class="font-heading font-bold text-lg text-slate-700 mt-0.5">Camión preparado</h4>
            <p class="text-sm text-brand-muted mt-1 leading-relaxed">
              Unidad <strong class="text-slate-800">{{ activePickup?.camionPatente || sector?.patente || 'PV-RC-2026' }}</strong> saldrá a ruta en su horario programado.
            </p>
          </div>
        </div>

        <!-- ==================== PASO 3 ==================== -->
        <!-- Paso 3: COMPLETADO (cuando el chofer registró el pesaje en báscula) -->
        <div *ngIf="effectiveEstado === 'PESADO'"
             class="p-5 sm:p-6 rounded-2xl bg-[#F4F9F2] border-2 border-[#4F8A3D] flex items-start gap-4 transition-transform hover:-translate-y-0.5 duration-200 ring-2 ring-emerald-300">
          <div class="w-12 h-12 rounded-2xl bg-[#4F8A3D] text-white flex items-center justify-center text-xl flex-shrink-0 shadow-xs interactive-icon">
            <i class="fa-solid fa-certificate"></i>
          </div>
          <div class="min-w-0 flex-1">
            <span class="text-xs font-bold uppercase tracking-wider text-[#4F8A3D]">Paso 3 • Certificado</span>
            <h4 class="font-heading font-extrabold text-lg text-brand-navy mt-0.5">Pesaje Oficial Concluido</h4>
            <p class="text-sm text-slate-700 mt-1 leading-relaxed">
              <strong class="text-emerald-900 font-extrabold text-base">{{ activePickup?.kilosRecolectados || activePickup?.pesoRealKg || 0 }} kg</strong> certificados en báscula de cabina. Trasladando a planta de valorización.
            </p>
          </div>
        </div>

        <!-- Paso 3: EN CURSO (cuando está RETIRADO pero falta pesar) -->
        <div *ngIf="effectiveEstado === 'RETIRADO'"
             class="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/60 border-2 border-amber-400 flex items-start gap-4 transition-transform hover:-translate-y-0.5 duration-200 ring-2 ring-amber-300 animate-pulse">
          <div class="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl flex-shrink-0 shadow-xs interactive-icon">
            <i class="fa-solid fa-scale-balanced"></i>
          </div>
          <div class="min-w-0 flex-1">
            <span class="text-xs font-bold uppercase tracking-wider text-amber-800">Paso 3 • En curso</span>
            <h4 class="font-heading font-extrabold text-lg text-amber-950 mt-0.5">Pesando en Báscula Digital</h4>
            <p class="text-sm text-amber-900 mt-1 leading-relaxed">
              El chofer está registrando los kilos oficiales en la balanza del camión en este momento.
            </p>
          </div>
        </div>

        <!-- Paso 3: PRÓXIMO PASO (cuando está EN_RUTA) -->
        <div *ngIf="effectiveEstado === 'EN_RUTA'"
             class="p-5 sm:p-6 rounded-2xl bg-sky-50/50 border border-sky-200 flex items-start gap-4 transition-transform hover:-translate-y-0.5 duration-200">
          <div class="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-xl flex-shrink-0 interactive-icon">
            <i class="fa-solid fa-scale-balanced"></i>
          </div>
          <div class="min-w-0 flex-1">
            <span class="text-xs font-bold uppercase tracking-wider text-sky-700">Paso 3 • Próximo</span>
            <h4 class="font-heading font-bold text-lg text-slate-800 mt-0.5">Recepción y Pesaje</h4>
            <p class="text-sm text-slate-600 mt-1 leading-relaxed">
              Ten tus materiales listos en el frontis. Serán pesados en la balanza digital al momento del retiro.
            </p>
          </div>
        </div>

        <!-- Paso 3: PENDIENTE (cuando está SOLICITADO, PROGRAMADO o SIN_SOLICITUD) -->
        <div *ngIf="effectiveEstado === 'SOLICITADO' || effectiveEstado === 'PROGRAMADO' || effectiveEstado === 'SIN_SOLICITUD'"
             class="p-5 sm:p-6 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4] opacity-80 flex items-start gap-4 transition-transform hover:-translate-y-0.5 duration-200">
          <div class="w-12 h-12 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center text-xl flex-shrink-0 interactive-icon">
            <i class="fa-solid fa-recycle"></i>
          </div>
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Paso 3 • Pendiente</span>
            <h4 class="font-heading font-bold text-lg text-slate-700 mt-0.5">Retiro y pesaje</h4>
            <p class="text-sm text-brand-muted mt-1 leading-relaxed">
              Pesaje certificado en báscula del camión y emisión automática de trazabilidad a la DIMAO.
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
  @Input() sector!: Sector | null;
  @Input() pickups: Pickup[] = [];
  @Input() userEmail: string = '';
  @Input() isCamionEnRuta: boolean = false;

  get activePickup(): Pickup | undefined {
    if (!this.pickups || this.pickups.length === 0) return undefined;
    if (this.userEmail) {
      const mine = this.pickups.filter(p => p.vecinoEmail && p.vecinoEmail.toLowerCase() === this.userEmail.toLowerCase() && p.estado !== 'CANCELADO');
      if (mine.length > 0) {
        return mine.find(p => p.estado === 'EN_RUTA')
          || mine.find(p => p.estado === 'RETIRADO')
          || mine.find(p => p.estado === 'PROGRAMADO')
          || mine.find(p => p.estado === 'SOLICITADO')
          || mine[0];
      }
    }
    return this.pickups.find(p => p.estado === 'EN_RUTA')
      || this.pickups.find(p => p.estado === 'RETIRADO')
      || this.pickups.find(p => p.estado === 'PROGRAMADO')
      || this.pickups.find(p => p.estado === 'SOLICITADO');
  }

  get effectiveEstado(): 'SIN_SOLICITUD' | 'SOLICITADO' | 'PROGRAMADO' | 'EN_RUTA' | 'RETIRADO' | 'PESADO' {
    if (this.activePickup && this.activePickup.estado) {
      const st = this.activePickup.estado.toUpperCase();
      if (st === 'EN_RUTA' || st === 'RETIRADO' || st === 'PESADO' || st === 'PROGRAMADO' || st === 'SOLICITADO') {
        return st as 'SOLICITADO' | 'PROGRAMADO' | 'EN_RUTA' | 'RETIRADO' | 'PESADO';
      }
    }
    return this.isCamionEnRuta ? 'EN_RUTA' : 'SIN_SOLICITUD';
  }
}
