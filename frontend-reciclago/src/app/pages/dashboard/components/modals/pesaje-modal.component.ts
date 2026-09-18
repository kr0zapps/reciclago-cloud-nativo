import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';
import { BffService } from '../../../../services/bff.service';
import { Pickup } from '../../data/sectors.data';

@Component({
  selector: 'app-pesaje-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen"
         (click)="onClose()"
         role="dialog"
         aria-modal="true"
         aria-labelledby="modal-pesaje-title"
         class="fixed inset-0 z-[9999] overflow-y-auto bg-[#041D2D]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-h-screen anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel p-6 sm:p-7 text-slate-800 my-auto">
        
        <!-- Franja de acento superior institucional -->
        <div class="h-1.5 -mx-7 -mt-7 mb-5 bg-gradient-to-r from-[#4F8A3D] via-[#84CC16] to-[#123F5B]"></div>

        <!-- Encabezado del modal -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-emerald-50 text-[#4F8A3D] flex items-center justify-center text-sm font-bold shadow-2xs border border-emerald-200">
              <i class="fa-solid fa-scale-balanced"></i>
            </div>
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider text-[#4F8A3D] block">Báscula Digital de Terreno</span>
              <h3 id="modal-pesaje-title" class="font-heading font-extrabold text-lg sm:text-xl text-[#123F5B]">
                Pesaje Oficial #{{ pickup?.id }}
              </h3>
            </div>
          </div>
          <button (click)="onClose()" type="button" aria-label="Cerrar modal de pesaje" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs transition-colors cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="p-2.5 rounded-xl bg-[#F8FAF7] border border-[#E2E9E4] mb-4 text-xs text-slate-600">
          <span class="font-bold text-[#123F5B] block truncate">{{ pickup?.direccion }}</span>
          <span class="text-slate-500">Material: <strong class="text-emerald-700">{{ pickup?.residuoNombre || 'Reciclaje' }}</strong></span>
          <span *ngIf="pickup?.pesoEstimadoKg" class="ml-2 text-slate-400">• Est. Vecino: <strong>{{ pickup?.pesoEstimadoKg }} kg</strong></span>
        </div>

        <!-- Formulario de Pesaje Báscula Digital -->
        <div class="space-y-3 text-left">
          <div class="p-4 rounded-2xl bg-[#EEF5EB] border border-[#CCE4C8] text-center">
            <label for="actionPesoKgInput" class="text-[11px] font-bold uppercase tracking-wider text-[#4F8A3D] block cursor-pointer">
              Pesaje Digital Certificado en Camión
            </label>
            <div class="flex items-center justify-center gap-2 mt-2.5">
              <input id="actionPesoKgInput"
                     type="number"
                     step="0.1"
                     min="0.1"
                     max="5000"
                     [(ngModel)]="actionPesoKg"
                     class="input-stitch w-36 py-2 px-3 text-2xl font-black text-center text-[#123F5B] bg-white shadow-2xs"
                     placeholder="Ej: 8.5"
                     aria-label="Kilos recolectados certificados">
              <span class="text-lg font-bold text-slate-500">kg</span>
            </div>

            <!-- Botones de Pesaje Rápido en Terreno -->
            <div class="flex items-center justify-center gap-1.5 flex-wrap mt-3">
              <button *ngFor="let w of [2.0, 5.0, 8.5, 12.0, 15.0, 25.0]"
                      (click)="actionPesoKg = w"
                      type="button"
                      class="px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer"
                      [ngClass]="actionPesoKg === w ? 'bg-[#4F8A3D] text-white border-[#4F8A3D]' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'">
                {{ w }} kg
              </button>
            </div>
          </div>
          <p class="text-xs text-slate-500 text-center">
            <i class="fa-solid fa-satellite-dish text-emerald-600 mr-1"></i> Se emitirá evento a Kafka y comando de certificado a RabbitMQ (<code>q.cmd.certificate</code>).
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
            Cancelar
          </button>
          <button (click)="guardarPesaje()"
                  [disabled]="isSubmitting || isInvalidPeso"
                  type="button"
                  class="btn-stitch-primary px-5 py-2.5 text-xs font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
            <span *ngIf="!isSubmitting">Certificar Pesaje</span>
            <span *ngIf="isSubmitting"><i class="fa-solid fa-spinner fa-spin"></i> Guardando...</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class PesajeModalComponent implements OnChanges, OnDestroy {
  @Input() isOpen: boolean = false;
  @Input() pickup: Pickup | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() actionCompleted = new EventEmitter<void>();

  actionPesoKg = 5.0;
  isSubmitting = false;
  errorMessage = '';
  errorTitle = 'Aviso de Báscula';

  constructor(private bffService: BffService) {}

  get isInvalidPeso(): boolean {
    const val = Number(this.actionPesoKg);
    return !this.actionPesoKg || isNaN(val) || val <= 0 || val > 5000;
  }

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
      this.actionPesoKg = Number(this.pickup.kilosRecolectados) || Number(this.pickup.pesoEstimadoKg) || 5.0;
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

  guardarPesaje(): void {
    if (!this.pickup) return;
    const id = this.pickup.id;
    this.isSubmitting = true;
    this.errorMessage = '';

    if (this.isInvalidPeso) {
      this.errorTitle = 'Peso Inválido';
      this.errorMessage = 'Debe ingresar un pesaje válido mayor a 0 kg y menor a 5.000 kg.';
      this.isSubmitting = false;
      return;
    }

    const peso = Number(this.actionPesoKg);

    let obs;
    if (this.pickup.estado === 'EN_RUTA') {
      // Si aún está en ruta, encadena secuencialmente retirado y luego pesado
      obs = this.bffService.retiradoPickup(id).pipe(
        switchMap(() => this.bffService.pesadoPickup(id, peso))
      );
    } else {
      obs = this.bffService.pesadoPickup(id, peso);
    }

    obs.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.actionCompleted.emit();
        this.onClose();
      },
      error: (err) => {
        this.isSubmitting = false;
        const raw = err?.error?.error || err?.error?.message || err?.message || '';
        if (raw.includes('RETIRADO')) {
          this.errorTitle = 'Retiro Pendiente';
          this.errorMessage = 'Debes confirmar primero el retiro físico en puerta antes de certificar el pesaje.';
        } else {
          this.errorTitle = 'Error en Báscula';
          this.errorMessage = 'No se pudo guardar el pesaje en el microservicio de retiros.';
        }
      }
    });
  }
}
