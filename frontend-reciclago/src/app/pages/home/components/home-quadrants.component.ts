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
  binImage: string;
}

const DEFAULT_MATERIALS_CYCLE: MaterialDefinition[] = [
  {
    categoryKey: 'VIDRIO',
    materialNombre: 'Vidrio',
    materialDescripcion: 'Botellas, frascos conserveros y envases de vidrio transparente o color',
    materialInstrucciones: 'Enjuagar botellas y frascos, retirar tapas y corchos. No incluir cerámica, ampolletas ni espejos.',
    binImage: 'assets/bin_vidrio_clean.png'
  },
  {
    categoryKey: 'CARTON',
    materialNombre: 'Cartón',
    materialDescripcion: 'Cajas de cartón corrugado, papel kraft, diarios y revistas limpias',
    materialInstrucciones: 'Aplanar cajas para reducir volumen. Mantener seco y libre de restos de grasa, comida o cintas adhesivas excesivas.',
    binImage: 'assets/bin_carton_clean.png'
  },
  {
    categoryKey: 'PLASTICO',
    materialNombre: 'Plásticos PET/PEAD',
    materialDescripcion: 'Botellas plásticas de bebidas (PET 1) y envases de detergente/lácteos (PEAD 2)',
    materialInstrucciones: 'Lavar, escurrir, aplastar para reducir volumen y volver a colocar la tapa plástica.',
    binImage: 'assets/bin_plasticos_clean.png'
  },
  {
    categoryKey: 'LATAS',
    materialNombre: 'Latas',
    materialDescripcion: 'Latas de bebidas de aluminio y tarros de conserva de hojalata',
    materialInstrucciones: 'Enjuagar para evitar olores y vectores sanitarios. Aplastar si es posible.',
    binImage: 'assets/bin_latas_clean.png'
  }
];

@Component({
  selector: 'app-home-quadrants',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- BEGIN: QuadrantsSection -->
    <section class="py-14 sm:py-20 bg-white relative overflow-hidden" id="cuadrantes">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Section Tag & Heading con Scroll Reveal -->
        <div class="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 reveal-init"
             [class.reveal-active]="isVisible">
          <div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a233b] tracking-tight mb-2 font-heading">
              Cuadrantes y Residuos Comunales
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 max-w-xl">
              Revisa tu cuadrante, el día de retiro y qué material corresponde esta semana según el catálogo oficial DIMAO.
            </p>
          </div>

          <!-- Selector / Indicador Reactivo de Rotación Municipal con Feedback Táctil -->
          <div class="inline-flex items-center gap-1 bg-[#edf5ef] p-1.5 rounded-2xl border border-emerald-200/80 self-start md:self-auto shadow-xs">
            <button
              type="button"
              (click)="selectWeek(1)"
              [class.bg-white]="activeWeek === 1"
              [class.text-[#1b5e20]]="activeWeek === 1"
              [class.shadow-sm]="activeWeek === 1"
              [class.font-bold]="activeWeek === 1"
              [class.text-slate-600]="activeWeek !== 1"
              class="px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-95">
              <i class="fa-solid fa-calendar-check text-xs" [class.text-emerald-600]="activeWeek === 1" [class.text-slate-400]="activeWeek !== 1"></i>
              <span>Semana Actual</span>
            </button>
            <button
              type="button"
              (click)="selectWeek(2)"
              [class.bg-white]="activeWeek === 2"
              [class.text-[#1b5e20]]="activeWeek === 2"
              [class.shadow-sm]="activeWeek === 2"
              [class.font-bold]="activeWeek === 2"
              [class.text-slate-600]="activeWeek !== 2"
              class="px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-95">
              <i class="fa-solid fa-calendar-plus text-xs" [class.text-emerald-600]="activeWeek === 2" [class.text-slate-400]="activeWeek !== 2"></i>
              <span>Próxima Semana</span>
            </button>
          </div>
        </div>

        <!-- Mobile View: Selector con Scroll Horizontal + Indicadores Degradados + Tarjeta con Acordeón (md:hidden) -->
        <div class="md:hidden">
          <!-- Contenedor con Scroll Horizontal e Indicadores Degradados laterales -->
          <div class="relative mb-3.5">
            <div class="pointer-events-none absolute left-0 top-0 bottom-2 w-5 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div class="pointer-events-none absolute right-0 top-0 bottom-2 w-5 bg-gradient-to-l from-white to-transparent z-10"></div>

            <div class="flex items-center gap-2 overflow-x-auto pb-2 px-1 no-scrollbar scroll-smooth">
              <button
                *ngFor="let q of quadrants; let i = index"
                type="button"
                (click)="setMobileQuadrant(i)"
                [class.bg-[#236836]]="selectedMobileIndex === i"
                [class.text-white]="selectedMobileIndex === i"
                [class.border-[#236836]]="selectedMobileIndex === i"
                [class.shadow-2xs]="selectedMobileIndex === i"
                [class.bg-white]="selectedMobileIndex !== i"
                [class.text-slate-700]="selectedMobileIndex !== i"
                [class.border-slate-200]="selectedMobileIndex !== i"
                class="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer">
                {{ q.name }}
              </button>
            </div>
          </div>

          <!-- Single Interactive Card con Transición Suave de Semana -->
          <article
            *ngIf="quadrants[selectedMobileIndex] as q"
            class="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
            [ngClass]="{ 'opacity-0 translate-y-3 scale-[0.98] pointer-events-none': isFadingOut, 'anim-week-switch': !isFadingOut }">
            
            <!-- Imagen Paisajística del Sector con Badge Cuadrante y Controles Flechas -->
            <div class="relative h-44 w-full overflow-hidden bg-slate-100">
              <img
                [src]="q.image"
                [alt]="'Sector ' + q.name + ' - Puerto Varas'"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none"></div>

              <span
                class="absolute bottom-3 left-3 bg-[#236836] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md tracking-wide">
                Cuadrante {{ q.cuadranteNumber }} · {{ q.name }}
              </span>

              <!-- Badge Aviso Reprogramación DIMAO -->
              <span *ngIf="q.diaModificado" class="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                <i class="fa-solid fa-bullhorn text-[9px]"></i> Aviso DIMAO
              </span>

              <!-- Badge Catálogo Live -->
              <span *ngIf="catalogLoaded" class="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[10px] font-bold text-emerald-800 px-2 py-0.5 rounded shadow-2xs border border-emerald-200">
                <i class="fa-solid fa-circle-check text-emerald-600 mr-1"></i>Catálogo Activo
              </span>

              <!-- Controles Flechas ← 1 / 4 → flotantes -->
              <div class="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs font-bold">
                <button
                  type="button"
                  (click)="prevMobileQuadrant()"
                  class="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                  aria-label="Cuadrante anterior">
                  ‹
                </button>
                <span class="text-[11px] font-semibold px-1">{{ selectedMobileIndex + 1 }} / {{ quadrants.length }}</span>
                <button
                  type="button"
                  (click)="nextMobileQuadrant()"
                  class="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                  aria-label="Siguiente cuadrante">
                  ›
                </button>
              </div>
            </div>

            <!-- Contenido Informativo de la Tarjeta Móvil -->
            <div class="p-4 sm:p-5">
              <div class="flex items-baseline justify-between mb-3">
                <h3 class="text-lg font-extrabold text-[#0a233b] tracking-tight font-heading">
                  {{ q.name }}
                </h3>
                <span class="text-xs text-slate-500 font-medium">{{ q.hours }}</span>
              </div>

              <!-- Grilla de Día de Retiro y Requisitos -->
              <div class="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                <div class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect height="18" rx="2" ry="2" stroke-width="2" width="18" x="3" y="4"></rect>
                    <line stroke-width="2" x1="16" x2="16" y1="2" y2="6"></line>
                    <line stroke-width="2" x1="8" x2="8" y1="2" y2="6"></line>
                    <line stroke-width="2" x1="3" x2="21" y1="10" y2="10"></line>
                  </svg>
                  <div>
                    <span class="block text-[10px] text-slate-500 font-medium">Día de retiro</span>
                    <span class="block text-xs font-extrabold" [ngClass]="q.diaModificado ? 'text-amber-900' : 'text-slate-800'">{{ q.day }}</span>
                    <span *ngIf="q.diaModificado" class="text-[9px] font-bold text-amber-800 bg-amber-100 px-1 py-0.5 rounded border border-amber-300 mt-0.5 inline-block">
                      Reprogramado
                    </span>
                  </div>
                </div>

                <div class="flex items-start gap-2">
                  <div class="w-4 h-4 rounded-full bg-[#206935] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs">
                    <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <span class="block text-[10px] text-slate-500 font-medium">Requisitos</span>
                    <span class="block text-xs font-bold text-slate-800 line-clamp-1">{{ q.requisitos }}</span>
                  </div>
                </div>
              </div>

              <!-- Fila Inferior: Material Asignado con Badge de Color según Material + Ilustración -->
              <div class="pt-3 flex items-center justify-between">
                <div>
                  <span class="block text-[10px] text-slate-500 font-medium">{{ activeWeek === 1 ? 'Material esta semana' : 'Material próxima semana' }}</span>
                  <div class="mt-0.5">
                    <span class="text-sm font-extrabold text-[#11324d]">{{ q.materialNombre }}</span>
                  </div>
                  <span *ngIf="q.materialDescripcion" class="block text-[11px] text-slate-500 mt-1 line-clamp-1 max-w-[200px]">
                    {{ q.materialDescripcion }}
                  </span>
                </div>

                <div class="flex items-center pl-2 shrink-0">
                  <img
                    [src]="q.binImage"
                    [alt]="q.materialNombre"
                    class="h-14 w-auto object-contain drop-shadow-sm"
                  />
                </div>
              </div>
            </div>

            <!-- Acordeón interactivo inline: Ver preparación para la entrega -->
            <button
              type="button"
              (click)="toggleAccordion(q.id)"
              class="w-full px-4 py-3 flex items-center justify-between text-xs text-emerald-700 font-bold border-t border-slate-100 hover:bg-emerald-50/50 transition-colors cursor-pointer"
              [attr.aria-expanded]="expandedAccordionId === q.id">
              <span class="inline-flex items-center gap-1.5">
                <i class="fa-solid fa-circle-info text-emerald-600"></i>
                <span>{{ expandedAccordionId === q.id ? 'Ocultar preparación' : 'Ver preparación para la entrega' }}</span>
              </span>
              <i class="fa-solid fa-chevron-down text-xs transition-transform duration-300 ease-out" [class.rotate-180]="expandedAccordionId === q.id"></i>
            </button>

            <!-- Panel Expandido del Acordeón Móvil con Grid Animado -->
            <div class="grid transition-all duration-300 ease-out"
                 [class.grid-rows-[1fr]]="expandedAccordionId === q.id"
                 [class.grid-rows-[0fr]]="expandedAccordionId !== q.id">
              <div class="overflow-hidden">
                <div class="p-4 bg-emerald-50/60 border-t border-emerald-100/80 text-xs text-slate-700 leading-relaxed">
                  <div class="font-bold text-[#206935] mb-1 flex items-center gap-1.5">
                    <i class="fa-solid fa-list-check"></i>
                    <span>Instrucciones de preparación comunal:</span>
                  </div>
                  <p class="mb-2">{{ q.materialInstrucciones || 'Enjuagar y secar botellas y envases antes de depositar. Aplanar cajas de cartón.' }}</p>
                  <div class="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                    <i class="fa-solid fa-circle-check text-emerald-600"></i>
                    <span>Entrega: {{ q.requisitos }} · Frente a frontis domiciliario</span>
                  </div>
                </div>
              </div>
            </div>

          </article>
        </div>

        <!-- Desktop View: 4 Quadrants Grid con Acordeón Fluido y Micro-interacciones -->
        <div class="hidden md:grid md:grid-cols-2 gap-7 lg:gap-8">
          <article
            *ngFor="let q of quadrants; let i = index"
            class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover-lift hover:border-emerald-300/80 hover:shadow-lg transition-all duration-300 flex flex-col justify-between reveal-init"
            [class.reveal-active]="isVisible"
            [style.transition-delay]="(i * 100) + 'ms'"
            [ngClass]="{ 'opacity-0 translate-y-3 scale-[0.98] pointer-events-none': isFadingOut, 'anim-week-switch': !isFadingOut && isVisible }">
            
            <div>
              <!-- Imagen Paisajística del Sector con Zoom Sutil -->
              <div class="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                <img
                  [src]="q.image"
                  [alt]="'Sector ' + q.name + ' - Puerto Varas'"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <span
                  class="absolute bottom-3 left-4 bg-[#236836] text-white text-xs font-bold px-3 py-1 rounded-md shadow-md tracking-wide">
                  Cuadrante {{ q.cuadranteNumber }}
                </span>
                
                <!-- Badge Aviso Reprogramación DIMAO -->
                <span *ngIf="q.diaModificado" class="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                  <i class="fa-solid fa-bullhorn text-[9px]"></i> Aviso DIMAO
                </span>

                <!-- Badge Catálogo Live -->
                <span *ngIf="catalogLoaded" class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-emerald-800 px-2 py-0.5 rounded shadow-2xs border border-emerald-200">
                  <i class="fa-solid fa-circle-check text-emerald-600 mr-1"></i>Catálogo Activo
                </span>
              </div>

              <!-- Contenido Informativo de la Tarjeta -->
              <div class="p-5 sm:p-6">
                <div class="flex items-baseline justify-between mb-4">
                  <h3 class="text-xl sm:text-2xl font-extrabold text-[#0a233b] tracking-tight font-heading group-hover:text-[#22a652] transition-colors duration-200">
                    {{ q.name }}
                  </h3>
                  <span class="text-xs text-slate-400 font-medium">{{ q.hours }}</span>
                </div>

                <!-- Grilla de Día de Retiro y Requisitos -->
                <div class="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                  <div class="flex items-start gap-2.5">
                    <svg class="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect height="18" rx="2" ry="2" stroke-width="2" width="18" x="3" y="4"></rect>
                      <line stroke-width="2" x1="16" x2="16" y1="2" y2="6"></line>
                      <line stroke-width="2" x1="8" x2="8" y1="2" y2="6"></line>
                      <line stroke-width="2" x1="3" x2="21" y1="10" y2="10"></line>
                    </svg>
                    <div>
                      <span class="block text-[11px] text-slate-500 font-medium">Día de retiro</span>
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="text-sm font-extrabold" [ngClass]="q.diaModificado ? 'text-amber-900' : 'text-slate-800'">{{ q.day }}</span>
                        <span *ngIf="q.diaModificado" class="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300 inline-flex items-center gap-1">
                          <i class="fa-solid fa-circle-exclamation text-[9px] text-amber-600"></i>
                          <span>Reprogramado</span>
                        </span>
                      </div>
                      <span *ngIf="q.diaModificado && q.motivoModificacion" class="block text-[10px] text-amber-700 font-medium mt-0.5">
                        {{ q.motivoModificacion }}
                      </span>
                    </div>
                  </div>

                  <div class="flex items-start gap-2.5">
                    <div class="w-5 h-5 rounded-full bg-[#206935] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <span class="block text-[11px] text-slate-500 font-medium">Requisitos de entrega</span>
                      <span class="block text-xs font-bold text-slate-800">{{ q.requisitos }}</span>
                    </div>
                  </div>
                </div>

                <!-- Fila Inferior: Material Asignado con Micro-interacción en el Bin -->
                <div class="pt-4 flex items-center justify-between">
                  <div>
                    <span class="block text-[11px] text-slate-500 font-medium">{{ activeWeek === 1 ? 'Material esta semana' : 'Material próxima semana' }}</span>
                    <div class="mt-0.5">
                      <span class="block text-base sm:text-lg font-extrabold text-[#11324d]">
                        {{ q.materialNombre }}
                      </span>
                    </div>
                    <span *ngIf="q.materialDescripcion" class="block text-[11px] text-slate-500 mt-1 line-clamp-1 max-w-xs">
                      {{ q.materialDescripcion }}
                    </span>
                  </div>

                  <!-- Ilustración de Material / Bin con Flotación Suave -->
                  <div class="flex items-center gap-2 pl-2">
                    <img
                      [src]="q.binImage"
                      [alt]="q.materialNombre"
                      class="h-16 w-auto object-contain drop-shadow-sm group-hover:scale-110 group-hover:-translate-y-1.5 transition-all duration-300 ease-out"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Acordeón interactivo inline: Ver preparación para la entrega -->
            <button
              type="button"
              (click)="toggleAccordion(q.id)"
              class="px-5 sm:px-6 py-3.5 flex items-center justify-between text-xs text-emerald-700 font-bold border-t border-slate-100 hover:bg-emerald-50/50 transition-colors cursor-pointer"
              [attr.aria-expanded]="expandedAccordionId === q.id">
              <span class="inline-flex items-center gap-2">
                <i class="fa-solid fa-circle-info text-emerald-600"></i>
                <span>{{ expandedAccordionId === q.id ? 'Ocultar instrucciones de preparación' : 'Ver preparación para la entrega' }}</span>
              </span>
              <i class="fa-solid fa-chevron-down text-xs transition-transform duration-300 ease-out" [class.rotate-180]="expandedAccordionId === q.id"></i>
            </button>

            <!-- Panel Expandido del Acordeón en Desktop con Grid Animado -->
            <div class="grid transition-all duration-300 ease-out"
                 [class.grid-rows-[1fr]]="expandedAccordionId === q.id"
                 [class.grid-rows-[0fr]]="expandedAccordionId !== q.id">
              <div class="overflow-hidden">
                <div class="px-5 sm:px-6 py-4 bg-emerald-50/50 border-t border-emerald-100/80 text-xs text-slate-700 leading-relaxed">
                  <div class="font-bold text-[#206935] mb-1 flex items-center gap-1.5">
                    <i class="fa-solid fa-list-check"></i>
                    <span>Instrucciones oficiales de entrega DIMAO:</span>
                  </div>
                  <p class="mb-2">{{ q.materialInstrucciones || 'Enjuagar y secar botellas y envases antes de depositar. Aplanar cajas de cartón.' }}</p>
                  <div class="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                    <i class="fa-solid fa-circle-check text-emerald-600"></i>
                    <span>Entrega: {{ q.requisitos }} · Frente a frontis domiciliario</span>
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
  private el = inject(ElementRef);
  private observer: IntersectionObserver | null = null;

  constructor(private bffService: BffService, private cdr: ChangeDetectorRef) {}

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

  currentCycleWeek: number = 3;

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

      // Sincronización con reprogramación de día del admin DIMAO
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
        diaModificado: !!override,
        diaOriginal: override ? override.diaOriginal : q.day,
        motivoModificacion: override?.motivo || ''
      };
    });
  }

  selectWeek(weekNumber: number): void {
    if (this.activeWeek === weekNumber && !this.isFadingOut) return;

    this.isFadingOut = true;
    this.expandedAccordionId = null;
    this.cdr.markForCheck();

    setTimeout(() => {
      this.activeWeek = weekNumber;
      this.updateQuadrantsForWeek(weekNumber);

      setTimeout(() => {
        this.isFadingOut = false;
        this.cdr.markForCheck();
      }, 50);
    }, 140);
  }

  onSelectQuadrant(q: QuadrantCardInfo): void {
    this.quadrantSelected.emit(q);
  }
}
