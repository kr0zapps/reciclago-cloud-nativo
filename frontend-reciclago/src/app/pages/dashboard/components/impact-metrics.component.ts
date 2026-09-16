import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sector, Pickup } from '../data/sectors.data';

@Component({
  selector: 'app-impact-metrics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-gradient-to-r from-[#EEF7EC] via-[#F4F9F2] to-[#EEF5F8] border border-[#DFE8E1] rounded-3xl p-6 sm:p-9 shadow-xs card-hover anim-fade-up anim-delay-4" id="impacto-section">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#DFEAE0] gap-2">
        <div>
          <h3 class="font-heading font-extrabold text-2xl text-brand-navy">Tu impacto positivo en Puerto Varas</h3>
          <p class="text-base text-brand-muted">Aporte acumulado por tu hogar durante el programa 2025–2026</p>
        </div>
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/90 border border-[#D0E2CE] text-brand-navy text-xs font-bold shadow-2xs">
          <i class="fa-solid fa-water text-brand-lake"></i>
          <span>Protección ambiental del Lago Llanquihue</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D8E6D9] gap-6 md:gap-0">
        <!-- Métrica 1: Retiros -->
        <div class="pt-4 md:pt-0 md:px-6 first:pl-0 flex items-center gap-4 group">
          <div class="w-14 h-14 rounded-2xl bg-white text-brand-green flex items-center justify-center text-2xl flex-shrink-0 shadow-sm border border-[#D5E6D2] interactive-icon">
            <i class="fa-solid fa-arrows-rotate"></i>
          </div>
          <div>
            <div class="font-heading font-black text-4xl text-brand-navy leading-none">
              <span class="count-metric">{{ pickups.length }}</span>
            </div>
            <p class="text-[16px] font-bold text-brand-charcoal mt-1">Retiros realizados</p>
            <p class="text-sm text-brand-muted">En tu domicilio en {{ userAddress || sector?.direccionEjemplo }}</p>
          </div>
        </div>

        <!-- Métrica 2: Kilogramos -->
        <div class="pt-4 md:pt-0 md:px-6 flex items-center gap-4 group">
          <div class="w-14 h-14 rounded-2xl bg-white text-brand-green flex items-center justify-center text-2xl flex-shrink-0 shadow-sm border border-[#D5E6D2] interactive-icon">
            <i class="fa-solid fa-leaf anim-leaf-sway"></i>
          </div>
          <div>
            <div class="font-heading font-black text-4xl text-brand-navy leading-none">
              <span class="count-metric">{{ getTotalKilos() }}</span> <span class="text-xl font-bold text-brand-muted">kg</span>
            </div>
            <p class="text-[16px] font-bold text-brand-charcoal mt-1">Material reciclado</p>
            <p class="text-sm text-brand-muted">~{{ (getTotalKilos() * 0.6).toFixed(1) }} kg CO₂ evitados para la cuenca</p>
          </div>
        </div>

        <!-- Métrica 3: Participación -->
        <div class="pt-4 md:pt-0 md:px-6 last:pr-0 flex items-center gap-4 group">
          <div class="w-14 h-14 rounded-2xl bg-white text-brand-lake flex items-center justify-center text-2xl flex-shrink-0 shadow-sm border border-[#CFE4ED] interactive-icon">
            <i class="fa-solid fa-award"></i>
          </div>
          <div>
            <div class="font-heading font-black text-4xl text-brand-navy leading-none">
              <span class="count-metric">100</span>%
            </div>
            <p class="text-[16px] font-bold text-brand-charcoal mt-1">Participación comunitaria</p>
            <p class="text-sm text-brand-muted">Vecino destacado del cuadrante</p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ImpactMetricsComponent {
  @Input() pickups: Pickup[] | any[] = [];
  @Input() userAddress: string = '';
  @Input() sector!: Sector | any;

  getTotalKilos(): number {
    return this.pickups
      .filter(p => (p.estado === 'completado' || p.estado === 'PESADO' || p.estado === 'RETIRADO') && p.kilosRecolectados)
      .reduce((sum, p) => sum + (Number(p.kilosRecolectados) || 0), 0);
  }
}
