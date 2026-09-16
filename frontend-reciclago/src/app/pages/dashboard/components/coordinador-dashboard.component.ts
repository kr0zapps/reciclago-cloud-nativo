import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sector, Camion, Residuo, Pickup, Waypoint } from '../data/sectors.data';

@Component({
  selector: 'app-coordinador-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 sm:space-y-8">
      <!-- ==================== 1. ENCABEZADO DE DESPACHO Y MESA DE AYUDA ==================== -->
      <section class="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E9E4] shadow-xs">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div class="flex items-center gap-2 text-xs font-bold text-[#1F6685] mb-1">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#1F6685]/10 text-[#1F6685] uppercase tracking-wider text-[10px] font-black">
                <i class="fa-solid fa-headset text-xs"></i> Despacho Logístico
              </span>
              <span class="text-slate-300">•</span>
              <span class="text-slate-500">Sector de Planificación: <strong class="text-brand-navy">{{ sector?.cuadrante || sector?.nombre || 'Puerto Varas' }}</strong></span>
            </div>
            <h2 class="font-heading font-extrabold text-xl sm:text-2xl text-brand-navy">
              Consola de Programación, Asignación y Atención Vecinal
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              Recepción telefónica ciudadana, asignación de cuadrillas y despacho de camiones en ruta.
            </p>
          </div>

          <!-- Botón de Atención Primaria -->
          <div class="flex items-center gap-3 flex-shrink-0">
            <button (click)="openNuevoRetiroModal()"
                    type="button"
                    class="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#1F6685] hover:bg-[#164E66] text-white text-sm font-bold shadow-xs transition-all cursor-pointer">
              <i class="fa-solid fa-phone-volume text-sm"></i>
              <span>+ Ingresar Solicitud Telefónica</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ==================== 2. PIPELINE DE DESPACHO EN TIEMPO REAL ==================== -->
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <!-- Tarjeta 1: Solicitudes Entrantes (Por Asignar) -->
        <div class="bg-white rounded-2xl p-5 border-2 shadow-xs flex flex-col justify-between"
             [ngClass]="countPendientes > 0 ? 'border-amber-300/80 bg-amber-50/20' : 'border-[#E2E9E4]'">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-amber-900">Por Programar</span>
            <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
              <i class="fa-solid fa-inbox"></i>
            </div>
          </div>
          <div class="mt-3">
            <div class="text-3xl sm:text-4xl font-black font-heading text-amber-900">{{ countPendientes }}</div>
            <p class="text-xs text-amber-800 mt-1 font-semibold">
              {{ countPendientes > 0 ? 'Esperando asignación a camión' : 'Bandeja al día' }}
            </p>
          </div>
        </div>

        <!-- Tarjeta 2: Listos para Despacho (Programados) -->
        <div class="bg-white rounded-2xl p-5 border border-[#E2E9E4] shadow-xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Programados</span>
            <div class="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center text-xs font-bold border border-sky-200">
              <i class="fa-solid fa-calendar-check"></i>
            </div>
          </div>
          <div class="mt-3">
            <div class="text-3xl sm:text-4xl font-black font-heading text-brand-navy">{{ countProgramados }}</div>
            <p class="text-xs text-slate-500 mt-1">Con fecha y sector asignado</p>
          </div>
        </div>

        <!-- Tarjeta 3: Cuadrillas en Ruta -->
        <div class="bg-white rounded-2xl p-5 border border-[#E2E9E4] shadow-xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">En Ruta</span>
            <div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-xs font-bold border border-indigo-200">
              <i class="fa-solid fa-truck-fast"></i>
            </div>
          </div>
          <div class="mt-3">
            <div class="text-3xl sm:text-4xl font-black font-heading text-[#1F6685]">{{ countEnRuta }}</div>
            <p class="text-xs text-slate-500 mt-1">Recorriendo direcciones</p>
          </div>
        </div>

        <!-- Tarjeta 4: Camiones Operables -->
        <div class="bg-white rounded-2xl p-5 border border-[#E2E9E4] shadow-xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Flota Activa</span>
            <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold border border-emerald-200">
              <i class="fa-solid fa-truck"></i>
            </div>
          </div>
          <div class="mt-3">
            <div class="text-3xl sm:text-4xl font-black font-heading text-emerald-800">
              {{ camionesDisponiblesCount }} / {{ camiones.length }}
            </div>
            <p class="text-xs text-slate-500 mt-1">Unidades operativas hoy</p>
          </div>
        </div>
      </section>

      <!-- ==================== 3. PLANILLA DE DESPACHO Y ASIGNACIÓN DE RUTAS ==================== -->
      <section class="bg-white rounded-3xl border border-[#E2E9E4] shadow-xs overflow-hidden">
        <div class="p-6 border-b border-[#EAEFE8] space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-[#1F6685]">Control Operativo de Calle</span>
              <h3 class="font-heading font-extrabold text-2xl text-brand-navy mt-0.5">
                Planilla de Despacho y Gestión de Rutas
              </h3>
            </div>

            <!-- Filtros de Sector y Tamaño de Página -->
            <div class="flex items-center gap-3 flex-wrap">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-slate-500">Sector:</span>
                <select [(ngModel)]="filterSector"
                        (ngModelChange)="onFilterSectorChange()"
                        class="select-stitch py-1.5 px-3 text-xs font-bold text-[#1F6685] bg-[#F8FAF7]">
                  <option value="ALL">Todos los Sectores</option>
                  <option *ngFor="let s of sectores" [value]="s.nombre">{{ s.nombre }}</option>
                </select>
              </div>

              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-slate-500">Filas:</span>
                <select [(ngModel)]="pageSize"
                        (ngModelChange)="onPageSizeChange()"
                        class="select-stitch py-1.5 px-2 text-xs font-bold text-[#1F6685] bg-[#F8FAF7]">
                  <option [value]="5">5</option>
                  <option [value]="10">10</option>
                  <option [value]="20">20</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Pestañas de Estado Logísticas -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
            <button (click)="onFilterStatusChange('ALL')"
                    type="button"
                    class="px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                    [ngClass]="filterStatus === 'ALL' ? 'bg-[#1F6685] text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'">
              Todos ({{ pickups.length }})
            </button>

            <button (click)="onFilterStatusChange('SOLICITADO')"
                    type="button"
                    class="px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                    [ngClass]="filterStatus === 'SOLICITADO' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/60'">
              Por Programar ({{ countPendientes }})
            </button>

            <button (click)="onFilterStatusChange('PROGRAMADO')"
                    type="button"
                    class="px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                    [ngClass]="filterStatus === 'PROGRAMADO' ? 'bg-sky-700 text-white shadow-xs' : 'bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200/60'">
              Programados ({{ countProgramados }})
            </button>

            <button (click)="onFilterStatusChange('EN_RUTA')"
                    type="button"
                    class="px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                    [ngClass]="filterStatus === 'EN_RUTA' ? 'bg-indigo-700 text-white shadow-xs' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/60'">
              En Ruta ({{ countEnRuta }})
            </button>

            <button (click)="onFilterStatusChange('RETIRADO')"
                    type="button"
                    class="px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                    [ngClass]="filterStatus === 'RETIRADO' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/60'">
              Retirados ({{ countRetirados }})
            </button>
          </div>
        </div>

        <!-- Lista de Despacho -->
        <div class="divide-y divide-[#EEF3EF]">
          <div *ngFor="let p of paginatedPickups"
               class="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#F9FAF8] transition-colors">
            
            <div class="flex items-start sm:items-center gap-4 min-w-0 flex-1">
              <div class="w-12 h-12 rounded-2xl bg-sky-50 text-[#1F6685] flex items-center justify-center text-xl flex-shrink-0 border border-sky-200 shadow-2xs">
                <i class="fa-solid fa-route"></i>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2.5 flex-wrap">
                  <span class="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    #{{ p.id }}
                  </span>
                  <h4 class="font-heading font-bold text-base sm:text-lg text-brand-navy">
                    {{ p.direccion }}
                  </h4>
                  <span class="text-xs font-bold text-[#1F6685] px-2.5 py-0.5 rounded-lg bg-sky-50 border border-sky-200">
                    {{ p.residuoNombre || 'Reciclaje Domiciliario' }}
                  </span>
                </div>

                <div class="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                  <span><i class="fa-regular fa-calendar text-slate-400 mr-1"></i>{{ p.fechaTexto || p.fecha || 'Sin fecha' }}</span>
                  <span class="text-slate-300" *ngIf="p.pesoEstimadoKg">•</span>
                  <span *ngIf="p.pesoEstimadoKg" class="font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    <i class="fa-solid fa-weight-hanging mr-1 text-slate-400"></i>Est: {{ p.pesoEstimadoKg }} kg
                  </span>
                  <span class="text-slate-300" *ngIf="p.kilosRecolectados">•</span>
                  <span *ngIf="p.kilosRecolectados" class="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <i class="fa-solid fa-scale-balanced mr-1"></i>{{ p.kilosRecolectados }} kg pesados
                  </span>
                  <span class="text-slate-300">•</span>
                  <span *ngIf="p.comentarios" class="text-slate-600 font-medium">
                    "{{ p.comentarios }}"
                  </span>
                  <span *ngIf="!p.comentarios" class="text-slate-400 italic">
                    Sin observaciones
                  </span>
                </div>
              </div>
            </div>

            <!-- Botones de Coordinación -->
            <div class="flex items-center gap-3 flex-wrap self-start lg:self-center flex-shrink-0">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border shadow-2xs"
                    [ngClass]="getStatusBadgeClass(p.estado)">
                <i [ngClass]="getStatusIconClass(p.estado)"></i>
                <span>{{ p.estado }}</span>
              </span>

              <div class="flex items-center gap-1.5">
                <!-- 1. SOLICITADO -> Programar -->
                <button *ngIf="p.estado === 'SOLICITADO'"
                        (click)="requestAction(p, 'programar')"
                        type="button"
                        class="px-4 py-2 rounded-xl text-xs font-bold bg-[#1F6685] hover:bg-[#164E66] text-white transition-all cursor-pointer shadow-xs flex items-center gap-1.5">
                  <i class="fa-regular fa-calendar-check text-xs"></i>
                  <span>Programar en Ruta</span>
                </button>

                <!-- 2. PROGRAMADO -> Despachar a Ruta -->
                <button *ngIf="p.estado === 'PROGRAMADO'"
                        (click)="requestAction(p, 'en-ruta')"
                        type="button"
                        class="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-all cursor-pointer shadow-xs flex items-center gap-1.5">
                  <i class="fa-solid fa-truck-fast text-xs"></i>
                  <span>Despachar a Cuadrilla</span>
                </button>

                <!-- 3. EN_RUTA -> Retirado -->
                <button *ngIf="p.estado === 'EN_RUTA'"
                        (click)="requestAction(p, 'retirado')"
                        type="button"
                        class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-2xs flex items-center gap-1.5">
                  <i class="fa-solid fa-box-open text-xs"></i>
                  <span>Confirmar Retiro</span>
                </button>

                <!-- 4. RETIRADO -> Pesar en Báscula -->
                <button *ngIf="p.estado === 'RETIRADO'"
                        (click)="requestAction(p, 'pesado')"
                        type="button"
                        class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#4F8A3D] hover:bg-[#3D6E2E] text-white transition-all cursor-pointer shadow-2xs flex items-center gap-1.5">
                  <i class="fa-solid fa-scale-balanced text-xs"></i>
                  <span>Registrar Báscula</span>
                </button>

                <div *ngIf="p.estado === 'PESADO'"
                     class="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#EBF5E7] text-emerald-900 border border-[#CDE8C7] flex items-center gap-1">
                  <i class="fa-solid fa-check text-emerald-600 text-xs"></i>
                  <span>{{ p.kilosRecolectados ? p.kilosRecolectados + ' kg' : 'Pesado' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="filteredPickups.length === 0" class="py-12 px-4 text-center">
            <div class="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-lg mb-2">
              <i class="fa-solid fa-inbox"></i>
            </div>
            <p class="font-bold text-brand-navy text-sm">No hay retiros en este filtro</p>
            <p class="text-xs text-slate-500 mt-0.5">Selecciona otra pestaña o cambia de sector.</p>
          </div>
        </div>

        <!-- Paginación -->
        <div *ngIf="filteredPickups.length > 0" class="p-4 bg-[#F8FAF7] border-t border-[#EAEFE8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span class="text-slate-500 font-medium">
            Mostrando <strong class="text-slate-800">{{ (currentPage - 1) * pageSize + 1 }}</strong> a
            <strong class="text-slate-800">{{ Math.min(currentPage * pageSize, filteredPickups.length) }}</strong> de
            <strong class="text-slate-800">{{ filteredPickups.length }}</strong> solicitudes
          </span>

          <div class="flex items-center gap-1.5">
            <button (click)="setPage(currentPage - 1)"
                    [disabled]="currentPage === 1"
                    type="button"
                    class="px-3 py-1.5 rounded-lg border border-slate-200 font-bold transition-all"
                    [ngClass]="currentPage === 1 ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-white hover:bg-slate-100 text-slate-700 cursor-pointer shadow-2xs'">
              <i class="fa-solid fa-chevron-left mr-1"></i> Anterior
            </button>

            <button *ngFor="let page of getPageNumbers()"
                    (click)="setPage(page)"
                    type="button"
                    class="w-8 h-8 rounded-lg font-bold transition-all text-xs flex items-center justify-center cursor-pointer"
                    [ngClass]="currentPage === page ? 'bg-[#1F6685] text-white shadow-xs' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'">
              {{ page }}
            </button>

            <button (click)="setPage(currentPage + 1)"
                    [disabled]="currentPage === totalPages"
                    type="button"
                    class="px-3 py-1.5 rounded-lg border border-slate-200 font-bold transition-all"
                    [ngClass]="currentPage === totalPages ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-white hover:bg-slate-100 text-slate-700 cursor-pointer shadow-2xs'">
              Siguiente <i class="fa-solid fa-chevron-right ml-1"></i>
            </button>
          </div>
        </div>
      </section>

      <!-- ==================== 4. TELEMETRÍA MULTICAMIÓN PARA DESPACHO ==================== -->
      <section class="bg-white rounded-3xl border border-[#E2E9E4] p-6 sm:p-8 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#EAEFE8]">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-[#1F6685]">Monitoreo de Cuadrillas en Terreno</span>
            <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-brand-navy mt-0.5">
              Rastreo Satelital y Estimación de Tiempos (ETA)
            </h3>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-bold text-slate-500">Seleccionar Camión:</span>
            <div class="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200">
              <button *ngFor="let c of camiones"
                      (click)="selectTruck(c.patente)"
                      type="button"
                      class="px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer"
                      [ngClass]="selectedTruckPatente === c.patente ? 'bg-[#1F6685] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'">
                {{ c.patente }}
              </button>
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-[#F0F6F9] border-2 border-[#D4E6EF] p-4 sm:p-5 relative overflow-hidden">
          <div class="flex items-center justify-between gap-2 mb-3">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-compass text-[#1F6685] text-lg"></i>
              <span class="font-bold text-sm text-brand-navy">
                Camión {{ selectedCamion.patente }} — {{ currentWaypoint.name }}
              </span>
            </div>
            <span class="text-xs text-slate-600 font-semibold bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
              {{ truckSimulationRunning ? 'En recorrido' : 'Pausado' }}
            </span>
          </div>

          <div class="h-48 sm:h-56 w-full bg-white rounded-xl relative p-2 overflow-hidden border border-[#E1EDF2] select-none">
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
                <div class="relative w-9 h-9 rounded-full bg-gradient-to-tr from-[#1F6685] to-[#38BDF8] text-white flex items-center justify-center text-xs shadow-lg ring-2 ring-white">
                  <i class="fa-solid fa-truck-moving text-xs text-white"></i>
                </div>
                <div class="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#041D2D] text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap border border-slate-700">
                  {{ selectedTruckPatente }}
                </div>
              </div>
            </div>
          </div>

          <div class="mt-3 bg-white/95 rounded-xl p-3 border border-[#D0E2EC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-[#1F6685] border border-sky-200">
                  <i class="fa-solid fa-location-dot text-[10px]"></i>
                  <span>Cuadrante en Atención</span>
                </span>
                <span class="text-xs font-bold text-[#123F5B] truncate">{{ currentWaypoint.name }}</span>
              </div>
              <p class="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                <span>{{ currentWaypoint.detail }}</span>
                <span class="text-slate-300">•</span>
                <span class="font-bold text-[#4F8A3D]">Llegada aprox: {{ currentWaypoint.eta }}</span>
                <span class="text-slate-300">•</span>
                <span class="font-semibold text-slate-600">{{ currentWaypoint.distancia }}</span>
              </p>
            </div>

            <div class="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-center">
              <button (click)="toggleTruckSimulation.emit()" type="button" class="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#EEF5EB] hover:bg-[#E0EDE0] text-[#3D742F] border border-[#C8DFCA] transition-colors flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid" [class.fa-pause]="truckSimulationRunning" [class.fa-play]="!truckSimulationRunning"></i>
                <span>{{ truckSimulationRunning ? 'Pausar' : 'Reanudar' }}</span>
              </button>
              <button (click)="toggleTruckSpeed.emit()" type="button" class="px-2 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors cursor-pointer">
                <span>{{ truckSpeed }}x</span>
              </button>
              <button (click)="resetTruckSimulation.emit()" type="button" class="px-2 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors cursor-pointer">
                <i class="fa-solid fa-rotate-left text-[11px]"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== MODAL TELEFÓNICO ==================== -->
      <div *ngIf="showNuevoRetiroModal"
           (click)="closeNuevoRetiroModal()"
           class="fixed inset-0 z-[9999] overflow-y-auto bg-[#041D2D]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen anim-modal-backdrop">
        <div (click)="$event.stopPropagation()"
             class="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel text-slate-800 my-auto p-6 sm:p-8">
          
          <div class="h-1.5 -mx-8 -mt-8 mb-6 bg-gradient-to-r from-[#1F6685] via-[#38BDF8] to-[#4F8A3D]"></div>

          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-sky-50 text-[#1F6685] flex items-center justify-center text-sm font-bold border border-sky-200">
                <i class="fa-solid fa-headset"></i>
              </div>
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Despacho Logístico</span>
                <h3 class="font-heading font-extrabold text-lg text-brand-navy">Mesa de Entrada de Solicitud Telefónica</h3>
              </div>
            </div>
            <button (click)="closeNuevoRetiroModal()" type="button" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs transition-colors cursor-pointer">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form (ngSubmit)="submitRetiroVecinal()" class="space-y-4 text-left">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-[#1F6685] mb-1">Nombre o Teléfono del Vecino</label>
              <input type="text" [(ngModel)]="nuevoVecinoNombre" name="nuevoVecinoNombre" required class="input-stitch w-full py-2 px-3 text-sm font-medium" placeholder="Ej: Juan Pérez (+56 9 8765 4321)">
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-[#1F6685] mb-1">Dirección Exacta</label>
              <input type="text" [(ngModel)]="nuevaDireccion" name="nuevaDireccion" required class="input-stitch w-full py-2 px-3 text-sm font-medium" placeholder="Ej: San Francisco 320, Puerto Varas">
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-[#1F6685] mb-1">Tipo de Residuo / Material</label>
              <select [(ngModel)]="nuevoResiduoId" name="nuevoResiduoId" class="select-stitch w-full py-2 px-3 text-sm font-medium">
                <option *ngFor="let r of residuos" [value]="r.id">{{ r.nombre }}</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-[#1F6685] mb-1">Observaciones para el Chofer</label>
              <textarea [(ngModel)]="nuevosComentarios" name="nuevosComentarios" rows="2" class="input-stitch w-full py-2 px-3 text-sm" placeholder="Ej: Dejar cajas amarradas en el portón"></textarea>
            </div>

            <div class="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button (click)="closeNuevoRetiroModal()" type="button" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
                Cancelar
              </button>
              <button type="submit" [disabled]="isSubmittingRetiro" class="px-5 py-2.5 rounded-xl bg-[#1F6685] hover:bg-[#164E66] text-white text-xs font-bold cursor-pointer">
                <span *ngIf="!isSubmittingRetiro">Agendar para Despacho</span>
                <span *ngIf="isSubmittingRetiro"><i class="fa-solid fa-spinner fa-spin"></i> Guardando...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class CoordinadorDashboardComponent implements OnInit, OnChanges {
  @Input() userRoles: string[] = [];
  @Input() userName: string = '';
  @Input() sector: Sector | any = null;
  @Input() sectores: Sector[] = [];
  @Input() pickups: Pickup[] = [];
  @Input() camiones: Camion[] = [];
  @Input() residuos: Residuo[] = [];
  @Input() activeWaypoint: Waypoint = { name: 'Costanera Sur', detail: 'Recorrido en curso', eta: '10 min', distancia: '1.2 km', x: 28, y: 72, estado: 'En recorrido' };
  @Input() truckSimulationRunning: boolean = true;
  @Input() truckSpeed: number = 1;

  @Output() actionRequested = new EventEmitter<{ pickup: any; action: 'programar' | 'en-ruta' | 'retirado' | 'pesado' | 'cancelar' }>();
  @Output() pickupCreated = new EventEmitter<any>();
  @Output() openRutaCompleta = new EventEmitter<void>();
  @Output() toggleTruckSimulation = new EventEmitter<void>();
  @Output() toggleTruckSpeed = new EventEmitter<void>();
  @Output() resetTruckSimulation = new EventEmitter<void>();

  Math = Math;
  selectedTruckPatente: string = 'PV-RC-2026';

  filterStatus: string = 'ALL';
  filterSector: string = 'ALL';

  pageSize: number = 5;
  currentPage: number = 1;

  showNuevoRetiroModal = false;
  isSubmittingRetiro = false;
  nuevoVecinoNombre = '';
  nuevaDireccion = '';
  nuevoResiduoId = 1;
  nuevosComentarios = '';

  truckWaypointsMap: Record<string, Waypoint> = {
    'PV-RC-2026': { name: 'Costanera Sur / San Francisco', detail: 'Recorriendo cuadrante urbano', eta: '6 min', distancia: '850 m', x: 28, y: 72, estado: 'En recorrido' },
    'PV-RC-2027': { name: 'Puerto Chico / Av. Los Colonos', detail: 'Recolección diferenciada de cartón y vidrios', eta: '12 min', distancia: '1.4 km', x: 52, y: 35, estado: 'En ruta' },
    'PV-RC-2028': { name: 'Camino a Ensenada Km 2', detail: 'Traslado a planta de valorización', eta: '18 min', distancia: '3.1 km', x: 75, y: 60, estado: 'En traslado' }
  };

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['residuos'] && this.residuos && this.residuos.length > 0) {
      this.nuevoResiduoId = this.residuos[0].id;
    }
  }

  get selectedCamion(): Camion {
    return this.camiones.find(c => c.patente === this.selectedTruckPatente) || this.camiones[0] || { id: 1, patente: 'PV-RC-2026', capacidadKilos: 1500, estado: 'DISPONIBLE' };
  }

  get currentWaypoint(): Waypoint {
    return this.truckWaypointsMap[this.selectedTruckPatente] || this.activeWaypoint;
  }

  get camionesDisponiblesCount(): number {
    return this.camiones.filter(c => c.estado !== 'MANTENIMIENTO').length;
  }

  selectTruck(patente: string): void {
    this.selectedTruckPatente = patente;
  }

  get countPendientes(): number {
    return this.pickups.filter(p => p.estado === 'SOLICITADO').length;
  }

  get countProgramados(): number {
    return this.pickups.filter(p => p.estado === 'PROGRAMADO').length;
  }

  get countEnRuta(): number {
    return this.pickups.filter(p => p.estado === 'EN_RUTA').length;
  }

  get countRetirados(): number {
    return this.pickups.filter(p => p.estado === 'RETIRADO').length;
  }

  get filteredPickups(): Pickup[] {
    return this.pickups.filter(p => {
      const matchStatus = this.filterStatus === 'ALL' || p.estado === this.filterStatus;
      const matchSector = this.filterSector === 'ALL' || (p.direccion && p.direccion.includes(this.filterSector));
      return matchStatus && matchSector;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredPickups.length / this.pageSize));
  }

  get paginatedPickups(): Pickup[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredPickups.slice(start, start + this.pageSize);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  onFilterStatusChange(status: string): void {
    this.filterStatus = status;
    this.currentPage = 1;
  }

  onFilterSectorChange(): void {
    this.currentPage = 1;
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  requestAction(pickup: any, action: 'programar' | 'en-ruta' | 'retirado' | 'pesado' | 'cancelar'): void {
    this.actionRequested.emit({ pickup, action });
  }

  openNuevoRetiroModal(): void {
    this.showNuevoRetiroModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeNuevoRetiroModal(): void {
    this.showNuevoRetiroModal = false;
    document.body.style.overflow = '';
  }

  submitRetiroVecinal(): void {
    if (!this.nuevaDireccion) return;
    this.isSubmittingRetiro = true;
    const item = {
      direccion: this.nuevaDireccion,
      residuoId: Number(this.nuevoResiduoId),
      comentarios: `[Ingreso Mesa Despacho - ${this.nuevoVecinoNombre}] ${this.nuevosComentarios}`
    };
    this.pickupCreated.emit(item);
    setTimeout(() => {
      this.isSubmittingRetiro = false;
      this.closeNuevoRetiroModal();
      this.nuevaDireccion = '';
      this.nuevoVecinoNombre = '';
      this.nuevosComentarios = '';
    }, 500);
  }

  getStatusBadgeClass(estado?: string): string {
    switch (estado) {
      case 'SOLICITADO':
        return 'bg-amber-50 text-amber-900 border-amber-200/80';
      case 'PROGRAMADO':
        return 'bg-sky-50 text-sky-900 border-sky-200/80';
      case 'EN_RUTA':
        return 'bg-indigo-50 text-indigo-900 border-indigo-200/80';
      case 'RETIRADO':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200/80';
      case 'PESADO':
        return 'bg-[#EBF5E7] text-emerald-900 border-[#CDE8C7]';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }

  getStatusIconClass(estado?: string): string {
    switch (estado) {
      case 'SOLICITADO':
        return 'fa-regular fa-clock text-amber-600 text-xs';
      case 'PROGRAMADO':
        return 'fa-regular fa-calendar-check text-sky-600 text-xs';
      case 'EN_RUTA':
        return 'fa-solid fa-truck-fast text-indigo-600 text-xs';
      case 'RETIRADO':
        return 'fa-solid fa-box-open text-emerald-600 text-xs';
      case 'PESADO':
        return 'fa-solid fa-check text-emerald-600 text-xs';
      default:
        return 'fa-solid fa-circle-info text-slate-500 text-xs';
    }
  }
}
