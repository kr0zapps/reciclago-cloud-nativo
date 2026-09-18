import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sector, Camion, Residuo, Pickup, Waypoint } from '../data/sectors.data';

@Component({
  selector: 'app-chofer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 sm:space-y-8">
      <!-- Barra de Chofer -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>Conductor: <strong class="text-[#123F5B] font-bold">{{ userName || 'Chofer' }}</strong></span>
          <span class="text-slate-300">•</span>
          <span>Unidad: <strong class="text-[#4F8A3D] font-mono font-bold">{{ selectedCamion.patente }}</strong></span>
        </div>

        <!-- Selector de Camión Asignado -->
        <div class="flex items-center gap-2 flex-wrap flex-shrink-0">
          <span class="text-xs font-bold text-slate-500">Camión:</span>
          <div class="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200">
            <button *ngFor="let c of camiones"
                    (click)="selectTruck(c.patente)"
                    type="button"
                    class="px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer"
                    [ngClass]="selectedTruckPatente === c.patente ? 'bg-[#4F8A3D] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'">
              <i class="fa-solid fa-truck text-[10px] mr-1"></i>
              {{ c.patente }}
            </button>
          </div>
        </div>
      </div>

      <!-- ==================== 2. KPIS Y MEDIDOR DE CAPACIDAD DE TOLVA ==================== -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <!-- KPI 1: Unidad y Estado -->
        <div class="bg-white rounded-2xl p-5 border border-[#E2E9E4] shadow-xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Unidad Operativa</span>
            <div class="w-8 h-8 rounded-xl bg-[#EEF5EB] text-[#4F8A3D] flex items-center justify-center text-xs font-bold border border-[#CCE4C8]">
              <i class="fa-solid fa-id-card"></i>
            </div>
          </div>
          <div class="mt-3">
            <div class="text-2xl sm:text-3xl font-black font-mono text-[#123F5B]">{{ selectedCamion.patente }}</div>
            <p class="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>En servicio • GPS Activo</span>
            </p>
          </div>
        </div>

        <!-- KPI 2: Paradas Pendientes del Turno -->
        <div class="bg-white rounded-2xl p-5 border border-[#E2E9E4] shadow-xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Paradas Pendientes</span>
            <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-xs font-bold border border-amber-200">
              <i class="fa-solid fa-location-dot"></i>
            </div>
          </div>
          <div class="mt-3">
            <div class="text-3xl sm:text-4xl font-black font-heading text-brand-navy">{{ countChoferPendientes }}</div>
            <p class="text-xs text-slate-500 mt-1">Direcciones por retirar hoy</p>
          </div>
        </div>

        <!-- KPI 3: Kilos en Tolva -->
        <div class="bg-white rounded-2xl p-5 border border-[#E2E9E4] shadow-xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Kilos en Tolva</span>
            <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold border border-emerald-200">
              <i class="fa-solid fa-scale-balanced"></i>
            </div>
          </div>
          <div class="mt-3">
            <div class="text-3xl sm:text-4xl font-black font-heading text-emerald-800">
              {{ choferKilosTurno | number:'1.0-1' }} <span class="text-lg font-bold text-slate-400">kg</span>
            </div>
            <p class="text-xs text-slate-500 mt-1">Recolectados en este recorrido</p>
          </div>
        </div>

        <!-- KPI 4: Capacidad y Barra de Llenado -->
        <div class="bg-white rounded-2xl p-5 border border-[#E2E9E4] shadow-xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Llenado de Tolva</span>
            <div class="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center text-xs font-bold border border-sky-200">
              <i class="fa-solid fa-gauge-high"></i>
            </div>
          </div>
          <div class="mt-3">
            <div class="flex items-baseline justify-between">
              <span class="text-3xl sm:text-4xl font-black font-heading text-[#123F5B]">{{ choferPorcentajeCarga }}%</span>
              <span class="text-xs font-semibold text-slate-500">de {{ selectedCamion.capacidadKilos || 1500 }} kg</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2.5 mt-2 overflow-hidden border border-slate-200">
              <div class="h-2.5 rounded-full bg-[#4F8A3D] transition-all duration-500" [style.width.%]="choferPorcentajeCarga"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== 3. PRÓXIMA PARADA DESTACADA (EN CABINA) ==================== -->
      <section class="p-6 rounded-3xl bg-[#F0F6F9] border-2 border-[#D4E6EF] shadow-xs">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div class="flex items-start gap-4">
            <div class="w-14 h-14 rounded-2xl bg-[#123F5B] text-white flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">
              <i class="fa-solid fa-map-pin"></i>
            </div>
            <div>
              <span class="text-[11px] font-black uppercase tracking-wider text-[#1F6685] block">
                {{ activeDriverStop?.estado === 'RETIRADO' ? '⚠️ Retiro Realizado — Pendiente Registrar Báscula' : (activeDriverStop?.estado === 'SOLICITADO' ? '⏳ Esperando Visto Bueno del Coordinador' : 'Próxima Parada Inmediata en Hoja de Ruta') }}
              </span>
              <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-brand-navy mt-0.5">
                {{ activeDriverStop?.direccion || '¡Ruta completada! Todas las direcciones atendidas' }}
              </h3>
              <p class="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap" *ngIf="activeDriverStop">
                <span class="font-bold text-[#4F8A3D] px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                  Material: {{ activeDriverStop.residuoNombre || 'Reciclaje' }}
                </span>
                <span class="text-slate-300" *ngIf="activeDriverStop.pesoEstimadoKg">•</span>
                <span class="font-bold text-slate-700 px-2 py-0.5 rounded bg-slate-100 border border-slate-200" *ngIf="activeDriverStop.pesoEstimadoKg">
                  <i class="fa-solid fa-weight-hanging mr-1 text-slate-500"></i>Est. Vecino: {{ activeDriverStop.pesoEstimadoKg }} kg
                </span>
                <span class="text-slate-300">•</span>
                <span class="text-slate-600 font-medium" *ngIf="activeDriverStop.comentarios">
                  "{{ activeDriverStop.comentarios }}"
                </span>
              </p>
            </div>
          </div>

          <!-- Botón Táctil Gigante Cabina -->
          <div *ngIf="activeDriverStop" class="flex-shrink-0 flex flex-wrap items-center gap-2">
            <!-- Aviso si está SOLICITADO: Debe esperar al coordinador -->
            <div *ngIf="activeDriverStop.estado === 'SOLICITADO'"
                 class="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-center gap-3 shadow-xs">
              <i class="fa-regular fa-clock text-amber-600 text-xl flex-shrink-0"></i>
              <div class="text-left">
                <span class="text-xs font-black uppercase tracking-wider block text-amber-950">Esperando Visto Bueno</span>
                <span class="text-[11px] text-amber-900 leading-tight">Tu Coordinador debe programar fecha y camión antes de salir a ruta.</span>
              </div>
            </div>

            <!-- Iniciar Ruta solo si está PROGRAMADO -->
            <button *ngIf="activeDriverStop.estado === 'PROGRAMADO'"
                    (click)="requestAction(activeDriverStop, 'en-ruta')"
                    type="button"
                    class="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#123F5B] hover:bg-[#0D3549] text-white text-sm sm:text-base font-extrabold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-3">
              <i class="fa-solid fa-truck-fast text-lg"></i>
              <span>Iniciar Ruta a esta Dirección</span>
            </button>

            <ng-container *ngIf="activeDriverStop.estado === 'EN_RUTA'">
              <button (click)="requestAction(activeDriverStop, 'retirado')"
                      type="button"
                      class="w-full sm:w-auto px-5 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-sm sm:text-base font-extrabold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2">
                <i class="fa-solid fa-box-open text-lg"></i>
                <span>Confirmar Retiro</span>
              </button>
              <button (click)="requestAction(activeDriverStop, 'pesado')"
                      type="button"
                      class="w-full sm:w-auto px-5 py-4 rounded-2xl bg-[#4F8A3D] hover:bg-[#3D6E2E] text-white text-sm sm:text-base font-extrabold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2">
                <i class="fa-solid fa-scale-balanced text-lg"></i>
                <span>Pesar en Báscula</span>
              </button>
            </ng-container>

            <button *ngIf="activeDriverStop.estado === 'RETIRADO'"
                    (click)="requestAction(activeDriverStop, 'pesado')"
                    type="button"
                    class="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#4F8A3D] hover:bg-[#3D6E2E] text-white text-sm sm:text-base font-extrabold shadow-md transition-all cursor-pointer flex items-center justify-center gap-3 ring-2 ring-emerald-400">
              <i class="fa-solid fa-scale-balanced text-xl"></i>
              <span>Registrar Pesaje en Báscula (kg)</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ==================== 4. HOJA DE RECORRIDO TÁCTIL PARA EL CHOFER ==================== -->
      <section class="bg-white rounded-3xl border border-[#E2E9E4] shadow-xs overflow-hidden">
        <div class="p-6 border-b border-[#EAEFE8] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-[#4F8A3D]">Hoja de Trabajo en Terreno</span>
            <h3 class="font-heading font-extrabold text-xl text-brand-navy mt-0.5">
              Paradas de la Cuadrilla ({{ choferPickups.length }})
            </h3>
          </div>
          <span class="text-xs text-slate-500 font-semibold">Toca el botón correspondiente para registrar el avance</span>
        </div>

        <div class="divide-y divide-[#EEF3EF]">
          <div *ngFor="let p of choferPickups"
               class="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F9FAF8] transition-colors">
            
            <div class="flex items-start sm:items-center gap-4 min-w-0 flex-1">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 border shadow-2xs"
                   [ngClass]="p.estado === 'PESADO' ? 'bg-[#EEF5EB] text-[#4F8A3D] border-[#CCE4C8]' : (p.estado === 'EN_RUTA' ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-slate-100 text-slate-600 border-slate-200')">
                <i [ngClass]="p.estado === 'PESADO' ? 'fa-solid fa-check' : (p.estado === 'EN_RUTA' ? 'fa-solid fa-truck-fast' : 'fa-solid fa-location-dot')"></i>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2.5 flex-wrap">
                  <span class="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    #{{ p.id }}
                  </span>
                  <h4 class="font-heading font-bold text-base sm:text-lg text-brand-navy">
                    {{ p.direccion }}
                  </h4>
                  <span class="text-xs font-bold text-[#4F8A3D] px-2.5 py-0.5 rounded-lg bg-[#EBF5E7] border border-[#CDE8C7]">
                    {{ p.residuoNombre || 'Reciclaje' }}
                  </span>
                </div>

                <div class="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                  <span><i class="fa-regular fa-calendar text-slate-400 mr-1"></i>{{ p.fechaTexto || p.fecha || 'Hoy' }}</span>
                  <span class="text-slate-300" *ngIf="p.pesoEstimadoKg">•</span>
                  <span *ngIf="p.pesoEstimadoKg" class="font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    <i class="fa-solid fa-weight-hanging mr-1 text-slate-400"></i>Est: {{ p.pesoEstimadoKg }} kg
                  </span>
                  <span class="text-slate-300">•</span>
                  <span *ngIf="p.kilosRecolectados" class="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <i class="fa-solid fa-scale-balanced mr-1"></i>{{ p.kilosRecolectados }} kg pesados
                  </span>
                  <span *ngIf="!p.kilosRecolectados" class="text-slate-400 italic">
                    {{ p.estado === 'RETIRADO' ? '⚠️ Retirado (pendiente báscula)' : 'Pendiente de retiro' }}
                  </span>
                  <span *ngIf="p.comentarios" class="text-slate-600 font-medium">
                    — "{{ p.comentarios }}"
                  </span>
                </div>
              </div>
            </div>

            <!-- Botones Grandes Táctiles para Conductor -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <!-- 1. SOLICITADO -> Esperando Visto Bueno del Coordinador -->
              <div *ngIf="p.estado === 'SOLICITADO'"
                   class="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-950 border border-amber-300 flex items-center gap-1.5 shadow-2xs"
                   title="Debes esperar el visto bueno de tu Coordinador para seguir esta orden">
                <i class="fa-regular fa-clock text-amber-600"></i>
                <span>Esperando Visto Bueno</span>
              </div>

              <!-- 2. PROGRAMADO -> Iniciar Ruta -->
              <button *ngIf="p.estado === 'PROGRAMADO'"
                      (click)="requestAction(p, 'en-ruta')"
                      type="button"
                      class="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#123F5B] hover:bg-[#0D3549] text-white transition-all cursor-pointer shadow-xs flex items-center gap-2">
                <i class="fa-solid fa-truck-fast"></i>
                <span>Iniciar Ruta</span>
              </button>

              <!-- 2. EN_RUTA -> Marcar Retirado o Pesar Báscula Directo -->
              <ng-container *ngIf="p.estado === 'EN_RUTA'">
                <button (click)="requestAction(p, 'retirado')"
                        type="button"
                        class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white transition-all cursor-pointer shadow-xs flex items-center gap-1.5">
                  <i class="fa-solid fa-box-open"></i>
                  <span>Retirar</span>
                </button>
                <button (click)="requestAction(p, 'pesado')"
                        type="button"
                        class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#4F8A3D] hover:bg-[#3D6E2E] text-white transition-all cursor-pointer shadow-xs flex items-center gap-1.5">
                  <i class="fa-solid fa-scale-balanced"></i>
                  <span>Pesar</span>
                </button>
              </ng-container>

              <!-- 3. RETIRADO -> Pesar en Báscula -->
              <button *ngIf="p.estado === 'RETIRADO'"
                      (click)="requestAction(p, 'pesado')"
                      type="button"
                      class="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#4F8A3D] hover:bg-[#3D6E2E] text-white transition-all cursor-pointer shadow-md flex items-center gap-2 ring-2 ring-emerald-300">
                <i class="fa-solid fa-scale-balanced text-sm"></i>
                <span>Registrar Báscula</span>
              </button>

              <!-- 4. PESADO -> Certificado -->
              <div *ngIf="p.estado === 'PESADO'"
                   class="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#EBF5E7] text-emerald-900 border border-[#CDE8C7] flex items-center gap-2 shadow-2xs">
                <i class="fa-solid fa-circle-check text-[#4F8A3D]"></i>
                <span>Pesaje Oficial Listo</span>
              </div>
            </div>
          </div>

          <div *ngIf="choferPickups.length === 0" class="py-12 px-4 text-center">
            <div class="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-lg mb-2">
              <i class="fa-solid fa-clipboard-check"></i>
            </div>
            <p class="font-bold text-brand-navy text-sm">No hay paradas asignadas para el camión {{ selectedTruckPatente }}</p>
            <p class="text-xs text-slate-500 mt-0.5">Comunícate con el Coordinador de Despacho si necesitas asignar paradas a esta cuadrilla.</p>
          </div>
        </div>
      </section>

      <!-- ==================== 5. NAVEGADOR GPS DE CABINA ==================== -->
      <section class="bg-white rounded-3xl border border-[#E2E9E4] p-6 sm:p-8 shadow-xs">
        <div class="flex items-center justify-between pb-4 mb-4 border-b border-[#EAEFE8]">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-[#4F8A3D]">Navegación GPS de Cabina</span>
            <h3 class="font-heading font-extrabold text-xl text-brand-navy mt-0.5">
              Posición Satelital del Camión {{ selectedCamion.patente }}
            </h3>
          </div>
          <span class="text-xs font-bold text-emerald-800 bg-[#EBF5E7] border border-[#CDE8C7] px-3 py-1 rounded-xl">
            <i class="fa-solid fa-satellite mr-1"></i> Transmitiendo GPS
          </span>
        </div>

        <div class="rounded-2xl bg-[#F0F6F9] border-2 border-[#D4E6EF] p-4 sm:p-5 relative overflow-hidden">
          <div class="h-44 sm:h-52 w-full bg-white rounded-xl relative p-2 overflow-hidden border border-[#E1EDF2] select-none">
            <div class="absolute -top-4 -right-4 w-44 sm:w-52 h-24 bg-gradient-to-br from-[#E3F2F8] to-[#D5EBF5] rounded-3xl flex flex-col items-center justify-center text-[10px] font-extrabold text-[#1F6685] border border-[#C5E1EE]/70 shadow-xs pointer-events-none">
              <div class="flex items-center gap-1.5 opacity-90">
                <i class="fa-solid fa-water text-xs text-sky-500"></i>
                <span>Lago Llanquihue</span>
              </div>
              <span class="text-[8.5px] font-semibold text-sky-700/80 mt-0.5">Bahía Puerto Varas</span>
            </div>

            <div class="absolute left-0 right-0 top-[68%] h-4 bg-slate-100 border-y border-slate-200/80 flex items-center justify-between px-3">
              <span class="text-[8px] font-bold text-slate-600 uppercase tracking-wider">Av. Vicente Pérez Rosales</span>
              <span class="text-[8px] font-semibold text-slate-500 hidden sm:inline">Hacia Ensenada →</span>
            </div>
            <div class="absolute left-[27%] top-0 bottom-0 w-4 bg-slate-100 border-x border-slate-200/80 flex flex-col items-center justify-center">
              <span class="text-[7.5px] font-bold text-slate-600 [writing-mode:vertical-lr] rotate-180 uppercase tracking-tight py-1">San Francisco</span>
            </div>
            <div class="absolute left-[51%] top-0 bottom-0 w-4 bg-slate-100 border-x border-slate-200/80 flex flex-col items-center justify-center">
              <span class="text-[7.5px] font-bold text-slate-600 [writing-mode:vertical-lr] rotate-180 uppercase tracking-tight py-1">Santa Rosa</span>
            </div>

            <svg class="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M 8 72 L 28 72 L 28 28 L 52 28 L 52 72 L 82 72" fill="none" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="3 3"></path>
              <path d="M 8 72 L 28 72 L 28 28 L 52 28 L 52 72 L 82 72" fill="none" stroke="#4F8A3D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"></path>
            </svg>

            <div class="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2"
                 [style.left.%]="currentWaypoint.x"
                 [style.top.%]="currentWaypoint.y"
                 style="transition: left 1.2s cubic-bezier(0.4, 0, 0.2, 1), top 1.2s cubic-bezier(0.4, 0, 0.2, 1);">
              <div class="relative flex items-center justify-center">
                <div class="relative w-10 h-10 rounded-full bg-gradient-to-tr from-[#4F8A3D] to-[#123F5B] text-white flex items-center justify-center text-sm shadow-lg ring-2 ring-white">
                  <i class="fa-solid fa-truck text-xs text-white"></i>
                </div>
                <div class="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#041D2D] text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap border border-slate-700">
                  {{ selectedTruckPatente }}
                </div>
              </div>
            </div>
          </div>

          <div class="mt-3 bg-white/95 rounded-xl p-3 border border-[#D0E2EC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span class="text-xs font-bold text-[#123F5B]">Posición GPS: {{ currentWaypoint.name }}</span>
              <p class="text-[11px] text-slate-500 mt-0.5">
                {{ currentWaypoint.detail }} • <strong class="text-[#4F8A3D]">ETA: {{ currentWaypoint.eta }}</strong> ({{ currentWaypoint.distancia }})
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class ChoferDashboardComponent implements OnInit, OnChanges {
  @Input() userName: string = '';
  @Input() sector: Sector | null = null;
  @Input() pickups: Pickup[] = [];
  @Input() camiones: Camion[] = [];
  @Input() activeWaypoint: Waypoint = { name: 'Costanera Sur', detail: 'Recorrido en curso', eta: '10 min', distancia: '1.2 km', x: 28, y: 72, estado: 'En recorrido' };

  @Output() actionRequested = new EventEmitter<{ pickup: Pickup; action: 'programar' | 'en-ruta' | 'retirado' | 'pesado' | 'cancelar' }>();

  selectedTruckPatente: string = 'PV-RC-2026';

  truckWaypointsMap: Record<string, Waypoint> = {
    'PV-RC-2026': { name: 'Costanera Sur / San Francisco', detail: 'Recorriendo cuadrante urbano', eta: '6 min', distancia: '850 m', x: 28, y: 72, estado: 'En recorrido' },
    'PV-RC-2027': { name: 'Puerto Chico / Av. Los Colonos', detail: 'Recolección de cartón y vidrios', eta: '12 min', distancia: '1.4 km', x: 52, y: 35, estado: 'En ruta' },
    'PV-RC-2028': { name: 'Camino a Ensenada Km 2', detail: 'Traslado a planta de valorización', eta: '18 min', distancia: '3.1 km', x: 75, y: 60, estado: 'En traslado' }
  };

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}

  get selectedCamion(): Camion {
    return this.camiones.find(c => c.patente === this.selectedTruckPatente) || this.camiones[0] || { id: 1, patente: 'PV-RC-2026', capacidadKilos: 1500, estado: 'DISPONIBLE' };
  }

  get currentWaypoint(): Waypoint {
    return this.truckWaypointsMap[this.selectedTruckPatente] || this.activeWaypoint;
  }

  selectTruck(patente: string): void {
    this.selectedTruckPatente = patente;
  }

  get choferPickups(): Pickup[] {
    return this.pickups.filter(p => {
      if (p.estado === 'CANCELADO') return false;
      if (p.camionPatente) {
        return p.camionPatente === this.selectedTruckPatente;
      }
      return this.selectedTruckPatente === 'PV-RC-2026';
    });
  }

  get countChoferPendientes(): number {
    return this.choferPickups.filter(p => p.estado === 'PROGRAMADO' || p.estado === 'EN_RUTA' || p.estado === 'SOLICITADO' || p.estado === 'RETIRADO').length;
  }

  get choferKilosTurno(): number {
    return this.choferPickups
      .filter(p => (p.estado === 'RETIRADO' || p.estado === 'PESADO') && p.kilosRecolectados)
      .reduce((sum, p) => sum + (Number(p.kilosRecolectados) || 0), 0);
  }

  get choferPorcentajeCarga(): number {
    const cap = this.selectedCamion.capacidadKilos || this.selectedCamion.capacidadMaximaKg || 1500;
    return Math.min(100, Math.round((this.choferKilosTurno / cap) * 100));
  }

  get activeDriverStop(): Pickup | undefined {
    return this.choferPickups.find(p => p.estado === 'EN_RUTA')
      || this.choferPickups.find(p => p.estado === 'RETIRADO')
      || this.choferPickups.find(p => p.estado === 'PROGRAMADO')
      || this.choferPickups.find(p => p.estado === 'SOLICITADO');
  }

  requestAction(pickup: any, action: 'programar' | 'en-ruta' | 'retirado' | 'pesado' | 'cancelar'): void {
    this.actionRequested.emit({ pickup, action });
  }
}
