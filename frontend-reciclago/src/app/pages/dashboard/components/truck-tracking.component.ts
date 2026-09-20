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
          <h3 class="font-heading font-extrabold text-2xl sm:text-3xl text-brand-navy">
            Seguimiento del camión recolector
          </h3>
          <p class="text-sm sm:text-base text-brand-muted mt-1">
            Monitoreo en tiempo real para {{ sector?.cuadrante || 'Puerto Varas' }}
            <span *ngIf="activePickup" class="text-slate-400"> · Solicitud #{{ activePickup.id }}</span>
          </p>
        </div>

        <!-- Estado sobrio vinculado a la operación -->
        <div class="self-start sm:self-auto flex items-center gap-2">
          <span *ngIf="effectiveEstado === 'EN_RUTA'" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#E8F3F7] text-[#123F5B] border border-[#CFE4ED]">
            <i class="fa-solid fa-truck-moving text-brand-lake text-xs"></i>
            <span>Camión en ruta</span>
          </span>

          <span *ngIf="effectiveEstado === 'RETIRADO'" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
            <i class="fa-solid fa-box-open text-amber-600 text-xs"></i>
            <span>Retirado · En pesaje</span>
          </span>

          <span *ngIf="effectiveEstado === 'PESADO'" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EBF5E7] text-emerald-900 border border-[#CDE8C7]">
            <i class="fa-solid fa-circle-check text-[#4F8A3D] text-xs"></i>
            <span>Completado ({{ activePickup?.kilosRecolectados || activePickup?.pesoRealKg || 0 }} kg)</span>
          </span>

          <span *ngIf="effectiveEstado === 'PROGRAMADO'" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <i class="fa-regular fa-calendar-check text-slate-500 text-xs"></i>
            <span>Programado: {{ activePickup?.fechaTexto || sector?.dia }}</span>
          </span>

          <span *ngIf="effectiveEstado === 'SOLICITADO'" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
            <i class="fa-regular fa-clock text-amber-600 text-xs"></i>
            <span>Solicitud en revisión</span>
          </span>

          <span *ngIf="effectiveEstado === 'SIN_SOLICITUD'" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F8FAF7] text-slate-600 border border-[#DFE8E1]">
            <i class="fa-regular fa-calendar text-slate-400 text-xs"></i>
            <span>Próximo recorrido: {{ sector?.dia }}</span>
          </span>
        </div>
      </div>

      <!-- LÍNEA DE TIEMPO VISUAL (3 PASOS) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 relative">

        <!-- ==================== PASO 1 ==================== -->
        <!-- Paso 1: Completado -->
        <div *ngIf="effectiveEstado === 'PROGRAMADO' || effectiveEstado === 'EN_RUTA' || effectiveEstado === 'RETIRADO' || effectiveEstado === 'PESADO'"
             class="p-5 sm:p-6 rounded-2xl bg-[#F4F9F2] border border-[#CDE5C8] flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-[#4F8A3D] text-white flex items-center justify-center text-lg flex-shrink-0 shadow-xs">
            <i class="fa-solid fa-check"></i>
          </div>
          <div>
            <span class="text-xs font-semibold text-[#4F8A3D]">Paso 1 · Completado</span>
            <h4 class="font-heading font-bold text-base sm:text-lg text-brand-navy mt-0.5">Retiro programado</h4>
            <p class="text-xs sm:text-sm text-brand-muted mt-1 leading-relaxed">
              Camión <strong class="text-slate-800">{{ activePickup?.camionPatente || sector?.patente || 'PV-RC-2026' }}</strong> asignado para el <strong class="text-[#123F5B]">{{ activePickup?.fechaTexto || sector?.dia }}</strong>.
            </p>
          </div>
        </div>

        <!-- Paso 1: En Revisión -->
        <div *ngIf="effectiveEstado === 'SOLICITADO'"
             class="p-5 sm:p-6 rounded-2xl bg-amber-50/50 border border-amber-300 flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg flex-shrink-0 shadow-xs">
            <i class="fa-regular fa-clock"></i>
          </div>
          <div>
            <span class="text-xs font-semibold text-amber-800">Paso 1 · En revisión</span>
            <h4 class="font-heading font-bold text-base sm:text-lg text-brand-navy mt-0.5">Solicitud ingresada</h4>
            <p class="text-xs sm:text-sm text-brand-muted mt-1 leading-relaxed">
              Coordinación municipal revisando capacidad para confirmar retiro oficial.
            </p>
          </div>
        </div>

        <!-- Paso 1: Agendado Comunal -->
        <div *ngIf="effectiveEstado === 'SIN_SOLICITUD'"
             class="p-5 sm:p-6 rounded-2xl bg-[#F0F6F9] border border-[#CFE4ED] flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-brand-lake text-white flex items-center justify-center text-lg flex-shrink-0 shadow-xs">
            <i class="fa-regular fa-calendar-check"></i>
          </div>
          <div>
            <span class="text-xs font-semibold text-brand-lake">Paso 1 · Calendario comunal</span>
            <h4 class="font-heading font-bold text-base sm:text-lg text-brand-navy mt-0.5">Retiro programado</h4>
            <p class="text-xs sm:text-sm text-brand-muted mt-1 leading-relaxed">
              Cuadrante asignado para este <strong class="text-brand-navy">{{ sector?.dia }}</strong> ({{ sector?.horario }}).
            </p>
          </div>
        </div>

        <!-- ==================== PASO 2 ==================== -->
        <!-- Paso 2: EN CURSO -->
        <div *ngIf="effectiveEstado === 'EN_RUTA'"
             class="p-5 sm:p-6 rounded-2xl bg-[#EBF4F8] border-2 border-brand-lake flex items-start gap-4 relative overflow-hidden">
          <div class="w-10 h-10 rounded-xl bg-brand-lake text-white flex items-center justify-center text-lg flex-shrink-0 shadow-xs">
            <i class="fa-solid fa-truck-moving"></i>
          </div>
          <div class="flex-grow min-w-0">
            <span class="text-xs font-bold text-brand-lake">Paso 2 · En curso</span>
            <h4 class="font-heading font-bold text-base sm:text-lg text-brand-navy mt-0.5">
              Camión en ruta a tu frontis
            </h4>
            <div class="w-full h-1 bg-brand-lake/20 rounded-full mt-2 mb-2 overflow-hidden">
              <div class="anim-route-flow h-full w-1/3 bg-brand-lake rounded-full"></div>
            </div>
            <p class="text-xs sm:text-sm text-brand-charcoal leading-tight">
              Cuadrilla en trayecto hacia <strong class="text-[#123F5B]">{{ activePickup?.direccion || sector?.cuadrante }}</strong>.
            </p>
          </div>
        </div>

        <!-- Paso 2: COMPLETADO -->
        <div *ngIf="effectiveEstado === 'RETIRADO' || effectiveEstado === 'PESADO'"
             class="p-5 sm:p-6 rounded-2xl bg-[#F4F9F2] border border-[#CDE5C8] flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-[#4F8A3D] text-white flex items-center justify-center text-lg flex-shrink-0 shadow-xs">
            <i class="fa-solid fa-box-open"></i>
          </div>
          <div class="min-w-0 flex-1">
            <span class="text-xs font-semibold text-[#4F8A3D]">Paso 2 · Completado</span>
            <h4 class="font-heading font-bold text-base sm:text-lg text-brand-navy mt-0.5">Retiro en puerta realizado</h4>
            <p class="text-xs sm:text-sm text-brand-muted mt-1 leading-relaxed">
              La cuadrilla municipal recogió los residuos en <strong class="text-slate-800">{{ activePickup?.direccion || 'tu frontis' }}</strong>.
            </p>
          </div>
        </div>

        <!-- Paso 2: EN ESPERA -->
        <div *ngIf="effectiveEstado === 'SOLICITADO' || effectiveEstado === 'PROGRAMADO' || effectiveEstado === 'SIN_SOLICITUD'"
             class="p-5 sm:p-6 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4] flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center text-lg flex-shrink-0">
            <i class="fa-solid fa-warehouse"></i>
          </div>
          <div class="flex-grow min-w-0">
            <span class="text-xs font-medium text-slate-400">Paso 2 · En espera</span>
            <h4 class="font-heading font-bold text-base sm:text-lg text-slate-700 mt-0.5">Camión preparado</h4>
            <p class="text-xs sm:text-sm text-brand-muted mt-1 leading-relaxed">
              Unidad <strong class="text-slate-800">{{ activePickup?.camionPatente || sector?.patente || 'PV-RC-2026' }}</strong> saldrá a ruta en su horario programado.
            </p>
          </div>
        </div>

        <!-- ==================== PASO 3 ==================== -->
        <!-- Paso 3: COMPLETADO -->
        <div *ngIf="effectiveEstado === 'PESADO'"
             class="p-5 sm:p-6 rounded-2xl bg-[#F4F9F2] border border-[#4F8A3D] flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-[#4F8A3D] text-white flex items-center justify-center text-lg flex-shrink-0 shadow-xs">
            <i class="fa-solid fa-certificate"></i>
          </div>
          <div class="min-w-0 flex-1">
            <span class="text-xs font-semibold text-[#4F8A3D]">Paso 3 · Certificado</span>
            <h4 class="font-heading font-bold text-base sm:text-lg text-brand-navy mt-0.5">Pesaje oficial concluido</h4>
            <p class="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
              <strong class="text-emerald-900 font-bold">{{ activePickup?.kilosRecolectados || activePickup?.pesoRealKg || 0 }} kg</strong> certificados en báscula del camión.
            </p>
          </div>
        </div>

        <!-- Paso 3: EN CURSO -->
        <div *ngIf="effectiveEstado === 'RETIRADO'"
             class="p-5 sm:p-6 rounded-2xl bg-amber-50/70 border border-amber-300 flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg flex-shrink-0 shadow-xs">
            <i class="fa-solid fa-scale-balanced"></i>
          </div>
          <div class="min-w-0 flex-1">
            <span class="text-xs font-semibold text-amber-800">Paso 3 · En curso</span>
            <h4 class="font-heading font-bold text-base sm:text-lg text-amber-950 mt-0.5">Pesaje en curso</h4>
            <p class="text-xs sm:text-sm text-amber-900 mt-1 leading-relaxed">
              El chofer está registrando los kilos oficiales en la balanza del camión.
            </p>
          </div>
        </div>

        <!-- Paso 3: PRÓXIMO PASO (cuando está EN_RUTA) -->
        <div *ngIf="effectiveEstado === 'EN_RUTA'"
             class="p-5 sm:p-6 rounded-2xl bg-sky-50/50 border border-sky-200 flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-lg flex-shrink-0">
            <i class="fa-solid fa-scale-balanced"></i>
          </div>
          <div class="min-w-0 flex-1">
            <span class="text-xs font-medium text-sky-700">Paso 3 · Siguiente</span>
            <h4 class="font-heading font-bold text-base sm:text-lg text-slate-800 mt-0.5">Recepción y pesaje</h4>
            <p class="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Ten tus materiales listos en el frontis para pesaje al momento del retiro.
            </p>
          </div>
        </div>

        <!-- Paso 3: PENDIENTE -->
        <div *ngIf="effectiveEstado === 'SOLICITADO' || effectiveEstado === 'PROGRAMADO' || effectiveEstado === 'SIN_SOLICITUD'"
             class="p-5 sm:p-6 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4] opacity-80 flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center text-lg flex-shrink-0">
            <i class="fa-solid fa-recycle"></i>
          </div>
          <div>
            <span class="text-xs font-medium text-slate-400">Paso 3 · Pendiente</span>
            <h4 class="font-heading font-bold text-base sm:text-lg text-slate-700 mt-0.5">Retiro y pesaje</h4>
            <p class="text-xs sm:text-sm text-brand-muted mt-1 leading-relaxed">
              Pesaje certificado en báscula del camión y trazabilidad hacia la planta de reciclaje.
            </p>
          </div>
        </div>

      </div>

      <!-- NOTA INFORMATIVA CON IDENTIDAD LOCAL -->
      <div class="mt-8 pt-6 border-t border-[#EEF3EF] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs sm:text-sm text-slate-500">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-location-crosshairs text-slate-400"></i>
          <span>Cuadrillas monitoreadas con telemetría GPS municipal.</span>
        </div>
        <div class="flex items-center gap-1.5 text-slate-600">
          <i class="fa-solid fa-leaf text-[#4F8A3D]"></i>
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
