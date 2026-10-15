import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sector } from '../data/sectors.data';

@Component({
  selector: 'app-hero-pickup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
      <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <i class="fa-regular fa-calendar-check text-[#22a652]"></i>
        <span>Próximo retiro: <strong class="text-[#123F5B]">{{ sector?.dia }} {{ sector?.fechaTexto }}</strong></span>
      </div>
      
      <div class="mb-4">
        <span class="text-gray-500 text-sm">Material de la semana:</span>
        <h2 class="font-heading font-bold text-3xl text-[#123F5B]">{{ sector?.materialPrincipal || 'Vidrio' }}</h2>
      </div>

      <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
        <i class="fa-solid fa-circle-info text-[#22a652] mr-2"></i>
        Deja tus residuos de {{ sector?.materialPrincipal || 'Vidrio' }} limpios y secos en tu frontis antes de las <strong>08:00 hrs</strong>.
      </p>

      <div *ngIf="sector?.diaModificado" class="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span>Reprogramado. Día habitual: {{ sector?.diaOriginal }}. {{ sector?.motivoModificacion }}</span>
      </div>
    </div>
  `
})
export class HeroPickupComponent {
  @Input() sector!: Sector | null;
  @Input() userAddress: string = '';
}
