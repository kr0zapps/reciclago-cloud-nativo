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
    iconClass: 'fa-solid fa-can-food',
    binImage: 'assets/bin_latas_clean.png'
  }
];

@Component({
  selector: 'app-home-quadrants',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- SECCIÓN: Cuadrantes Semanales (Bento Editorial Asimétrico Sin Cajas-en-Cajas) -->
    <section class="py-20 sm:py-24 bg-niebla-50 relative border-b border-niebla-200" id="cuadrantes">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Encabezado & Selector de Semana Ejecutivo -->
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div class="max-w-2xl">
            <p class="font-mono text-xs text-pizarra-600 tracking-wider mb-2">
              DIVISIÓN TERRITORIAL · 4 CUADRANTES
            </p>
            <h2 class="text-3xl sm:text-5xl font-extrabold text-bosque-950 tracking-tight font-heading leading-tight mb-2">
              Cuadrantes y residuos semanales
            </h2>
            <p class="text-sm sm:text-base text-pizarra-600 font-sans leading-relaxed">
              Selecciona tu sector para revisar el día exacto de retiro, el tipo de residuo segregado y las condiciones de entrega en frontis.
            </p>
          </div>

          <!-- Selector de Semana Institucional -->
          <div class="inline-flex rounded-xl p-1 bg-white border border-niebla-200 shadow-2xs self-start md:self-auto font-mono text-xs">
            <button
              type="button"
              (click)="selectWeek(1)"
              [class.bg-bosque-950]="activeWeek === 1"
              [class.text-white]="activeWeek === 1"
              [class.text-pizarra-600]="activeWeek !== 1"
              class="px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-2">
              <i class="fa-solid fa-calendar-check" [class.text-lago-400]="activeWeek === 1"></i>
              <span>Semana Actual</span>
            </button>
            <button
              type="button"
              (click)="selectWeek(2)"
              [class.bg-bosque-950]="activeWeek === 2"
              [class.text-white]="activeWeek === 2"
              [class.text-pizarra-600]="activeWeek !== 2"
              class="px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-2">
              <i class="fa-solid fa-calendar-plus" [class.text-lago-400]="activeWeek === 2"></i>
              <span>Próxima Semana</span>
            </button>
          </div>
        </div>

        <!-- BENTO EDITORIAL ASIMÉTRICO (Grid 12 Columnas) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start transition-opacity duration-200" [class.opacity-0]="isFadingOut">
          
          <!-- MÓDULO DOMINANTE: Sector Seleccionado (7 Columnas) -->
          <article
            *ngIf="quadrants[activeSectorIndex] as q"
            class="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-niebla-200 shadow-sm flex flex-col justify-between anim-week-switch">
            
            <!-- Fotografía Panorámica con Niebla del Lago -->
            <div class="relative h-64 sm:h-80 w-full overflow-hidden bg-bosque-950">
              <img
                [src]="q.image"
                [alt]="'Sector ' + q.name + ' - Puerto Varas'"
                class="w-full h-full object-cover filter brightness-95 contrast-105"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-bosque-950/95 via-bosque-950/40 to-transparent"></div>

              <!-- Metadatos sobre la fotografía -->
              <div class="absolute top-4 left-5 right-5 flex justify-between items-center text-xs font-mono">
                <span class="bg-bosque-950/80 backdrop-blur-md text-white px-3 py-1 rounded-md border border-white/10">
                  CUADRANTE {{ q.cuadranteNumber }}
                </span>
                <span *ngIf="q.diaModificado" class="bg-madera-500 text-white px-3 py-1 rounded-md font-bold">
                  REPROGRAMADO
                </span>
              </div>

              <!-- Título del Sector Dominante -->
              <div class="absolute bottom-5 left-6 right-6">
                <span class="font-mono text-xs uppercase tracking-wider text-lago-400 block mb-1">
                  Sector Residencial Comunal
                </span>
                <h3 class="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight drop-shadow-sm">
                  {{ q.name }}
                </h3>
              </div>
            </div>

            <!-- Datos Tipográficos Continuos (SIN CAJAS DENTRO DE CAJAS) -->
            <div class="p-6 sm:p-8 space-y-5">
              
              <!-- Alerta oficial DIMAO si aplica -->
              <div *ngIf="q.diaModificado && q.motivoModificacion" class="p-4 rounded-xl bg-niebla-50 border border-madera-500/40 text-xs text-bosque-950 flex items-start gap-2.5">
                <i class="fa-solid fa-triangle-exclamation text-madera-500 mt-0.5 shrink-0"></i>
                <div>
                  <span class="font-bold text-madera-600">Aviso Oficial DIMAO:</span> {{ q.motivoModificacion }}
                </div>
              </div>

              <!-- Fila 1: Día y Horario -->
              <div class="flex flex-col sm:flex-row sm:items-baseline justify-between py-3 border-b border-niebla-200">
                <span class="text-xs font-mono text-pizarra-600 uppercase tracking-wider">Día y Horario de Recolección</span>
                <div class="text-left sm:text-right mt-1 sm:mt-0">
                  <span class="font-heading font-extrabold text-xl text-bosque-950 block">{{ q.day }}</span>
                  <span class="font-mono text-xs text-pizarra-600">{{ q.hours }}</span>
                </div>
              </div>

              <!-- Fila 2: Residuo Prioritario Asignado -->
              <div class="flex flex-col sm:flex-row sm:items-baseline justify-between py-3 border-b border-niebla-200">
                <span class="text-xs font-mono text-pizarra-600 uppercase tracking-wider">Residuo Asignado esta Semana</span>
                <div class="text-left sm:text-right mt-1 sm:mt-0">
                  <span class="font-heading font-extrabold text-xl text-bosque-700 block">{{ q.materialNombre }}</span>
                  <span class="text-xs text-pizarra-600">{{ q.materialDescripcion }}</span>
                </div>
              </div>

              <!-- Fila 3: Requisitos de Pureza en Frontis -->
              <div class="flex flex-col sm:flex-row sm:items-baseline justify-between py-3 border-b border-niebla-200">
                <span class="text-xs font-mono text-pizarra-600 uppercase tracking-wider">Condición de Entrega</span>
                <div class="text-left sm:text-right mt-1 sm:mt-0">
                  <span class="font-semibold text-sm text-bosque-950 block">{{ q.requisitos }}</span>
                  <span class="text-xs text-pizarra-600">Disponer en frontis antes de las 08:00 hrs</span>
                </div>
              </div>

              <!-- Fila 4: Protocolo DIMAO e Instrucción -->
              <div class="py-3 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <span class="text-xs font-mono text-pizarra-600 uppercase tracking-wider shrink-0">Normativa Sanitaria</span>
                <p class="text-xs text-pizarra-600 sm:text-right max-w-md leading-relaxed font-sans">
                  {{ q.materialInstrucciones || 'Enjuagar y escurrir botellas y envases antes de disponer. Sin restos orgánicos.' }}
                </p>
              </div>

              <!-- Botón de Acción Directo -->
              <div class="pt-4 border-t border-niebla-200 flex justify-between items-center">
                <button
                  type="button"
                  (click)="onSelectQuadrant(q)"
                  class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-bosque-950 hover:bg-bosque-900 text-white font-heading font-semibold text-xs transition cursor-pointer shadow-xs">
                  <span>Ver Ficha y Mapa de {{ q.name }}</span>
                  <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>

            </div>
          </article>

          <!-- CONSOLA LATERAL: Los Otros 3 Sectores (5 Columnas) -->
          <div class="lg:col-span-5 space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-niebla-200">
              <span class="font-mono text-xs text-pizarra-600 uppercase tracking-wider">
                Otros Sectores de la Comuna
              </span>
              <span class="font-mono text-[11px] text-pizarra-400">
                Selecciona para inspeccionar
              </span>
            </div>

            <!-- Lista de Cuadrantes Rápidos -->
            <div class="space-y-3">
              <div
                *ngFor="let sector of quadrants; let idx = index"
                (click)="activeSectorIndex = idx"
                [class.bg-white]="activeSectorIndex === idx"
                [class.border-bosque-700]="activeSectorIndex === idx"
                [class.shadow-xs]="activeSectorIndex === idx"
                [class.bg-niebla-100]="activeSectorIndex !== idx"
                [class.border-niebla-200]="activeSectorIndex !== idx"
                class="p-4 rounded-2xl border transition-all duration-200 cursor-pointer hover:border-bosque-700 flex items-center justify-between group">
                
                <div class="flex items-center gap-4">
                  <!-- Indicador de Cuadrante -->
                  <div
                    [class.bg-bosque-950]="activeSectorIndex === idx"
                    [class.text-white]="activeSectorIndex === idx"
                    [class.bg-white]="activeSectorIndex !== idx"
                    [class.text-pizarra-600]="activeSectorIndex !== idx"
                    class="w-10 h-10 rounded-xl border border-niebla-200 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    C{{ sector.cuadranteNumber }}
                  </div>

                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="font-heading font-bold text-sm text-bosque-950 group-hover:text-bosque-700 transition-colors">
                        {{ sector.name }}
                      </h4>
                      <span *ngIf="activeSectorIndex === idx" class="font-mono text-[9px] px-1.5 py-0.5 rounded bg-bosque-700 text-white font-semibold">
                        ACTIVO
                      </span>
                    </div>
                    <span class="text-xs text-pizarra-600 block">
                      {{ sector.day }} · {{ sector.materialNombre }}
                    </span>
                  </div>
                </div>

                <!-- Flecha de Selección -->
                <i
                  class="fa-solid fa-chevron-right text-xs transition-transform"
                  [class.text-bosque-950]="activeSectorIndex === idx"
                  [class.translate-x-1]="activeSectorIndex === idx"
                  [class.text-pizarra-400]="activeSectorIndex !== idx"></i>
              </div>
            </div>

            <!-- Resumen Informativo Comunal -->
            <div class="p-5 rounded-2xl bg-white border border-niebla-200 text-xs text-pizarra-600 leading-relaxed font-sans">
              <span class="font-bold text-bosque-950 block mb-1 font-heading">
                ¿No sabes cuál es tu cuadrante?
              </span>
              Revisa el letrero en tu esquina o consulta en el portal vecinal con tu dirección exacta para ver la fecha que te corresponde.
            </div>

          </div>

        </div>

      </div>
    </section>
  `
})
export class HomeQuadrantsComponent implements OnInit, OnDestroy {
  @Output() quadrantSelected = new EventEmitter<QuadrantCardInfo>();

  quadrants: QuadrantCardInfo[] = [...INITIAL_QUADRANTS];
  catalogLoaded = false;
  activeWeek: number = 1;
  activeSectorIndex: number = 0;

  isFadingOut = false;
  isVisible = false;
  private el = inject(ElementRef);
  private observer: IntersectionObserver | null = null;
  private liveResiduosMap = new Map<string, Residuo>();
  currentCycleWeek: number = 3;

  constructor(private bffService: BffService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.updateQuadrantsForWeek(this.activeWeek);
    this.loadCatalogResiduos();

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

  loadCatalogResiduos(): void {
    this.bffService.getRotacionSemanal().subscribe({
      next: (rot) => {
        if (rot && rot.slotSemana) {
          this.currentCycleWeek = rot.slotSemana;
          this.updateQuadrantsForWeek(this.activeWeek);
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
          this.updateQuadrantsForWeek(this.activeWeek);
          this.cdr.markForCheck();
        }
      },
      error: () => {
        this.catalogLoaded = false;
      }
    });
  }

  getEffectiveWeek(weekNumber: number): number {
    if (weekNumber === 2) {
      return (this.currentCycleWeek % 4) + 1;
    }
    return this.currentCycleWeek;
  }

  updateQuadrantsForWeek(weekNumber: number): void {
    const offset = weekNumber === 2 ? 1 : 0;
    const effectiveWeek = this.getEffectiveWeek(weekNumber);

    this.quadrants = INITIAL_QUADRANTS.map((q, idx) => {
      const matIndex = (idx + offset) % DEFAULT_MATERIALS_CYCLE.length;
      const baseMat = DEFAULT_MATERIALS_CYCLE[matIndex];
      const liveMat = this.liveResiduosMap.get(baseMat.categoryKey);

      const override = getScheduleOverrideForSector(q.name, effectiveWeek);

      return {
        ...q,
        cuadranteNumber: q.cuadranteNumber,
        name: q.name,
        shortName: q.shortName,
        day: override ? override.nuevoDia : q.day,
        hours: q.hours,
        image: q.image,
        categoryKey: baseMat.categoryKey,
        materialNombre: liveMat?.nombre || baseMat.materialNombre,
        materialDescripcion: liveMat?.descripcion || baseMat.materialDescripcion,
        materialInstrucciones: liveMat?.instrucciones || baseMat.materialInstrucciones,
        binImage: baseMat.binImage,
        iconClass: baseMat.iconClass || q.iconClass,
        diaModificado: !!override,
        diaOriginal: override ? override.diaOriginal : q.day,
        motivoModificacion: override?.motivo || ''
      };
    });
  }

  selectWeek(weekNumber: number): void {
    if (this.activeWeek === weekNumber && !this.isFadingOut) return;

    this.isFadingOut = true;
    this.cdr.markForCheck();

    setTimeout(() => {
      this.activeWeek = weekNumber;
      this.updateQuadrantsForWeek(weekNumber);

      setTimeout(() => {
        this.isFadingOut = false;
        this.cdr.markForCheck();
      }, 50);
    }, 150);
  }

  onSelectQuadrant(q: QuadrantCardInfo): void {
    this.quadrantSelected.emit(q);
  }
}
