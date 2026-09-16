import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BffService } from '../../../../services/bff.service';
import { Pickup, Camion, Sector, DEFAULT_SECTORES } from '../../data/sectors.data';
import { DateOption, TimeSlot } from './programar-modal.component';
import { detectSector, DAY_NAME_TO_NUMBER } from '../../utils/sector.utils';

@Component({
  selector: 'app-chofer-operacion-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen"
         (click)="onClose()"
         class="fixed inset-0 z-[9999] overflow-y-auto bg-[#041D2D]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel p-6 sm:p-7 text-slate-800 my-auto">
        
        <!-- Franja de acento superior institucional -->
        <div class="h-1.5 -mx-7 -mt-7 mb-5"
             [ngClass]="actionType === 'en-ruta' ? 'bg-gradient-to-r from-[#123F5B] via-[#38BDF8] to-[#4F8A3D]' : 'bg-gradient-to-r from-amber-500 to-emerald-600'"></div>

        <!-- Encabezado del modal -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shadow-2xs border"
                 [ngClass]="actionType === 'en-ruta' ? 'bg-sky-50 text-sky-800 border-sky-200' : 'bg-amber-50 text-amber-800 border-amber-200'">
              <i [ngClass]="actionType === 'en-ruta' ? 'fa-solid fa-truck-fast' : 'fa-solid fa-box-open'"></i>
            </div>
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                {{ actionType === 'en-ruta' ? 'Despacho y Salida a Ruta' : 'Operación de Cabina' }}
              </span>
              <h3 class="font-heading font-extrabold text-lg sm:text-xl text-[#123F5B]">
                {{ actionType === 'en-ruta' ? 'Despachar a Ruta' : 'Confirmar Retiro' }} #{{ pickup?.id }}
              </h3>
            </div>
          </div>
          <button (click)="onClose()" type="button" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs transition-colors cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Resumen de Dirección y Material -->
        <div class="p-3 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4] mb-3 text-xs text-slate-600">
          <div class="flex items-center justify-between gap-2">
            <span class="font-bold text-[#123F5B] truncate">{{ pickup?.direccion }}</span>
            <span class="px-2.5 py-0.5 rounded-md font-bold text-xs bg-emerald-100 text-emerald-900 border border-emerald-200 flex-shrink-0">
              {{ materialName }}
            </span>
          </div>
          <div class="flex items-center gap-2 mt-1 text-[11px] text-slate-500 flex-wrap">
            <span>Sector: <strong class="text-slate-700">{{ sectorName }}</strong></span>
            <span *ngIf="actionCamionPatente">• Camión: <strong class="text-slate-700">{{ actionCamionPatente }}</strong></span>
            <span *ngIf="pickup?.pesoEstimadoKg">• Est: <strong class="text-slate-700">{{ pickup?.pesoEstimadoKg }} kg</strong></span>
          </div>
        </div>

        <!-- Caso 1: En Ruta pero estado SOLICITADO (Bloqueo Preventivo) -->
        <div *ngIf="actionType === 'en-ruta' && pickup?.estado === 'SOLICITADO'" class="space-y-2 text-left p-4 rounded-2xl bg-amber-50 border border-amber-300">
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-base flex-shrink-0">
              <i class="fa-regular fa-clock"></i>
            </div>
            <div>
              <p class="text-sm font-bold text-amber-950">Esperando Visto Bueno del Coordinador</p>
              <p class="text-xs text-amber-900 leading-relaxed mt-1">
                Debes esperar el visto bueno de tu Coordinador para seguir esta orden. La solicitud aún está en estado <strong>SOLICITADO</strong> y debe ser programada con fecha y camión asignado antes de salir a ruta.
              </p>
            </div>
          </div>
        </div>

        <!-- Caso 2: En Ruta y estado PROGRAMADO (Confirmar Despacho) -->
        <div *ngIf="actionType === 'en-ruta' && pickup?.estado !== 'SOLICITADO'" class="space-y-3 text-left">
          
          <!-- Tarjeta de Agenda Asignada con botón para ajustar si se requiere -->
          <div class="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <i class="fa-regular fa-calendar-check text-[#1F6685] text-sm"></i>
                <span class="font-extrabold text-[#123F5B]">Turno Operativo Asignado</span>
              </div>
              <button (click)="toggleAdjustSchedule()"
                      type="button"
                      class="px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer"
                      [ngClass]="showAdjustSchedule ? 'bg-sky-700 text-white border-sky-800' : 'bg-white text-sky-800 border-sky-300 hover:bg-sky-100'">
                <i class="fa-solid fa-pen-to-square mr-1"></i>
                <span>{{ showAdjustSchedule ? 'Ocultar Selector' : 'Ajustar Día / Hora' }}</span>
              </button>
            </div>

            <div class="mt-2 text-[11px] text-slate-700 space-y-0.5">
              <div>Fecha: <strong class="text-brand-navy">{{ selectedFechaFullText }}</strong></div>
              <div>Hora: <strong class="text-brand-navy">{{ selectedHora }} hrs</strong> ({{ selectedPeriodo }})</div>
              <div>Cuadrilla: <strong class="text-brand-navy">{{ actionCamionPatente }}</strong></div>
            </div>
          </div>

          <!-- SELECTOR INTUITIVO EXPANDIBLE AL DESPACHAR -->
          <div *ngIf="showAdjustSchedule" class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 anim-fade-up text-left">
            
            <!-- 1. Días del material -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-[11px] font-bold uppercase tracking-wider text-[#123F5B]">
                  Días Permitidos para {{ materialName }}
                </label>
                <span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {{ allowedDayNames.join(', ') }}
                </span>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button *ngFor="let d of nextDateOptions"
                        (click)="seleccionarFecha(d.value)"
                        type="button"
                        class="p-2 rounded-xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between"
                        [ngClass]="selectedFecha === d.value ? 'bg-[#123F5B] text-white border-[#123F5B] shadow-2xs font-bold ring-1 ring-sky-300' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'">
                  <div>
                    <div class="flex items-center justify-between">
                      <span class="text-[9px] font-black uppercase opacity-80">{{ d.diaSemana }}</span>
                      <i *ngIf="selectedFecha === d.value" class="fa-solid fa-circle-check text-[10px]"></i>
                    </div>
                    <span class="text-xs font-black block mt-0.5 leading-tight">{{ d.label }}</span>
                  </div>
                  <span class="text-[8.5px] mt-1 block font-medium opacity-75 truncate">{{ d.sublabel }}</span>
                </button>
              </div>
            </div>

            <!-- 2. Horas de trabajo -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-[11px] font-bold uppercase tracking-wider text-[#123F5B]">
                  Horas de Trabajo Oficiales
                </label>
                <span class="text-[9px] font-semibold text-slate-500">
                  Jornada: {{ officialHoursRange }}
                </span>
              </div>
              <div class="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                <button *ngFor="let slot of availableTimeSlots"
                        (click)="seleccionarHora(slot.value)"
                        type="button"
                        class="py-1.5 px-1 rounded-lg text-center border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5"
                        [ngClass]="selectedHora === slot.value ? 'bg-[#4F8A3D] text-white border-[#4F8A3D] font-bold shadow-2xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'">
                  <span class="text-xs font-bold">{{ slot.label }}</span>
                  <span class="text-[8.5px] font-medium opacity-80">{{ slot.periodo }}</span>
                </button>
              </div>
            </div>

            <!-- 3. Camión si hay disponibles -->
            <div *ngIf="camionesDisponibles && camionesDisponibles.length > 0">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-[#123F5B] mb-1">
                Camión Asignado
              </label>
              <select [(ngModel)]="actionCamionPatente" (ngModelChange)="hasScheduleChanges = true" class="select-stitch w-full py-1.5 px-2.5 text-xs font-medium bg-white">
                <option *ngFor="let c of camionesDisponibles" [value]="c.patente">
                  {{ c.patente }} ({{ (c.estado === 'ACTIVO' || !c.estado) ? 'Operativo' : c.estado }})
                </option>
              </select>
            </div>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed px-1">
            Al confirmar, el estado pasará a <strong>EN_RUTA</strong>, habilitando la telemetría GPS y notificando al vecino.
          </p>
        </div>

        <!-- Caso 3: Retirado en Puerta -->
        <div *ngIf="actionType === 'retirado'" class="space-y-2 text-left p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70">
          <p class="text-sm font-bold text-emerald-950">¿Confirmar recolección en puerta?</p>
          <p class="text-xs text-emerald-900 leading-relaxed">
            El residuo ha sido retirado del frontis del domicilio del vecino y queda listo para pesaje oficial en la báscula digital.
          </p>
        </div>

        <!-- Banner de Error Sobrio -->
        <div *ngIf="errorMessage" class="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5 text-left">
          <i class="fa-solid fa-circle-exclamation text-amber-600 text-base mt-0.5 flex-shrink-0"></i>
          <div class="flex-1 min-w-0">
            <span class="font-bold block text-sm text-amber-950">{{ errorTitle }}</span>
            <span class="text-xs text-amber-900 leading-relaxed mt-0.5 block">{{ errorMessage }}</span>
          </div>
          <button (click)="errorMessage = ''" type="button" class="text-amber-500 hover:text-amber-800 text-xs cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Botonera inferior -->
        <div class="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button (click)="onClose()" type="button" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
            {{ isBlocked ? 'Entendido' : 'Cancelar' }}
          </button>
          <button *ngIf="!isBlocked"
                  (click)="confirmarOperacion()"
                  [disabled]="isSubmitting"
                  type="button"
                  class="btn-stitch-primary px-5 py-2.5 text-xs font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
            <span *ngIf="!isSubmitting">{{ actionType === 'en-ruta' ? 'Confirmar Despacho a Ruta' : 'Confirmar Retiro' }}</span>
            <span *ngIf="isSubmitting"><i class="fa-solid fa-spinner fa-spin"></i> Guardando...</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ChoferOperacionModalComponent implements OnChanges, OnDestroy {
  @Input() isOpen: boolean = false;
  @Input() pickup: Pickup | any = null;
  @Input() actionType: 'en-ruta' | 'retirado' = 'en-ruta';
  @Input() camionesDisponibles: Camion[] | any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() actionCompleted = new EventEmitter<void>();

  isSubmitting = false;
  errorMessage = '';
  errorTitle = 'Aviso de Cabina';

  showAdjustSchedule = false;
  hasScheduleChanges = false;
  selectedFecha: string = '';
  selectedHora: string = '09:30';
  actionCamionPatente: string = 'PV-RC-2026';

  nextDateOptions: DateOption[] = [];
  availableTimeSlots: TimeSlot[] = [];

  constructor(private bffService: BffService) {}

  get isBlocked(): boolean {
    return this.actionType === 'en-ruta' && this.pickup?.estado === 'SOLICITADO';
  }

  get materialName(): string {
    return this.pickup?.residuoNombre || 'Vidrio';
  }

  get sectorDetected(): Sector {
    return detectSector(this.pickup?.direccion || '', this.materialName);
  }

  get sectorName(): string {
    return this.sectorDetected.nombre;
  }

  get isRetiroEspecial(): boolean {
    const obs = (this.pickup?.comentarios || '').toUpperCase();
    return obs.includes('ESPECIAL');
  }

  get allowedDayNames(): string[] {
    if (this.isRetiroEspecial) return ['Viernes', 'Sábado'];
    return [this.sectorDetected.dia];
  }

  get allowedDayNumbers(): number[] {
    if (this.isRetiroEspecial) return [5, 6];
    return [DAY_NAME_TO_NUMBER[this.sectorDetected.dia.toLowerCase()] ?? 2];
  }

  get officialHoursRange(): string {
    return this.sectorDetected.horario || '08:00 – 17:00 hrs';
  }

  get selectedFechaFullText(): string {
    const found = this.nextDateOptions.find(d => d.value === this.selectedFecha);
    if (found) return found.fullLabel;
    if (this.pickup?.fechaTexto) return this.pickup.fechaTexto;
    return this.selectedFecha || 'Sin fecha asignada';
  }

  get selectedPeriodo(): string {
    const found = this.availableTimeSlots.find(s => s.value === this.selectedHora);
    return found ? found.periodo : 'Turno Oficial';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      this.errorMessage = '';
      this.showAdjustSchedule = false;
      this.hasScheduleChanges = false;
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    if (changes['pickup'] && this.pickup) {
      this.errorMessage = '';
      this.hasScheduleChanges = false;
      this.showAdjustSchedule = false;
      this.computeDateAndHourOptions();

      if (this.pickup.camionPatente) {
        this.actionCamionPatente = this.pickup.camionPatente;
      } else {
        this.actionCamionPatente = this.sectorDetected.patente || 'PV-RC-2026';
      }

      if (this.pickup.fechaProgramada) {
        const parts = String(this.pickup.fechaProgramada).split('T');
        if (parts[0]) {
          this.selectedFecha = parts[0];
          this.ensureFechaInOptions(parts[0]);
        }
        if (parts[1]) {
          const hora = parts[1].substring(0, 5);
          this.selectedHora = hora;
          this.ensureHoraInSlots(hora);
        }
      } else if (this.nextDateOptions.length > 0) {
        this.selectedFecha = this.nextDateOptions[0].value;
      }
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  toggleAdjustSchedule(): void {
    this.showAdjustSchedule = !this.showAdjustSchedule;
  }

  seleccionarFecha(fechaVal: string): void {
    this.selectedFecha = fechaVal;
    this.hasScheduleChanges = true;
  }

  seleccionarHora(horaVal: string): void {
    this.selectedHora = horaVal;
    this.hasScheduleChanges = true;
  }

  computeDateAndHourOptions(): void {
    const dates: DateOption[] = [];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const now = new Date();
    const targetDays = this.allowedDayNumbers;
    let checkDate = new Date(now);
    checkDate.setDate(checkDate.getDate() + 1);

    const sublabels = ['Próximo recorrido', 'Semana siguiente', 'En 2 semanas', 'En 3 semanas'];
    let count = 0;

    while (dates.length < 4) {
      if (targetDays.includes(checkDate.getDay())) {
        const y = checkDate.getFullYear();
        const m = String(checkDate.getMonth() + 1).padStart(2, '0');
        const d = String(checkDate.getDate()).padStart(2, '0');
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const dayName = dayNames[checkDate.getDay()];
        dates.push({
          value: `${y}-${m}-${d}`,
          diaSemana: dayName,
          label: `${d} ${months[checkDate.getMonth()]}`,
          fullLabel: `${dayName} ${d} de ${months[checkDate.getMonth()]}`,
          sublabel: sublabels[count] || 'Recorrido oficial'
        });
        count++;
      }
      checkDate.setDate(checkDate.getDate() + 1);
    }

    this.nextDateOptions = dates;

    if (this.isRetiroEspecial) {
      this.availableTimeSlots = [
        { value: '09:00', label: '09:00', periodo: 'Apertura' },
        { value: '10:00', label: '10:00', periodo: 'Mañana' },
        { value: '11:00', label: '11:00', periodo: 'Media Mañana' },
        { value: '12:00', label: '12:00', periodo: 'Mediodía' },
        { value: '13:00', label: '13:00', periodo: 'Tarde' },
        { value: '13:30', label: '13:30', periodo: 'Cierre' }
      ];
    } else {
      this.availableTimeSlots = [
        { value: '08:30', label: '08:30', periodo: 'Mañana' },
        { value: '09:30', label: '09:30', periodo: 'Mañana' },
        { value: '10:30', label: '10:30', periodo: 'Media Mañana' },
        { value: '11:30', label: '11:30', periodo: 'Mediodía' },
        { value: '12:30', label: '12:30', periodo: 'Mediodía' },
        { value: '14:00', label: '14:00', periodo: 'Tarde' },
        { value: '15:00', label: '15:00', periodo: 'Media Tarde' },
        { value: '16:00', label: '16:00', periodo: 'Tarde' },
        { value: '16:30', label: '16:30', periodo: 'Cierre de Ruta' }
      ];
    }
  }

  ensureFechaInOptions(fechaStr: string): void {
    const exists = this.nextDateOptions.some(d => d.value === fechaStr);
    if (!exists) {
      const [y, m, d] = fechaStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      this.nextDateOptions.unshift({
        value: fechaStr,
        diaSemana: dayNames[dateObj.getDay()] || 'Fecha',
        label: `${String(d).padStart(2, '0')} ${months[m - 1] || ''}`,
        fullLabel: `${dayNames[dateObj.getDay()] || ''} ${d} de ${months[m - 1] || ''}`,
        sublabel: 'Fecha Actual Asignada'
      });
    }
  }

  ensureHoraInSlots(horaStr: string): void {
    const exists = this.availableTimeSlots.some(s => s.value === horaStr);
    if (!exists) {
      this.availableTimeSlots.push({
        value: horaStr,
        label: horaStr,
        periodo: 'Hora Asignada'
      });
      this.availableTimeSlots.sort((a, b) => a.value.localeCompare(b.value));
    }
  }

  onClose(): void {
    this.errorMessage = '';
    document.body.style.overflow = '';
    this.close.emit();
  }

  confirmarOperacion(): void {
    if (!this.pickup) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    // Si se modificó la programación antes de despachar a cuadrilla, guardar primero
    if (this.actionType === 'en-ruta' && this.hasScheduleChanges && this.selectedFecha && this.selectedHora) {
      const camionSeleccionado = this.camionesDisponibles.find(c => c.patente === this.actionCamionPatente) || this.camionesDisponibles[0];
      const camionId = camionSeleccionado ? camionSeleccionado.id : 1;
      const isoDateTime = `${this.selectedFecha}T${this.selectedHora}:00`;

      this.bffService.programarPickup(this.pickup.id, {
        camionId: camionId,
        camionPatente: this.actionCamionPatente,
        fechaProgramada: isoDateTime
      }).subscribe({
        next: () => {
          this.procederConDespacho();
        },
        error: () => {
          this.isSubmitting = false;
          this.errorMessage = 'No se pudo actualizar la programación antes de despachar.';
        }
      });
    } else {
      this.procederConDespacho();
    }
  }

  private procederConDespacho(): void {
    const obs = this.actionType === 'en-ruta'
      ? this.bffService.enRutaPickup(this.pickup.id)
      : this.bffService.retiradoPickup(this.pickup.id);

    obs.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.actionCompleted.emit();
        this.onClose();
      },
      error: (err) => {
        this.isSubmitting = false;
        const raw = err?.error?.error || err?.error?.message || err?.message || '';
        if (raw.includes('SOLICITADO') || raw.includes('PROGRAMADO')) {
          this.errorTitle = 'Esperando Visto Bueno del Coordinador';
          this.errorMessage = 'Debes esperar el visto bueno de tu Coordinador para seguir esta orden.';
        } else if (raw.includes('EN_RUTA')) {
          this.errorTitle = 'Camión No Iniciado';
          this.errorMessage = 'El camión debe iniciar ruta hacia este domicilio antes de confirmar la recolección física.';
        } else {
          this.errorTitle = 'Error al Actualizar Estado';
          this.errorMessage = 'No se pudo comunicar con el microservicio de retiros.';
        }
      }
    });
  }
}
