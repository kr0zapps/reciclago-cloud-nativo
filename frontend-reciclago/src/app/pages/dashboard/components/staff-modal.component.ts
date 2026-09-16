import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BffService } from '../../../services/bff.service';
import { Camion } from '../data/sectors.data';

@Component({
  selector: 'app-staff-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen"
         (click)="onClose()"
         class="fixed inset-0 z-[9999] overflow-y-auto bg-[#041D2D]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel p-6 sm:p-7 text-slate-800 my-auto">
        
        <!-- Franja de acento superior institucional -->
        <div class="h-1.5 -mx-7 -mt-7 mb-5 bg-gradient-to-r from-[#4F8A3D] via-[#38BDF8] to-[#123F5B]"></div>

        <!-- Encabezado del modal -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-[#EEF5EB] text-[#4F8A3D] flex items-center justify-center text-sm font-bold shadow-2xs border border-[#CCE4C8]">
              <i class="fa-solid fa-clipboard-check"></i>
            </div>
            <h3 class="font-heading font-extrabold text-lg sm:text-xl text-[#123F5B]">
              Operación: {{ actionType | uppercase }} #{{ pickup?.id }}
            </h3>
          </div>
          <button (click)="onClose()" type="button" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs transition-colors cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="p-2.5 rounded-xl bg-[#F8FAF7] border border-[#E2E9E4] mb-4 text-xs text-slate-600">
          <span class="font-bold text-[#123F5B] block truncate">{{ pickup?.direccion }}</span>
          <span class="text-slate-500">Material: <strong class="text-emerald-700">{{ pickup?.residuoNombre }}</strong></span>
        </div>

        <!-- Formulario dinámico según acción -->
        <div *ngIf="actionType === 'programar'" class="space-y-3.5 text-left">
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
        </div>

        <div *ngIf="actionType === 'en-ruta'" class="space-y-2 text-left p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70">
          <p class="text-sm font-bold text-amber-950">¿Confirmar despacho del camión a ruta?</p>
          <p class="text-xs text-amber-900 leading-relaxed">Se notificará al sistema y el estado del retiro pasará a <strong>EN_RUTA</strong>, habilitando la telemetría GPS.</p>
        </div>

        <div *ngIf="actionType === 'retirado'" class="space-y-2 text-left p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70">
          <p class="text-sm font-bold text-emerald-950">¿Confirmar recolección en puerta?</p>
          <p class="text-xs text-emerald-900 leading-relaxed">El residuo ha sido retirado del frontis del domicilio del vecino y queda listo para pesaje en báscula.</p>
        </div>

        <div *ngIf="actionType === 'pesado'" class="space-y-3 text-left">
          <div class="p-3 rounded-2xl bg-[#EEF5EB] border border-[#CCE4C8] text-center">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#4F8A3D] block">Pesaje Digital Certificado en Camión</span>
            <div class="flex items-center justify-center gap-2 mt-2">
              <input type="number" step="0.1" min="0.1" [(ngModel)]="actionPesoKg" class="input-stitch w-36 py-2.5 px-3 text-2xl font-black text-center text-[#123F5B] bg-white" placeholder="Ej: 8.5">
              <span class="text-lg font-bold text-slate-500">kg</span>
            </div>
          </div>
          <p class="text-xs text-slate-500 text-center">
            <i class="fa-solid fa-satellite-dish text-emerald-600 mr-1"></i> Se emitirá evento a Kafka (<code>pickups.events</code>) para balance de huella ecológica.
          </p>
        </div>

        <div *ngIf="actionType === 'cancelar'" class="space-y-3 text-left">
          <label class="block text-xs font-bold uppercase tracking-wider text-[#123F5B]">Motivo de Cancelación</label>
          <input type="text" [(ngModel)]="actionMotivo" class="input-stitch w-full py-2 px-3 text-sm" placeholder="Ej: Domicilio cerrado o reprogramado">
        </div>

        <!-- Botonera inferior -->
        <div class="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button (click)="onClose()" type="button" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
            Cancelar
          </button>
          <button (click)="executePickupAction()" [disabled]="isSubmittingAction" type="button" class="btn-stitch-primary px-5 py-2.5 text-xs font-bold cursor-pointer">
            <span *ngIf="!isSubmittingAction">Confirmar Operación</span>
            <span *ngIf="isSubmittingAction"><i class="fa-solid fa-spinner fa-spin"></i> Guardando...</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class StaffModalComponent implements OnChanges, OnDestroy {
  @Input() isOpen: boolean = false;
  @Input() pickup: any = null;
  @Input() actionType: 'programar' | 'en-ruta' | 'retirado' | 'pesado' | 'cancelar' = 'programar';
  @Input() camionesDisponibles: Camion[] | any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() actionCompleted = new EventEmitter<void>();

  actionPesoKg = 5.0;
  actionMotivo = '';
  actionCamionPatente = 'PV-RC-2026';
  actionFechaProgramada = '';
  isSubmittingAction = false;

  constructor(private bffService: BffService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    if (changes['pickup'] && this.pickup) {
      this.actionPesoKg = Number(this.pickup.kilosRecolectados) || 5.0;
      this.actionMotivo = '';
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
    document.body.style.overflow = '';
    this.close.emit();
  }

  executePickupAction(): void {
    if (!this.pickup) return;
    const id = this.pickup.id;
    this.isSubmittingAction = true;

    let obs;
    if (this.actionType === 'programar') {
      const camionSeleccionado = this.camionesDisponibles.find(c => c.patente === this.actionCamionPatente) || this.camionesDisponibles[0];
      const camionId = camionSeleccionado ? camionSeleccionado.id : 1;
      obs = this.bffService.programarPickup(id, {
        camionId: camionId,
        camionPatente: this.actionCamionPatente,
        fechaProgramada: this.actionFechaProgramada
      });
    } else if (this.actionType === 'en-ruta') {
      obs = this.bffService.enRutaPickup(id);
    } else if (this.actionType === 'retirado') {
      obs = this.bffService.retiradoPickup(id);
    } else if (this.actionType === 'pesado') {
      obs = this.bffService.pesadoPickup(id, Number(this.actionPesoKg));
    } else if (this.actionType === 'cancelar') {
      obs = this.bffService.cancelarPickup(id, this.actionMotivo);
    }

    if (obs) {
      obs.subscribe({
        next: () => {
          this.isSubmittingAction = false;
          this.actionCompleted.emit();
          this.onClose();
        },
        error: (err) => {
          this.isSubmittingAction = false;
          alert('Error al actualizar retiro: ' + (err.error?.error || err.message || 'Error de comunicación'));
        }
      });
    } else {
      this.isSubmittingAction = false;
    }
  }
}
