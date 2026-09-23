import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, SimpleChanges, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Sector,
  Camion,
  Residuo,
  Pickup,
  Waypoint,
  EstadoCamion,
  RotacionSemanal,
  RotacionConfig,
  SEMANAS_ROTACION_DEFAULT,
  loadLocalRotacionConfig,
  saveLocalRotacionConfig,
  loadScheduleOverrides,
  saveScheduleOverrides,
  getScheduleOverrideForSector,
  SectorScheduleOverride,
  DEFAULT_SECTORES,
  aplicarSectorOverrides,
  loadLocalSectorOverrides,
  saveLocalSectorOverrides
} from '../data/sectors.data';
import { BffService } from '../../../services/bff.service';
import { formatRut, validateRut } from '../../../shared/utils/rut.utils';
import { formatChileanPhone, validateChileanPhone } from '../../../shared/utils/phone.utils';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 sm:space-y-8">
      <!-- Barra de Acciones de Administración -->
      <div class="flex items-center justify-end gap-2.5 flex-wrap">
        <button (click)="exportarPlanillaCsv()"
                  type="button"
                  class="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold border border-slate-200 transition-all cursor-pointer">
            <i class="fa-solid fa-file-csv text-slate-500 text-sm"></i>
            <span>Exportar CSV</span>
          </button>

          <button (click)="openAuditoriaModal.emit()"
                  type="button"
                  class="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#123F5B] hover:bg-[#123F5B] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer">
            <i class="fa-solid fa-clock-rotate-left text-xs"></i>
            <span>Auditoría</span>
          </button>

          <button (click)="openNuevoRetiroModal()"
                  type="button"
                  class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#22a652] hover:bg-[#1b8e45] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer">
            <i class="fa-solid fa-plus text-xs"></i>
            <span>Ingresar Solicitud</span>
          </button>
      </div>

      <!-- ==================== 2. TARJETAS DE KPIS EJECUTIVOS ==================== -->
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div class="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-500">Por asignar</span>
            <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-xs font-bold border border-amber-200/80">
              <i class="fa-solid fa-bell"></i>
            </div>
          </div>
          <div class="mt-3">
            <div class="text-3xl sm:text-4xl font-black font-heading text-[#123F5B]">{{ countPendientes }}</div>
            <p class="text-xs text-slate-500 mt-1">
              <span [ngClass]="countPendientes > 0 ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'">
                {{ countPendientes > 0 ? 'Requieren programación' : 'Al día' }}
              </span>
            </p>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-500">En recorrido</span>
            <div class="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center text-xs font-bold border border-sky-200/80">
              <i class="fa-solid fa-truck-moving"></i>
            </div>
          </div>
          <div class="mt-3">
            <div class="text-3xl sm:text-4xl font-black font-heading text-[#123F5B]">{{ countEnRuta }}</div>
            <p class="text-xs text-slate-500 mt-1">Cuadrillas activas en calle</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-500">Kilos certificados</span>
            <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold border border-emerald-200/80">
              <i class="fa-solid fa-scale-balanced"></i>
            </div>
          </div>
          <div class="mt-3">
            <div class="text-3xl sm:text-4xl font-black font-heading text-emerald-800">
              {{ totalKilosRecogidos | number:'1.0-1' }} <span class="text-lg font-bold text-slate-400">kg</span>
            </div>
            <p class="text-xs text-slate-500 mt-1">Pesaje verificado en báscula</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-500">Cumplimiento comunal</span>
            <div class="w-8 h-8 rounded-xl bg-slate-100 text-[#123F5B] flex items-center justify-center text-xs font-bold border border-slate-200">
              <i class="fa-solid fa-chart-pie"></i>
            </div>
          </div>
          <div class="mt-3">
            <div class="text-3xl sm:text-4xl font-black font-heading text-[#123F5B]">{{ porcentajeCumplimiento }}%</div>
            <p class="text-xs text-slate-500 mt-1">{{ countCompletados }} de {{ pickups.length }} retiros completados</p>
          </div>
        </div>
      </section>

      <!-- ==================== 3. GESTIÓN Y DISPONIBILIDAD DE FLOTA (EXCLUSIVO ADMIN) ==================== -->
      <section class="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-[#F8FAF7]">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-wider text-[#123F5B]">Control de Activos y Mantenimiento</span>
              <span class="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">Exclusivo Admin</span>
            </div>
            <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#123F5B] mt-0.5">
              Disponibilidad Operativa de Camiones Tolva
            </h3>
          </div>
          <span class="text-xs text-slate-500 font-semibold">
            Flota total municipal: {{ camiones.length }} unidades registradas
          </span>
        </div>

        <div *ngIf="camiones.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div *ngFor="let c of camiones"
               class="p-5 rounded-2xl border transition-all flex flex-col justify-between"
               [ngClass]="c.estado === 'MANTENIMIENTO' ? 'bg-rose-50/40 border-rose-200' : 'bg-[#F8FAF7] border-[#E2E8F0] hover:border-[#CFE2D4]'">
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="font-mono text-sm font-black px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] text-[#123F5B] shadow-2xs">
                  {{ c.patente }}
                </span>
                <span class="px-2.5 py-1 rounded-md text-xs font-bold"
                      [ngClass]="c.estado === 'MANTENIMIENTO' ? 'bg-rose-100 text-rose-800 border border-rose-300' : (c.estado === 'EN_RUTA' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-[#ecf7e6] text-emerald-900 border border-[#E2E8F0]')">
                  <i class="fa-solid mr-1"
                     [class.fa-triangle-exclamation]="c.estado === 'MANTENIMIENTO'"
                     [class.fa-truck-fast]="c.estado === 'EN_RUTA'"
                     [class.fa-check]="c.estado !== 'MANTENIMIENTO' && c.estado !== 'EN_RUTA'"></i>
                  {{ c.estado === 'MANTENIMIENTO' ? 'En taller' : (c.estado === 'EN_RUTA' ? 'En ruta' : 'Disponible') }}
                </span>
              </div>
              <h4 class="font-bold text-sm text-[#123F5B]">Camión Tolva Compactador</h4>
              <p class="text-xs text-slate-500 mt-1">
                Capacidad nominal: <strong class="text-slate-700">{{ c.capacidadKilos || c.capacidadMaximaKg || 1500 }} kg</strong>
              </p>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
              <button (click)="toggleMantenimiento(c)"
                      type="button"
                      class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5"
                      [ngClass]="c.estado === 'MANTENIMIENTO' ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-2xs'">
                <i class="fa-solid" [class.fa-circle-check]="c.estado === 'MANTENIMIENTO'" [class.fa-wrench]="c.estado !== 'MANTENIMIENTO'"></i>
                <span>{{ c.estado === 'MANTENIMIENTO' ? 'Dar de Alta a Servicio' : 'Enviar a Taller' }}</span>
              </button>
              <span class="text-[11px] font-semibold text-slate-500">{{ c.estado === 'MANTENIMIENTO' ? 'Inoperable' : (c.estado === 'EN_RUTA' ? 'En servicio' : 'Operable') }}</span>
            </div>
          </div>
        </div>

        <!-- Estado cuando no hay camiones o el microservicio está caído -->
        <div *ngIf="camiones.length === 0" class="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200">
          <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl mx-auto mb-3 border border-amber-200">
            <i class="fa-solid fa-truck-slash"></i>
          </div>
          <h4 class="font-bold text-slate-700 text-sm">
            {{ catalogoDisponible === false ? 'Servicio de Catálogo Desconectado' : (catalogoDisponible === null ? 'Cargando flota...' : 'Sin Camiones Registrados') }}
          </h4>
          <p class="text-xs text-slate-500 max-w-md mx-auto mt-1">
            {{ catalogoDisponible === false
                ? 'No fue posible conectar con el microservicio ms-reciclago-catalog (puerto 8081). Verifique que los microservicios Spring Boot estén iniciados.'
                : (catalogoDisponible === null ? 'Consultando ms-reciclago-catalog...' : 'No existen datos de camiones en la base de datos PostgreSQL.') }}
          </p>
        </div>
      </section>

      <!-- ==================== GESTIÓN Y REPROGRAMACIÓN DE RECORRIDOS POR SEMANA Y SECTOR (DIMAO) ==================== -->
      <section class="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F8FAF7]">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-wider text-[#123F5B]">Planificación Operativa Comunal</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ecf7e6] text-emerald-900 border border-[#E2E8F0]">
                Sincronización en Tiempo Real
              </span>
            </div>
            <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#123F5B] mt-0.5">
              Calendario y Rotación Semanal de Residuos
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Haz clic en cualquier semana para seleccionarla y reprogramar el día de recolección de un sector específico.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button *ngIf="hayModificacionesEnSemana(semanaSeleccionada)"
                    (click)="restablecerTodosSectoresDeSemana()"
                    type="button"
                    class="px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5">
              <i class="fa-solid fa-rotate-left text-slate-500"></i>
              <span>Restablecer Semana {{ semanaSeleccionada }}</span>
            </button>
          </div>
        </div>

        <!-- Banner de Feedback -->
        <div *ngIf="reprogramacionFeedback"
             class="p-3.5 rounded-xl text-xs flex items-center justify-between gap-2 transition-all"
             [ngClass]="reprogramacionFeedback.tipo === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'">
          <div class="flex items-center gap-2">
            <i class="fa-solid" [class.fa-circle-check]="reprogramacionFeedback.tipo === 'success'" [class.fa-circle-exclamation]="reprogramacionFeedback.tipo === 'error'"></i>
            <span class="font-semibold">{{ reprogramacionFeedback.mensaje }}</span>
          </div>
          <button (click)="reprogramacionFeedback = null" type="button" class="text-slate-400 hover:text-slate-600 text-xs cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Las 4 Tarjetas de Semanas (Interactivas / Clickeables) -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase tracking-wider text-[#123F5B]">
              1. Selecciona la Semana del Ciclo DIMAO (Haz clic en una semana)
            </span>
            <span class="text-xs text-slate-500 font-semibold">
              Semana en curso: <strong class="text-[#123F5B]">Semana {{ rotacionSemanal?.slotSemana || 3 }} ({{ rotacionSemanal?.residuoNombre || 'Plásticos' }})</strong>
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div *ngFor="let sem of semanasRotacion"
                 (click)="seleccionarSemana(sem.slot)"
                 class="p-4 rounded-xl border transition-all flex flex-col justify-between cursor-pointer select-none"
                 [ngClass]="semanaSeleccionada === sem.slot
                   ? 'bg-[#F8FAF7] border-2 border-[#123F5B] ring-2 ring-[#123F5B]/20 shadow-xs'
                   : 'bg-white border-[#E2E8F0] hover:border-[#123F5B]/50 hover:bg-[#FAFBF9]'">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-extrabold text-[#123F5B]">Semana {{ sem.slot }}</span>
                  <span *ngIf="semanaSeleccionada === sem.slot"
                        class="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#123F5B] text-white">
                    Seleccionada
                  </span>
                  <span *ngIf="semanaSeleccionada !== sem.slot && isSemanaEnCurso(sem.slot)"
                        class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    En Curso
                  </span>
                </div>
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm mb-2"
                     [ngClass]="semanaSeleccionada === sem.slot ? 'bg-[#123F5B] text-white' : 'bg-[#F8FAF7] text-[#22a652]'">
                  <i [class]="getRotacionMaterialIcon(sem.codigo)"></i>
                </div>
                <h5 class="text-xs font-extrabold text-[#123F5B] leading-tight">{{ sem.nombre }}</h5>
                <p class="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-snug">{{ sem.descripcion }}</p>
              </div>
              <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span class="font-bold text-slate-400">Ciclo DIMAO</span>
                <span class="font-mono text-slate-500">{{ sem.categoria }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel de Control: Reprogramar Día del Sector Seleccionado -->
        <div class="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E2E8F0] space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-[#123F5B] text-white flex items-center justify-center text-xs font-bold">
                <i class="fa-solid fa-sliders"></i>
              </div>
              <div>
                <h4 class="text-sm font-extrabold text-[#123F5B]">
                  2. Reprogramar Día de Recolección por Sector
                </h4>
                <p class="text-[11px] text-slate-500">
                  Configurando: <strong>Semana {{ semanaSeleccionada }} ({{ getSemanaNombre(semanaSeleccionada) }})</strong>
                </p>
              </div>
            </div>

            <span *ngIf="isSectorModificadoEnSemana(sectorSeleccionadoNombre, semanaSeleccionada)"
                  class="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
              <i class="fa-solid fa-circle-exclamation mr-1 text-amber-700"></i> Reprogramación Activa
            </span>
          </div>

          <!-- Fila de Selectores Intuitivos -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-end">
            <!-- Selector de Sector -->
            <div>
              <label for="adminSelectSector" class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] mb-1.5">
                Sector / Cuadrante
              </label>
              <select id="adminSelectSector"
                      [(ngModel)]="sectorSeleccionadoNombre"
                      (ngModelChange)="onSectorSeleccionadoChange()"
                      class="select-stitch w-full py-2 px-3 text-xs font-bold text-[#123F5B] bg-white border border-[#E2E8F0]">
                <option *ngFor="let s of sectores" [value]="s.nombre">
                  C{{ s.numero }}: {{ s.nombre }} (Habitual: {{ getDiaHabitual(s.nombre) }})
                </option>
              </select>
            </div>

            <!-- Selector de Nuevo Día -->
            <div>
              <label for="adminSelectNuevoDia" class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] mb-1.5">
                Día de Recolección para Semana {{ semanaSeleccionada }}
              </label>
              <select id="adminSelectNuevoDia"
                      [(ngModel)]="nuevoDiaSeleccionado"
                      class="select-stitch w-full py-2 px-3 text-xs font-bold text-[#123F5B] bg-white border border-[#E2E8F0]">
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
              </select>
            </div>

            <!-- Motivo del Cambio -->
            <div>
              <label for="adminMotivoCambio" class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] mb-1.5">
                Motivo del Aviso a Vecinos (Opcional)
              </label>
              <input id="adminMotivoCambio"
                     type="text"
                     [(ngModel)]="motivoCambioDia"
                     placeholder="Ej: Feriado irrenunciable o contingencia climática"
                     class="input-stitch w-full py-2 px-3 text-xs font-medium bg-white border border-[#E2E8F0]">
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="pt-2 flex items-center justify-between flex-wrap gap-2">
            <p class="text-[11px] text-slate-500">
              Día habitual: <strong class="text-slate-700">{{ getDiaHabitual(sectorSeleccionadoNombre) }}</strong>.
              <span *ngIf="nuevoDiaSeleccionado !== getDiaHabitual(sectorSeleccionadoNombre)" class="text-amber-800 font-bold ml-1">
                Se reprogramará al {{ nuevoDiaSeleccionado }} y se notificará en toda la comuna.
              </span>
            </p>

            <div class="flex items-center gap-2">
              <button *ngIf="isSectorModificadoEnSemana(sectorSeleccionadoNombre, semanaSeleccionada)"
                      (click)="restablecerSectorSeleccionado()"
                      type="button"
                      class="px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 transition-colors cursor-pointer shadow-2xs">
                <i class="fa-solid fa-rotate-left mr-1"></i> Volver a Día Habitual
              </button>
              <button (click)="guardarReprogramacionSector()"
                      type="button"
                      [disabled]="isSavingRotacion"
                      class="btn-stitch-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs">
                <i class="fa-solid" [class.fa-spinner]="isSavingRotacion" [class.fa-spin]="isSavingRotacion" [class.fa-bullhorn]="!isSavingRotacion"></i>
                <span>{{ isSavingRotacion ? 'Guardando...' : 'Aplicar Cambio y Sincronizar' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 4 Tarjetas de Cuadrantes para la Semana Seleccionada -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-[#123F5B]">
              Resumen de los 4 Cuadrantes para Semana {{ semanaSeleccionada }} ({{ getSemanaNombre(semanaSeleccionada) }})
            </span>
            <span class="text-xs text-slate-500 font-semibold">
              Haz clic en cualquier cuadrante para seleccionarlo en el formulario
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div *ngFor="let s of sectores"
                 (click)="seleccionarSectorEnGrilla(s.nombre)"
                 class="p-4 rounded-xl border transition-all flex flex-col justify-between cursor-pointer select-none"
                 [ngClass]="sectorSeleccionadoNombre === s.nombre
                   ? 'border-[#123F5B] bg-[#F4F8FA] ring-2 ring-[#123F5B]/20 shadow-xs'
                   : (isSectorModificadoEnSemana(s.nombre, semanaSeleccionada)
                     ? 'border-amber-300 bg-amber-50/40 hover:border-amber-400'
                     : 'border-[#E2E8F0] bg-white hover:border-slate-300')">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="font-mono text-xs font-black px-2 py-0.5 rounded bg-white border border-[#E2E8F0] text-[#123F5B]">
                    C{{ s.numero }}
                  </span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded"
                        [ngClass]="isSectorModificadoEnSemana(s.nombre, semanaSeleccionada)
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-600'">
                    {{ isSectorModificadoEnSemana(s.nombre, semanaSeleccionada) ? 'Reprogramado' : 'Habitual' }}
                  </span>
                </div>

                <h5 class="text-xs font-extrabold text-[#123F5B] leading-tight">{{ s.nombre }}</h5>
                <p class="text-[11px] text-slate-500 mt-0.5">{{ s.sector }} • {{ s.patente }}</p>

                <!-- Día asignado destacado -->
                <div class="mt-3 p-2.5 rounded-lg flex items-center justify-between"
                     [ngClass]="isSectorModificadoEnSemana(s.nombre, semanaSeleccionada)
                       ? 'bg-amber-100/70 border border-amber-300 text-amber-950'
                       : 'bg-[#F8FAF7] border border-[#E2E8F0] text-slate-800'">
                  <div>
                    <span class="text-[10px] font-bold uppercase tracking-wider block text-slate-500">Día de Retiro</span>
                    <span class="text-sm font-extrabold"
                          [ngClass]="isSectorModificadoEnSemana(s.nombre, semanaSeleccionada) ? 'text-amber-900' : 'text-[#123F5B]'">
                      {{ getDiaSector(s.nombre, semanaSeleccionada) }}
                    </span>
                  </div>
                  <i class="fa-solid text-sm"
                     [class.fa-triangle-exclamation]="isSectorModificadoEnSemana(s.nombre, semanaSeleccionada)"
                     [class.text-amber-600]="isSectorModificadoEnSemana(s.nombre, semanaSeleccionada)"
                     [class.fa-calendar-check]="!isSectorModificadoEnSemana(s.nombre, semanaSeleccionada)"
                     [class.text-emerald-700]="!isSectorModificadoEnSemana(s.nombre, semanaSeleccionada)"></i>
                </div>

                <!-- Aviso / Motivo si está modificado -->
                <div *ngIf="isSectorModificadoEnSemana(s.nombre, semanaSeleccionada)" class="mt-2 text-[10px] text-amber-800 font-semibold bg-amber-50 p-1.5 rounded border border-amber-200/80">
                  <i class="fa-solid fa-bullhorn mr-1 text-amber-600"></i>
                  <span>{{ getAvisoMotivo(s.nombre, semanaSeleccionada) }}</span>
                </div>
              </div>

              <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span class="text-slate-400 font-medium">Horario: {{ s.horario }}</span>
                <span class="font-bold text-[#123F5B] hover:underline">Editar →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== 4. PLANILLA MAESTRA DE DESPACHO CON PAGINACIÓN ==================== -->
      <section class="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div class="p-6 border-b border-[#F8FAF7] space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-[#123F5B]">Supervisión y Control Integral</span>
              <h3 class="font-heading font-extrabold text-2xl text-[#123F5B] mt-0.5">
                Planilla Maestra de Trazabilidad Comunal
              </h3>
            </div>

            <!-- Filtros de Sector y Tamaño de Página -->
            <div class="flex items-center gap-3 flex-wrap">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-slate-500">Sector:</span>
                <select [(ngModel)]="filterSector"
                        (ngModelChange)="onFilterSectorChange()"
                        class="select-stitch py-1.5 px-3 text-xs font-bold text-[#123F5B] bg-[#F8FAF7]">
                  <option value="ALL">Todos los Sectores</option>
                  <option *ngFor="let s of sectores" [value]="s.nombre">{{ s.nombre }}</option>
                </select>
              </div>

              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-slate-500">Filas:</span>
                <select [(ngModel)]="pageSize"
                        (ngModelChange)="onPageSizeChange()"
                        class="select-stitch py-1.5 px-2 text-xs font-bold text-[#123F5B] bg-[#F8FAF7]">
                  <option [value]="5">5</option>
                  <option [value]="10">10</option>
                  <option [value]="20">20</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Pestañas de Estado Logísticas Unificadas (Segmented Control) -->
          <div class="bg-slate-100/90 p-1 rounded-xl inline-flex items-center gap-1 border border-slate-200/80 overflow-x-auto no-scrollbar max-w-full">
            <button (click)="onFilterStatusChange('ALL')"
                    type="button"
                    class="px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                    [ngClass]="filterStatus === 'ALL' ? 'bg-white text-[#123F5B] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 font-medium'">
              <span>Todos</span>
              <span class="text-[11px] font-mono px-1.5 py-0.5 rounded"
                    [ngClass]="filterStatus === 'ALL' ? 'bg-[#123F5B] text-white' : 'bg-slate-200/70 text-slate-700'">{{ pickups.length }}</span>
            </button>

            <button (click)="onFilterStatusChange('SOLICITADO')"
                    type="button"
                    class="px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                    [ngClass]="filterStatus === 'SOLICITADO' ? 'bg-white text-[#123F5B] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 font-medium'">
              <span>Por Programar</span>
              <span class="text-[11px] font-mono px-1.5 py-0.5 rounded"
                    [ngClass]="filterStatus === 'SOLICITADO' ? 'bg-amber-600 text-white' : 'bg-slate-200/70 text-slate-700'">{{ countPendientes }}</span>
            </button>

            <button (click)="onFilterStatusChange('PROGRAMADO')"
                    type="button"
                    class="px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                    [ngClass]="filterStatus === 'PROGRAMADO' ? 'bg-white text-[#123F5B] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 font-medium'">
              <span>Programados</span>
              <span class="text-[11px] font-mono px-1.5 py-0.5 rounded"
                    [ngClass]="filterStatus === 'PROGRAMADO' ? 'bg-sky-600 text-white' : 'bg-slate-200/70 text-slate-700'">{{ countProgramados }}</span>
            </button>

            <button (click)="onFilterStatusChange('EN_RUTA')"
                    type="button"
                    class="px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                    [ngClass]="filterStatus === 'EN_RUTA' ? 'bg-white text-[#123F5B] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 font-medium'">
              <span>En Ruta</span>
              <span class="text-[11px] font-mono px-1.5 py-0.5 rounded"
                    [ngClass]="filterStatus === 'EN_RUTA' ? 'bg-indigo-600 text-white' : 'bg-slate-200/70 text-slate-700'">{{ countEnRuta }}</span>
            </button>

            <button (click)="onFilterStatusChange('RETIRADO')"
                    type="button"
                    class="px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                    [ngClass]="filterStatus === 'RETIRADO' ? 'bg-white text-[#123F5B] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 font-medium'">
              <span>Por Pesar</span>
              <span class="text-[11px] font-mono px-1.5 py-0.5 rounded"
                    [ngClass]="filterStatus === 'RETIRADO' ? 'bg-emerald-600 text-white' : 'bg-slate-200/70 text-slate-700'">{{ countRetirados }}</span>
            </button>

            <button (click)="onFilterStatusChange('PESADO')"
                    type="button"
                    class="px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                    [ngClass]="filterStatus === 'PESADO' ? 'bg-white text-[#123F5B] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 font-medium'">
              <span>Pesados</span>
              <span class="text-[11px] font-mono px-1.5 py-0.5 rounded"
                    [ngClass]="filterStatus === 'PESADO' ? 'bg-slate-800 text-white' : 'bg-slate-200/70 text-slate-700'">{{ countPesados }}</span>
            </button>
          </div>
        </div>

        <!-- Filas de la Planilla -->
        <div class="divide-y divide-[#E2E8F0]">
          <div *ngFor="let p of paginatedPickups"
               class="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#F9FAF8] transition-colors">
            
            <div class="flex items-start sm:items-center gap-4 min-w-0 flex-1">
              <div class="w-12 h-12 rounded-2xl bg-[#F8FAF7] text-[#22a652] flex items-center justify-center text-xl flex-shrink-0 border border-[#E2E8F0] shadow-2xs">
                <i class="fa-solid fa-recycle"></i>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2.5 flex-wrap">
                  <span class="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    #{{ p.id }}
                  </span>
                  <h4 class="font-heading font-bold text-base sm:text-lg text-[#123F5B]">
                    {{ p.direccion }}
                  </h4>
                  <span class="text-xs font-bold text-[#22a652] px-2.5 py-0.5 rounded-lg bg-[#ecf7e6] border border-[#E2E8F0]">
                    {{ p.residuoNombre || 'Reciclaje Domiciliario' }}
                  </span>
                </div>

                <div class="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                  <span><i class="fa-regular fa-calendar text-slate-400 mr-1"></i>{{ p.fechaTexto || p.fecha || 'Fecha por asignar' }}</span>
                  <span class="text-slate-300" *ngIf="p.pesoEstimadoKg">•</span>
                  <span *ngIf="p.pesoEstimadoKg" class="font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    <i class="fa-solid fa-weight-hanging mr-1 text-slate-400"></i>Est: {{ p.pesoEstimadoKg }} kg
                  </span>
                  <span class="text-slate-300" *ngIf="p.kilosRecolectados">•</span>
                  <span *ngIf="p.kilosRecolectados" class="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <i class="fa-solid fa-scale-balanced mr-1"></i>{{ p.kilosRecolectados }} kg certificados
                  </span>
                  <span *ngIf="!p.kilosRecolectados" class="text-slate-500">
                    {{ p.estado === 'RETIRADO' ? '⚠️ Retirado (pendiente pesaje)' : 'Pendiente de pesaje' }}
                  </span>
                  <span *ngIf="p.comentarios" class="text-slate-400 italic truncate max-w-xs">
                    "{{ p.comentarios }}"
                  </span>
                </div>
              </div>
            </div>

            <!-- Acciones de Ciclo de Vida -->
            <div class="flex items-center gap-3 flex-wrap self-start lg:self-center flex-shrink-0">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border shadow-2xs"
                    [ngClass]="getStatusBadgeClass(p.estado)">
                <i [ngClass]="getStatusIconClass(p.estado)"></i>
                <span>{{ p.estado }}</span>
              </span>

              <div class="flex items-center gap-1.5">
                <button *ngIf="p.estado === 'SOLICITADO'"
                        (click)="requestAction(p, 'programar')"
                        type="button"
                        class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#123F5B] hover:bg-[#123F5B] text-white transition-all cursor-pointer shadow-2xs flex items-center gap-1.5">
                  <i class="fa-regular fa-calendar-check text-xs"></i>
                  <span>Programar Camión</span>
                </button>

                <button *ngIf="p.estado === 'PROGRAMADO'"
                        (click)="requestAction(p, 'en-ruta')"
                        type="button"
                        class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-all cursor-pointer shadow-2xs flex items-center gap-1.5">
                  <i class="fa-solid fa-truck-fast text-xs"></i>
                  <span>Despachar a Ruta</span>
                </button>

                <button *ngIf="p.estado === 'EN_RUTA'"
                        (click)="requestAction(p, 'retirado')"
                        type="button"
                        class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-2xs flex items-center gap-1.5">
                  <i class="fa-solid fa-box-open text-xs"></i>
                  <span>Confirmar Retiro</span>
                </button>

                <button *ngIf="p.estado === 'RETIRADO'"
                        (click)="requestAction(p, 'pesado')"
                        type="button"
                        class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#22a652] hover:bg-[#1b8e45] text-white transition-all cursor-pointer shadow-2xs flex items-center gap-1.5">
                  <i class="fa-solid fa-scale-balanced text-xs"></i>
                  <span>Pesar en Báscula</span>
                </button>

                <button *ngIf="p.estado === 'PESADO'"
                        (click)="requestAction(p, 'pesado')"
                        type="button"
                        class="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer shadow-2xs flex items-center gap-1">
                  <i class="fa-solid fa-check text-emerald-600 text-xs"></i>
                  <span>Certificado</span>
                </button>

                <button *ngIf="p.estado !== 'PESADO' && p.estado !== 'CANCELADO'"
                        (click)="requestAction(p, 'cancelar')"
                        type="button"
                        class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors flex items-center justify-center text-xs cursor-pointer"
                        title="Cancelar o anular solicitud">
                  <i class="fa-solid fa-ban"></i>
                </button>
              </div>
            </div>
          </div>

          <div *ngIf="filteredPickups.length === 0" class="py-12 px-4 text-center">
            <div class="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-lg mb-2">
              <i class="fa-solid fa-inbox"></i>
            </div>
            <p class="font-bold text-[#123F5B] text-sm">No hay retiros en este filtro</p>
            <p class="text-xs text-slate-500 mt-0.5">Selecciona otra pestaña o cambia el sector.</p>
          </div>
        </div>

        <!-- Paginación -->
        <div *ngIf="filteredPickups.length > 0" class="p-4 bg-[#F8FAF7] border-t border-[#F8FAF7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
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
                    [ngClass]="currentPage === page ? 'bg-[#123F5B] text-white shadow-xs' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'">
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

      <!-- ==================== 5. SUPERVISIÓN SATELITAL GPS DE TODA LA FLOTA ==================== -->
      <section class="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#F8FAF7]">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-[#123F5B]">Telemetría Satelital de Flota</span>
            <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#123F5B] mt-0.5">
              Supervisión de Camiones en Puerto Varas
            </h3>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-bold text-slate-500">Trackear Unidad:</span>
            <div class="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200">
              <button *ngFor="let c of camiones"
                      (click)="selectTruck(c.patente)"
                      type="button"
                      class="px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer"
                      [ngClass]="selectedTruckPatente === c.patente ? 'bg-[#123F5B] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'">
                {{ c.patente }}
              </button>
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-[#F8FAF7] border-2 border-[#E2E8F0] p-4 sm:p-5 relative overflow-hidden">
          <div class="flex items-center justify-between gap-2 mb-3">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-satellite-dish text-[#123F5B] text-lg"></i>
              <span class="font-bold text-sm text-[#123F5B]">
                Unidad {{ selectedCamion.patente }} — {{ currentWaypoint.name }}
              </span>
            </div>
            <span class="text-xs text-slate-600 font-semibold bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
              {{ truckSimulationRunning ? 'GPS Activo' : 'Pausado' }}
            </span>
          </div>

          <div class="h-48 sm:h-56 w-full bg-white rounded-xl relative p-2 overflow-hidden border border-[#E1EDF2] select-none">
            <div class="absolute -top-4 -right-4 w-44 sm:w-52 h-24 bg-gradient-to-br from-[#E3F2F8] to-[#D5EBF5] rounded-2xl flex flex-col items-center justify-center text-[10px] font-extrabold text-[#123F5B] border border-[#C5E1EE]/70 shadow-xs pointer-events-none">
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
              <path d="M 8 72 L 28 72 L 28 28 L 52 28 L 52 72 L 82 72" fill="none" stroke="#22a652" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"></path>
            </svg>

            <div class="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2"
                 [style.left.%]="currentWaypoint.x"
                 [style.top.%]="currentWaypoint.y"
                 style="transition: left 1.2s cubic-bezier(0.4, 0, 0.2, 1), top 1.2s cubic-bezier(0.4, 0, 0.2, 1);">
              <div class="relative flex items-center justify-center">
                <div class="relative w-9 h-9 rounded-full bg-gradient-to-tr from-[#123F5B] to-[#1E628C] text-white flex items-center justify-center text-xs shadow-lg ring-2 ring-white">
                  <i class="fa-solid fa-truck-fast text-xs text-white"></i>
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
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  <i class="fa-solid fa-location-arrow text-[10px] text-slate-500"></i>
                  <span>Posición GPS</span>
                </span>
                <span class="text-xs font-bold text-[#123F5B] truncate">{{ currentWaypoint.name }}</span>
              </div>
              <p class="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                <span>{{ currentWaypoint.detail }}</span>
                <span class="text-slate-300">•</span>
                <span class="font-bold text-[#22a652]">ETA: {{ currentWaypoint.eta }}</span>
                <span class="text-slate-300">•</span>
                <span class="font-semibold text-slate-600">{{ currentWaypoint.distancia }}</span>
              </p>
            </div>

            <div class="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-center">
              <button (click)="toggleTruckSimulation.emit()" type="button" class="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#F8FAF7] hover:bg-[#E0EDE0] text-[#1b8e45] border border-[#C8DFCA] transition-colors flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid" [class.fa-pause]="truckSimulationRunning" [class.fa-play]="!truckSimulationRunning"></i>
                <span>{{ truckSimulationRunning ? 'Pausar' : 'Reanudar' }}</span>
              </button>
              <button (click)="toggleTruckSpeed.emit()" type="button" class="px-2 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors cursor-pointer" title="Velocidad">
                <span>{{ truckSpeed }}x</span>
              </button>
              <button (click)="resetTruckSimulation.emit()" type="button" class="px-2 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors cursor-pointer" title="Reiniciar">
                <i class="fa-solid fa-rotate-left text-[11px]"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== MODAL TELEFÓNICO ==================== -->
      <div *ngIf="showNuevoRetiroModal"
           (click)="closeNuevoRetiroModal()"
           role="dialog"
           aria-modal="true"
           aria-labelledby="admin-mesa-title"
           class="fixed inset-0 z-[9999] overflow-y-auto bg-[#041D2D]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen anim-modal-backdrop">
        <div (click)="$event.stopPropagation()"
             class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden anim-modal-panel text-slate-800 my-auto p-6 sm:p-8">
          
          <div class="h-1.5 -mx-8 -mt-8 mb-6 bg-gradient-to-r from-[#123F5B] via-[#38BDF8] to-[#22a652]"></div>

          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-[#F8FAF7] text-[#22a652] flex items-center justify-center text-sm font-bold border border-[#E2E8F0]">
                <i class="fa-solid fa-file-circle-plus"></i>
              </div>
              <div>
                <h3 id="admin-mesa-title" class="font-heading font-extrabold text-lg text-[#123F5B]">Ingresar Solicitud de Retiro</h3>
                <p class="text-xs text-slate-400">Registro de solicitud vecinal para recolección</p>
              </div>
            </div>
            <button (click)="closeNuevoRetiroModal()" type="button" aria-label="Cerrar modal" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs transition-colors cursor-pointer">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div *ngIf="mesaError" role="alert" aria-live="polite" class="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <i class="fa-solid fa-circle-exclamation text-rose-600"></i>
            <span>{{ mesaError }}</span>
          </div>

          <form (ngSubmit)="submitRetiroVecinal()" class="space-y-3.5 text-left">
            <div>
              <label for="adminVecinoNombre" class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] mb-1">Nombre Completo del Vecino</label>
              <input id="adminVecinoNombre" type="text" [(ngModel)]="nuevoVecinoNombre" name="nuevoVecinoNombre" required class="input-stitch w-full py-2 px-3 text-sm font-medium" placeholder="Ej: Juan Pérez González">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label for="adminVecinoRut" class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] mb-1">RUT Vecino (Opcional)</label>
                <input id="adminVecinoRut" type="text" [value]="nuevoVecinoRut" (input)="onMesaRutInput($event)" name="nuevoVecinoRut" class="input-stitch w-full py-2 px-3 text-sm font-medium" placeholder="Ej: 12.345.678-K">
                <span *ngIf="mesaRutError" class="text-[10px] text-rose-600 font-bold mt-0.5 block">{{ mesaRutError }}</span>
              </div>
              <div>
                <label for="adminVecinoTelefono" class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] mb-1">Teléfono Móvil (Opcional)</label>
                <input id="adminVecinoTelefono" type="text" [value]="nuevoVecinoTelefono" (input)="onMesaPhoneInput($event)" name="nuevoVecinoTelefono" class="input-stitch w-full py-2 px-3 text-sm font-medium" placeholder="Ej: +56 9 8765 4321">
                <span *ngIf="mesaPhoneError" class="text-[10px] text-rose-600 font-bold mt-0.5 block">{{ mesaPhoneError }}</span>
              </div>
            </div>

            <div>
              <label for="adminNuevaDireccion" class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] mb-1">Dirección Exacta</label>
              <input id="adminNuevaDireccion" type="text" [(ngModel)]="nuevaDireccion" name="nuevaDireccion" required class="input-stitch w-full py-2 px-3 text-sm font-medium" placeholder="Ej: San Francisco 320, Puerto Varas">
            </div>

            <!-- Fila: Material y Peso Estimado -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- Selector de Material Personalizado -->
              <div class="relative material-dropdown-container">
                <label id="adminResiduoLabel" class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] mb-1">Tipo de Residuo / Material</label>
                <button
                  type="button"
                  (click)="toggleMaterialDropdown($event)"
                  aria-labelledby="adminResiduoLabel"
                  aria-haspopup="listbox"
                  [attr.aria-expanded]="isMaterialDropdownOpen"
                  class="w-full flex items-center justify-between py-2 px-3 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#22a652] text-left shadow-2xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#22a652]/30 min-h-[42px]">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div class="w-7 h-7 rounded-lg bg-[#F8FAF7] text-[#22a652] flex items-center justify-center text-xs flex-shrink-0">
                      <i [class]="getMaterialIcon(selectedResiduoNombre)"></i>
                    </div>
                    <span class="text-xs font-bold text-[#123F5B] truncate">{{ selectedResiduoNombre }}</span>
                  </div>
                  <i class="fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-200"
                     [class.rotate-180]="isMaterialDropdownOpen"></i>
                </button>

                <!-- Menú Desplegable Flotante Moderno -->
                <div *ngIf="isMaterialDropdownOpen"
                     role="listbox"
                     class="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] p-2 z-[100] anim-modal-backdrop space-y-1">
                  <button
                    *ngFor="let r of residuos"
                    type="button"
                    role="option"
                    [attr.aria-selected]="nuevoResiduoId === r.id"
                    (click)="selectResiduo(r.id)"
                    class="w-full text-left p-2 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
                    [ngClass]="nuevoResiduoId === r.id ? 'bg-[#F8FAF7] border border-[#E2E8F0]' : 'hover:bg-slate-50 border border-transparent'">
                    <div class="flex items-center gap-2.5 min-w-0">
                      <div class="w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 transition-colors"
                           [ngClass]="nuevoResiduoId === r.id ? 'bg-[#22a652] text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-[#F8FAF7] group-hover:text-[#22a652]'">
                        <i [class]="getMaterialIcon(r.nombre)"></i>
                      </div>
                      <div class="min-w-0">
                        <span class="text-xs font-bold text-[#123F5B] block truncate">{{ r.nombre }}</span>
                        <span class="text-[10px] text-slate-400 block truncate">{{ r.descripcion || 'Reciclaje clasificado' }}</span>
                      </div>
                    </div>
                    <i *ngIf="nuevoResiduoId === r.id" class="fa-solid fa-circle-check text-[#22a652] text-sm flex-shrink-0 ml-2"></i>
                  </button>
                </div>
              </div>

              <!-- Peso Estimado -->
              <div>
                <label for="adminNuevoPeso" class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] mb-1">Peso Estimado (kg)</label>
                <div class="relative">
                  <input id="adminNuevoPeso" type="number" step="0.5" min="0.5" max="500" [(ngModel)]="nuevoPesoEstimadoKg" name="nuevoPesoEstimadoKg" class="input-stitch w-full py-2 px-3 text-sm font-medium text-center min-h-[42px]" placeholder="5.0">
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">kg</span>
                </div>
              </div>
            </div>

            <div>
              <label for="adminNuevosComentarios" class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] mb-1">Observaciones / Detalle</label>
              <textarea id="adminNuevosComentarios" [(ngModel)]="nuevosComentarios" name="nuevosComentarios" rows="2" class="input-stitch w-full py-2 px-3 text-sm" placeholder="Ej: Solicita retiro de colchón de 2 plazas"></textarea>
            </div>

            <div class="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button (click)="closeNuevoRetiroModal()" type="button" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
                Cancelar
              </button>
              <button type="submit" [disabled]="isSubmittingRetiro" class="btn-stitch-primary px-5 py-2.5 text-xs font-bold cursor-pointer">
                <span *ngIf="!isSubmittingRetiro">Guardar Solicitud</span>
                <span *ngIf="isSubmittingRetiro"><i class="fa-solid fa-spinner fa-spin"></i> Guardando...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit, OnChanges {
  @Input() sector: Sector | null = null;
  @Input() sectores: Sector[] = [];
  @Input() pickups: Pickup[] = [];
  @Input() camiones: Camion[] = [];
  @Input() catalogoDisponible: boolean | null = true;
  @Input() residuos: Residuo[] = [];
  @Input() rotacionSemanal: RotacionSemanal | null = null;
  @Input() activeWaypoint: Waypoint = { name: 'Costanera Sur', detail: 'Recorrido en curso', eta: '10 min', distancia: '1.2 km', x: 28, y: 72, estado: 'En recorrido' };
  @Input() truckSimulationRunning: boolean = true;
  @Input() truckSpeed: number = 1;

  @Output() actionRequested = new EventEmitter<{ pickup: Pickup; action: 'programar' | 'en-ruta' | 'retirado' | 'pesado' | 'cancelar' }>();
  @Output() pickupCreated = new EventEmitter<any>();
  @Output() openAuditoriaModal = new EventEmitter<void>();
  @Output() toggleTruckSimulation = new EventEmitter<void>();
  @Output() toggleTruckSpeed = new EventEmitter<void>();
  @Output() resetTruckSimulation = new EventEmitter<void>();
  @Output() camionEstadoCambiado = new EventEmitter<Camion>();
  @Output() rotacionModificada = new EventEmitter<void>();
  @Output() sectoresModificados = new EventEmitter<Sector[]>();

  Math = Math;
  selectedTruckPatente: string = 'PV-RC-2026';

  rotacionModo: 'AUTOMATICO' | 'MANUAL' = 'AUTOMATICO';
  overrideMaterialCodigo: string = 'VIDRIO';
  semanasRotacion = SEMANAS_ROTACION_DEFAULT;
  rotacionFeedback: { tipo: 'success' | 'error'; mensaje: string } | null = null;
  isSavingRotacion = false;
  sectorFormOverrides: Record<string, { dia: string; material: string }> = {};
  savingSectorNombre: string | null = null;
  sectorFeedback: Record<string, { tipo: 'success' | 'error'; mensaje: string }> = {};

  // Reprogramación interactiva por semana y sector DIMAO
  semanaSeleccionada: number = 3;
  sectorSeleccionadoNombre: string = 'Costanera Sur y Llanquihue Sur';
  nuevoDiaSeleccionado: string = 'Miércoles';
  motivoCambioDia: string = '';
  reprogramacionFeedback: { tipo: 'success' | 'error'; mensaje: string } | null = null;

  filterStatus: string = 'ALL';
  filterSector: string = 'ALL';

  pageSize: number = 5;
  currentPage: number = 1;

  showNuevoRetiroModal = false;
  isSubmittingRetiro = false;
  isMaterialDropdownOpen = false;
  nuevoVecinoNombre = '';
  nuevoVecinoRut = '';
  nuevoVecinoTelefono = '';
  nuevaDireccion = '';
  nuevoResiduoId = 1;
  nuevoPesoEstimadoKg = 5.0;
  nuevosComentarios = '';
  mesaRutError = '';
  mesaPhoneError = '';
  mesaError = '';

  toggleMaterialDropdown(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isMaterialDropdownOpen = !this.isMaterialDropdownOpen;
  }

  selectResiduo(id: number): void {
    this.nuevoResiduoId = id;
    this.isMaterialDropdownOpen = false;
  }

  get selectedResiduoNombre(): string {
    const found = this.residuos.find(r => r.id === Number(this.nuevoResiduoId));
    return found ? found.nombre : (this.residuos[0]?.nombre || 'Vidrio');
  }

  getMaterialIcon(name?: string): string {
    if (!name) return 'fa-solid fa-recycle';
    const n = name.toLowerCase();
    if (n.includes('vidrio')) return 'fa-solid fa-wine-bottle';
    if (n.includes('cartón') || n.includes('carton') || n.includes('papel')) return 'fa-solid fa-box-archive';
    if (n.includes('plástico') || n.includes('plastico') || n.includes('pet')) return 'fa-solid fa-bottle-water';
    if (n.includes('lata') || n.includes('metal')) return 'fa-solid fa-can-food';
    return 'fa-solid fa-recycle';
  }

  truckWaypointsMap: Record<string, Waypoint> = {
    'PV-RC-2026': { name: 'Costanera Sur / San Francisco', detail: 'Recorriendo cuadrante costero', eta: '6 min', distancia: '850 m', x: 28, y: 72, estado: 'En recorrido' },
    'PV-RC-2027': { name: 'Puerto Chico / Av. Los Colonos', detail: 'Recolección diferenciada de cartón y vidrios', eta: '12 min', distancia: '1.4 km', x: 52, y: 35, estado: 'En ruta' },
    'PV-RC-2028': { name: 'Camino a Ensenada Km 2', detail: 'Traslado a centro de acopio comunal', eta: '18 min', distancia: '3.1 km', x: 75, y: 60, estado: 'En traslado' }
  };

  constructor(private bffService: BffService) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.material-dropdown-container')) {
      this.isMaterialDropdownOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.isMaterialDropdownOpen) {
      this.isMaterialDropdownOpen = false;
      return;
    }
    if (this.showNuevoRetiroModal && !this.isSubmittingRetiro) {
      this.closeNuevoRetiroModal();
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  ngOnInit(): void {
    if (this.rotacionSemanal?.slotSemana) {
      this.semanaSeleccionada = this.rotacionSemanal.slotSemana;
    }
    if (this.sectores && this.sectores.length > 0) {
      this.sectorSeleccionadoNombre = this.sectores[0].nombre;
    }
    this.syncSectorSeleccionadoForm();
    this.initRotacionConfig();
    this.initSectorForms();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['residuos'] && this.residuos && this.residuos.length > 0) {
      this.nuevoResiduoId = this.residuos[0].id;
    }
    if (changes['sectores'] && this.sectores && this.sectores.length > 0) {
      if (!this.sectorSeleccionadoNombre) {
        this.sectorSeleccionadoNombre = this.sectores[0].nombre;
      }
      this.syncSectorSeleccionadoForm();
      this.initSectorForms();
    }
    if (changes['rotacionSemanal'] && this.rotacionSemanal) {
      if (this.rotacionModo === 'MANUAL' && this.rotacionSemanal.residuoCodigo) {
        this.overrideMaterialCodigo = this.rotacionSemanal.residuoCodigo;
      }
      if (this.rotacionSemanal.slotSemana) {
        this.semanaSeleccionada = this.rotacionSemanal.slotSemana;
        this.syncSectorSeleccionadoForm();
      }
    }
  }

  initRotacionConfig(): void {
    const local = loadLocalRotacionConfig();
    this.rotacionModo = local.modo || 'AUTOMATICO';
    if (local.overrideCodigoResiduo) {
      this.overrideMaterialCodigo = local.overrideCodigoResiduo;
    }
    this.bffService.getRotacionConfig().subscribe({
      next: (cfg) => {
        if (cfg && cfg.modo) {
          this.rotacionModo = cfg.modo;
          if (cfg.overrideCodigoResiduo) {
            this.overrideMaterialCodigo = cfg.overrideCodigoResiduo;
          }
          saveLocalRotacionConfig({
            modo: this.rotacionModo,
            overrideCodigoResiduo: this.rotacionModo === 'MANUAL' ? this.overrideMaterialCodigo : null
          });
        }
      },
      error: () => {}
    });
  }

  initSectorForms(): void {
    const overrides = loadLocalSectorOverrides();
    this.sectores.forEach(s => {
      const ov = overrides[s.nombre] || overrides[s.sector] || overrides[s.cuadrante];
      this.sectorFormOverrides[s.nombre] = {
        dia: ov?.dia || s.dia,
        material: ov?.material || ov?.materialPrincipal || s.materialPrincipal || s.material
      };
    });
  }

  get currentSemanaISO(): number {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86_400_000) + 1;
    return Math.ceil(dayOfYear / 7);
  }

  isSemanaActiva(slot: number): boolean {
    return this.rotacionSemanal?.slotSemana === slot;
  }

  getRotacionMaterialIcon(codigo: string): string {
    switch (codigo) {
      case 'VIDRIO': return 'fa-solid fa-wine-bottle';
      case 'CARTON_PAPEL': return 'fa-solid fa-box-archive';
      case 'PLASTICO_PET': return 'fa-solid fa-bottle-water';
      case 'LATAS_METALES': return 'fa-solid fa-can-food';
      default: return 'fa-solid fa-recycle';
    }
  }

  isSectorOverride(sectorNombre: string): boolean {
    const overrides = loadLocalSectorOverrides();
    return !!(overrides && overrides[sectorNombre]);
  }

  guardarRotacionConfig(): void {
    this.isSavingRotacion = true;
    this.rotacionFeedback = null;
    const payload = {
      modo: this.rotacionModo,
      overrideCodigoResiduo: this.rotacionModo === 'MANUAL' ? this.overrideMaterialCodigo : null
    };

    saveLocalRotacionConfig(payload);

    this.bffService.actualizarRotacionConfig(payload).subscribe({
      next: () => {
        this.isSavingRotacion = false;
        this.rotacionFeedback = {
          tipo: 'success',
          mensaje: this.rotacionModo === 'MANUAL'
            ? 'Rotación manual guardada con éxito en el catálogo municipal.'
            : 'Rotación automática guardada y sincronizada.'
        };
        this.rotacionModificada.emit();
        setTimeout(() => { if (this.rotacionFeedback?.tipo === 'success') this.rotacionFeedback = null; }, 4000);
      },
      error: () => {
        this.isSavingRotacion = false;
        this.rotacionFeedback = {
          tipo: 'success',
          mensaje: 'Configuración guardada localmente (ms-reciclago-catalog fuera de línea).'
        };
        this.rotacionModificada.emit();
        setTimeout(() => { if (this.rotacionFeedback?.tipo === 'success') this.rotacionFeedback = null; }, 4000);
      }
    });
  }

  restablecerRotacionAutomatica(): void {
    this.isSavingRotacion = true;
    this.rotacionFeedback = null;
    const payload = { modo: 'AUTOMATICO' as const, overrideCodigoResiduo: null };
    saveLocalRotacionConfig(payload);
    this.rotacionModo = 'AUTOMATICO';

    this.bffService.resetRotacionConfig().subscribe({
      next: () => {
        this.isSavingRotacion = false;
        this.rotacionFeedback = {
          tipo: 'success',
          mensaje: 'Calendario restablecido a rotación automática según semana ISO municipal.'
        };
        this.rotacionModificada.emit();
        setTimeout(() => { if (this.rotacionFeedback?.tipo === 'success') this.rotacionFeedback = null; }, 4000);
      },
      error: () => {
        this.isSavingRotacion = false;
        this.rotacionFeedback = {
          tipo: 'success',
          mensaje: 'Calendario restablecido localmente a modo automático.'
        };
        this.rotacionModificada.emit();
        setTimeout(() => { if (this.rotacionFeedback?.tipo === 'success') this.rotacionFeedback = null; }, 4000);
      }
    });
  }

  guardarSectorOverride(sector: Sector): void {
    const form = this.sectorFormOverrides[sector.nombre];
    if (!form) return;

    this.savingSectorNombre = sector.nombre;
    const overrides = loadLocalSectorOverrides();
    overrides[sector.nombre] = {
      dia: form.dia,
      material: form.material,
      materialPrincipal: form.material
    };
    saveLocalSectorOverrides(overrides);

    sector.dia = form.dia;
    sector.material = form.material;
    sector.materialPrincipal = form.material;

    let matCod = 'VIDRIO';
    const mLower = form.material.toLowerCase();
    if (mLower.includes('cartón') || mLower.includes('carton') || mLower.includes('papel')) matCod = 'CARTON_PAPEL';
    else if (mLower.includes('plástico') || mLower.includes('plastico') || mLower.includes('pet')) matCod = 'PLASTICO_PET';
    else if (mLower.includes('lata') || mLower.includes('metal')) matCod = 'LATAS_METALES';

    this.bffService.actualizarSectorRotacion(sector.nombre, { dia: form.dia, materialCodigo: matCod, materialNombre: form.material }).subscribe({
      next: () => {
        this.savingSectorNombre = null;
        this.sectorFeedback[sector.nombre] = { tipo: 'success', mensaje: 'Actualizado' };
        this.sectoresModificados.emit(this.sectores);
        this.rotacionModificada.emit();
        setTimeout(() => { delete this.sectorFeedback[sector.nombre]; }, 3000);
      },
      error: () => {
        this.savingSectorNombre = null;
        this.sectorFeedback[sector.nombre] = { tipo: 'success', mensaje: 'Guardado local' };
        this.sectoresModificados.emit(this.sectores);
        this.rotacionModificada.emit();
        setTimeout(() => { delete this.sectorFeedback[sector.nombre]; }, 3000);
      }
    });
  }

  restablecerSector(sector: Sector): void {
    const defaultSec = DEFAULT_SECTORES.find(s => s.nombre === sector.nombre || s.numero === sector.numero);
    if (!defaultSec) return;

    const overrides = loadLocalSectorOverrides();
    delete overrides[sector.nombre];
    saveLocalSectorOverrides(overrides);

    sector.dia = defaultSec.dia;
    sector.material = defaultSec.material;
    sector.materialPrincipal = defaultSec.materialPrincipal;

    this.sectorFormOverrides[sector.nombre] = {
      dia: defaultSec.dia,
      material: defaultSec.materialPrincipal || defaultSec.material
    };

    this.sectorFeedback[sector.nombre] = { tipo: 'success', mensaje: 'Restablecido' };
    this.sectoresModificados.emit(this.sectores);
    this.rotacionModificada.emit();
    setTimeout(() => { delete this.sectorFeedback[sector.nombre]; }, 3000);
  }

  // ==================== MÉTODOS DE REPROGRAMACIÓN POR SEMANA Y SECTOR DIMAO ====================
  seleccionarSemana(slot: number): void {
    this.semanaSeleccionada = slot;
    this.syncSectorSeleccionadoForm();
  }

  getSemanaNombre(slot: number): string {
    const s = this.semanasRotacion.find(sem => sem.slot === slot);
    return s ? s.nombre : `Semana ${slot}`;
  }

  isSemanaEnCurso(slot: number): boolean {
    return this.rotacionSemanal?.slotSemana === slot;
  }

  getDiaHabitual(sectorNombre: string): string {
    if (!sectorNombre) return 'Lunes';
    const sec = DEFAULT_SECTORES.find(s =>
      s.nombre === sectorNombre ||
      sectorNombre.includes(s.nombre) ||
      s.nombre.includes(sectorNombre)
    );
    return sec?.dia || 'Lunes';
  }

  getDiaSector(sectorNombre: string, semana: number): string {
    const override = getScheduleOverrideForSector(sectorNombre, semana);
    if (override) return override.nuevoDia;
    return this.getDiaHabitual(sectorNombre);
  }

  isSectorModificadoEnSemana(sectorNombre: string, semana: number): boolean {
    if (!sectorNombre) return false;
    return !!getScheduleOverrideForSector(sectorNombre, semana);
  }

  getAvisoMotivo(sectorNombre: string, semana: number): string {
    const override = getScheduleOverrideForSector(sectorNombre, semana);
    if (!override) return '';
    return override.motivo || `Reprogramado excepcionalmente al ${override.nuevoDia}`;
  }

  hayModificacionesEnSemana(semana: number): boolean {
    const all = loadScheduleOverrides();
    return all.some(o => o.semana === semana);
  }

  onSectorSeleccionadoChange(): void {
    this.syncSectorSeleccionadoForm();
  }

  seleccionarSectorEnGrilla(sectorNombre: string): void {
    this.sectorSeleccionadoNombre = sectorNombre;
    this.syncSectorSeleccionadoForm();
  }

  syncSectorSeleccionadoForm(): void {
    if (!this.sectorSeleccionadoNombre && this.sectores.length > 0) {
      this.sectorSeleccionadoNombre = this.sectores[0].nombre;
    }
    const override = getScheduleOverrideForSector(this.sectorSeleccionadoNombre, this.semanaSeleccionada);
    if (override) {
      this.nuevoDiaSeleccionado = override.nuevoDia;
      this.motivoCambioDia = override.motivo || '';
    } else {
      this.nuevoDiaSeleccionado = this.getDiaHabitual(this.sectorSeleccionadoNombre);
      this.motivoCambioDia = '';
    }
  }

  guardarReprogramacionSector(): void {
    this.isSavingRotacion = true;
    const diaHabitual = this.getDiaHabitual(this.sectorSeleccionadoNombre);
    const overrides = loadScheduleOverrides().filter(
      o => !(o.sectorNombre === this.sectorSeleccionadoNombre && o.semana === this.semanaSeleccionada)
    );

    if (this.nuevoDiaSeleccionado !== diaHabitual || (this.motivoCambioDia && this.motivoCambioDia.trim())) {
      overrides.push({
        semana: this.semanaSeleccionada,
        sectorNombre: this.sectorSeleccionadoNombre,
        diaOriginal: diaHabitual,
        nuevoDia: this.nuevoDiaSeleccionado,
        motivo: this.motivoCambioDia.trim() || `Reprogramado excepcionalmente al ${this.nuevoDiaSeleccionado}`,
        fechaModificacion: new Date().toISOString()
      });
    }

    saveScheduleOverrides(overrides);

    const matSemana = this.semanasRotacion.find(s => s.slot === this.semanaSeleccionada);
    this.bffService.actualizarSectorRotacion(this.sectorSeleccionadoNombre, {
      dia: this.nuevoDiaSeleccionado,
      materialCodigo: matSemana?.codigo || 'VIDRIO',
      materialNombre: matSemana?.nombre || 'Residuo'
    }).subscribe({
      next: () => this.finalizarGuardadoReprogramacion(),
      error: () => this.finalizarGuardadoReprogramacion()
    });
  }

  private finalizarGuardadoReprogramacion(): void {
    this.isSavingRotacion = false;
    this.reprogramacionFeedback = {
      tipo: 'success',
      mensaje: `¡Reprogramación aplicada con éxito! El sector "${this.sectorSeleccionadoNombre}" se recolectará el día ${this.nuevoDiaSeleccionado} en Semana ${this.semanaSeleccionada}. Aviso sincronizado para vecinos y coordinadores.`
    };
    const semanaActiva = this.rotacionSemanal?.slotSemana || 3;
    const updatedSectores = aplicarSectorOverrides(this.sectores, semanaActiva);
    this.sectoresModificados.emit(updatedSectores);
    this.rotacionModificada.emit();
    setTimeout(() => {
      if (this.reprogramacionFeedback?.tipo === 'success') {
        this.reprogramacionFeedback = null;
      }
    }, 5000);
  }

  restablecerSectorSeleccionado(): void {
    const overrides = loadScheduleOverrides().filter(
      o => !(o.sectorNombre === this.sectorSeleccionadoNombre && o.semana === this.semanaSeleccionada)
    );
    saveScheduleOverrides(overrides);
    this.syncSectorSeleccionadoForm();

    const semanaActiva = this.rotacionSemanal?.slotSemana || 3;
    const updatedSectores = aplicarSectorOverrides(this.sectores, semanaActiva);
    this.sectoresModificados.emit(updatedSectores);
    this.rotacionModificada.emit();

    this.reprogramacionFeedback = {
      tipo: 'success',
      mensaje: `Sector "${this.sectorSeleccionadoNombre}" restablecido a su día habitual (${this.nuevoDiaSeleccionado}) para Semana ${this.semanaSeleccionada}.`
    };
    setTimeout(() => {
      if (this.reprogramacionFeedback?.tipo === 'success') {
        this.reprogramacionFeedback = null;
      }
    }, 4000);
  }

  restablecerTodosSectoresDeSemana(): void {
    const overrides = loadScheduleOverrides().filter(o => o.semana !== this.semanaSeleccionada);
    saveScheduleOverrides(overrides);
    this.syncSectorSeleccionadoForm();

    const semanaActiva = this.rotacionSemanal?.slotSemana || 3;
    const updatedSectores = aplicarSectorOverrides(this.sectores, semanaActiva);
    this.sectoresModificados.emit(updatedSectores);
    this.rotacionModificada.emit();

    this.reprogramacionFeedback = {
      tipo: 'success',
      mensaje: `Se restablecieron todos los sectores de la Semana ${this.semanaSeleccionada} a sus días habituales.`
    };
    setTimeout(() => {
      if (this.reprogramacionFeedback?.tipo === 'success') {
        this.reprogramacionFeedback = null;
      }
    }, 4000);
  }

  get selectedCamion(): Camion {
    return this.camiones.find(c => c.patente === this.selectedTruckPatente) || this.camiones[0] || { id: 1, patente: 'PV-RC-2026', capacidadKilos: 1500, estado: 'DISPONIBLE' };
  }

  get currentWaypoint(): Waypoint {
    return this.truckWaypointsMap[this.selectedTruckPatente] || this.activeWaypoint;
  }

  selectTruck(patente: string): void {
    this.selectedTruckPatente = patente;
  }

  toggleMantenimiento(camion: Camion): void {
    const nuevoEstado: EstadoCamion = camion.estado === 'MANTENIMIENTO' ? 'DISPONIBLE' : 'MANTENIMIENTO';
    camion.estado = nuevoEstado;
    this.camionEstadoCambiado.emit(camion);
    if (camion.id) {
      this.bffService.actualizarEstadoCamion(camion.id, nuevoEstado).subscribe({
        next: (res) => {
          if (res && res.estado) {
            camion.estado = res.estado;
            this.camionEstadoCambiado.emit(camion);
          }
        },
        error: (err) => {
          console.error('Error al persistir estado del camión en catálogo:', err);
        }
      });
    }
  }

  exportarPlanillaCsv(): void {
    const sanitizeCsvField = (val: any): string => {
      let s = String(val ?? '').replace(/"/g, '""').replace(/[\r\n]+/g, ' ');
      if (/^[=+\-@\t]/.test(s)) {
        s = "'" + s;
      }
      return `"${s}"`;
    };

    const headers = ['ID', 'Direccion', 'Material', 'Estado', 'Fecha', 'Kilos Recolectados', 'Comentarios'];
    const rows = this.filteredPickups.map(p => [
      p.id,
      sanitizeCsvField(p.direccion),
      sanitizeCsvField(p.residuoNombre),
      p.estado,
      sanitizeCsvField(p.fecha || p.fechaTexto || ''),
      p.kilosRecolectados || 0,
      sanitizeCsvField(p.comentarios)
    ]);
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `planilla_oficial_dimao_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  get countPesados(): number {
    return this.pickups.filter(p => p.estado === 'PESADO').length;
  }

  get countCompletados(): number {
    return this.pickups.filter(p => p.estado === 'RETIRADO' || p.estado === 'PESADO').length;
  }

  get totalKilosRecogidos(): number {
    return this.pickups
      .filter(p => (p.estado === 'RETIRADO' || p.estado === 'PESADO') && p.kilosRecolectados)
      .reduce((sum, p) => sum + (Number(p.kilosRecolectados) || 0), 0);
  }

  get porcentajeCumplimiento(): number {
    if (!this.pickups || this.pickups.length === 0) return 100;
    return Math.round((this.countCompletados / this.pickups.length) * 100);
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

  onMesaRutInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.nuevoVecinoRut = formatRut(input.value);
    if (this.nuevoVecinoRut.length > 3) {
      this.mesaRutError = validateRut(this.nuevoVecinoRut) ? '' : 'RUT inválido (ej: 12.345.678-K)';
    } else {
      this.mesaRutError = '';
    }
  }

  onMesaPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.nuevoVecinoTelefono = formatChileanPhone(input.value);
    if (this.nuevoVecinoTelefono.length > 6) {
      this.mesaPhoneError = validateChileanPhone(this.nuevoVecinoTelefono) ? '' : 'Formato inválido (ej: +56 9 8765 4321)';
    } else {
      this.mesaPhoneError = '';
    }
  }

  openNuevoRetiroModal(): void {
    this.showNuevoRetiroModal = true;
    this.isMaterialDropdownOpen = false;
    this.mesaError = '';
    this.mesaRutError = '';
    this.mesaPhoneError = '';
    document.body.style.overflow = 'hidden';
  }

  closeNuevoRetiroModal(): void {
    this.showNuevoRetiroModal = false;
    this.isMaterialDropdownOpen = false;
    this.mesaError = '';
    this.mesaRutError = '';
    this.mesaPhoneError = '';
    document.body.style.overflow = '';
  }

  submitRetiroVecinal(): void {
    this.mesaError = '';
    if (!this.nuevaDireccion || !this.nuevaDireccion.trim()) {
      this.mesaError = 'Por favor ingresa la dirección exacta del domicilio.';
      return;
    }
    if (this.nuevoVecinoRut && !validateRut(this.nuevoVecinoRut)) {
      this.mesaRutError = 'RUT inválido (ej: 12.345.678-K).';
      this.mesaError = 'Corrige el RUT ingresado.';
      return;
    }
    if (this.nuevoVecinoTelefono && !validateChileanPhone(this.nuevoVecinoTelefono)) {
      this.mesaPhoneError = 'Teléfono celular inválido (+56 9 XXXX XXXX).';
      this.mesaError = 'Corrige el teléfono ingresado.';
      return;
    }
    const pesoNum = Number(this.nuevoPesoEstimadoKg) > 0 ? Number(this.nuevoPesoEstimadoKg) : 5.0;

    this.isSubmittingRetiro = true;
    const resObj = this.residuos.find(r => r.id === Number(this.nuevoResiduoId));
    const contactoInfo = [
      this.nuevoVecinoRut ? `RUT: ${this.nuevoVecinoRut}` : '',
      this.nuevoVecinoTelefono ? `Tel: ${this.nuevoVecinoTelefono}` : ''
    ].filter(Boolean).join(' • ');

    const comentariosCompletos = `[Ingreso Mesa Central DIMAO - ${this.nuevoVecinoNombre || 'Atención Ciudadana'}${contactoInfo ? ' - ' + contactoInfo : ''}] ${this.nuevosComentarios || ''}`.trim();

    const item = {
      vecinoNombre: this.nuevoVecinoNombre || 'Vecino Puerto Varas',
      vecinoEmail: 'vecino.contacto@puertovaras.cl',
      direccion: this.nuevaDireccion.trim(),
      comuna: 'Puerto Varas',
      residuoId: Number(this.nuevoResiduoId || 1),
      residuoNombre: resObj ? resObj.nombre : 'Vidrio',
      pesoEstimadoKg: pesoNum,
      comentarios: comentariosCompletos,
      observaciones: comentariosCompletos
    };
    this.pickupCreated.emit(item);
    setTimeout(() => {
      this.isSubmittingRetiro = false;
      this.closeNuevoRetiroModal();
      this.nuevaDireccion = '';
      this.nuevoVecinoNombre = '';
      this.nuevoVecinoRut = '';
      this.nuevoVecinoTelefono = '';
      this.nuevosComentarios = '';
      this.nuevoPesoEstimadoKg = 5.0;
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
        return 'bg-[#ecf7e6] text-emerald-900 border-[#E2E8F0]';
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

