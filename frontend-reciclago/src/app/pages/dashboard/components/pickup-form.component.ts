import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BffService } from '../../../services/bff.service';
import { Sector, Residuo, Pickup } from '../data/sectors.data';
import { formatRut, validateRut } from '../../../shared/utils/rut.utils';
import { formatChileanPhone, validateChileanPhone } from '../../../shared/utils/phone.utils';

@Component({
  selector: 'app-pickup-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="solicitud-retiro" class="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 mt-8">
      <div class="pb-6 mb-6 border-b border-[#E2E8F0]">
        <h3 class="font-heading font-extrabold text-2xl sm:text-3xl text-[#123F5B]">
          {{ isRetiroEspecial ? 'Retiro especial' : 'Solicitar retiro' }}
        </h3>
      </div>

      <form (ngSubmit)="onSubmit()" class="space-y-6 text-gray-700">
        <!-- Banners -->
        <div *ngIf="submitStatus === 'success'" class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 text-sm">
          <strong>¡Éxito!</strong> Solicitud recibida.
        </div>
        
        <div *ngIf="submitStatus === 'error'" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 text-sm">
          <strong>Error:</strong> {{ errorMessage || 'Hubo un problema.' }}
        </div>

        <div *ngIf="generalError" class="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-6 text-sm">
          <strong>Aviso:</strong> {{ generalError }}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1 text-left">
            <label for="vecinoRutInput" class="block text-sm font-semibold text-[#123F5B]">RUT (Opcional)</label>
            <input id="vecinoRutInput" type="text" [value]="vecinoRut" (input)="onRutInput($event)" placeholder="Ej: 12.345.678-K" maxlength="12" class="input-stitch w-full text-sm p-2 border border-[#E2E8F0] rounded-lg">
            <p *ngIf="rutError" class="text-sm text-red-600 mt-1">{{ rutError }}</p>
          </div>

          <div class="space-y-1 text-left">
            <label for="vecinoTelefonoInput" class="block text-sm font-semibold text-[#123F5B]">Teléfono (Opcional)</label>
            <input id="vecinoTelefonoInput" type="text" [value]="vecinoTelefono" (input)="onPhoneInput($event)" placeholder="Ej: +56 9 8765 4321" maxlength="16" class="input-stitch w-full text-sm p-2 border border-[#E2E8F0] rounded-lg">
            <p *ngIf="phoneError" class="text-sm text-red-600 mt-1">{{ phoneError }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div class="space-y-1">
            <label class="block text-sm font-semibold text-[#123F5B]">Sector</label>
            <div class="p-2 border border-[#E2E8F0] rounded-lg bg-gray-50 min-h-[42px] flex items-center">
              <span class="text-sm text-gray-700">{{ sector?.nombre }} - {{ sector?.cuadrante }}</span>
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-semibold text-[#123F5B]" for="direccion">Dirección</label>
              <button (click)="detectarCuadrante()" type="button" class="text-xs text-[#22a652] hover:underline cursor-pointer">
                {{ isDetectingCuadrante ? 'Detectando...' : 'Detectar' }}
              </button>
            </div>
            <input [(ngModel)]="newPickup.direccion" (blur)="detectarCuadrante()" class="input-stitch w-full text-sm p-2 border border-[#E2E8F0] rounded-lg" id="direccion" name="direccion" placeholder="Calle y número" required type="text" />
            <p *ngIf="detectedCuadrante" class="text-xs text-green-800 mt-1">{{ detectedCuadrante }}</p>
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-semibold text-[#123F5B]">Material</label>
              <button type="button" (click)="toggleRetiroEspecial()" class="text-xs text-[#22a652] hover:underline cursor-pointer">
                {{ isRetiroEspecial ? 'Volver' : 'Especial' }}
              </button>
            </div>
            <div *ngIf="!isRetiroEspecial" class="p-2 border border-[#E2E8F0] rounded-lg bg-gray-50 min-h-[42px] flex items-center">
              <span class="text-sm text-gray-700">{{ newPickup.residuoNombre || sector?.materialPrincipal || 'Vidrio' }}</span>
            </div>
            <select *ngIf="isRetiroEspecial" [(ngModel)]="newPickup.residuoNombre" class="select-stitch w-full text-sm p-2 border border-[#E2E8F0] rounded-lg" id="residuoNombre" name="residuoNombre" required>
              <option value="">Selecciona material</option>
              <option *ngFor="let res of residuos" [value]="res.nombre">{{ res.nombre }}</option>
            </select>
          </div>
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-semibold text-[#123F5B]" for="pesoEstimado">Peso Estimado (kg)</label>
          <div class="flex items-center gap-3">
            <input [(ngModel)]="newPickup.pesoEstimadoKg" class="input-stitch w-24 text-sm p-2 border border-[#E2E8F0] rounded-lg" id="pesoEstimado" name="pesoEstimado" type="number" step="0.5" min="0.5" max="500" placeholder="Ej: 5.0" required />
            <div class="flex items-center gap-2">
              <button type="button" *ngFor="let k of [2, 5, 10, 15, 25]" (click)="setQuickWeight(k)"
                      class="px-2 py-1 rounded text-xs border cursor-pointer"
                      [ngClass]="newPickup.pesoEstimadoKg === k ? 'bg-[#22a652] text-white border-[#22a652]' : 'bg-white text-gray-700 border-gray-300'">
                {{ k }}
              </button>
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-semibold text-[#123F5B]" for="comentarios">Comentarios</label>
          <textarea [(ngModel)]="newPickup.comentarios" class="input-stitch w-full text-sm p-2 border border-[#E2E8F0] rounded-lg" id="comentarios" name="comentarios" placeholder="Opcional"></textarea>
        </div>

        <div class="pt-4 flex justify-end">
          <button [disabled]="isSubmitting" class="btn-stitch-primary px-6 py-2 bg-[#22a652] hover:bg-[#1b8e45] text-white rounded-lg font-semibold text-sm cursor-pointer border-none" type="submit">
            {{ isSubmitting ? 'Procesando...' : 'Solicitar Retiro' }}
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
    pesoEstimadoKg: 5.0,
    comentarios: ''
  };

  isRetiroEspecial = false;
  isDetectingCuadrante = false;
  detectedCuadrante = '';

  isSubmitting = false;
  submitStatus: 'idle' | 'success' | 'error' = 'idle';
  errorMessage = '';
  generalError = '';

  vecinoRut = '';
  vecinoTelefono = '';
  rutError = '';
  phoneError = '';

  constructor(private readonly bffService: BffService) {}

  onRutInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.vecinoRut = formatRut(input.value);
    if (this.vecinoRut.length > 3) {
      this.rutError = validateRut(this.vecinoRut) ? '' : 'RUT inválido (ej: 12.345.678-K)';
    } else {
      this.rutError = '';
    }
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.vecinoTelefono = formatChileanPhone(input.value);
    if (this.vecinoTelefono.length > 6) {
      this.phoneError = validateChileanPhone(this.vecinoTelefono) ? '' : 'Formato inválido (ej: +56 9 8765 4321)';
    } else {
      this.phoneError = '';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sector'] && this.sector) {
      this.newPickup.sector = this.sector.nombre || '';
      this.syncOfficialMaterialForSector();
    }
  }

  syncOfficialMaterialForSector(): void {
    if (!this.isRetiroEspecial && this.sector?.materialPrincipal) {
      const mat = this.sector.materialPrincipal.toLowerCase();
      const matchingRes = this.residuos.find(r => 
        r.nombre?.toLowerCase().includes(mat) || mat.includes(r.nombre?.toLowerCase())
      );
      this.newPickup.residuoNombre = matchingRes ? matchingRes.nombre : this.sector.materialPrincipal;
    }
  }

  toggleRetiroEspecial(): void {
    this.isRetiroEspecial = !this.isRetiroEspecial;
    if (!this.isRetiroEspecial) {
      this.syncOfficialMaterialForSector();
    }
  }

  detectarCuadrante(): void {
    if (!this.newPickup.direccion || this.newPickup.direccion.trim().length < 3) return;
    this.isDetectingCuadrante = true;
    this.bffService.getCuadrante(this.newPickup.direccion).subscribe({
      next: (res) => {
        this.isDetectingCuadrante = false;
        if (res?.cuadranteId) {
          this.detectedCuadrante = `Detectado: ${res.nombre} (${res.diaSemana}) • Horario: ${res.horario}`;
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

    if (this.vecinoRut && !validateRut(this.vecinoRut)) {
      this.rutError = 'El RUT ingresado no es válido (ej: 12.345.678-K).';
      this.generalError = 'Corrige el RUT ingresado antes de enviar.';
      return;
    }

    if (this.vecinoTelefono && !validateChileanPhone(this.vecinoTelefono)) {
      this.phoneError = 'El teléfono celular debe tener formato +56 9 XXXX XXXX.';
      this.generalError = 'Corrige el teléfono de contacto antes de enviar.';
      return;
    }

    const pesoNum = Number(this.newPickup.pesoEstimadoKg);
    if (Number.isNaN(pesoNum) || pesoNum <= 0) {
      this.generalError = 'Por favor ingresa un peso estimado válido mayor a 0 kg.';
      return;
    }

    if (!this.newPickup.residuoNombre) {
      this.syncOfficialMaterialForSector();
    }

    this.isSubmitting = true;
    this.submitStatus = 'idle';
    this.errorMessage = '';

    const currentSectorName = this.sector?.nombre || this.newPickup.sector || 'Puerto Varas';
    const fullDireccion = this.newPickup.direccion.includes(currentSectorName)
      ? this.newPickup.direccion.trim()
      : `${this.newPickup.direccion.trim()}, ${currentSectorName}`;

    const matchingRes = this.residuos.find(r => r.nombre === this.newPickup.residuoNombre);
    const residuoId = matchingRes?.id ?? 1;
    const residuoNombre = matchingRes?.nombre ?? (this.newPickup.residuoNombre || 'Vidrio');

    const tipoPrefijo = this.isRetiroEspecial ? '[RETIRO ESPECIAL DIMAO]' : '[AVISO RECORRIDO REGULAR]';
    const contactoInfo = [
      this.vecinoRut ? `RUT: ${this.vecinoRut}` : '',
      this.vecinoTelefono ? `Tel: ${this.vecinoTelefono}` : ''
    ].filter(Boolean).join(' • ');

    const comentarioCompleto = [
      tipoPrefijo,
      contactoInfo ? `[${contactoInfo}]` : '',
      this.newPickup.comentarios?.trim() || 'Notificación vecinal para el cuadrante'
    ].filter(Boolean).join(' ');

    const payload = {
      vecinoEmail: this.userEmail || 'vecino@puertovaras.cl',
      vecinoNombre: this.userName || 'Vecino Puerto Varas',
      direccion: fullDireccion,
      comuna: 'Puerto Varas',
      residuoId: Number(residuoId),
      residuoNombre: residuoNombre,
      pesoEstimadoKg: pesoNum,
      observaciones: comentarioCompleto,
      comentarios: comentarioCompleto
    };

    this.bffService.createPickup(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.submitStatus = 'success';
        this.newPickup.direccion = '';
        this.newPickup.comentarios = '';
        this.newPickup.pesoEstimadoKg = 5.0;
        this.vecinoRut = '';
        this.vecinoTelefono = '';
        this.rutError = '';
        this.phoneError = '';
        this.isRetiroEspecial = false;
        this.syncOfficialMaterialForSector();
        this.pickupCreated.emit(res || payload);
        setTimeout(() => this.submitStatus = 'idle', 5000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitStatus = 'error';
        const rawDetail = err?.error?.error || err?.error?.message || (typeof err?.error === 'string' ? err.error : null);
        if (err.status === 0) {
          this.errorMessage = 'No fue posible contactar al microservicio de retiros (BFF fuera de línea o sin conexión).';
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
