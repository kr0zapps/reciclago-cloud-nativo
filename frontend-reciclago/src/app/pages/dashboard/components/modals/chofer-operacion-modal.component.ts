import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BffService } from '../../../../services/bff.service';
import { Pickup } from '../../data/sectors.data';

@Component({
  selector: 'app-chofer-operacion-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen"
         (click)="onClose()"
         class="fixed inset-0 z-[9999] overflow-y-auto bg-[#041D2D]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel p-6 sm:p-7 text-slate-800 my-auto">
        
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
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Operación de Cabina</span>
              <h3 class="font-heading font-extrabold text-lg sm:text-xl text-[#123F5B]">
                {{ actionType === 'en-ruta' ? 'Iniciar Ruta' : 'Confirmar Retiro' }} #{{ pickup?.id }}
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
          <span *ngIf="pickup?.camionPatente" class="ml-2 text-slate-400">• Camión: <strong>{{ pickup?.camionPatente }}</strong></span>
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
        <div *ngIf="actionType === 'en-ruta' && pickup?.estado !== 'SOLICITADO'" class="space-y-2 text-left p-3 rounded-2xl bg-sky-50/70 border border-sky-200/70">
          <p class="text-sm font-bold text-[#123F5B]">¿Confirmar despacho del camión a ruta?</p>
          <p class="text-xs text-slate-600 leading-relaxed">
            Se notificará al sistema municipal y el estado pasará a <strong>EN_RUTA</strong>, habilitando la telemetría GPS y la notificación ciudadana.
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
                  class="btn-stitch-primary px-5 py-2.5 text-xs font-bold cursor-pointer">
            <span *ngIf="!isSubmitting">Confirmar Operación</span>
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

  @Output() close = new EventEmitter<void>();
  @Output() actionCompleted = new EventEmitter<void>();

  isSubmitting = false;
  errorMessage = '';
  errorTitle = 'Aviso de Cabina';

  constructor(private bffService: BffService) {}

  get isBlocked(): boolean {
    return this.actionType === 'en-ruta' && this.pickup?.estado === 'SOLICITADO';
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
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
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
