import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BffService } from '../../../../services/bff.service';
import { Camion, Pickup, Sector, DEFAULT_SECTORES } from '../../data/sectors.data';

export interface DateOption {
  value: string;       // YYYY-MM-DD
  label: string;       // "22 Sep"
  diaSemana: string;   // "Martes"
  fullLabel: string;   // "Martes 22 de Septiembre"
  sublabel: string;    // "Próximo recorrido", "En 1 semana", etc.
}

export interface TimeSlot {
  value: string;       // "09:30"
  label: string;       // "09:30"
  periodo: string;     // "Turno Mañana"
}

@Component({
  selector: 'app-programar-modal',
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
             [ngClass]="isRetiroEspecial ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600' : 'bg-gradient-to-r from-[#1F6685] via-[#38BDF8] to-[#4F8A3D]'"></div>

        <!-- Encabezado del modal -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shadow-2xs border"
                 [ngClass]="isRetiroEspecial ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-sky-50 text-[#1F6685] border-sky-200'">
              <i [ngClass]="isRetiroEspecial ? 'fa-solid fa-boxes-packing' : 'fa-regular fa-calendar-check'"></i>
            </div>
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider block"
                    [ngClass]="isRetiroEspecial ? 'text-amber-800' : 'text-[#1F6685]'">
                {{ isEditMode ? 'Modificación de Agenda (Antes de Iniciar Ruta)' : (isRetiroEspecial ? 'Despacho de Servicio Especial' : 'Planificación Logística Comunal') }}
              </span>
              <h3 class="font-heading font-extrabold text-lg sm:text-xl text-[#123F5B]">
                {{ isEditMode ? 'Editar Programación' : 'Despachar / Programar Retiro' }} #{{ pickup?.id }}
              </h3>
            </div>
          </div>
          <button (click)="onClose()" type="button" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs transition-colors cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Resumen del retiro y material -->
        <div class="p-3 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4] mb-4 text-xs text-slate-600">
          <div class="flex items-center justify-between gap-2">
            <span class="font-bold text-[#123F5B] truncate">{{ pickup?.direccion }}</span>
            <span class="px-2.5 py-0.5 rounded-md font-bold text-xs bg-emerald-100 text-emerald-900 border border-emerald-200 flex-shrink-0">
              {{ materialName }}
            </span>
          </div>
          <div class="flex items-center gap-2 mt-1 text-[11px] text-slate-500 flex-wrap">
            <span>Sector: <strong class="text-slate-700">{{ sectorName }}</strong></span>
            <span *ngIf="pickup?.pesoEstimadoKg">• Est: <strong class="text-slate-700">{{ pickup?.pesoEstimadoKg }} kg</strong></span>
            <span *ngIf="isEditMode" class="text-sky-700 font-semibold">• Modo Edición Activo</span>
          </div>
        </div>

        <!-- 1. TOGGLE: MODALIDAD DE SERVICIO (Regular vs Especial) -->
        <div class="mb-4">
          <label class="block text-[11px] font-extrabold uppercase tracking-wider text-[#123F5B] mb-1.5">
            Modalidad de Recolección
          </label>
          <div class="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button (click)="setModalidad(false)"
                    type="button"
                    class="py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                    [ngClass]="!isRetiroEspecial ? 'bg-white text-[#123F5B] shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'">
              <i class="fa-solid fa-truck"></i>
              <span>Recorrido Regular</span>
            </button>

            <button (click)="setModalidad(true)"
                    type="button"
                    class="py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                    [ngClass]="isRetiroEspecial ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'">
              <i class="fa-solid fa-boxes-packing"></i>
              <span>Retiro Especial DIMAO</span>
            </button>
          </div>
        </div>

        <!-- 2. TARJETA INFORMATIVA DE DÍAS OFICIALES -->
        <div class="p-3 rounded-2xl mb-4 text-xs border"
             [ngClass]="isRetiroEspecial ? 'bg-amber-50/80 border-amber-200 text-amber-950' : 'bg-sky-50/80 border-sky-200 text-[#123F5B]'">
          <div class="flex items-start gap-2.5">
            <i [ngClass]="isRetiroEspecial ? 'fa-solid fa-calendar-star text-amber-600' : 'fa-solid fa-circle-info text-sky-600'" class="text-sm mt-0.5 flex-shrink-0"></i>
            <div>
              <span class="font-bold block text-xs">
                {{ isRetiroEspecial ? 'Días Operativos Especiales DIMAO' : 'Día de Recolección para ' + materialName }}
              </span>
              <p class="text-[11px] mt-0.5 leading-relaxed opacity-90">
                <span *ngIf="!isRetiroEspecial">
                  En {{ sectorName }}, este material se recolecta exclusivamente los <strong>{{ allowedDayNames.join(', ') | uppercase }}</strong> en horario de <strong>{{ officialHoursRange }}</strong>.
                </span>
                <span *ngIf="isRetiroEspecial">
                  Los retiros especiales de voluminosos se atienden los días <strong>VIERNES Y SÁBADOS</strong> en jornada de <strong>09:00 a 14:00 hrs</strong>.
                </span>
              </p>
            </div>
          </div>
        </div>

        <!-- 3. SELECTOR INTUITIVO DE DÍAS OFICIALES (SIN ENTRADA LIBRE) -->
        <div class="mb-4 text-left">
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-[#123F5B]">
              1. Selecciona el Día de Recolección
            </label>
            <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Solo días oficiales: {{ allowedDayNames.join(', ') }}
            </span>
          </div>

          <!-- Grilla de Tarjetas de Días Válidos -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button *ngFor="let d of nextDateOptions"
                    (click)="seleccionarFecha(d.value)"
                    type="button"
                    class="p-2.5 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between"
                    [ngClass]="selectedFecha === d.value ? (isRetiroEspecial ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300 font-bold' : 'bg-[#123F5B] text-white border-[#123F5B] shadow-md ring-2 ring-sky-300 font-bold') : 'bg-[#F8FAF7] text-slate-700 border-[#E2E9E4] hover:bg-slate-100 hover:border-slate-300'">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-black uppercase tracking-wider opacity-85">{{ d.diaSemana }}</span>
                  <i *ngIf="selectedFecha === d.value" class="fa-solid fa-circle-check text-xs text-white"></i>
                </div>
                <span class="text-sm font-black block mt-0.5 leading-tight">{{ d.label }}</span>
              </div>
              <span class="text-[9px] mt-1.5 block font-semibold opacity-80 truncate">{{ d.sublabel }}</span>
            </button>
          </div>
        </div>

        <!-- 4. SELECTOR INTUITIVO DE HORAS DE TRABAJO (SIN ENTRADA LIBRE) -->
        <div class="mb-4 text-left">
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-[#123F5B]">
              2. Selecciona la Hora de Trabajo
            </label>
            <span class="text-[10px] font-semibold text-slate-500">
              Jornada: {{ isRetiroEspecial ? '09:00 – 14:00 hrs' : '08:00 – 17:00 hrs' }}
            </span>
          </div>

          <!-- Grilla de Bloques Horarios Oficiales -->
          <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
            <button *ngFor="let slot of availableTimeSlots"
                    (click)="seleccionarHora(slot.value)"
                    type="button"
                    class="py-2 px-1.5 rounded-xl text-center border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5"
                    [ngClass]="selectedHora === slot.value ? (isRetiroEspecial ? 'bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-300 font-black' : 'bg-[#4F8A3D] text-white border-[#4F8A3D] shadow-md ring-2 ring-emerald-300 font-black') : 'bg-[#F8FAF7] text-slate-700 border-[#E2E9E4] hover:bg-slate-100 hover:border-slate-300'">
              <div class="flex items-center gap-1">
                <span class="text-xs font-black">{{ slot.label }}</span>
                <i *ngIf="selectedHora === slot.value" class="fa-solid fa-circle-check text-[10px]"></i>
              </div>
              <span class="text-[9px] font-medium opacity-85">{{ slot.periodo }}</span>
            </button>
          </div>
        </div>

        <!-- 5. SELECTOR DE CAMIÓN -->
        <div class="mb-4 text-left">
          <label class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] mb-1">
            3. Camión Recolector Municipal Asignado
          </label>
          <select [(ngModel)]="actionCamionPatente" class="select-stitch w-full py-2 px-3 text-xs font-medium">
            <option *ngFor="let c of camionesDisponibles" [value]="c.patente">
              {{ c.patente }} — Cap: {{ c.capacidadKilos || c.capacidadMaximaKg || 1500 }} kg ({{ (c.estado === 'ACTIVO' || !c.estado) ? 'Operativo' : c.estado }})
            </option>
          </select>
        </div>

        <!-- 6. RESUMEN RECONFIRMATIVO EN VIVO -->
        <div class="p-3 rounded-2xl bg-[#EEF5EB] border border-[#CCE4C8] text-emerald-950 text-xs flex items-center gap-3 mb-4 text-left">
          <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm flex-shrink-0">
            <i class="fa-solid fa-calendar-check"></i>
          </div>
          <div class="min-w-0 flex-1">
            <span class="font-extrabold text-[10px] uppercase tracking-wider block text-emerald-900">
              {{ isEditMode ? 'Reprogramación Validada' : 'Turno Operativo Válido' }}
            </span>
            <p class="text-xs text-emerald-950 font-bold mt-0.5 truncate">
              {{ selectedFechaFullText }} a las {{ selectedHora }} hrs ({{ selectedPeriodo }})
            </p>
            <span class="text-[10px] text-emerald-800 font-medium block">
              Camión: <strong>{{ actionCamionPatente }}</strong> • {{ isRetiroEspecial ? 'Servicio DIMAO' : 'Sector ' + sectorName }}
            </span>
          </div>
        </div>

        <!-- Banner de Error si fallara el guardado -->
        <div *ngIf="errorMessage" class="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-2 text-left anim-fade-up">
          <i class="fa-solid fa-triangle-exclamation text-rose-500 text-sm mt-0.5 flex-shrink-0"></i>
          <div>
            <span class="font-bold block">Error al Guardar</span>
            <span class="text-[11px] leading-tight block mt-0.5">{{ errorMessage }}</span>
          </div>
        </div>

        <!-- Botonera inferior -->
        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button (click)="onClose()" type="button" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
            Cancelar
          </button>
          <button (click)="confirmarProgramacion()"
                  [disabled]="isSubmitting"
                  type="button"
                  class="btn-stitch-primary px-5 py-2.5 text-xs font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
            <span *ngIf="!isSubmitting">{{ isEditMode ? 'Guardar Cambios' : 'Confirmar Programación' }}</span>
            <span *ngIf="isSubmitting"><i class="fa-solid fa-spinner fa-spin"></i> Guardando...</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProgramarModalComponent implements OnChanges, OnDestroy {
  @Input() isOpen: boolean = false;
  @Input() pickup: Pickup | any = null;
  @Input() camionesDisponibles: Camion[] | any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() actionCompleted = new EventEmitter<void>();

  isRetiroEspecial: boolean = false;
  selectedFecha: string = '';
  selectedHora: string = '09:30';
  actionCamionPatente: string = 'PV-RC-2026';
  isSubmitting: boolean = false;
  errorMessage: string = '';

  nextDateOptions: DateOption[] = [];
  availableTimeSlots: TimeSlot[] = [];

  constructor(private bffService: BffService) {}

  get materialName(): string {
    return this.pickup?.residuoNombre || 'Vidrio';
  }

  get sectorDetected(): Sector {
    const dir = (this.pickup?.direccion || '').toLowerCase();
    if (dir.includes('costanera') || dir.includes('llanquihue') || dir.includes('guindos') || dir.includes('vicente')) {
      return DEFAULT_SECTORES[1]; // Cuadrante 2 (Martes - Vidrio)
    }
    if (dir.includes('chico') || dir.includes('mirador') || dir.includes('decher') || dir.includes('colón')) {
      return DEFAULT_SECTORES[0]; // Cuadrante 1 (Lunes - Papel)
    }
    if (dir.includes('ensenada') || dir.includes('colonos') || dir.includes('225')) {
      return DEFAULT_SECTORES[2]; // Cuadrante 3 (Miércoles - Plástico)
    }
    if (dir.includes('braunau') || dir.includes('klein')) {
      return DEFAULT_SECTORES[3]; // Cuadrante 4 (Jueves - Vidrio)
    }
    // Fallback por tipo de residuo
    const mat = this.materialName.toLowerCase();
    if (mat.includes('vidrio')) return DEFAULT_SECTORES[1]; // Martes
    if (mat.includes('cartón') || mat.includes('papel')) return DEFAULT_SECTORES[0]; // Lunes
    if (mat.includes('plástic')) return DEFAULT_SECTORES[2]; // Miércoles
    return DEFAULT_SECTORES[1];
  }

  get sectorName(): string {
    return this.sectorDetected.nombre;
  }

  get allowedDayNames(): string[] {
    if (this.isRetiroEspecial) {
      return ['Viernes', 'Sábado'];
    }
    return [this.sectorDetected.dia];
  }

  get allowedDayNumbers(): number[] {
    if (this.isRetiroEspecial) {
      return [5, 6]; // Viernes (5) y Sábado (6)
    }
    const map: Record<string, number> = {
      'domingo': 0, 'lunes': 1, 'martes': 2, 'miércoles': 3, 'miercoles': 3, 'jueves': 4, 'viernes': 5, 'sábado': 6, 'sabado': 6
    };
    const target = map[this.sectorDetected.dia.toLowerCase()] ?? 2;
    return [target];
  }

  get officialHoursRange(): string {
    return this.sectorDetected.horario || '08:00 – 17:00 hrs';
  }

  get isEditMode(): boolean {
    return this.pickup?.estado === 'PROGRAMADO';
  }

  get selectedFechaFullText(): string {
    const found = this.nextDateOptions.find(d => d.value === this.selectedFecha);
    if (found) return found.fullLabel;
    if (!this.selectedFecha) return 'Sin fecha seleccionada';
    return this.selectedFecha;
  }

  get selectedPeriodo(): string {
    const found = this.availableTimeSlots.find(s => s.value === this.selectedHora);
    return found ? found.periodo : 'Turno Oficial';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      this.errorMessage = '';
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    if (changes['pickup'] && this.pickup) {
      this.errorMessage = '';
      // Detectar si el vecino pidió retiro especial en observaciones
      const obs = (this.pickup.comentarios || '').toUpperCase();
      this.isRetiroEspecial = obs.includes('ESPECIAL');
      this.updateConfiguration();

      // Si está en modo edición (ya programado), pre-cargar los datos existentes
      if (this.isEditMode) {
        if (this.pickup.camionPatente) {
          this.actionCamionPatente = this.pickup.camionPatente;
        }
        if (this.pickup.fechaProgramada) {
          const parts = String(this.pickup.fechaProgramada).split('T');
          if (parts[0]) {
            this.selectedFecha = parts[0];
            // Asegurar que esta fecha exista en la grilla visual
            this.ensureFechaInOptions(parts[0]);
          }
          if (parts[1]) {
            const hora = parts[1].substring(0, 5);
            this.selectedHora = hora;
            this.ensureHoraInSlots(hora);
          }
        }
      }
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  setModalidad(especial: boolean): void {
    this.isRetiroEspecial = especial;
    this.updateConfiguration();
  }

  updateConfiguration(): void {
    this.computeNextDateOptions();
    this.computeAvailableTimeSlots();

    if (this.nextDateOptions.length > 0) {
      this.selectedFecha = this.nextDateOptions[0].value;
    }

    if (this.isRetiroEspecial) {
      this.selectedHora = '10:00';
      this.actionCamionPatente = 'PV-RC-2026';
    } else {
      this.selectedHora = '09:30';
      this.actionCamionPatente = this.sectorDetected.patente || 'PV-RC-2026';
    }
  }

  computeNextDateOptions(): void {
    const dates: DateOption[] = [];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const now = new Date();

    const targetDays = this.allowedDayNumbers;
    let checkDate = new Date(now);
    checkDate.setDate(checkDate.getDate() + 1); // Empezar desde mañana

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

  computeAvailableTimeSlots(): void {
    if (this.isRetiroEspecial) {
      // Horario especial caso: 09:00 a 14:00 hrs
      this.availableTimeSlots = [
        { value: '09:00', label: '09:00', periodo: 'Apertura' },
        { value: '10:00', label: '10:00', periodo: 'Mañana' },
        { value: '11:00', label: '11:00', periodo: 'Media Mañana' },
        { value: '12:00', label: '12:00', periodo: 'Mediodía' },
        { value: '13:00', label: '13:00', periodo: 'Tarde' },
        { value: '13:30', label: '13:30', periodo: 'Cierre' }
      ];
    } else {
      // Horario regular caso: 08:00 a 17:00 hrs
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

  seleccionarFecha(fechaVal: string): void {
    this.selectedFecha = fechaVal;
  }

  seleccionarHora(horaVal: string): void {
    this.selectedHora = horaVal;
  }

  onClose(): void {
    this.errorMessage = '';
    document.body.style.overflow = '';
    this.close.emit();
  }

  confirmarProgramacion(): void {
    if (!this.pickup || !this.selectedFecha || !this.selectedHora) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    const camionSeleccionado = this.camionesDisponibles.find(c => c.patente === this.actionCamionPatente) || this.camionesDisponibles[0];
    const camionId = camionSeleccionado ? camionSeleccionado.id : 1;
    const isoDateTime = `${this.selectedFecha}T${this.selectedHora}:00`;

    this.bffService.programarPickup(this.pickup.id, {
      camionId: camionId,
      camionPatente: this.actionCamionPatente,
      fechaProgramada: isoDateTime
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.actionCompleted.emit();
        this.onClose();
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'No se pudo registrar la programación en el microservicio.';
      }
    });
  }
}
