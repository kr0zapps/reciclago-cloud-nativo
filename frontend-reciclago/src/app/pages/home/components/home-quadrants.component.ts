import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BffService } from '../../../services/bff.service';
import { QuadrantCardInfo, INITIAL_QUADRANTS } from '../data/home-sectors.data';
import { Residuo, getScheduleOverrideForSector } from '../../dashboard/data/sectors.data';

interface MaterialDefinition {
  categoryKey: string;
  materialNombre: string;
  materialDescripcion: string;
  materialInstrucciones: string;
  iconClass: string;
  binImage: string;
}

export interface QuadrantTrackingInfo {
  patente: string | null;
  enRuta: boolean;
  calleActual: string | null;
  kilosCargados: number | null;
}

const DEFAULT_MATERIALS_CYCLE: MaterialDefinition[] = [
  {
    categoryKey: 'VIDRIO',
    materialNombre: 'Vidrio',
    materialDescripcion: 'Botellas y frascos de vidrio',
    materialInstrucciones: 'Enjuagar botellas y frascos, retirar tapas y corchos. Sin cerámica ni espejos.',
    iconClass: 'fa-solid fa-wine-bottle',
    binImage: 'assets/bin_vidrio_clean.png'
  },
  {
    categoryKey: 'CARTON',
    materialNombre: 'Cartón',
    materialDescripcion: 'Cajas dobladas, diarios y papel',
    materialInstrucciones: 'Aplanar cajas para reducir volumen. Mantener seco y libre de restos de comida.',
    iconClass: 'fa-solid fa-box-open',
    binImage: 'assets/bin_carton_clean.png'
  },
  {
    categoryKey: 'PLASTICO',
    materialNombre: 'Plásticos PET/PEAD',
    materialDescripcion: 'Botellas plásticas y envases limpios',
    materialInstrucciones: 'Lavar, escurrir, aplastar y volver a colocar la tapa plástica.',
    iconClass: 'fa-solid fa-bottle-water',
    binImage: 'assets/bin_plasticos_clean.png'
  },
  {
    categoryKey: 'LATAS',
    materialNombre: 'Latas',
    materialDescripcion: 'Latas de bebidas y conservas',
    materialInstrucciones: 'Enjuagar para evitar olores. Aplastar si es posible.',
    iconClass: 'fa-solid fa-boxes-stacked',
    binImage: 'assets/bin_latas_clean.png'
  }
];

@Component({
  selector: 'app-home-quadrants',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- BEGIN: QuadrantsSection -->
    <section class="py-10 sm:py-16 bg-slate-50/70 relative overflow-hidden border-b border-slate-200" id="cuadrantes">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Section Header Modern Clean -->
        <div class="mb-5 sm:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-3 sm:gap-4 reveal-init"
             [class.reveal-active]="isVisible">
          <div>
            <h2 class="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading mb-1">
              Cuadrantes de Retiro
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 max-w-xl font-sans">
              Revisa tu sector comunal, el día de retiro programado y el estado del camión recolector.
            </p>
          </div>
        </div>

        <!-- Mobile View: Selector de 4 Sectores en 1 Fila (CERO scroll horizontal) + Tarjeta Interactiva (md:hidden) -->
        <div class="md:hidden">
          <!-- Selector Cuadrantes Móvil: Grid de 4 columnas que encaja al 100% de la pantalla sin deslizar -->
          <div class="grid grid-cols-4 gap-1 p-1 bg-slate-200/80 rounded-xl mb-3 border border-slate-200/90 shadow-2xs">
            <button
              *ngFor="let q of quadrants; let i = index"
              type="button"
              (click)="setMobileQuadrant(i)"
              [class.bg-white]="selectedMobileIndex === i"
              [class.text-slate-900]="selectedMobileIndex === i"
              [class.shadow-xs]="selectedMobileIndex === i"
              [class.font-bold]="selectedMobileIndex === i"
              [class.text-slate-600]="selectedMobileIndex !== i"
              [class.hover:text-slate-900]="selectedMobileIndex !== i"
              class="py-2 px-1 rounded-lg text-center transition-all cursor-pointer">
              <span class="block text-[10px] leading-tight truncate mt-1 text-slate-500" [class.text-emerald-700]="selectedMobileIndex === i" [class.font-semibold]="selectedMobileIndex === i">{{ q.shortName }}</span>
            </button>
          </div>

          <!-- Single Interactive Card Móvil Compacta -->
          <article
            *ngIf="quadrants[selectedMobileIndex] as q"
            class="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs flex flex-col"
            [ngClass]="{ 'opacity-0 translate-y-3 scale-[0.98] pointer-events-none': isFadingOut, 'anim-week-switch': !isFadingOut }">
            
            <!-- Imagen Paisajística del Sector (Compacta) -->
            <div class="relative h-32 w-full overflow-hidden bg-slate-100">
              <img
                [src]="q.image"
                [alt]="'Sector ' + q.name + ' - Puerto Varas'"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-slate-900/10 pointer-events-none"></div>

              <!-- Badges de cabecera -->
              <div class="absolute top-2.5 left-3 flex items-center gap-2">
                <span class="text-white text-[11px] font-semibold bg-slate-900/80 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-white/15">
                  Cuadrante {{ q.cuadranteNumber }}
                </span>
                <span *ngIf="q.diaModificado" class="text-[11px] font-semibold text-amber-900 bg-amber-100/95 px-2 py-0.5 rounded-md border border-amber-300 flex items-center gap-1">
                  <i class="fa-solid fa-triangle-exclamation text-[9px]"></i> Reprogramado
                </span>
              </div>

              <!-- Controles Flechas ← 1 / 4 → flotantes -->
              <div class="absolute top-2.5 right-3 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-white text-xs font-medium border border-white/15">
                <button
                  type="button"
                  (click)="prevMobileQuadrant()"
                  class="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                  aria-label="Cuadrante anterior">
                  ‹
                </button>
                <span class="text-[10px] px-1">{{ selectedMobileIndex + 1 }} / {{ quadrants.length }}</span>
                <button
                  type="button"
                  (click)="nextMobileQuadrant()"
                  class="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                  aria-label="Siguiente cuadrante">
                  ›
                </button>
              </div>

              <!-- Título en Overlay -->
              <div class="absolute bottom-2.5 left-3 right-3 flex items-baseline justify-between">
                <h3 class="font-heading font-extrabold text-xl text-white tracking-tight drop-shadow-sm">
                  {{ q.name }}
                </h3>
              </div>
            </div>

            <!-- Contenido Informativo Móvil Compacto -->
            <div class="p-4">
              <!-- Estado del Camión en el Cuadrante (Información en Vivo) -->
              <div *ngIf="getTracking(q.cuadranteNumber) as t" class="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <i class="fa-solid fa-truck text-slate-500"></i>
                    <span class="font-semibold text-slate-900">
                      {{ t.patente ? 'Camión ' + t.patente : 'Camión municipal' }}
                    </span>
                  </div>
                  <span class="text-xs font-semibold" [ngClass]="t.enRuta ? 'text-[#1b8e45]' : 'text-slate-500'">
                    {{ t.enRuta ? 'En recorrido' : 'En base' }}
                  </span>
                </div>
                <div *ngIf="t.calleActual" class="text-[11px] text-slate-500 mt-1 truncate">
                  Pasa por: {{ t.calleActual }}
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Desktop View: 2 Columnas Limpias y Compactas -->
        <div class="hidden md:grid md:grid-cols-2 gap-5">
          <article
            *ngFor="let q of quadrants; let i = index"
            class="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between reveal-init"
            [class.reveal-active]="isVisible"
            [style.transition-delay]="(i * 100) + 'ms'"
            [ngClass]="{ 'opacity-0 translate-y-3 scale-[0.98] pointer-events-none': isFadingOut, 'anim-week-switch': !isFadingOut && isVisible }">
            
            <div>
              <!-- Imagen Paisajística del Sector (Compacta h-36) -->
              <div class="relative h-36 w-full overflow-hidden bg-slate-100">
                <img
                  [src]="q.image"
                  [alt]="'Sector ' + q.name + ' - Puerto Varas'"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-slate-900/10 pointer-events-none"></div>

                <!-- Badges de cabecera -->
                <div class="absolute top-2.5 left-4 flex items-center gap-2">
                  <span *ngIf="q.diaModificado" class="text-[11px] font-semibold text-amber-900 bg-amber-100/95 px-2 py-0.5 rounded-md border border-amber-300 flex items-center gap-1 shadow-2xs">
                    <i class="fa-solid fa-triangle-exclamation text-[9px]"></i> Reprogramado
                  </span>
                </div>

                <div class="absolute bottom-2.5 left-4 right-4 flex items-baseline justify-between">
                  <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight drop-shadow-sm">
                    {{ q.name }}
                  </h3>
                </div>
              </div>

              <!-- Contenido Informativo Compacto -->
              <div class="p-4 sm:p-5 flex flex-col justify-between">
                <!-- Estado del Camión en el Cuadrante (Información en Vivo) -->
                <div *ngIf="getTracking(q.cuadranteNumber) as t" class="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <i class="fa-solid fa-truck text-slate-500"></i>
                      <span class="font-semibold text-slate-900">
                        {{ t.patente ? 'Camión ' + t.patente : 'Camión municipal' }}
                      </span>
                    </div>
                    <span class="text-xs font-semibold" [ngClass]="t.enRuta ? 'text-[#1b8e45]' : 'text-slate-500'">
                      {{ t.enRuta ? 'En recorrido' : 'En base' }}
                    </span>
                  </div>
                  <div *ngIf="t.calleActual" class="text-[11px] text-slate-500 mt-1 truncate">
                    Pasa por: {{ t.calleActual }}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

      </div>
    </section>
    <!-- END: QuadrantsSection -->
  `
})
export class HomeQuadrantsComponent implements OnInit, OnDestroy {
  @Output() quadrantSelected = new EventEmitter<QuadrantCardInfo>();

  quadrants: QuadrantCardInfo[] = [...INITIAL_QUADRANTS];
  catalogLoaded = false;
  activeWeek: number = 1;
  selectedMobileIndex: number = 0;
  expandedAccordionId: string | null = null;

  isFadingOut = false;
  isVisible = false;
  private readonly el = inject(ElementRef);
  private observer: IntersectionObserver | null = null;

  constructor(private readonly bffService: BffService, private readonly cdr: ChangeDetectorRef) {}

  toggleAccordion(id: string): void {
    this.expandedAccordionId = this.expandedAccordionId === id ? null : id;
  }

  setMobileQuadrant(index: number): void {
    this.selectedMobileIndex = index;
    this.expandedAccordionId = null;
  }

  nextMobileQuadrant(): void {
    if (this.quadrants.length > 0) {
      this.selectedMobileIndex = (this.selectedMobileIndex + 1) % this.quadrants.length;
      this.expandedAccordionId = null;
    }
  }

  prevMobileQuadrant(): void {
    if (this.quadrants.length > 0) {
      this.selectedMobileIndex = (this.selectedMobileIndex - 1 + this.quadrants.length) % this.quadrants.length;
      this.expandedAccordionId = null;
    }
  }

  private liveResiduosMap = new Map<string, Residuo>();

  trackingByQuadranteId = new Map<number, QuadrantTrackingInfo>([
    [1, { patente: 'PV-RC-2027', enRuta: true, calleActual: 'Colón con Decher', kilosCargados: 310 }],
    [2, { patente: 'PV-RC-2026', enRuta: true, calleActual: 'Av. Vicente Pérez Rosales', kilosCargados: 420 }],
    [3, { patente: 'PV-RC-2028', enRuta: false, calleActual: 'Base operativa DIMAO', kilosCargados: 0 }],
    [4, { patente: 'PV-RC-2026', enRuta: false, calleActual: 'Base operativa DIMAO', kilosCargados: 0 }]
  ]);

  getTracking(cuadranteNumber: number): QuadrantTrackingInfo | null {
    return this.trackingByQuadranteId.get(cuadranteNumber) || null;
  }

  loadTrackingAll(): void {
    this.bffService.getCuadrantes().subscribe({
      next: (cuadrantes: any[]) => {
        if (Array.isArray(cuadrantes) && cuadrantes.length > 0) {
          cuadrantes.forEach((c: any) => {
            const numero = c.numero || c.id;
            const current = this.trackingByQuadranteId.get(numero) || {
              patente: null,
              enRuta: false,
              calleActual: null,
              kilosCargados: null
            };
            if (c.camionPatente) current.patente = c.camionPatente;
            if (c.camionEnRuta !== undefined && c.camionEnRuta !== null) {
              current.enRuta = Boolean(c.camionEnRuta);
            }
            this.trackingByQuadranteId.set(numero, current);

            if (c.id) {
              this.bffService.getTracking(c.id).subscribe({
                next: (tracking: any) => {
                  if (tracking) {
                    if (tracking.calleActual) current.calleActual = tracking.calleActual;
                    if (tracking.kilosCargados !== undefined) current.kilosCargados = tracking.kilosCargados;
                    if (tracking.estado === 'EN_CIRCULACION') current.enRuta = true;
                    this.trackingByQuadranteId.set(numero, current);
                    this.cdr.markForCheck();
                  }
                },
                error: () => {}
              });
            }
          });
          this.cdr.markForCheck();
        }
      },
      error: () => {}
    });
  }

  ngOnInit(): void {
    this.updateQuadrants();
    this.loadCatalogResiduos();
    this.loadTrackingAll();

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) {
          this.isVisible = true;
          this.cdr.markForCheck();
          this.observer?.disconnect();
        }
      }, { threshold: 0.12 });
      this.observer.observe(this.el.nativeElement);
    } else {
      this.isVisible = true;
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  currentCycleWeek: number = 3;

  loadCatalogResiduos(): void {
    this.bffService.getRotacionSemanal().subscribe({
      next: (rot) => {
        if (rot && rot.slotSemana) {
          this.currentCycleWeek = rot.slotSemana;
          this.updateQuadrants();
          this.cdr.markForCheck();
        }
      },
      error: () => {}
    });

    this.bffService.getResiduos().subscribe({
      next: (residuos: Residuo[]) => {
        if (residuos && residuos.length > 0) {
          this.catalogLoaded = true;
          residuos.forEach(r => {
            const cat = (r.categoria || r.tipo || '').toUpperCase();
            if (cat.includes('VIDRIO')) this.liveResiduosMap.set('VIDRIO', r);
            else if (cat.includes('CARTON')) this.liveResiduosMap.set('CARTON', r);
            else if (cat.includes('PLASTICO')) this.liveResiduosMap.set('PLASTICO', r);
            else if (cat.includes('LATA') || cat.includes('METAL')) this.liveResiduosMap.set('LATAS', r);
          });
          this.updateQuadrants();
          this.cdr.markForCheck();
        }
      },
      error: () => {
        this.catalogLoaded = false;
      }
    });
  }

  updateQuadrants(): void {
    this.quadrants = INITIAL_QUADRANTS.map((q) => {
      return {
        ...q,
        cuadranteNumber: q.cuadranteNumber,
        name: q.name,
        shortName: q.shortName,
        image: q.image
      };
    });
  }

  onSelectQuadrant(q: QuadrantCardInfo): void {
    this.quadrantSelected.emit(q);
  }
}


