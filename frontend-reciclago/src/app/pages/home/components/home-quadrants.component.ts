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
    <section class="py-16 sm:py-20 bg-slate-50/70 relative overflow-hidden border-b border-slate-200" id="cuadrantes">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Section Header Modern Clean -->
        <div class="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-5 reveal-init"
             [class.reveal-active]="isVisible">
          <div>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/70 mb-3 shadow-2xs">
              <i class="fa-solid fa-calendar-check text-[11px]"></i> Calendario Oficial de Retiros
            </span>
            <h2 class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading mb-2">
              Cuadrantes y Residuos Semanales
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 max-w-xl font-sans">
              Revisa tu sector comunal, el día de retiro programado y qué residuo corresponde separar esta semana.
            </p>
          </div>

          <!-- Selector de Semana Ejecutivo Moderno -->
          <div class="inline-flex rounded-xl p-1 bg-white border border-slate-200 shadow-2xs self-start md:self-auto">
            <button
              type="button"
              (click)="selectWeek(1)"
              [class.bg-slate-900]="activeWeek === 1"
              [class.text-white]="activeWeek === 1"
              [class.shadow-xs]="activeWeek === 1"
              [class.text-slate-600]="activeWeek !== 1"
              [class.hover:text-slate-900]="activeWeek !== 1"
              class="px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2">
              <i class="fa-solid fa-calendar-check" [class.text-emerald-400]="activeWeek === 1" [class.text-emerald-600]="activeWeek !== 1"></i>
              <span>Semana Actual</span>
            </button>
            <button
              type="button"
              (click)="selectWeek(2)"
              [class.bg-slate-900]="activeWeek === 2"
              [class.text-white]="activeWeek === 2"
              [class.shadow-xs]="activeWeek === 2"
              [class.text-slate-600]="activeWeek !== 2"
              [class.hover:text-slate-900]="activeWeek !== 2"
              class="px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2">
              <i class="fa-solid fa-calendar-plus" [class.text-emerald-400]="activeWeek === 2" [class.text-emerald-600]="activeWeek !== 2"></i>
              <span>Próxima Semana</span>
            </button>
          </div>
        </div>

        <!-- Mobile View: Selector con Scroll Horizontal + Tarjeta Interactiva (md:hidden) -->
        <div class="md:hidden">
          <!-- Pills cuadrantes móvil -->
          <div class="relative mb-4">
            <div class="flex items-center gap-2 overflow-x-auto pb-1 px-0.5 no-scrollbar scroll-smooth">
              <button
                *ngFor="let q of quadrants; let i = index"
                type="button"
                (click)="setMobileQuadrant(i)"
                [class.bg-slate-900]="selectedMobileIndex === i"
                [class.text-white]="selectedMobileIndex === i"
                [class.border-slate-900]="selectedMobileIndex === i"
                [class.shadow-xs]="selectedMobileIndex === i"
                [class.bg-white]="selectedMobileIndex !== i"
                [class.text-slate-600]="selectedMobileIndex !== i"
                [class.border-slate-200]="selectedMobileIndex !== i"
                class="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer">
                C{{ q.cuadranteNumber }} · {{ q.shortName }}
              </button>
            </div>
          </div>

          <!-- Single Interactive Card Móvil -->
          <article
            *ngIf="quadrants[selectedMobileIndex] as q"
            class="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col"
            [ngClass]="{ 'opacity-0 translate-y-3 scale-[0.98] pointer-events-none': isFadingOut, 'anim-week-switch': !isFadingOut }">
            
            <!-- Imagen Paisajística del Sector -->
            <div class="relative h-48 w-full overflow-hidden bg-slate-100">
              <img
                [src]="q.image"
                [alt]="'Sector ' + q.name + ' - Puerto Varas'"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent pointer-events-none"></div>

              <!-- Badges de cabecera -->
              <div class="absolute top-3 left-3 flex items-center gap-2">
                <span class="text-white text-xs font-semibold bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/15">
                  Cuadrante {{ q.cuadranteNumber }}
                </span>
                <span *ngIf="q.diaModificado" class="text-xs font-semibold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                  <i class="fa-solid fa-triangle-exclamation text-[10px]"></i> Reprogramado
                </span>
              </div>

              <span *ngIf="catalogLoaded" class="absolute top-3 right-3 text-xs font-semibold text-emerald-700 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                <i class="fa-solid fa-check-circle text-emerald-600"></i> DIMAO
              </span>

              <!-- Controles Flechas ← 1 / 4 → flotantes -->
              <div class="absolute top-12 right-3 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs font-medium border border-white/15">
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
              <div class="absolute bottom-3 left-4 right-4">
                <span class="text-[11px] font-semibold tracking-wider text-emerald-300 block uppercase">Sector Residencial</span>
                <h3 class="font-heading font-extrabold text-2xl text-white tracking-tight drop-shadow-sm">
                  {{ q.name }}
                </h3>
              </div>
            </div>

            <!-- Contenido Informativo Móvil -->
            <div class="p-5">
              <div *ngIf="q.diaModificado && q.motivoModificacion" class="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                <i class="fa-solid fa-circle-exclamation text-amber-600 mt-0.5 shrink-0"></i>
                <div>
                  <span class="font-bold">Aviso DIMAO:</span> {{ q.motivoModificacion }}
                </div>
              </div>

              <!-- 2-column info grid Modern -->
              <div class="grid grid-cols-2 gap-3 mb-4">
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div class="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
                    <i class="fa-regular fa-calendar text-slate-400"></i> Día de Retiro
                  </div>
                  <span class="font-heading font-bold text-slate-900 text-base">{{ q.day }}</span>
                  <span class="text-[11px] text-slate-500 mt-0.5">{{ q.hours }}</span>
                </div>
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div class="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
                    <i class="fa-solid fa-circle-check text-emerald-600"></i> Condición
                  </div>
                  <span class="text-xs font-semibold text-slate-800 leading-snug">{{ q.requisitos }}</span>
                  <span class="text-[11px] text-slate-500 mt-0.5">En frontis</span>
                </div>
              </div>

              <!-- Placa Material Asignado Modern -->
              <div class="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40 flex items-center justify-between mb-4">
                <div>
                  <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-0.5">
                    {{ activeWeek === 1 ? 'Esta Semana' : 'Próxima Semana' }}
                  </span>
                  <h4 class="font-heading font-extrabold text-base text-slate-900">{{ q.materialNombre }}</h4>
                  <p class="text-xs text-slate-600 mt-0.5 line-clamp-1">{{ q.materialDescripcion }}</p>
                </div>

                <div class="w-11 h-11 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-lg shrink-0 shadow-2xs text-emerald-600">
                  <svg *ngIf="q.categoryKey === 'VIDRIO'" class="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 2h8v4l-2 3v13H10V9L8 6V2z"></path><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="10" x2="14" y1="2" y2="2"></line></svg>
                  <svg *ngIf="q.categoryKey === 'CARTON'" class="w-5 h-5 text-amber-700" fill="currentColor" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                  <svg *ngIf="q.categoryKey === 'PLASTICO'" class="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 2h8v2H8V2zm1 3h6v2.5l2 3.5v11H7V11l2-3.5V5z"></path></svg>
                  <svg *ngIf="q.categoryKey === 'LATAS'" class="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24"><rect height="16" rx="2" width="10" x="7" y="4"></rect><path d="M9 2h6v2H9z"></path></svg>
                </div>
              </div>

              <!-- Acordeón protocolo -->
              <div class="border-t border-slate-100 pt-3">
                <button
                  type="button"
                  (click)="toggleAccordion(q.id)"
                  class="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer py-1"
                  [attr.aria-expanded]="expandedAccordionId === q.id">
                  <span class="inline-flex items-center gap-2">
                    <i class="fa-regular fa-circle-question text-slate-400"></i>
                    <span>{{ expandedAccordionId === q.id ? 'Ocultar instrucciones' : '¿Cómo preparar tus residuos?' }}</span>
                  </span>
                  <i class="fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-200" [class.rotate-180]="expandedAccordionId === q.id"></i>
                </button>

                <div *ngIf="expandedAccordionId === q.id"
                     class="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  <strong class="text-slate-900 font-semibold">Norma DIMAO:</strong> {{ q.materialInstrucciones || 'Enjuagar y secar botellas y envases antes de depositar.' }}
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Desktop View: 2 Columnas Limpias y Modernas -->
        <div class="hidden md:grid md:grid-cols-2 gap-7">
          <article
            *ngFor="let q of quadrants; let i = index"
            class="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between reveal-init"
            [class.reveal-active]="isVisible"
            [style.transition-delay]="(i * 100) + 'ms'"
            [ngClass]="{ 'opacity-0 translate-y-3 scale-[0.98] pointer-events-none': isFadingOut, 'anim-week-switch': !isFadingOut && isVisible }">
            
            <div>
              <!-- Imagen Paisajística del Sector -->
              <div class="relative h-52 w-full overflow-hidden bg-slate-100">
                <img
                  [src]="q.image"
                  [alt]="'Sector ' + q.name + ' - Puerto Varas'"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent pointer-events-none"></div>

                <!-- Badges de cabecera -->
                <div class="absolute top-3.5 left-4 flex items-center gap-2">
                  <span class="text-white text-xs font-semibold bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/15 shadow-xs">
                    Cuadrante {{ q.cuadranteNumber }}
                  </span>
                  <span *ngIf="q.diaModificado" class="text-xs font-semibold text-amber-900 bg-amber-100/90 px-2.5 py-1 rounded-md border border-amber-200 flex items-center gap-1.5 shadow-xs">
                    <i class="fa-solid fa-triangle-exclamation text-[10px]"></i> Reprogramado
                  </span>
                </div>

                <span *ngIf="catalogLoaded" class="absolute top-3.5 right-4 text-xs font-semibold text-emerald-700 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1.5 shadow-xs">
                  <i class="fa-solid fa-check-circle text-emerald-600"></i> DIMAO
                </span>

                <!-- Titular del Sector en Overlay -->
                <div class="absolute bottom-3.5 left-5 right-5">
                  <span class="text-[11px] font-semibold tracking-wider text-emerald-300 block uppercase">Sector Residencial</span>
                  <h3 class="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight drop-shadow-sm">
                    {{ q.name }}
                  </h3>
                </div>
              </div>

              <!-- Contenido Informativo de la Tarjeta Modern -->
              <div class="p-6">
                <div *ngIf="q.diaModificado && q.motivoModificacion" class="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                  <i class="fa-solid fa-triangle-exclamation text-amber-600 mt-0.5 shrink-0"></i>
                  <div>
                    <span class="font-bold">Aviso Oficial DIMAO:</span> {{ q.motivoModificacion }}
                  </div>
                </div>

                <!-- 2-column metadata grid Modern -->
                <div class="grid grid-cols-2 gap-3.5 mb-4">
                  <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div class="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                      <i class="fa-regular fa-calendar text-slate-400"></i> Día de Retiro
                    </div>
                    <span class="font-heading font-bold text-base sm:text-lg text-slate-900">{{ q.day }}</span>
                    <span class="text-xs text-slate-500 mt-0.5">{{ q.hours }}</span>
                  </div>
                  <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div class="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                      <i class="fa-solid fa-circle-check text-emerald-600"></i> Condición
                    </div>
                    <span class="text-xs font-semibold text-slate-800 leading-snug">{{ q.requisitos }}</span>
                    <span class="text-xs text-slate-500 mt-0.5">En frontis</span>
                  </div>
                </div>

                <!-- Material Row Modern -->
                <div class="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40 flex items-center justify-between mb-4">
                  <div>
                    <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-0.5">
                      {{ activeWeek === 1 ? 'Esta Semana' : 'Próxima Semana' }}
                    </span>
                    <h4 class="font-heading font-extrabold text-base sm:text-lg text-slate-900">{{ q.materialNombre }}</h4>
                    <p class="text-xs text-slate-600 mt-0.5 line-clamp-1">{{ q.materialDescripcion }}</p>
                  </div>

                  <div class="w-12 h-12 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-lg shrink-0 shadow-2xs">
                    <svg *ngIf="q.categoryKey === 'VIDRIO'" class="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 2h8v4l-2 3v13H10V9L8 6V2z"></path><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="10" x2="14" y1="2" y2="2"></line></svg>
                    <svg *ngIf="q.categoryKey === 'CARTON'" class="w-6 h-6 text-amber-700" fill="currentColor" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    <svg *ngIf="q.categoryKey === 'PLASTICO'" class="w-6 h-6 text-sky-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 2h8v2H8V2zm1 3h6v2.5l2 3.5v11H7V11l2-3.5V5z"></path></svg>
                    <svg *ngIf="q.categoryKey === 'LATAS'" class="w-6 h-6 text-slate-600" fill="currentColor" viewBox="0 0 24 24"><rect height="16" rx="2" width="10" x="7" y="4"></rect><path d="M9 2h6v2H9z"></path></svg>
                  </div>
                </div>

                <!-- Acordeón Desplegable para Instrucciones -->
                <div class="border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    (click)="toggleAccordion(q.id)"
                    class="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer py-1"
                    [attr.aria-expanded]="expandedAccordionId === q.id">
                    <span class="inline-flex items-center gap-2">
                      <i class="fa-regular fa-circle-question text-slate-400"></i>
                      <span>{{ expandedAccordionId === q.id ? 'Ocultar instrucciones' : '¿Cómo preparar tus residuos?' }}</span>
                    </span>
                    <i class="fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-200" [class.rotate-180]="expandedAccordionId === q.id"></i>
                  </button>

                  <!-- Panel Expandido del Acordeón -->
                  <div *ngIf="expandedAccordionId === q.id"
                       class="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                    <strong class="text-slate-900 font-semibold">Norma DIMAO:</strong> {{ q.materialInstrucciones || 'Enjuagar y secar botellas y envases antes de depositar.' }}
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


