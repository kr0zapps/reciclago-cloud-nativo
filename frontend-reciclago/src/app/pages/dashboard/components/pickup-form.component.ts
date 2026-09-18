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
    <section id="solicitud-retiro" class="bg-white rounded-3xl sm:rounded-[2.2rem] border border-[#E2E9E4] p-6 sm:p-10 shadow-xs card-hover anim-fade-up anim-delay-5 mt-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#EAEFE8] gap-2">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider mb-2">
            <i class="fa-solid fa-truck-pickup text-[#4F8A3D]"></i> Servicio Vecinal DIMAO Puerto Varas
          </div>
          <h3 class="font-heading font-extrabold text-2xl sm:text-3xl text-[#123F5B]">
            {{ isRetiroEspecial ? 'Solicitud de Retiro Especial a Domicilio' : 'Aviso de Retiro Domiciliario' }}
          </h3>
          <p class="text-base text-[#61717A] mt-1">
            {{ isRetiroEspecial ? 'Coordina la recolección de residuos fuera del calendario regular o de gran volumen.' : 'Informa a la cuadrilla municipal si dejarás material en tu puerta para el recorrido de este ' + (sector?.fechaTexto || sector?.dia) + '.' }}
          </p>
        </div>
      </div>

      <!-- Formulario interactivo -->
      <form (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Mensajes de estado -->
        <div *ngIf="submitStatus === 'success'" role="alert" aria-live="polite" class="bg-[#EEF5EB] border border-[#CDE5C8] text-[#3B6E2C] px-4 py-3 rounded-2xl flex items-center gap-3 mb-6">
          <i class="fa-solid fa-circle-check text-xl"></i>
          <div>
            <span class="block font-bold text-sm">¡Solicitud recibida con éxito!</span>
            <span class="text-xs">Hemos registrado tu solicitud en el sistema para el próximo recorrido municipal.</span>
          </div>
        </div>
        
        <div *ngIf="submitStatus === 'error'" role="alert" aria-live="polite" class="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl flex items-center gap-3 mb-6">
          <i class="fa-solid fa-circle-exclamation text-xl"></i>
          <div>
            <span class="block font-bold text-sm">Error al solicitar</span>
            <span class="text-xs">{{ errorMessage || 'Hubo un problema al procesar tu solicitud con el microservicio. Por favor intenta de nuevo.' }}</span>
          </div>
        </div>

        <div *ngIf="generalError" role="alert" aria-live="polite" class="bg-amber-50 border border-amber-300 text-amber-900 px-4 py-3 rounded-2xl flex items-center gap-3 mb-6">
          <i class="fa-solid fa-circle-exclamation text-xl text-amber-600"></i>
          <div>
            <span class="block font-bold text-sm">Verifica los datos requeridos</span>
            <span class="text-xs">{{ generalError }}</span>
          </div>
        </div>

        <!-- Datos de Identificación y Contacto (RUT y Teléfono) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#F8FAF7] border border-[#E2E9E4] rounded-2xl">
          <div class="space-y-1.5 text-left">
            <div class="flex items-center justify-between">
              <label for="vecinoRutInput" class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] ml-1">
                RUT del Vecino (Opcional)
              </label>
              <span class="text-[10px] text-slate-400 font-medium">Validación Módulo 11</span>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <i class="fa-solid fa-id-card text-xs"></i>
              </div>
              <input id="vecinoRutInput"
                     type="text"
                     [value]="vecinoRut"
                     (input)="onRutInput($event)"
                     placeholder="Ej: 12.345.678-K"
                     maxlength="12"
                     class="input-stitch has-icon !pl-10 text-xs font-semibold"
                     [ngClass]="rutError ? '!border-rose-400 !bg-rose-50/50' : ''"
                     aria-describedby="rut-error-desc">
            </div>
            <p id="rut-error-desc" *ngIf="rutError" class="text-[10px] text-rose-600 font-bold ml-1 flex items-center gap-1">
              <i class="fa-solid fa-circle-exclamation text-[10px]"></i> {{ rutError }}
            </p>
          </div>

          <div class="space-y-1.5 text-left">
            <div class="flex items-center justify-between">
              <label for="vecinoTelefonoInput" class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] ml-1">
                Teléfono Celular (Opcional)
              </label>
              <span class="text-[10px] text-slate-400 font-medium">+56 9 XXXX XXXX</span>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <i class="fa-solid fa-phone text-xs"></i>
              </div>
              <input id="vecinoTelefonoInput"
                     type="text"
                     [value]="vecinoTelefono"
                     (input)="onPhoneInput($event)"
                     placeholder="Ej: +56 9 8765 4321"
                     maxlength="16"
                     class="input-stitch has-icon !pl-10 text-xs font-semibold"
                     [ngClass]="phoneError ? '!border-rose-400 !bg-rose-50/50' : ''"
                     aria-describedby="phone-error-desc">
            </div>
            <p id="phone-error-desc" *ngIf="phoneError" class="text-[10px] text-rose-600 font-bold ml-1 flex items-center gap-1">
              <i class="fa-solid fa-circle-exclamation text-[10px]"></i> {{ phoneError }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <!-- 1. Sector activo confirmado -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] ml-1">Sector y Cuadrante</label>
              <span class="text-[11px] font-bold text-[#4F8A3D] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                Pasa el {{ sector?.dia }}
              </span>
            </div>
            <div class="p-3 bg-[#F8FAF7] border border-[#E2E9E4] rounded-2xl flex items-center justify-between min-h-[50px]">
              <div class="flex items-center gap-3 overflow-hidden">
                <div class="w-9 h-9 rounded-xl bg-white text-[#4F8A3D] flex items-center justify-center text-sm shadow-2xs border border-[#CCE2C9] flex-shrink-0">
                  <i class="fa-solid fa-map-location-dot"></i>
                </div>
                <div class="min-w-0">
                  <span class="text-xs font-extrabold text-[#123F5B] block truncate">{{ sector?.nombre }}</span>
                  <span class="text-[11px] text-[#61717A] block truncate">{{ sector?.cuadrante }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Dirección exacta con Detector de Cuadrante -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] ml-1" for="direccion">Calle y número</label>
              <button (click)="detectarCuadrante()" type="button" class="text-[11px] font-bold text-[#4F8A3D] hover:underline flex items-center gap-1 cursor-pointer">
                <i class="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
                <span *ngIf="!isDetectingCuadrante">Detectar cuadrante</span>
                <span *ngIf="isDetectingCuadrante">Detectando...</span>
              </button>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                <i class="fa-solid fa-location-dot text-[#61717A] text-sm"></i>
              </div>
              <input [(ngModel)]="newPickup.direccion" (blur)="detectarCuadrante()" class="input-stitch has-icon !pl-11 pr-4" id="direccion" name="direccion" placeholder="Ej: Calle Los Guindos 450" required type="text" />
            </div>
            <p *ngIf="detectedCuadrante" class="text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60 flex items-center gap-1.5 mt-1">
              <i class="fa-solid fa-circle-check text-[11px] text-emerald-600"></i>
              <span>{{ detectedCuadrante }}</span>
            </p>
          </div>

          <!-- 3. Material a reciclar -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] ml-1">Material a reciclar</label>
              <button type="button" (click)="toggleRetiroEspecial()" class="text-[11px] font-bold text-[#123F5B] hover:text-[#4F8A3D] hover:underline cursor-pointer">
                <span *ngIf="!isRetiroEspecial">¿Otro material? (Especial)</span>
                <span *ngIf="isRetiroEspecial">← Volver al material del día</span>
              </button>
            </div>

            <!-- Caso regular: Material asignado del día -->
            <div *ngIf="!isRetiroEspecial" class="p-3 bg-gradient-to-r from-[#EEF7EC] to-[#F8FAF7] border border-[#CCE2C9] rounded-2xl flex items-center justify-between shadow-2xs min-h-[50px]">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-white text-[#4F8A3D] flex items-center justify-center text-sm shadow-2xs border border-[#CCE2C9] flex-shrink-0">
                  <i class="fa-solid fa-recycle"></i>
                </div>
                <div>
                  <span class="text-[10px] font-bold uppercase text-[#4F8A3D] tracking-wider block">Oficial para este {{ sector?.dia }}</span>
                  <span class="text-xs font-extrabold text-[#123F5B] block">{{ newPickup.residuoNombre || sector?.materialPrincipal || 'Vidrio' }}</span>
                </div>
              </div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                Designado
              </span>
            </div>

            <!-- Caso especial: Selección libre de material fuera de fecha -->
            <div *ngIf="isRetiroEspecial" class="space-y-1">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                  <i class="fa-solid fa-truck-ramp-box text-amber-600 text-sm"></i>
                </div>
                <select [(ngModel)]="newPickup.residuoNombre" class="select-stitch has-icon !pl-11 !pr-10 appearance-none text-xs font-semibold" id="residuoNombre" name="residuoNombre" required>
                  <option value="">Selecciona material especial</option>
                  <option *ngFor="let res of residuos" [value]="res.nombre">{{ res.nombre }}</option>
                </select>
                <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
                  <i class="fa-solid fa-chevron-down text-[#61717A] text-xs"></i>
                </div>
              </div>
              <p class="text-[10px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 mt-1">
                <i class="fa-solid fa-info-circle mr-1"></i> Sujeto a coordinación especial DIMAO.
              </p>
            </div>
          </div>
        </div>

        <!-- 4. Estimación de Kilos (Vecino) -->
        <div class="p-4 bg-[#F8FAF7] border border-[#E2E9E4] rounded-2xl space-y-2">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] ml-1" for="pesoEstimado">
              <i class="fa-solid fa-weight-scale text-[#4F8A3D] mr-1.5"></i> Kilos Estimados de Residuos (Aprox.)
            </label>
            <span class="text-[11px] font-semibold text-slate-500">
              Selecciona una cantidad sugerida o escribe tu peso estimado
            </span>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3">
            <div class="relative w-full sm:w-44">
              <input [(ngModel)]="newPickup.pesoEstimadoKg"
                     class="input-stitch !py-2.5 !px-3 font-extrabold text-base text-[#123F5B] text-center"
                     id="pesoEstimado"
                     name="pesoEstimado"
                     type="number"
                     step="0.5"
                     min="0.5"
                     max="500"
                     placeholder="Ej: 5.0"
                     required />
              <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">kg</span>
            </div>

            <!-- Chips de acceso rápido -->
            <div class="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
              <button type="button"
                      *ngFor="let k of [2, 5, 10, 15, 25]"
                      (click)="setQuickWeight(k)"
                      class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border"
                      [ngClass]="newPickup.pesoEstimadoKg === k ? 'bg-[#4F8A3D] text-white border-[#4F8A3D] shadow-2xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
                {{ k }} kg
              </button>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold uppercase tracking-wider text-[#123F5B] ml-1" for="comentarios">
            {{ isRetiroEspecial ? 'Detalles de la solicitud especial (volumen, tipo de residuo o instrucciones)' : 'Comentarios adicionales (opcional)' }}
          </label>
          <div class="relative">
            <textarea [(ngModel)]="newPickup.comentarios" class="input-stitch min-h-[85px] resize-y pt-3" id="comentarios" name="comentarios" placeholder="Instrucciones para llegar, cantidad aproximada, etc."></textarea>
          </div>
        </div>

        <div class="pt-2 flex justify-end">
          <button [disabled]="isSubmitting" class="btn-stitch-primary w-full md:w-auto px-8 py-3.5 text-base shadow-sm cursor-pointer" type="submit">
            <span *ngIf="!isSubmitting">
              {{ isRetiroEspecial ? 'Solicitar retiro especial a DIMAO' : 'Notificar aviso para este ' + (sector?.dia || '') }}
            </span>
            <span *ngIf="isSubmitting" class="flex items-center gap-2">
              <i class="fa-solid fa-circle-notch fa-spin"></i> Procesando...
            </span>
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

  constructor(private bffService: BffService) {}

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
    if (!this.isRetiroEspecial && this.sector && this.sector.materialPrincipal) {
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
        if (res && res.cuadranteId) {
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
    if (isNaN(pesoNum) || pesoNum <= 0) {
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
    const residuoId = matchingRes && matchingRes.id ? matchingRes.id : 1;
    const residuoNombre = matchingRes ? matchingRes.nombre : (this.newPickup.residuoNombre || 'Vidrio');

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
