import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sector, Pickup } from '../data/sectors.data';

@Component({
  selector: 'app-truck-tracking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
      <h3 class="font-heading font-bold text-xl text-[#123F5B] mb-6">Estado de tu retiro</h3>
      
      <div class="flex items-center justify-between mb-6 relative">
        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0"></div>
        <div class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#22a652] z-0 transition-all duration-500" 
             [style.width]="getProgressBarWidth()"></div>

        <div *ngFor="let step of steps; let i = index" class="relative z-10 flex flex-col items-center">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
               [ngClass]="getStepClass(i)">
            {{ i + 1 }}
          </div>
          <span class="text-[10px] sm:text-xs font-medium mt-2" [ngClass]="getTextClass(i)">{{ step.label }}</span>
        </div>
      </div>

      <div class="bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm text-gray-700">
        <div *ngIf="effectiveEstado === 'PROGRAMADO' || effectiveEstado === 'SIN_SOLICITUD'">
          <i class="fa-regular fa-calendar text-[#123F5B] mr-2"></i>
          Programado para: <strong>{{ activePickup?.fechaTexto || sector?.dia }}</strong>
        </div>
        <div *ngIf="effectiveEstado === 'EN_RUTA'">
          <i class="fa-solid fa-truck-moving text-[#123F5B] mr-2"></i>
          Camión <strong>{{ activePickup?.camionPatente || sector?.patente || 'PV-RC-2026' }}</strong> en camino.
        </div>
        <div *ngIf="effectiveEstado === 'RETIRADO'">
          <i class="fa-solid fa-box-open text-[#123F5B] mr-2"></i>
          Retiro realizado, en proceso de pesaje.
        </div>
        <div *ngIf="effectiveEstado === 'PESADO'">
          <i class="fa-solid fa-certificate text-[#22a652] mr-2"></i>
          <strong>{{ activePickup?.kilosRecolectados || activePickup?.pesoRealKg || 0 }} kg</strong> certificados.
        </div>
        <div *ngIf="effectiveEstado === 'SOLICITADO'">
          <i class="fa-regular fa-clock text-[#123F5B] mr-2"></i>
          Solicitud en revisión.
        </div>
      </div>
    </div>
  `
})
export class TruckTrackingComponent {
  @Input() sector!: Sector | null;
  @Input() pickups: Pickup[] = [];
  @Input() userEmail: string = '';
  @Input() isCamionEnRuta: boolean = false;
  @Input() selectedPickup: Pickup | null = null;

  steps = [
    { label: 'Solicitado', state: 'SOLICITADO' },
    { label: 'Programado', state: 'PROGRAMADO' },
    { label: 'En ruta', state: 'EN_RUTA' },
    { label: 'Retirado', state: 'RETIRADO' },
    { label: 'Pesado', state: 'PESADO' }
  ];

  get activePickup(): Pickup | undefined {
    // Si el vecino seleccionó un pickup desde el historial, mostrar ese
    if (this.selectedPickup) return this.selectedPickup;

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

  get effectiveEstado(): string {
    if (this.activePickup && this.activePickup.estado) {
      const st = this.activePickup.estado.toUpperCase();
      if (st === 'EN_RUTA' || st === 'RETIRADO' || st === 'PESADO' || st === 'PROGRAMADO' || st === 'SOLICITADO') {
        return st;
      }
    }
    return this.isCamionEnRuta ? 'EN_RUTA' : 'SIN_SOLICITUD';
  }

  getCurrentStepIndex(): number {
    const estado = this.effectiveEstado === 'SIN_SOLICITUD' ? 'PROGRAMADO' : this.effectiveEstado;
    return this.steps.findIndex(s => s.state === estado);
  }

  getProgressBarWidth(): string {
    const index = this.getCurrentStepIndex();
    if (index === -1) return '0%';
    return `${(index / (this.steps.length - 1)) * 100}%`;
  }

  getStepClass(index: number): string {
    const current = this.getCurrentStepIndex();
    if (index <= current && current !== -1) {
      return 'bg-[#22a652] text-white border-[#22a652]';
    }
    return 'bg-white text-gray-400 border-gray-200';
  }

  getTextClass(index: number): string {
    const current = this.getCurrentStepIndex();
    if (index <= current && current !== -1) {
      return 'text-gray-800 font-bold';
    }
    return 'text-gray-400';
  }
}
