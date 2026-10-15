import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BffService } from '../../../../services/bff.service';
import { Camion, Pickup, Sector } from '../../data/sectors.data';
import { detectSector, DAY_NAME_TO_NUMBER } from '../../utils/sector.utils';

export interface DateOption {
  value: string;       // YYYY-MM-DD
  label: string;       // "22 Sep"
  diaSemana: string;   // "Martes"
  fullLabel: string;   // "Martes 22 de Septiembre"
  sublabel: string;    // "Próximo recorrido", "En 1 semana", etc.
}

export interface TimeSlot {
  value: string;
  label: string;
  periodo: string;
}

@Component({
  selector: 'app-programar-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen"
         (click)="onClose()"
         role="dialog"
         aria-modal="true"
         aria-labelledby="modal-programar-title"
         class="fixed inset-0 z-[9999] overflow-y-auto bg-[#041D2D]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-6 sm:p-7 text-slate-800 my-auto">
        
        <!-- Franja superior institucional -->
        <div class="h-1.5 -mx-7 -mt-7 mb-5 bg-[#123F5B]"></div>

        <!-- Encabezado del modal -->
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 id="modal-programar-title" class="font-heading font-bold text-lg sm:text-xl text-[#123F5B]">
              {{ isEditMode ? 'Editar Programación' : 'Programar Retiro' }} #{{ pickup?.id }}
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Asigna el camión y día correspondiente para el retiro de reciclaje.
            </p>
          </div>
          <button (click)="onClose()" type="button" aria-label="Cerrar modal" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs transition-colors cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Resumen del retiro -->
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-4 text-xs text-slate-600">
          <div class="flex items-center justify-between gap-2">
            <span class="font-semibold text-slate-800 truncate">{{ pickup?.direccion }}</span>
            <span class="font-medium text-slate-700">
              {{ materialName }}
            </span>
          </div>
          <div class="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
            <span>Sector: <strong class="text-slate-700 font-semibold">{{ sectorName }}</strong></span>
            <span *ngIf="pickup?.pesoEstimadoKg">• Estimado: <strong class="text-slate-700 font-semibold">{{ pickup?.pesoEstimadoKg }} kg</strong></span>
          </div>
        </div>

        <!-- Modalidad de Servicio -->
        <div class="mb-4">
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">
            Modalidad de servicio
          </label>
          <div class="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button (click)="setModalidad(false)"
                    type="button"
                    class="py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    [ngClass]="!isRetiroEspecial ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'">
              Recorrido regular
            </button>
            <button (click)="setModalidad(true)"
                    type="button"
                    class="py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    [ngClass]="isRetiroEspecial ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'">
              Retiro especial DIMAO
            </button>
          </div>
        </div>

        <!-- Selector Intuitivo 1: Día de Retiro (Táctil) -->
        <div class="mb-4">
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">
            Día de retiro programado
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button *ngFor="let d of nextDateOptions"
                    (click)="selectedFecha = d.value"
                    type="button"
                    class="p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between"
                    [ngClass]="selectedFecha === d.value
                      ? 'bg-[#ecf7e6] border-[#22a652] text-slate-900 shadow-2xs ring-1 ring-[#22a652]'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold">{{ d.diaSemana }} {{ d.label }}</span>
                <i *ngIf="selectedFecha === d.value" class="fa-solid fa-circle-check text-[#22a652] text-xs"></i>
              </div>
              <span class="text-[10px] text-slate-500 mt-1">{{ d.sublabel }}</span>
            </button>
          </div>
          <p class="text-[11px] text-slate-500 mt-1">
            Días oficiales para {{ sectorName }}: {{ allowedDayNames.join(', ') }} ({{ officialHoursRange }}).
          </p>
        </div>

        <!-- Selector Intuitivo 2: Camión Asignado (Táctil) -->
        <div class="mb-4">
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">
            Camión recolector asignado
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button *ngFor="let c of camionesDisponibles"
                    (click)="seleccionarCamion(c)"
                    [disabled]="c.estado === 'MANTENIMIENTO'"
                    type="button"
                    class="p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between"
                    [ngClass]="c.estado === 'MANTENIMIENTO'
                      ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200'
                      : (actionCamionPatente === c.patente
                        ? 'bg-[#ecf7e6] border-[#22a652] text-slate-900 shadow-2xs ring-1 ring-[#22a652]'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300')">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-truck text-xs" [ngClass]="actionCamionPatente === c.patente ? 'text-[#22a652]' : 'text-slate-400'"></i>
                <div>
                  <span class="text-xs font-mono font-bold block">{{ c.patente }}</span>
                  <span class="text-[10px] text-slate-500">{{ c.capacidadKilos || c.capacidadMaximaKg || 1500 }} kg</span>
                </div>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-[10px] font-medium" [ngClass]="c.estado === 'EN_RUTA' ? 'text-amber-700' : 'text-slate-500'">
                  {{ c.estado === 'MANTENIMIENTO' ? 'En taller' : (c.estado === 'EN_RUTA' ? 'En ruta' : 'Disponible') }}
                </span>
                <i *ngIf="actionCamionPatente === c.patente" class="fa-solid fa-circle-check text-[#22a652] text-xs"></i>
              </div>
            </button>
          </div>
        </div>

        <!-- Resumen de Confirmación -->
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 mb-5">
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Día asignado:</span>
            <span class="font-semibold text-slate-900">{{ selectedFechaFullText }}</span>
          </div>
          <div class="flex items-center justify-between mt-1 pt-1 border-t border-slate-200">
            <span class="text-slate-500">Camión:</span>
            <span class="font-semibold text-slate-900">{{ actionCamionPatente }}</span>
          </div>
        </div>

        <!-- Banner de Error -->
        <div *ngIf="errorMessage" role="alert" class="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {{ errorMessage }}
        </div>

        <!-- Botonera inferior -->
        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <button (click)="onClose()" type="button" class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">
            Cancelar
          </button>
          <button (click)="confirmarProgramacion()"
                  [disabled]="isSubmitting"
                  type="button"
                  class="btn-stitch-primary px-5 py-2 text-xs font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
            <span *ngIf="!isSubmitting">{{ isEditMode ? 'Guardar cambios' : 'Confirmar programación' }}</span>
            <span *ngIf="isSubmitting">Guardando...</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProgramarModalComponent implements OnChanges, OnDestroy {
  @Input() isOpen: boolean = false;
  @Input() pickup: Pickup | null = null;
  @Input() camionesDisponibles: Camion[] = [];

  @Output() modalClose = new EventEmitter<void>();
  @Output() actionCompleted = new EventEmitter<void>();

  isRetiroEspecial: boolean = false;
  selectedFecha: string = '';
  actionCamionPatente: string = 'PV-RC-2026';
  isSubmitting: boolean = false;
  errorMessage: string = '';

  nextDateOptions: DateOption[] = [];

  constructor(private readonly bffService: BffService) {}

  get materialName(): string {
    return this.pickup?.residuoNombre || 'Vidrio';
  }

  get sectorDetected(): Sector {
    return detectSector(this.pickup?.direccion || '', this.materialName);
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
      return [5, 6];
    }
    const target = DAY_NAME_TO_NUMBER[this.sectorDetected.dia.toLowerCase()] ?? 2;
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

  private handleIsOpenChange(): void {
    this.errorMessage = '';
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  private handlePickupChange(): void {
    if (!this.pickup) return;
    this.errorMessage = '';
    const obs = (this.pickup.comentarios || '').toUpperCase();
    this.isRetiroEspecial = obs.includes('ESPECIAL');
    this.updateConfiguration();

    if (this.isEditMode) {
      if (this.pickup.camionPatente) {
        this.actionCamionPatente = this.getValidCamionPatente(this.pickup.camionPatente);
      }
      if (this.pickup.fechaProgramada) {
        const parts = String(this.pickup.fechaProgramada).split('T');
        if (parts[0]) {
          this.selectedFecha = parts[0];
          this.ensureFechaInOptions(parts[0]);
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      this.handleIsOpenChange();
    }
    if (changes['camionesDisponibles']) {
      this.actionCamionPatente = this.getValidCamionPatente(this.actionCamionPatente);
    }
    if (changes['pickup'] && this.pickup) {
      this.handlePickupChange();
    }
  }

  seleccionarCamion(c: Camion): void {
    if (c.estado === 'MANTENIMIENTO') return;
    this.actionCamionPatente = c.patente;
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.isOpen && !this.isSubmitting) {
      this.onClose();
    }
  }

  getValidCamionPatente(desiredPatente: string): string {
    const list = this.camionesDisponibles || [];
    const desired = list.find(c => c.patente === desiredPatente);
    if (desired && desired.estado !== 'MANTENIMIENTO') {
      return desired.patente;
    }
    const primerDisponible = list.find(c => c.estado !== 'MANTENIMIENTO');
    return primerDisponible ? primerDisponible.patente : desiredPatente;
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

    if (this.nextDateOptions.length > 0) {
      this.selectedFecha = this.nextDateOptions[0].value;
    }

    if (this.isRetiroEspecial) {
      this.actionCamionPatente = this.getValidCamionPatente('PV-RC-2026');
    } else {
      this.actionCamionPatente = this.getValidCamionPatente(this.sectorDetected.patente || 'PV-RC-2026');
    }
  }

  computeNextDateOptions(): void {
    const dates: DateOption[] = [];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const now = new Date();

    let targetDays = this.allowedDayNumbers;
    if (!targetDays || targetDays.length === 0) {
      targetDays = [1, 2, 3, 4, 5];
    }
    let checkDate = new Date(now);
    checkDate.setDate(checkDate.getDate() + 1);

    const sublabels = ['Próximo recorrido', 'Semana siguiente', 'En 2 semanas', 'En 3 semanas'];
    let count = 0;
    let maxIterations = 60;

    while (dates.length < 4 && maxIterations-- > 0) {
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
        sublabel: 'Fecha actual asignada'
      });
    }
  }

  onClose(): void {
    this.errorMessage = '';
    document.body.style.overflow = '';
    this.modalClose.emit();
  }

  confirmarProgramacion(): void {
    if (!this.pickup || !this.selectedFecha) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    const camionSeleccionado = this.camionesDisponibles.find(c => c.patente === this.actionCamionPatente) || this.camionesDisponibles[0];
    if (camionSeleccionado?.estado === 'MANTENIMIENTO') {
      this.errorMessage = `El camión ${camionSeleccionado.patente} se encuentra en taller/mantenimiento. Seleccione una unidad disponible.`;
      this.isSubmitting = false;
      return;
    }
    const camionId = camionSeleccionado?.id ?? 1;
    const isoDateTime = `${this.selectedFecha}T08:00:00`;

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
      error: (err: any) => {
        this.isSubmitting = false;
        const detail = err?.error?.error || err?.error?.message || (typeof err?.error === 'string' ? err.error : null);
        this.errorMessage = detail || 'No se pudo registrar la programación en el microservicio.';
      }
    });
  }
}
