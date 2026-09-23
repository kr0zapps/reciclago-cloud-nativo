import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BffService } from '../../../../services/bff.service';
import { Pickup } from '../../data/sectors.data';

@Component({
  selector: 'app-cancelar-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen"
         (click)="onClose()"
         role="dialog"
         aria-modal="true"
         aria-labelledby="modal-cancelar-title"
         class="fixed inset-0 z-[9999] overflow-y-auto bg-[#041D2D]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel p-6 sm:p-7 text-slate-800 my-auto">
        
        <!-- Franja de acento superior institucional -->
        <div class="h-1.5 -mx-7 -mt-7 mb-5 bg-red-600"></div>

        <!-- Encabezado del modal -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-sm font-bold shadow-2xs border border-rose-200">
              <i class="fa-solid fa-ban"></i>
            </div>
            <div>
              <h3 id="modal-cancelar-title" class="font-heading font-extrabold text-lg sm:text-xl text-[#123F5B]">
                Cancelar Solicitud #{{ pickup?.id }}
              </h3>
            </div>
          </div>
          <button (click)="onClose()" type="button" aria-label="Cerrar modal de cancelación" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs transition-colors cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="p-2.5 rounded-xl bg-[#F8FAF7] border border-[#E2E9E4] mb-4 text-xs text-slate-600">
          <span class="font-bold text-[#123F5B] block truncate">{{ pickup?.direccion }}</span>
          <span class="text-slate-500">Material: <strong class="text-rose-700">{{ pickup?.residuoNombre || 'Reciclaje' }}</strong></span>
          <span *ngIf="pickup?.estado" class="ml-2 text-slate-400">• Estado actual: <strong>{{ pickup?.estado }}</strong></span>
        </div>

        <!-- Formulario de Cancelación -->
        <div class="space-y-3.5 text-left">
          <div>
            <label for="motivoCancelacionInput" class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] mb-1">
              Motivo de Cancelación
            </label>
            <input id="motivoCancelacionInput"
                   type="text"
                   [(ngModel)]="actionMotivo"
                   class="input-stitch w-full py-2 px-3 text-sm"
                   placeholder="Ej: Domicilio cerrado, material inadecuado o reprogramado"
                   aria-required="true">
          </div>
          <p class="text-xs text-slate-500">
            <i class="fa-solid fa-triangle-exclamation text-amber-500 mr-1"></i> Esta acción cancela la orden y notificará al vecino por correo municipal.
          </p>
        </div>

        <!-- Banner de Error Sobrio -->
        <div *ngIf="errorMessage" role="alert" aria-live="polite" class="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5 text-left">
          <i class="fa-solid fa-circle-exclamation text-amber-600 text-base mt-0.5 flex-shrink-0"></i>
          <div class="flex-1 min-w-0">
            <span class="font-bold block text-sm text-amber-950">{{ errorTitle }}</span>
            <span class="text-xs text-amber-900 leading-relaxed mt-0.5 block">{{ errorMessage }}</span>
          </div>
          <button (click)="errorMessage = ''" type="button" aria-label="Cerrar aviso" class="text-amber-500 hover:text-amber-800 text-xs cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Botonera inferior -->
        <div class="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button (click)="onClose()" type="button" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
            Volver
          </button>
          <button (click)="confirmarCancelacion()" [disabled]="isSubmitting || !actionMotivo.trim()" type="button" class="px-5 py-2.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed">
            <span *ngIf="!isSubmitting">Confirmar Cancelación</span>
            <span *ngIf="isSubmitting"><i class="fa-solid fa-spinner fa-spin"></i> Cancelando...</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class CancelarModalComponent implements OnChanges, OnDestroy {
  @Input() isOpen: boolean = false;
  @Input() pickup: Pickup | null = null;

  @Output() modalClose = new EventEmitter<void>();
  @Output() actionCompleted = new EventEmitter<void>();

  actionMotivo = '';
  isSubmitting = false;
  errorMessage = '';
  errorTitle = 'Aviso de Cancelación';

  constructor(private readonly bffService: BffService) {}

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.isOpen && !this.isSubmitting) {
      this.onClose();
    }
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
      this.actionMotivo = '';
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  onClose(): void {
    this.errorMessage = '';
    document.body.style.overflow = '';
    this.modalClose.emit();
  }

  confirmarCancelacion(): void {
    if (!this.pickup || !this.actionMotivo.trim()) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    this.bffService.cancelarPickup(this.pickup.id, this.actionMotivo).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.actionCompleted.emit();
        this.onClose();
      },
      error: (err) => {
        this.isSubmitting = false;
        const raw = err?.error?.error || err?.error?.message || err?.message || '';
        if (raw.includes('RETIRADO') || raw.includes('PESADO')) {
          this.errorTitle = 'Cancelación No Permitida';
          this.errorMessage = 'No es posible cancelar un retiro que ya fue completado o pesado en terreno.';
        } else {
          this.errorTitle = 'Error al Cancelar';
          this.errorMessage = 'No se pudo registrar la cancelación en el microservicio.';
        }
      }
    });
  }
}
