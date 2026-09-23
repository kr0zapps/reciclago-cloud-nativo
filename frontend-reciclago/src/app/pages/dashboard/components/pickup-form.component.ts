import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BffService } from '../../../services/bff.service';
import { Sector, Residuo, Pickup, DEFAULT_SECTORES } from '../data/sectors.data';

interface MaterialChip {
  nombre: string;
  icon: string;
}

interface MaterialEspecialChip {
  nombre: string;
  descripcion: string;
  icon: string;
  pesoSugerido: number;
}

@Component({
  selector: 'app-pickup-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="solicitud-retiro" class="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-7 shadow-xs">
      <!-- Encabezado con selector de modo intuitivo -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#E2E8F0]">
        <div>
          <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#123F5B] flex items-center gap-2">
            <i [class]="isRetiroEspecial ? 'fa-solid fa-couch text-amber-500' : 'fa-solid fa-recycle text-[#22a652]'"></i>
            <span>{{ isRetiroEspecial ? 'Retiro Especial de Voluminosos' : 'Solicitar Retiro de Reciclaje' }}</span>
          </h3>
          <p class="text-xs sm:text-sm text-gray-500 mt-1">
            {{ isRetiroEspecial
              ? 'Servicio municipal DIMAO para enseres, ramas y artefactos que no entran en la recolección regular.'
              : 'Recolección selectiva puerta a puerta programada semanalmente para tu cuadrante.' }}
          </p>
        </div>

        <!-- Selector de Tipo de Retiro Intuitivo -->
        <div class="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200 self-start sm:self-auto flex-shrink-0">
          <button
            type="button"
            (click)="setModoRetiro(false)"
            class="py-2 px-3.5 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer"
            [ngClass]="!isRetiroEspecial ? 'bg-[#123F5B] text-white shadow-xs' : 'text-gray-600 hover:text-[#123F5B]'">
            <i class="fa-solid fa-recycle text-[#22a652]"></i>
            <span>Reciclaje Regular</span>
          </button>
          <button
            type="button"
            (click)="setModoRetiro(true)"
            class="py-2 px-3.5 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer"
            [ngClass]="isRetiroEspecial ? 'bg-[#123F5B] text-white shadow-xs' : 'text-gray-600 hover:text-[#123F5B]'">
            <i class="fa-solid fa-couch text-amber-400"></i>
            <span>Retiro Especial</span>
          </button>
        </div>
      </div>

      <form (ngSubmit)="onSubmit()" class="space-y-5 text-gray-700">
        <!-- Banners de Notificación de Estado -->
        <div *ngIf="submitStatus === 'success'" class="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center gap-2.5">
          <i class="fa-solid fa-circle-check text-emerald-600 text-lg flex-shrink-0"></i>
          <div>
            <strong class="font-extrabold">¡Solicitud recibida con éxito!</strong>
            <p class="text-xs mt-0.5">El equipo municipal ha registrado tu aviso para la ruta correspondiente.</p>
          </div>
        </div>
        
        <div *ngIf="submitStatus === 'error'" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm flex items-center gap-2.5">
          <i class="fa-solid fa-circle-exclamation text-red-600 text-lg flex-shrink-0"></i>
          <div>
            <strong class="font-extrabold">No fue posible enviar:</strong>
            <p class="text-xs mt-0.5">{{ errorMessage || 'Ocurrió un error al procesar la solicitud.' }}</p>
          </div>
        </div>

        <div *ngIf="generalError" class="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2">
          <i class="fa-solid fa-circle-info text-amber-600 flex-shrink-0"></i>
          <span>{{ generalError }}</span>
        </div>

        <!-- 1. SELECTOR VISUAL DE SECTOR / CUADRANTE (INTUITIVO, 1 CLICK) -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Sector / Cuadrante
            </label>
            <span class="text-xs text-gray-600 font-bold">
              Día de retiro: <strong class="text-[#123F5B]">{{ sector?.dia || 'Programado' }}</strong>
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              *ngFor="let s of sectoresDisponibles"
              type="button"
              (click)="onSelectCuadrante(s)"
              class="p-2.5 sm:p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between"
              [ngClass]="isSectorSelected(s) 
                ? 'border-[#123F5B] bg-[#123F5B] text-white shadow-sm ring-2 ring-[#123F5B]/20' 
                : 'border-[#E2E8F0] bg-[#F8FAF7] hover:bg-white hover:border-gray-300 text-gray-700'">
              <div class="flex items-center justify-between w-full">
                <span class="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                  [ngClass]="isSectorSelected(s) ? 'bg-white/20 text-emerald-300' : 'bg-emerald-100 text-[#22a652]'">
                  C{{ s.numero || s.id }}
                </span>
                <span class="text-[11px] font-bold" [ngClass]="isSectorSelected(s) ? 'text-gray-200' : 'text-gray-500'">
                  {{ s.dia }}
                </span>
              </div>
              <span class="text-xs font-bold leading-tight mt-1.5 truncate w-full" [title]="s.nombre">
                {{ getShortSectorName(s.nombre) }}
              </span>
            </button>
          </div>
        </div>

        <!-- 2. DIRECCIÓN CON BOTÓN DETECTAR CUADRANTE -->
        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500" for="direccion">
              Dirección en Puerto Varas
            </label>
            <button
              (click)="detectarCuadrante()"
              type="button"
              class="text-xs font-bold text-[#22a652] hover:text-[#1b8e45] cursor-pointer flex items-center gap-1">
              <i class="fa-solid fa-location-crosshairs"></i>
              <span>{{ isDetectingCuadrante ? 'Detectando...' : 'Detectar Cuadrante' }}</span>
            </button>
          </div>
          <input
            [(ngModel)]="newPickup.direccion"
            (blur)="detectarCuadrante()"
            class="w-full text-sm p-2.5 border border-[#E2E8F0] rounded-xl focus:border-[#22a652] focus:outline-none focus:ring-2 focus:ring-[#22a652]/10 bg-white"
            id="direccion"
            name="direccion"
            placeholder="Calle y número (Ej: Av. Colón 450, Costanera)"
            required
            type="text" />
          <p *ngIf="detectedCuadrante" class="text-xs text-emerald-800 font-semibold mt-1 flex items-center gap-1.5">
            <i class="fa-solid fa-circle-check text-[#22a652]"></i>
            <span>{{ detectedCuadrante }}</span>
          </p>
        </div>

        <!-- 3. SELECCIÓN DE MATERIAL O RESIDUO -->
        <!-- MODO REGULAR -->
        <div *ngIf="!isRetiroEspecial" class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Material a Reciclar
            </label>
            <span class="text-xs text-emerald-700 font-bold">
              Turno oficial: {{ sector?.materialPrincipal || 'Vidrio' }}
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              *ngFor="let mat of materialesRegulares"
              type="button"
              (click)="selectMaterialRegular(mat.nombre)"
              class="py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              [ngClass]="newPickup.residuoNombre === mat.nombre 
                ? 'border-[#22a652] bg-[#22a652] text-white shadow-xs' 
                : 'border-[#E2E8F0] bg-white hover:border-[#22a652] text-gray-700'">
              <i [class]="mat.icon"></i>
              <span>{{ mat.nombre }}</span>
            </button>
          </div>
        </div>

        <!-- MODO RETIRO ESPECIAL (VOLUMINOSOS) -->
        <div *ngIf="isRetiroEspecial" class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Tipo de Enser o Residuo Especial
            </label>
            <span class="text-xs text-amber-700 font-bold flex items-center gap-1">
              <i class="fa-solid fa-truck-ramp-box"></i>
              <span>Cuadrilla municipal DIMAO</span>
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              *ngFor="let esp of residuosEspeciales"
              type="button"
              (click)="selectMaterialEspecial(esp)"
              class="p-2.5 sm:p-3 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1"
              [ngClass]="newPickup.residuoNombre === esp.nombre 
                ? 'border-[#123F5B] bg-[#123F5B] text-white shadow-sm ring-2 ring-[#123F5B]/20' 
                : 'border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-gray-700'">
              <div class="flex items-center justify-between">
                <i [class]="esp.icon + ' text-sm'" [ngClass]="newPickup.residuoNombre === esp.nombre ? 'text-amber-300' : 'text-amber-600'"></i>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  [ngClass]="newPickup.residuoNombre === esp.nombre ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'">
                  ~{{ esp.pesoSugerido }} kg
                </span>
              </div>
              <div>
                <span class="text-xs font-bold block leading-tight">{{ esp.nombre }}</span>
                <span class="text-[11px] opacity-80 block leading-tight mt-0.5"
                  [ngClass]="newPickup.residuoNombre === esp.nombre ? 'text-gray-200' : 'text-gray-500'">
                  {{ esp.descripcion }}
                </span>
              </div>
            </button>
          </div>
        </div>

        <!-- 4. PESO ESTIMADO Y ACCESOS RÁPIDOS -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500" for="pesoEstimado">
              Peso Estimado (kg)
            </label>
            <span class="text-xs text-gray-400">
              {{ isRetiroEspecial ? 'Máximo 500 kg por solicitud' : 'Aproximado para estimar capacidad del camión' }}
            </span>
          </div>
          <div class="flex items-center gap-3">
            <div class="relative w-28 flex-shrink-0">
              <input
                [(ngModel)]="newPickup.pesoEstimadoKg"
                class="w-full text-sm p-2.5 pr-8 border border-[#E2E8F0] rounded-xl font-bold text-[#123F5B] focus:border-[#22a652] focus:outline-none"
                id="pesoEstimado"
                name="pesoEstimado"
                type="number"
                step="0.5"
                min="0.5"
                max="500"
                required />
              <span class="absolute right-3 top-2.5 text-xs text-gray-400 font-bold pointer-events-none">kg</span>
            </div>
            <div class="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                *ngFor="let k of (isRetiroEspecial ? [10, 20, 35, 50, 100] : [2, 5, 10, 15, 25])"
                (click)="setQuickWeight(k)"
                class="px-2.5 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer"
                [ngClass]="newPickup.pesoEstimadoKg === k 
                  ? 'bg-[#22a652] text-white border-[#22a652] shadow-2xs' 
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'">
                {{ k }} kg
              </button>
            </div>
          </div>
        </div>

        <!-- 5. COMENTARIOS / INDICACIONES -->
        <div class="space-y-1">
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-500" for="comentarios">
            Indicaciones para el retiro (Opcional)
          </label>
          <textarea
            [(ngModel)]="newPickup.comentarios"
            rows="2"
            class="w-full text-sm p-2.5 border border-[#E2E8F0] rounded-xl focus:border-[#22a652] focus:outline-none bg-white"
            id="comentarios"
            name="comentarios"
            placeholder="Ej: Dejar en antejardín, portón verde, llamar antes al timbre..."></textarea>
        </div>

        <!-- 6. ACCIÓN DE ENVÍO -->
        <div class="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100">
          <div class="text-xs text-gray-500 flex items-center gap-2">
            <i class="fa-solid fa-circle-check text-[#22a652]"></i>
            <span>Servicio municipal gratuito &middot; Puerto Varas Sustentable</span>
          </div>

          <button
            [disabled]="isSubmitting"
            class="px-6 py-2.5 bg-[#22a652] hover:bg-[#1b8e45] text-white rounded-xl font-bold text-sm cursor-pointer border-none shadow-xs transition flex items-center justify-center gap-2"
            type="submit">
            <i *ngIf="isSubmitting" class="fa-solid fa-circle-notch fa-spin"></i>
            <i *ngIf="!isSubmitting" [class]="isRetiroEspecial ? 'fa-solid fa-truck-ramp-box' : 'fa-solid fa-paper-plane'"></i>
            <span>{{ isSubmitting ? 'Registrando...' : (isRetiroEspecial ? 'Solicitar Retiro Especial' : 'Solicitar Retiro') }}</span>
          </button>
        </div>
      </form>
    </section>
  `
})
export class PickupFormComponent implements OnChanges {
  @Input() sector!: Sector | null;
  @Input() sectores: Sector[] = [];
  @Input() residuos: Residuo[] = [];
  @Input() userEmail: string = '';
  @Input() userName: string = '';

  @Output() pickupCreated = new EventEmitter<Pickup>();
  @Output() sectorChange = new EventEmitter<string>();

  newPickup = {
    sector: '',
    direccion: '',
    residuoNombre: 'Vidrio',
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

  materialesRegulares: MaterialChip[] = [
    { nombre: 'Vidrio', icon: 'fa-solid fa-wine-bottle' },
    { nombre: 'Cartón y Papel', icon: 'fa-solid fa-box-open' },
    { nombre: 'Plásticos (PET)', icon: 'fa-solid fa-bottle-water' },
    { nombre: 'Latas y Metales', icon: 'fa-solid fa-can-food' }
  ];

  residuosEspeciales: MaterialEspecialChip[] = [
    { nombre: 'Muebles & Enseres', descripcion: 'Sillones, colchones, mesas, sillas', icon: 'fa-solid fa-couch', pesoSugerido: 25 },
    { nombre: 'Electrodomésticos / RAEE', descripcion: 'Línea blanca, TV, microondas', icon: 'fa-solid fa-tv', pesoSugerido: 20 },
    { nombre: 'Restos de Poda', descripcion: 'Ramas atadas, hojas y jardinería', icon: 'fa-solid fa-tree', pesoSugerido: 15 },
    { nombre: 'Escombros Menores', descripcion: 'Material de construcción (máx. 5 sacos)', icon: 'fa-solid fa-cubes', pesoSugerido: 40 },
    { nombre: 'Chatarra Metálica', descripcion: 'Perfiles, latas grandes y fierros', icon: 'fa-solid fa-gears', pesoSugerido: 20 },
    { nombre: 'Otros Voluminosos', descripcion: 'Enseres mayores varios', icon: 'fa-solid fa-box-archive', pesoSugerido: 15 }
  ];

  constructor(private readonly bffService: BffService) {}

  get sectoresDisponibles(): Sector[] {
    return (this.sectores && this.sectores.length > 0) ? this.sectores : DEFAULT_SECTORES;
  }

  isSectorSelected(s: Sector): boolean {
    if (!this.sector) return false;
    return s.nombre === this.sector.nombre || s.id === this.sector.id;
  }

  getShortSectorName(name: string): string {
    if (!name) return 'Sector';
    if (name.includes('Puerto Chico')) return 'Puerto Chico';
    if (name.includes('Costanera')) return 'Costanera Sur';
    if (name.includes('Santa Rosa') || name.includes('Mirador')) return 'Santa Rosa';
    if (name.includes('Braunau')) return 'N. Braunau';
    if (name.includes('Ensenada')) return 'Ensenada';
    return name.split(' ')[0] || name;
  }

  onSelectCuadrante(s: Sector): void {
    this.sector = s;
    this.newPickup.sector = s.nombre;
    this.sectorChange.emit(s.nombre);
    if (!this.isRetiroEspecial) {
      this.syncOfficialMaterialForSector();
    }
  }

  setModoRetiro(esEspecial: boolean): void {
    this.isRetiroEspecial = esEspecial;
    if (esEspecial) {
      this.newPickup.residuoNombre = this.residuosEspeciales[0].nombre;
      this.newPickup.pesoEstimadoKg = this.residuosEspeciales[0].pesoSugerido;
    } else {
      this.newPickup.pesoEstimadoKg = 5.0;
      this.syncOfficialMaterialForSector();
    }
  }

  selectMaterialRegular(nombre: string): void {
    this.newPickup.residuoNombre = nombre;
  }

  selectMaterialEspecial(esp: MaterialEspecialChip): void {
    this.newPickup.residuoNombre = esp.nombre;
    this.newPickup.pesoEstimadoKg = esp.pesoSugerido;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sector'] && this.sector) {
      this.newPickup.sector = this.sector.nombre || '';
      if (!this.isRetiroEspecial) {
        this.syncOfficialMaterialForSector();
      }
    }
  }

  syncOfficialMaterialForSector(): void {
    if (!this.isRetiroEspecial && this.sector?.materialPrincipal) {
      const mat = this.sector.materialPrincipal.toLowerCase();
      const matchingRes = this.materialesRegulares.find(r => 
        r.nombre.toLowerCase().includes(mat) || mat.includes(r.nombre.toLowerCase())
      );
      this.newPickup.residuoNombre = matchingRes ? matchingRes.nombre : this.sector.materialPrincipal;
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
          if (res.nombre) {
            const matchingSector = this.sectoresDisponibles.find(s => 
              s.nombre.toLowerCase().includes(res.nombre.toLowerCase()) || 
              res.nombre.toLowerCase().includes(s.nombre.toLowerCase())
            );
            if (matchingSector) {
              this.onSelectCuadrante(matchingSector);
            }
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
      this.generalError = 'Por favor ingresa la calle y número de tu domicilio en Puerto Varas.';
      return;
    }

    const pesoNum = Number(this.newPickup.pesoEstimadoKg);
    if (Number.isNaN(pesoNum) || pesoNum <= 0) {
      this.generalError = 'Por favor ingresa un peso estimado válido mayor a 0 kg.';
      return;
    }

    if (!this.newPickup.residuoNombre) {
      this.newPickup.residuoNombre = this.isRetiroEspecial ? 'Muebles & Enseres' : (this.sector?.materialPrincipal || 'Vidrio');
    }

    this.isSubmitting = true;
    this.submitStatus = 'idle';
    this.errorMessage = '';

    const currentSectorName = this.sector?.nombre || this.newPickup.sector || 'Puerto Varas';
    const fullDireccion = this.newPickup.direccion.includes(currentSectorName)
      ? this.newPickup.direccion.trim()
      : `${this.newPickup.direccion.trim()}, ${currentSectorName}`;

    const matchingRes = this.residuos.find(r => 
      r.nombre?.toLowerCase() === this.newPickup.residuoNombre.toLowerCase()
    );
    const residuoId = matchingRes?.id ?? (this.isRetiroEspecial ? 99 : 1);
    const residuoNombre = this.newPickup.residuoNombre;

    const tipoPrefijo = this.isRetiroEspecial ? '[RETIRO ESPECIAL DIMAO]' : '[AVISO RECORRIDO REGULAR]';
    const comentarioCompleto = [
      tipoPrefijo,
      this.newPickup.comentarios?.trim() || (this.isRetiroEspecial ? 'Solicitud de retiro de voluminosos' : 'Notificación vecinal para el cuadrante')
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
        this.isRetiroEspecial = false;
        this.syncOfficialMaterialForSector();
        this.pickupCreated.emit(res || payload);
        setTimeout(() => this.submitStatus = 'idle', 6000);
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
        }, 8000);
      }
    });
  }
}
