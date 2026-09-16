import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BffService } from '../../../../services/bff.service';
import { Camion, Pickup } from '../../data/sectors.data';

@Component({
  selector: 'app-programar-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen"
         (click)="onClose()"
         class="fixed inset-0 z-[9999] overflow-y-auto bg-[#041D2D]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel p-6 sm:p-7 text-slate-800 my-auto">
        
        <!-- Franja de acento superior institucional -->
        <div class="h-1.5 -mx-7 -mt-7 mb-5 bg-gradient-to-r from-[#1F6685] via-[#38BDF8] to-[#123F5B]"></div>

        <!-- Encabezado del modal -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-sky-50 text-[#1F6685] flex items-center justify-center text-sm font-bold shadow-2xs border border-sky-200">
              <i class="fa-regular fa-calendar-check"></i>
            </div>
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider text-[#1F6685] block">Coordinación Logística</span>
              <h3 class="font-heading font-extrabold text-lg sm:text-xl text-[#123F5B]">
                Programar Retiro #{{ pickup?.id }}
              </h3>
            </div>
          </div>
          <button (click)="onClose()" type="button" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs transition-colors cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="p-2.5 rounded-xl bg-[#F8FAF7] border border-[#E2E9E4] mb-4 text-xs text-slate-600">
          <span class="font-bold text-[#123F5B] block truncate">{{ pickup?.direccion }}</span>
          <span class="text-slate-500">Material: <strong class="text-emerald-700">{{ pickup?.residuoNombre || 'Reciclaje' }}</strong></span>
          <span *ngIf="pickup?.pesoEstimadoKg" class="ml-2 text-slate-400">• Est: <strong>{{ pickup?.pesoEstimadoKg }} kg</strong></span>
        </div>

        <!-- Formulario de Programación -->
        <div class="space-y-3.5 text-left">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] mb-1">Fecha y Hora Programada</label>
            <input type="datetime-local" [(ngModel)]="actionFechaProgramada" class="input-stitch w-full py-2 px-3 text-sm font-medium">
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] mb-1">Camión Recolector Municipal</label>
            <select [(ngModel)]="actionCamionPatente" class="select-stitch w-full py-2 px-3 text-sm font-medium">
              <option *ngFor="let c of camionesDisponibles" [value]="c.patente">
                {{ c.patente }} — Cap: {{ c.capacidadKilos || c.capacidadMaximaKg || 1500 }} kg ({{ (c.estado === 'ACTIVO' || !c.estado) ? 'Operativo' : c.estado }})
              </option>
            </select>
          </div>

          <p class="text-xs text-slate-500">
            <i class="fa-solid fa-info-circle text-sky-600 mr-1"></i> Al programar, el estado pasa a <strong>PROGRAMADO</strong> y la orden queda habilitada para que el Chofer inicie ruta.
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
            Cancelar
          </button>
          <button (click)="confirmarProgramacion()" [disabled]="isSubmitting" type="button" class="btn-stitch-primary px-5 py-2.5 text-xs font-bold cursor-pointer">
            <span *ngIf="!isSubmitting">Confirmar Programación</span>
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

  actionCamionPatente = 'PV-RC-2026';
  actionFechaProgramada = '';
  isSubmitting = false;
  errorMessage = '';
  errorTitle = 'Aviso de Programación';

  constructor(private bffService: BffService) {}

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
      if (this.camionesDisponibles && this.camionesDisponibles.length > 0) {
        this.actionCamionPatente = this.camionesDisponibles[0].patente;
      }
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.actionFechaProgramada = tomorrow.toISOString().slice(0, 16);
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  onClose(): void {
    this.errorMessage = '';
    document.body.style.overflow = '';
    this.close.emit();
  }

  confirmarProgramacion(): void {
    if (!this.pickup) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    const camionSeleccionado = this.camionesDisponibles.find(c => c.patente === this.actionCamionPatente) || this.camionesDisponibles[0];
    const camionId = camionSeleccionado ? camionSeleccionado.id : 1;

    this.bffService.programarPickup(this.pickup.id, {
      camionId: camionId,
      camionPatente: this.actionCamionPatente,
      fechaProgramada: this.actionFechaProgramada
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.actionCompleted.emit();
        this.onClose();
      },
      error: (err) => {
        this.isSubmitting = false;
        const raw = err?.error?.error || err?.error?.message || err?.message || '';
        if (raw.includes('SOLICITADO')) {
          this.errorTitle = 'Solicitud ya Procesada';
          this.errorMessage = 'Esta orden ya fue programada con anterioridad o ya se encuentra en ruta.';
        } else {
          this.errorTitle = 'Error al Programar';
          this.errorMessage = 'No se pudo registrar la programación en el microservicio.';
        }
      }
    });
  }
}
