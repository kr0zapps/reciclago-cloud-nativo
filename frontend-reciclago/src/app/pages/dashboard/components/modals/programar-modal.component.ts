import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BffService } from '../../../../services/bff.service';
import { Camion, Pickup, Sector, DEFAULT_SECTORES } from '../../data/sectors.data';

interface DateOption {
  value: string;       // YYYY-MM-DD
  label: string;       // "Martes 22 Sept"
  diaSemana: string;   // "Martes"
  fullLabel: string;   // "Martes 22 de Septiembre"
}

interface TimeSlot {
  value: string;       // "09:30"
  label: string;       // "09:30 hrs"
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
                {{ isEditMode ? 'Editar Programación (Antes de Iniciar Ruta)' : (isRetiroEspecial ? 'Despacho de Servicio Especial' : 'Planificación Logística Comunal') }}
              </span>
              <h3 class="font-heading font-extrabold text-lg sm:text-xl text-[#123F5B]">
                {{ isEditMode ? 'Editar Programación' : 'Programar Retiro' }} #{{ pickup?.id }}
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
            <span class="px-2 py-0.5 rounded-md font-bold text-xs bg-emerald-100 text-emerald-900 border border-emerald-200 flex-shrink-0">
              {{ materialName }}
            </span>
          </div>
          <div class="flex items-center gap-2 mt-1 text-[11px] text-slate-500 flex-wrap">
            <span>Sector detectado: <strong class="text-slate-700">{{ sectorName }}</strong></span>
            <span *ngIf="pickup?.pesoEstimadoKg">• Est: <strong class="text-slate-700">{{ pickup?.pesoEstimadoKg }} kg</strong></span>
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

        <!-- 2. TARJETA INFORMATIVA DE REGLAS DE DÍAS Y HORAS -->
        <div class="p-3.5 rounded-2xl mb-4 text-xs border"
             [ngClass]="isRetiroEspecial ? 'bg-amber-50/80 border-amber-200 text-amber-950' : 'bg-sky-50/80 border-sky-200 text-[#123F5B]'">
          <div class="flex items-start gap-2.5">
            <i [ngClass]="isRetiroEspecial ? 'fa-solid fa-calendar-star text-amber-600' : 'fa-solid fa-circle-info text-sky-600'" class="text-sm mt-0.5 flex-shrink-0"></i>
            <div>
              <span class="font-bold block text-[13px]">
                {{ isRetiroEspecial ? 'Servicio Especial de Voluminosos' : 'Calendario Comunal: ' + materialName }}
              </span>
              <p class="text-[11px] mt-0.5 leading-relaxed opacity-90">
                <span *ngIf="!isRetiroEspecial">
                  En <strong>{{ sectorName }}</strong>, la recolección de <strong>{{ materialName }}</strong> opera exclusivamente los días <strong>{{ allowedDayNames.join(' o ') | uppercase }}</strong> en horario de <strong>{{ officialHoursRange }}</strong>.
                </span>
                <span *ngIf="isRetiroEspecial">
                  Los retiros especiales de voluminosos y fuera de calendario se coordinan en horario municipal oficial de <strong>09:00 a 14:00 hrs</strong> (Viernes y Sábados operativos).
                </span>
              </p>
            </div>
          </div>
        </div>

        <!-- 3. SELECTOR DE FECHAS OFICIALES PERMITIDAS -->
        <div class="space-y-3 text-left mb-4">
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-bold uppercase tracking-wider text-[#123F5B]">
                Fecha de Recolección
              </label>
              <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Día: {{ isRetiroEspecial ? 'Viernes / Sábado (Especial)' : allowedDayNames.join(', ') }}
              </span>
            </div>

            <!-- Chips de Fechas Oficiales Próximas (Sin opción a error) -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-1.5 mb-2">
              <button *ngFor="let d of nextDateOptions"
                      (click)="seleccionarFecha(d.value)"
                      type="button"
                      class="p-2 rounded-xl text-left border transition-all cursor-pointer"
                      [ngClass]="selectedFecha === d.value ? (isRetiroEspecial ? 'bg-amber-500 text-white border-amber-600 shadow-2xs font-bold' : 'bg-[#123F5B] text-white border-[#123F5B] shadow-2xs font-bold') : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'">
                <span class="text-[10px] opacity-80 uppercase block">{{ d.diaSemana }}</span>
                <span class="text-xs font-black block leading-tight">{{ d.label }}</span>
              </button>
            </div>

            <!-- Selector manual alternativo con validación estricta -->
            <div class="flex items-center gap-2">
              <input type="date"
                     [(ngModel)]="selectedFecha"
                     (ngModelChange)="onManualDateChange()"
                     class="input-stitch w-full py-2 px-3 text-xs font-bold"
                     [min]="minDate">
            </div>
          </div>

          <!-- 4. SELECTOR DE HORARIO OFICIAL (Slots Válidos) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-bold uppercase tracking-wider text-[#123F5B]">
                Franja Horaria Oficial
              </label>
              <span class="text-[10px] font-semibold text-slate-500">
                Turno: {{ isRetiroEspecial ? '09:00 – 14:00 hrs' : '08:00 – 17:00 hrs' }}
              </span>
            </div>

            <!-- Chips de Slots Horarios Permitidos -->
            <div class="flex items-center gap-1.5 flex-wrap mb-2">
              <button *ngFor="let slot of availableTimeSlots"
                      (click)="selectedHora = slot.value; onTimeChange()"
                      type="button"
                      class="px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer"
                      [ngClass]="selectedHora === slot.value ? (isRetiroEspecial ? 'bg-amber-600 text-white border-amber-600 shadow-2xs' : 'bg-[#4F8A3D] text-white border-[#4F8A3D] shadow-2xs') : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'">
                {{ slot.label }}
              </button>
            </div>

            <!-- Selector manual de hora con validación estricta de rango -->
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-500 font-semibold">Hora específica:</span>
              <input type="time"
                     [(ngModel)]="selectedHora"
                     (ngModelChange)="onTimeChange()"
                     class="input-stitch w-32 py-1.5 px-2.5 text-xs font-bold text-center">
            </div>
          </div>

          <!-- 5. SELECTOR DE CAMIÓN -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] mb-1">
              Camión Recolector Municipal
            </label>
            <select [(ngModel)]="actionCamionPatente" class="select-stitch w-full py-2 px-3 text-xs font-medium">
              <option *ngFor="let c of camionesDisponibles" [value]="c.patente">
                {{ c.patente }} — Cap: {{ c.capacidadKilos || c.capacidadMaximaKg || 1500 }} kg ({{ (c.estado === 'ACTIVO' || !c.estado) ? 'Operativo' : c.estado }})
              </option>
            </select>
          </div>
        </div>

        <!-- 6. BADGES DE VALIDACIÓN EN VIVO -->
        <div *ngIf="validationError" class="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-2 text-left anim-fade-up">
          <i class="fa-solid fa-triangle-exclamation text-rose-500 text-sm mt-0.5 flex-shrink-0"></i>
          <div>
            <span class="font-bold block">Restricción de Calendario Comunal</span>
            <span class="text-[11px] leading-tight block mt-0.5">{{ validationError }}</span>
          </div>
        </div>

        <div *ngIf="!validationError" class="mb-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 text-left">
          <i class="fa-solid fa-circle-check text-emerald-600 text-sm flex-shrink-0"></i>
          <span class="font-semibold text-[11px]">
            Fecha y hora conformes a la ordenanza ({{ selectedFecha }} a las {{ selectedHora }} hrs).
          </span>
        </div>

        <!-- Botonera inferior -->
        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button (click)="onClose()" type="button" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
            Cancelar
          </button>
          <button (click)="confirmarProgramacion()"
                  [disabled]="isSubmitting || !!validationError"
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
  minDate: string = '';

  nextDateOptions: DateOption[] = [];
  availableTimeSlots: TimeSlot[] = [];

  constructor(private bffService: BffService) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

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

  get validationError(): string | null {
    if (!this.selectedFecha) return 'Debes seleccionar una fecha oficial de recolección.';
    if (!this.selectedHora) return 'Debes indicar una hora dentro del turno operativo.';

    const [y, m, d] = this.selectedFecha.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayOfWeek = dateObj.getDay();

    const [hStr, mStr] = this.selectedHora.split(':');
    const hourDec = Number(hStr) + (Number(mStr) || 0) / 60;

    if (!this.isRetiroEspecial) {
      // 1. Validar día oficial para el sector/material
      if (!this.allowedDayNumbers.includes(dayOfWeek)) {
        return `Día no permitido: Para ${this.materialName} en ${this.sectorName} solo se atiende los días ${this.allowedDayNames.join(' o ').toUpperCase()}. Si necesitas retirar otro día, activa "Retiro Especial DIMAO".`;
      }
      // 2. Validar rango horario de recolección regular (08:00 a 17:00)
      if (hourDec < 8.0 || hourDec > 17.0) {
        return `Hora fuera de rango: El horario de recolección municipal para ${this.materialName} es estrictamente de 08:00 a 17:00 hrs. La hora ingresada (${this.selectedHora}) no es válida.`;
      }
    } else {
      // Retiro Especial
      // Horario estricto: 09:00 a 14:00
      if (hourDec < 9.0 || hourDec > 14.0) {
        return `Hora fuera de rango: El servicio de Retiro Especial DIMAO opera estrictamente de 09:00 a 14:00 hrs. La hora ingresada (${this.selectedHora}) no es válida.`;
      }
      if (dayOfWeek === 0) {
        return 'Día no permitido: El servicio municipal no realiza operativos los días domingo.';
      }
    }

    return null;
  }

  get isEditMode(): boolean {
    return this.pickup?.estado === 'PROGRAMADO';
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
      // Detectar si el vecino ya había pedido retiro especial en observaciones
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
          }
          if (parts[1]) {
            this.selectedHora = parts[1].substring(0, 5);
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

    while (dates.length < 3) {
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
          fullLabel: `${dayName} ${d} de ${months[checkDate.getMonth()]}`
        });
      }
      checkDate.setDate(checkDate.getDate() + 1);
    }

    this.nextDateOptions = dates;
  }

  computeAvailableTimeSlots(): void {
    if (this.isRetiroEspecial) {
      // Horario especial caso: 09:00 a 14:00 hrs
      this.availableTimeSlots = [
        { value: '09:00', label: '09:00', periodo: 'Apertura' },
        { value: '10:00', label: '10:00', periodo: 'Mañana' },
        { value: '11:30', label: '11:30', periodo: 'Mediodía' },
        { value: '12:45', label: '12:45', periodo: 'Tarde' },
        { value: '13:30', label: '13:30', periodo: 'Cierre' }
      ];
    } else {
      // Horario regular caso: 08:00 a 17:00 hrs
      this.availableTimeSlots = [
        { value: '08:30', label: '08:30', periodo: 'Mañana' },
        { value: '09:30', label: '09:30', periodo: 'Mañana' },
        { value: '10:30', label: '10:30', periodo: 'Media Mañana' },
        { value: '11:30', label: '11:30', periodo: 'Mediodía' },
        { value: '14:00', label: '14:00', periodo: 'Tarde' },
        { value: '15:30', label: '15:30', periodo: 'Media Tarde' },
        { value: '16:30', label: '16:30', periodo: 'Cierre de Ruta' }
      ];
    }
  }

  seleccionarFecha(fechaVal: string): void {
    this.selectedFecha = fechaVal;
  }

  onManualDateChange(): void {
    // La validación reactiva en validationError se encarga del feedback en vivo
  }

  onTimeChange(): void {
    // La validación reactiva en validationError se encarga del feedback en vivo
  }

  onClose(): void {
    this.errorMessage = '';
    document.body.style.overflow = '';
    this.close.emit();
  }

  confirmarProgramacion(): void {
    if (!this.pickup || this.validationError) return;
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
