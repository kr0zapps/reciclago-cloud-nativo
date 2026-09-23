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
    <!-- BEGIN: QuadrantsSection -->
    <section class="py-14 sm:py-20 bg-white relative overflow-hidden" id="cuadrantes">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Section Tag & Heading con Scroll Reveal -->
        <div class="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 reveal-init"
             [class.reveal-active]="isVisible">
          <div>
            <span class="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-[#206935] font-bold text-xs mb-3 shadow-2xs">
              Tu comuna, cuatro cuadrantes
            </span>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a233b] tracking-tight mb-2 font-heading">
              Cuadrantes y Residuos Comunales
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 max-w-xl">
              Revisa tu cuadrante, el día de retiro y qué material corresponde esta semana según el catálogo oficial DIMAO.
            </p>
          </div>

          <!-- Selector de Semana Ejecutivo -->
          <div class="inline-flex rounded-xl p-1 bg-gray-100 border border-[#E2E8F0] shadow-2xs self-start md:self-auto">
            <button
              type="button"
              (click)="selectWeek(1)"
              [class.bg-white]="activeWeek === 1"
              [class.text-[#123F5B]]="activeWeek === 1"
              [class.shadow-2xs]="activeWeek === 1"
              [class.font-bold]="activeWeek === 1"
              [class.text-gray-600]="activeWeek !== 1"
              class="px-4 py-2 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-2">
              <i class="fa-solid fa-calendar-check" [class.text-[#22a652]]="activeWeek === 1"></i>
              <span>Semana Actual</span>
            </button>
            <button
              type="button"
              (click)="selectWeek(2)"
              [class.bg-white]="activeWeek === 2"
              [class.text-[#123F5B]]="activeWeek === 2"
              [class.shadow-2xs]="activeWeek === 2"
              [class.font-bold]="activeWeek === 2"
              [class.text-gray-600]="activeWeek !== 2"
              class="px-4 py-2 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-2">
              <i class="fa-solid fa-calendar-plus" [class.text-[#22a652]]="activeWeek === 2"></i>
              <span>Próxima Semana</span>
            </button>
          </div>
        </div>

        <!-- Mobile View: Selector con Scroll Horizontal + Tarjeta Interactiva (md:hidden) -->
        <div class="md:hidden">
          <!-- Contenedor con Scroll Horizontal -->
          <div class="relative mb-4">
            <div class="flex items-center gap-2 overflow-x-auto pb-1 px-0.5 no-scrollbar scroll-smooth">
              <button
                *ngFor="let q of quadrants; let i = index"
                type="button"
                (click)="setMobileQuadrant(i)"
                [class.bg-[#123F5B]]="selectedMobileIndex === i"
                [class.text-white]="selectedMobileIndex === i"
                [class.border-[#123F5B]]="selectedMobileIndex === i"
                [class.shadow-xs]="selectedMobileIndex === i"
                [class.bg-white]="selectedMobileIndex !== i"
                [class.text-slate-600]="selectedMobileIndex !== i"
                [class.border-slate-200]="selectedMobileIndex !== i"
                class="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer">
                Cuadrante {{ q.cuadranteNumber }} · {{ q.shortName }}
              </button>
            </div>
          </div>

          <!-- Single Interactive Card con Transición Suave de Semana -->
          <article
            *ngIf="quadrants[selectedMobileIndex] as q"
            class="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs flex flex-col"
            [ngClass]="{ 'opacity-0 translate-y-3 scale-[0.98] pointer-events-none': isFadingOut, 'anim-week-switch': !isFadingOut }">
            
            <!-- Imagen Paisajística del Sector con Controles Flechas y Chips -->
            <div class="relative h-48 w-full overflow-hidden bg-slate-100">
              <img
                [src]="q.image"
                [alt]="'Sector ' + q.name + ' - Puerto Varas'"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/20 to-transparent pointer-events-none"></div>

              <!-- Badges de cabecera en foto -->
              <div class="absolute top-3 left-3 flex items-center gap-2">
                <span *ngIf="q.diaModificado" class="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                  <i class="fa-solid fa-circle-exclamation text-[9px]"></i> Cambio fecha
                </span>
              </div>

              <span *ngIf="catalogLoaded" class="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[10px] font-semibold text-slate-700 px-2 py-0.5 rounded-full shadow-2xs border border-white/40 flex items-center gap-1">
                <i class="fa-solid fa-circle-check text-[#22a652]"></i> DIMAO
              </span>

              <!-- Chip Cuadrante -->
              <div class="absolute bottom-3 left-3 flex items-center gap-2">
                <span class="bg-[#206935] text-white text-xs font-bold px-3 py-1 rounded shadow-md">
                  Cuadrante {{ q.cuadranteNumber }}
                </span>
              </div>

              <!-- Controles Flechas ← 1 / 4 → flotantes -->
              <div class="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs font-semibold">
                <button
                  type="button"
                  (click)="prevMobileQuadrant()"
                  class="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                  aria-label="Cuadrante anterior">
                  ‹
                </button>
                <span class="text-[11px] font-medium px-1">{{ selectedMobileIndex + 1 }} / {{ quadrants.length }}</span>
                <button
                  type="button"
                  (click)="nextMobileQuadrant()"
                  class="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                  aria-label="Siguiente cuadrante">
                  ›
                </button>
              </div>
            </div>

            <!-- Contenido Informativo Móvil (2-Column Info Grid) -->
            <div class="p-5">
              <h3 class="text-xl font-extrabold text-[#0a233b] mb-3 font-heading">
                {{ q.name }}
              </h3>

              <div *ngIf="q.diaModificado && q.motivoModificacion" class="mb-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                <i class="fa-solid fa-circle-exclamation text-amber-600 mt-0.5 shrink-0"></i>
                <div>
                  <span class="font-bold">Aviso DIMAO:</span> {{ q.motivoModificacion }}
                </div>
              </div>

              <!-- 2-column info grid Stitch -->
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
                    <span class="block text-xs font-extrabold text-slate-800">{{ q.day }}</span>
                    <span class="block text-[10px] text-slate-400 font-medium">{{ q.hours }}</span>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <div class="w-4 h-4 rounded-full bg-[#206935] flex items-center justify-center text-white shrink-0 mt-0.5">
                    <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <span class="block text-[10px] text-slate-500 font-medium">Requisitos</span>
                    <span class="block text-xs font-bold text-slate-800">{{ q.requisitos }}</span>
                  </div>
                </div>
              </div>

              <!-- Material Asignado -->
              <div class="pt-3 flex items-center justify-between">
                <div>
                  <span class="block text-[10px] text-[#22a652] font-bold uppercase tracking-wider">
                    {{ activeWeek === 1 ? 'Esta semana' : 'Próxima semana' }}
                  </span>
                  <span class="block text-base font-extrabold text-[#11324d] mt-0.5">
                    {{ q.materialNombre }}
                  </span>
                  <p class="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {{ q.materialDescripcion }}
                  </p>
                </div>

                <div class="w-10 h-10 rounded-full bg-[#dcf2e3] flex items-center justify-center text-[#206935] shrink-0">
                  <svg *ngIf="q.categoryKey === 'VIDRIO'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 2h8v4l-2 3v13H10V9L8 6V2z"></path><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="10" x2="14" y1="2" y2="2"></line></svg>
                  <svg *ngIf="q.categoryKey === 'CARTON'" class="w-5 h-5 text-amber-700" fill="currentColor" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                  <svg *ngIf="q.categoryKey === 'PLASTICO'" class="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 2h8v2H8V2zm1 3h6v2.5l2 3.5v11H7V11l2-3.5V5z"></path></svg>
                  <svg *ngIf="q.categoryKey === 'LATAS'" class="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24"><rect height="16" rx="2" width="10" x="7" y="4"></rect><path d="M9 2h6v2H9z"></path></svg>
                </div>
              </div>

              <!-- Acordeón preparación -->
              <div class="mt-3 pt-2.5 border-t border-slate-100">
                <button
                  type="button"
                  (click)="toggleAccordion(q.id)"
                  class="w-full flex items-center justify-between text-xs font-semibold text-slate-500 hover:text-[#0a233b] transition-colors cursor-pointer"
                  [attr.aria-expanded]="expandedAccordionId === q.id">
                  <span class="inline-flex items-center gap-1.5">
                    <i class="fa-regular fa-circle-question text-slate-400 text-xs"></i>
                    <span>{{ expandedAccordionId === q.id ? 'Ocultar recomendaciones' : '¿Cómo preparar tus residuos?' }}</span>
                  </span>
                  <i class="fa-solid fa-chevron-down text-[9px] transition-transform duration-200 text-slate-400" [class.rotate-180]="expandedAccordionId === q.id"></i>
                </button>

                <div *ngIf="expandedAccordionId === q.id"
                     class="mt-2 p-2.5 rounded-lg bg-[#F8FAF7] border border-[#E2E8F0] text-xs text-slate-600 leading-relaxed">
                  <strong class="text-[#0a233b]">Instrucción DIMAO:</strong> {{ q.materialInstrucciones || 'Enjuagar y secar botellas y envases antes de depositar.' }}
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Desktop View: 2 Columnas Elegantes Stitch -->
        <div class="hidden md:grid md:grid-cols-2 gap-6 lg:gap-8">
          <article
            *ngFor="let q of quadrants; let i = index"
            class="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between reveal-init"
            [class.reveal-active]="isVisible"
            [style.transition-delay]="(i * 100) + 'ms'"
            [ngClass]="{ 'opacity-0 translate-y-3 scale-[0.98] pointer-events-none': isFadingOut, 'anim-week-switch': !isFadingOut && isVisible }">
            
            <div>
              <!-- Imagen Paisajística del Sector con Encuadre Editorial -->
              <div class="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                <img
                  [src]="q.image"
                  [alt]="'Sector ' + q.name + ' - Puerto Varas'"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/20 to-transparent pointer-events-none"></div>

                <!-- Badges de cabecera -->
                <div class="absolute top-3 left-3 flex items-center gap-2">
                  <span *ngIf="q.diaModificado" class="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-xs flex items-center gap-1.5">
                    <i class="fa-solid fa-circle-exclamation text-[9px]"></i> Cambio de fecha
                  </span>
                </div>

                <span *ngIf="catalogLoaded" class="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[10px] font-semibold text-slate-700 px-2.5 py-1 rounded-full shadow-2xs border border-white/40 flex items-center gap-1">
                  <i class="fa-solid fa-circle-check text-[#22a652]"></i> DIMAO
                </span>

                <!-- Chip de Sector en overlay -->
                <div class="absolute bottom-3 left-4 flex items-center gap-2">
                  <span class="bg-[#206935] text-white text-xs font-bold px-3 py-1 rounded shadow-md tracking-wide">
                    Cuadrante {{ q.cuadranteNumber }}
                  </span>
                </div>
              </div>

              <!-- Contenido Informativo de la Tarjeta Stitch (2-Column Info Grid) -->
              <div class="p-6">
                <!-- Cabecera del Sector -->
                <h3 class="text-xl sm:text-2xl font-extrabold text-[#0a233b] mb-4 font-heading group-hover:text-[#22a652] transition-colors duration-200">
                  {{ q.name }}
                </h3>

                <div *ngIf="q.diaModificado && q.motivoModificacion" class="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                  <i class="fa-solid fa-circle-exclamation text-amber-600 mt-0.5 shrink-0"></i>
                  <div>
                    <span class="font-bold">Aviso DIMAO:</span> {{ q.motivoModificacion }}
                  </div>
                </div>

                <!-- 2-column metadata grid from Stitch -->
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
                      <span class="block text-sm font-extrabold text-slate-800">{{ q.day }}</span>
                      <span class="block text-[11px] text-slate-400 font-medium">{{ q.hours }}</span>
                    </div>
                  </div>
                  <div class="flex items-start gap-2.5">
                    <div class="w-5 h-5 rounded-full bg-[#206935] flex items-center justify-center text-white shrink-0 mt-0.5">
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

                <!-- Material Row with pure vector SVG icon -->
                <div class="pt-4 flex items-center justify-between">
                  <div>
                    <span class="block text-[11px] text-[#22a652] font-bold uppercase tracking-wider">
                      {{ activeWeek === 1 ? 'Esta semana' : 'Próxima semana' }}
                    </span>
                    <span class="block text-base sm:text-lg font-extrabold text-[#11324d] mt-0.5">
                      {{ q.materialNombre }}
                    </span>
                    <p class="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {{ q.materialDescripcion }}
                    </p>
                  </div>

                  <div class="w-11 h-11 rounded-full bg-[#dcf2e3] flex items-center justify-center text-[#206935] shrink-0">
                    <svg *ngIf="q.categoryKey === 'VIDRIO'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 2h8v4l-2 3v13H10V9L8 6V2z"></path><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="10" x2="14" y1="2" y2="2"></line></svg>
                    <svg *ngIf="q.categoryKey === 'CARTON'" class="w-5 h-5 text-amber-700" fill="currentColor" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    <svg *ngIf="q.categoryKey === 'PLASTICO'" class="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 2h8v2H8V2zm1 3h6v2.5l2 3.5v11H7V11l2-3.5V5z"></path></svg>
                    <svg *ngIf="q.categoryKey === 'LATAS'" class="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24"><rect height="16" rx="2" width="10" x="7" y="4"></rect><path d="M9 2h6v2H9z"></path></svg>
                  </div>
                </div>

                <!-- Acordeón Desplegable para Instrucciones -->
                <div class="mt-4 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    (click)="toggleAccordion(q.id)"
                    class="w-full flex items-center justify-between text-xs font-semibold text-slate-500 hover:text-[#0a233b] transition-colors cursor-pointer"
                    [attr.aria-expanded]="expandedAccordionId === q.id">
                    <span class="inline-flex items-center gap-2">
                      <i class="fa-regular fa-circle-question text-slate-400 text-xs"></i>
                      <span>{{ expandedAccordionId === q.id ? 'Ocultar recomendaciones' : '¿Cómo preparar tus residuos?' }}</span>
                    </span>
                    <i class="fa-solid fa-chevron-down text-[10px] transition-transform duration-200 text-slate-400" [class.rotate-180]="expandedAccordionId === q.id"></i>
                  </button>

                  <!-- Panel Expandido del Acordeón -->
                  <div *ngIf="expandedAccordionId === q.id"
                       class="mt-2.5 p-3 rounded-lg bg-[#F8FAF7] border border-[#E2E8F0] text-xs text-slate-600 leading-relaxed">
                    <strong class="text-[#0a233b]">Instrucción DIMAO:</strong> {{ q.materialInstrucciones || 'Enjuagar y secar botellas y envases antes de depositar.' }}
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


