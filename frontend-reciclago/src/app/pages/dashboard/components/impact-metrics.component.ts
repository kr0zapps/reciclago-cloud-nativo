import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sector, Pickup } from '../data/sectors.data';

@Component({
  selector: 'app-impact-metrics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-[#F8FAF7] border border-[#DFE8E1] rounded-3xl p-6 sm:p-9 shadow-xs card-hover anim-fade-up anim-delay-4" id="impacto-section">
      <div class="pb-6 mb-6 border-b border-[#DFEAE0]">
        <h3 class="font-heading font-extrabold text-2xl text-brand-navy">Tu aporte al reciclaje comunal</h3>
        <p class="text-sm sm:text-base text-brand-muted mt-0.5">Resumen de materiales recolectados y certificados en tu domicilio</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D8E6D9] gap-6 md:gap-0">
        <!-- Métrica 1: Retiros -->
        <div class="pt-4 md:pt-0 md:px-6 first:pl-0 flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-white text-brand-green flex items-center justify-center text-xl flex-shrink-0 shadow-xs border border-[#D5E6D2]">
            <i class="fa-solid fa-arrows-rotate"></i>
          </div>
          <div>
            <div class="font-heading font-black text-3xl sm:text-4xl text-brand-navy leading-none">
              <span class="count-metric">{{ pickups.length }}</span>
            </div>
            <p class="text-sm sm:text-base font-bold text-slate-800 mt-1">Retiros realizados</p>
            <p class="text-xs text-slate-500">{{ userAddress || sector?.direccionEjemplo || 'Tu domicilio' }}</p>
          </div>
        </div>

        <!-- Métrica 2: Kilogramos -->
        <div class="pt-4 md:pt-0 md:px-6 flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-white text-brand-green flex items-center justify-center text-xl flex-shrink-0 shadow-xs border border-[#D5E6D2]">
            <i class="fa-solid fa-weight-hanging"></i>
          </div>
          <div>
            <div class="font-heading font-black text-3xl sm:text-4xl text-brand-navy leading-none">
              <span class="count-metric">{{ getTotalKilos() }}</span> <span class="text-lg font-bold text-slate-400">kg</span>
            </div>
            <p class="text-sm sm:text-base font-bold text-slate-800 mt-1">Material recolectado</p>
            <p class="text-xs text-slate-500">Pesaje certificado en báscula</p>
          </div>
        </div>

        <!-- Métrica 3: CO2 Mitigado Real -->
        <div class="pt-4 md:pt-0 md:px-6 last:pr-0 flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-white text-brand-lake flex items-center justify-center text-xl flex-shrink-0 shadow-xs border border-[#CFE4ED]">
            <i class="fa-solid fa-leaf"></i>
          </div>
          <div>
            <div class="font-heading font-black text-3xl sm:text-4xl text-brand-navy leading-none">
              <span class="count-metric">{{ (getTotalKilos() * 0.6).toFixed(1) }}</span> <span class="text-lg font-bold text-slate-400">kg</span>
            </div>
            <p class="text-sm sm:text-base font-bold text-slate-800 mt-1">CO₂e mitigado</p>
            <p class="text-xs text-slate-500">Aporte estimado a la cuenca</p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ImpactMetricsComponent {
  @Input() pickups: Pickup[] = [];
  @Input() userAddress: string = '';
  @Input() sector!: Sector | null;

  getTotalKilos(): number {
    return this.pickups
      .filter(p => (p.estado === 'completado' || p.estado === 'PESADO' || p.estado === 'RETIRADO') && p.kilosRecolectados)
      .reduce((sum, p) => sum + (Number(p.kilosRecolectados) || 0), 0);
  }
}
