import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sector, Waypoint } from '../data/sectors.data';

@Component({
  selector: 'app-interactive-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-3xl border border-[#E2E9E4] p-7 sm:p-9 flex flex-col justify-between shadow-xs card-hover h-full">
      <div class="space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-[#E8F3F7] text-brand-lake flex items-center justify-center text-2xl interactive-icon">
          <i class="fa-solid fa-map-location-dot"></i>
        </div>
        <div>
          <h3 class="font-heading font-extrabold text-2xl text-brand-navy">Mapa de recorrido vecinal</h3>
        </div>
        <p class="text-sm sm:text-base text-brand-muted leading-relaxed">
          Consulta cuándo pasa el camión por tu calle y revisa el cuadrante comunal por días y tipos de materiales en toda la comuna.
        </p>

        <!-- Lienzo de Calles y Simulación -->
        <div class="rounded-2xl bg-[#F0F6F9] border border-[#D4E6EF] p-4 sm:p-5 relative overflow-hidden shadow-xs">
          <div class="flex items-center justify-between gap-2 mb-3">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-compass text-brand-lake text-base"></i>
              <span class="font-bold text-sm text-brand-navy">{{ sector?.cuadrante }}</span>
            </div>
            <span class="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <i class="fa-solid text-[9px]" [ngClass]="truckSimulationRunning ? 'fa-circle text-[#4F8A3D]' : 'fa-circle text-slate-400'"></i>
              <span>{{ truckSimulationRunning ? 'En circulación' : 'Pausado' }}</span>
            </span>
          </div>

          <!-- Mapa Vectorial de Calles -->
          <div class="h-44 sm:h-48 w-full bg-white rounded-xl relative p-2 overflow-hidden border border-[#E1EDF2] select-none">
            <!-- Lago Llanquihue -->
            <div class="absolute -top-4 -right-4 w-44 sm:w-52 h-24 bg-gradient-to-br from-[#E3F2F8] to-[#D5EBF5] rounded-3xl flex flex-col items-center justify-center text-[10px] font-extrabold text-brand-lake border border-[#C5E1EE]/70 shadow-xs pointer-events-none">
              <div class="flex items-center gap-1.5 opacity-90">
                <i class="fa-solid fa-water text-xs text-sky-500"></i>
                <span>Lago Llanquihue</span>
              </div>
              <span class="text-[8.5px] font-semibold text-sky-700/80 mt-0.5">Bahía de Puerto Varas</span>
            </div>

            <!-- Calles Reales -->
            <div class="absolute left-0 right-0 top-[68%] h-4 bg-slate-100 border-y border-slate-200/80 flex items-center justify-between px-3">
              <span class="text-[8px] font-bold text-slate-600 uppercase tracking-wider">Av. Vicente Pérez Rosales (Costanera)</span>
              <span class="text-[8px] font-semibold text-slate-500 hidden sm:inline">Hacia Ensenada →</span>
            </div>
            <div class="absolute left-[27%] top-0 bottom-0 w-4 bg-slate-100 border-x border-slate-200/80 flex flex-col items-center justify-center">
              <span class="text-[7.5px] font-bold text-slate-600 [writing-mode:vertical-lr] rotate-180 uppercase tracking-tight py-1">San Francisco</span>
            </div>
            <div class="absolute left-[27%] right-[45%] top-[26%] h-4 bg-slate-100 border-y border-slate-200/80 flex items-center justify-center">
              <span class="text-[7.5px] font-bold text-slate-600 uppercase tracking-tight">Del Salvador</span>
            </div>
            <div class="absolute left-[51%] top-0 bottom-0 w-4 bg-slate-100 border-x border-slate-200/80 flex flex-col items-center justify-center">
              <span class="text-[7.5px] font-bold text-slate-600 [writing-mode:vertical-lr] rotate-180 uppercase tracking-tight py-1">Santa Rosa</span>
            </div>

            <!-- Puntos de Interés -->
            <div class="absolute left-[8%] top-[35%] flex items-center gap-1 bg-white/95 px-1.5 py-0.5 rounded-md border border-slate-200 text-[9px] font-bold text-slate-700 shadow-xs">
              <i class="fa-solid fa-recycle text-[8.5px] text-[#4F8A3D]"></i>
              <span class="hidden sm:inline">Punto Limpio</span>
            </div>

            <div class="absolute left-[78%] top-[50%] flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-[#4F8A3D] shadow-xs text-[10px] font-bold text-[#4F8A3D] z-20">
              <i class="fa-solid fa-house-chimney text-[9px]"></i>
              <span>Tu casa</span>
            </div>

            <!-- Ruta SVG punteada y recorrida -->
            <svg class="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M 8 72 L 28 72 L 28 28 L 52 28 L 52 72 L 82 72" fill="none" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="3 3"></path>
              <path d="M 8 72 L 28 72 L 28 28 L 52 28 L 52 72 L 82 72" fill="none" stroke="#4F8A3D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"></path>
            </svg>

            <!-- Camión en Movimiento -->
            <div class="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2"
                 [style.left.%]="activeWaypoint.x"
                 [style.top.%]="activeWaypoint.y"
                 style="transition: left 1.2s cubic-bezier(0.4, 0, 0.2, 1), top 1.2s cubic-bezier(0.4, 0, 0.2, 1);">
              <div class="relative flex items-center justify-center">
                <div class="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#123F5B] to-[#1E628C] text-white flex items-center justify-center text-xs shadow-lg ring-2 ring-white">
                  <i class="fa-solid fa-truck-fast text-[11px] text-white"></i>
                </div>
                <div class="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#041D2D] text-white text-[8px] font-bold px-1.5 py-0.2 rounded-md shadow whitespace-nowrap border border-slate-700">
                  {{ activeCamionPatente || sector?.patente || 'PV-RC-2026' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Telemetría y Controles -->
          <div class="mt-3 bg-white/95 rounded-xl p-3 border border-[#D0E2EC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-bold text-[#123F5B] truncate">{{ activeWaypoint.name }}</span>
              </div>
              <p class="text-[11px] text-[#546571] mt-0.5 flex items-center gap-2 flex-wrap">
                <span>{{ activeWaypoint.detail }}</span>
                <span class="text-slate-300">•</span>
                <span class="font-medium text-slate-600"><i class="fa-regular fa-clock text-[10px] mr-0.5"></i> ETA: {{ activeWaypoint.eta }}</span>
                <span class="text-slate-300">•</span>
                <span class="font-medium text-slate-600"><i class="fa-solid fa-route text-[10px] mr-0.5"></i> {{ activeWaypoint.distancia }}</span>
              </p>
            </div>

            <div class="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-center">
              <button (click)="toggleSimulation.emit()" type="button" class="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#EEF5EB] hover:bg-[#E0EDE0] text-[#3D742F] border border-[#C8DFCA] transition-colors flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid" [class.fa-pause]="truckSimulationRunning" [class.fa-play]="!truckSimulationRunning"></i>
                <span>{{ truckSimulationRunning ? 'Pausar' : 'Reanudar' }}</span>
              </button>
              <button (click)="toggleSpeed.emit()" type="button" class="px-2 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors cursor-pointer" title="Alternar velocidad">
                <span>{{ truckSpeed }}x</span>
              </button>
              <button (click)="resetSimulation.emit()" type="button" class="px-2 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors cursor-pointer" title="Reiniciar recorrido">
                <i class="fa-solid fa-rotate-left text-[11px]"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-6">
        <button (click)="openRutaModal.emit()" type="button" class="btn-action inline-flex items-center justify-start gap-2.5 text-brand-lake hover:text-brand-navy font-bold text-base transition-colors py-2 cursor-pointer">
          <span>Ver mi recorrido comunal completo</span>
          <i class="fa-solid fa-arrow-right text-sm btn-arrow"></i>
        </button>
      </div>
    </div>
  `
})
export class InteractiveMapComponent {
  @Input() sector!: Sector | any;
  @Input() activeWaypoint!: Waypoint;
  @Input() truckSimulationRunning: boolean = true;
  @Input() truckSpeed: number = 1;
  @Input() activeCamionPatente: string = '';

  @Output() toggleSimulation = new EventEmitter<void>();
  @Output() toggleSpeed = new EventEmitter<void>();
  @Output() resetSimulation = new EventEmitter<void>();
  @Output() openRutaModal = new EventEmitter<void>();
}
