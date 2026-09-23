import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sector, Pickup } from '../data/sectors.data';

@Component({
  selector: 'app-impact-metrics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-sm text-gray-500 py-2">
      <span class="font-semibold text-[#123F5B]">{{ pickups.length }}</span> retiros · 
      <span class="font-semibold text-[#123F5B]">{{ getTotalKilos() }}</span> kg reciclados
    </div>
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
