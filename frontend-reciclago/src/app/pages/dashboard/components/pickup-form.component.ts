import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BffService } from '../../../services/bff.service';
import { Sector, Residuo, Pickup } from '../data/sectors.data';

@Component({
  selector: 'app-pickup-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="solicitud-retiro" class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 mt-6">
      <div class="pb-5 mb-5 border-b border-slate-200">
        <h3 class="font-heading font-extrabold text-2xl text-[#123F5B]">
          Solicitar retiro domiciliario
        </h3>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Ingresa tu dirección y el material que deseas reciclar. El equipo municipal programará el camión para tu sector.
        </p>
      </div>

      <form (ngSubmit)="onSubmit()" class="space-y-5 text-slate-700">
        <!-- Banners de notificación -->
        <div *ngIf="submitStatus === 'success'" role="alert" class="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-xs sm:text-sm">
          <strong>¡Solicitud recibida!</strong> Tu retiro quedó registrado. El coordinador asignará el camión recolector para tu día operativo.
        </div>

        <div *ngIf="submitStatus === 'error'" role="alert" class="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-xs sm:text-sm">
          {{ errorMessage || 'Hubo un inconveniente al registrar la solicitud.' }}
        </div>

        <div *ngIf="generalError" role="alert" class="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl text-xs sm:text-sm">
          {{ generalError }}
        </div>

        <!-- 1. Dirección domiciliaria -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-semibold text-slate-700" for="direccion">
              Dirección en Puerto Varas
            </label>
            <button (click)="detectarCuadrante()" type="button" class="text-xs text-[#22a652] hover:underline cursor-pointer">
              {{ isDetectingCuadrante ? 'Detectando sector...' : 'Verificar cuadrante' }}
            </button>
          </div>
          <input [(ngModel)]="newPickup.direccion"
                 (blur)="detectarCuadrante()"
                 class="w-full h-11 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#22a652] focus:ring-1 focus:ring-[#22a652] transition-colors"
                 id="direccion"
                 name="direccion"
                 placeholder="Calle y número (ej: San Francisco 450)"
                 required
                 type="text" />
          <p *ngIf="detectedCuadrante" class="text-xs text-[#1b8e45] mt-1.5 font-medium">
            {{ detectedCuadrante }}
          </p>
          <p *ngIf="!detectedCuadrante && sector?.nombre" class="text-[11px] text-slate-500 mt-1">
            Sector activo: <strong class="text-slate-700">{{ sector?.nombre }}</strong>
          </p>
        </div>

        <!-- 2. Tipo de residuo a reciclar -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5" for="residuoNombre">
            Tipo de residuo reciclable
          </label>
          <div class="relative">
            <select [(ngModel)]="newPickup.residuoNombre"
                    (ngModelChange)="onResiduoChange($event)"
                    class="w-full h-11 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#22a652] focus:ring-1 focus:ring-[#22a652] transition-colors appearance-none cursor-pointer pr-10"
                    id="residuoNombre"
                    name="residuoNombre"
                    required>
              <option value="">Selecciona el tipo de residuo</option>
              <option *ngFor="let res of residuos" [value]="res.nombre">
                {{ res.nombre }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 text-xs">
              <i class="fa-solid fa-chevron-down"></i>
            </div>
          </div>
          <p class="text-[11px] text-slate-500 mt-1">
            Puedes solicitar el retiro de cualquier material reciclable en cualquier momento.
          </p>
        </div>

        <!-- 3. Peso estimado -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5" for="pesoEstimado">
            Cantidad estimada (kg)
          </label>
          <div class="flex flex-wrap items-center gap-3">
            <input [(ngModel)]="newPickup.pesoEstimadoKg"
                   class="w-24 h-11 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#22a652] focus:ring-1 focus:ring-[#22a652] transition-colors"
                   id="pesoEstimado"
                   name="pesoEstimado"
                   type="number"
                   step="0.5"
                   min="0.5"
                   max="500"
                   required />
            <div class="flex items-center gap-1.5">
              <button type="button"
                      *ngFor="let k of [2, 5, 10, 15, 25]"
                      (click)="setQuickWeight(k)"
                      class="px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer"
                      [ngClass]="newPickup.pesoEstimadoKg === k ? 'bg-[#22a652] text-white border-[#22a652]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
                {{ k }} kg
              </button>
            </div>
          </div>
          <p class="text-[11px] text-slate-500 mt-1">
            Aproximado. El pesaje exacto lo certifica el chofer en la báscula al momento del retiro.
          </p>
        </div>

        <!-- 4. Instrucciones o comentarios -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5" for="comentarios">
            Instrucciones de entrega (opcional)
          </label>
          <textarea [(ngModel)]="newPickup.comentarios"
                    class="w-full h-20 p-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#22a652] focus:ring-1 focus:ring-[#22a652] transition-colors resize-none"
                    id="comentarios"
                    name="comentarios"
                    placeholder="Ej: Dejado en el frontis junto al portón, timbre 2B..."></textarea>
        </div>

        <!-- Botón de Envío -->
        <div class="pt-3 flex justify-end">
          <button [disabled]="isSubmitting"
                  class="btn-stitch-primary px-6 py-2.5 bg-[#22a652] hover:bg-[#1b8e45] text-white rounded-lg font-semibold text-xs cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit">
            <span *ngIf="!isSubmitting">Solicitar retiro</span>
            <span *ngIf="isSubmitting">Enviando solicitud...</span>
          </button>
        </div>
      </form>
    </section>
  `
})
export class PickupFormComponent implements OnChanges {
  @Input() sector!: Sector | null;
  @Input() residuos: Residuo[] = [];
  @Input() userEmail: string = '';
  @Input() userName: string = '';

  @Output() pickupCreated = new EventEmitter<Pickup>();

  newPickup = {
    sector: '',
    direccion: '',
    residuoNombre: '',
    residuoId: 0,
    pesoEstimadoKg: 5.0,
    comentarios: ''
  };

  isDetectingCuadrante = false;
  detectedCuadrante = '';

  isSubmitting = false;
  submitStatus: 'idle' | 'success' | 'error' = 'idle';
  errorMessage = '';
  generalError = '';

  constructor(private readonly bffService: BffService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sector'] && this.sector) {
      this.newPickup.sector = this.sector.nombre || '';
    }
  }

  onResiduoChange(nombreSeleccionado: string): void {
    const match = this.residuos.find(r => r.nombre === nombreSeleccionado);
    this.newPickup.residuoId = match?.id ?? 0;
  }

  detectarCuadrante(): void {
    if (!this.newPickup.direccion || this.newPickup.direccion.trim().length < 3) return;
    this.isDetectingCuadrante = true;
    this.bffService.getCuadrante(this.newPickup.direccion).subscribe({
      next: (res) => {
        this.isDetectingCuadrante = false;
        if (res?.cuadranteId) {
          this.detectedCuadrante = `Cuadrante detectado: ${res.nombre} (Día habitual: ${res.diaSemana})`;
          if (res.sector) {
            this.newPickup.sector = res.sector;
          }
        }
      },
      error: () => {
        this.isDetectingCuadrante = false;
      }
    });
  }

  setQuickWeight(kilos: number): void {
    this.newPickup.pesoEstimadoKg = kilos;
  }

  onSubmit(): void {
    this.generalError = '';

    if (!this.newPickup.direccion || !this.newPickup.direccion.trim()) {
      this.generalError = 'Por favor ingresa la calle y número de tu domicilio.';
      return;
    }

    if (!this.newPickup.residuoNombre) {
      this.generalError = 'Por favor selecciona el tipo de material reciclable.';
      return;
    }

    const pesoNum = Number(this.newPickup.pesoEstimadoKg);
    if (Number.isNaN(pesoNum) || pesoNum <= 0) {
      this.generalError = 'Por favor ingresa un peso estimado válido mayor a 0 kg.';
      return;
    }

    this.isSubmitting = true;
    this.submitStatus = 'idle';
    this.errorMessage = '';

    const currentSectorName = this.sector?.nombre || this.newPickup.sector || 'Puerto Varas';
    const fullDireccion = this.newPickup.direccion.includes(currentSectorName)
      ? this.newPickup.direccion.trim()
      : `${this.newPickup.direccion.trim()}, ${currentSectorName}`;

    const matchingRes = this.residuos.find(r => r.nombre === this.newPickup.residuoNombre);
    const residuoId = matchingRes?.id ?? this.newPickup.residuoId ?? 1;
    const residuoNombre = matchingRes?.nombre ?? this.newPickup.residuoNombre;
    const comentario = this.newPickup.comentarios?.trim() || 'Retiro domiciliario vecinal';

    const payload = {
      vecinoEmail: this.userEmail || 'vecino@puertovaras.cl',
      vecinoNombre: this.userName || 'Vecino Puerto Varas',
      direccion: fullDireccion,
      comuna: 'Puerto Varas',
      residuoId: Number(residuoId),
      residuoNombre: residuoNombre,
      pesoEstimadoKg: pesoNum,
      observaciones: comentario,
      comentarios: comentario
    };

    this.bffService.createPickup(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.submitStatus = 'success';
        this.newPickup.direccion = '';
        this.newPickup.comentarios = '';
        this.newPickup.pesoEstimadoKg = 5.0;
        this.newPickup.residuoNombre = '';
        this.newPickup.residuoId = 0;
        this.detectedCuadrante = '';
        this.pickupCreated.emit(res || payload);
        setTimeout(() => this.submitStatus = 'idle', 5000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitStatus = 'error';
        const rawDetail = err?.error?.error || err?.error?.message || (typeof err?.error === 'string' ? err.error : null);
        if (err.status === 0) {
          this.errorMessage = 'No fue posible contactar al servicio de retiros (BFF sin conexión).';
        } else {
          this.errorMessage = rawDetail || 'Ocurrió un error al registrar la solicitud. Por favor intenta más tarde.';
        }
        setTimeout(() => {
          if (this.submitStatus === 'error') this.submitStatus = 'idle';
        }, 7000);
      }
    });
  }
}
