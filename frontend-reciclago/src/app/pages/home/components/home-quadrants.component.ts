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
    <section class="py-10 sm:py-16 bg-slate-50/70 relative overflow-hidden border-b border-slate-200" id="cuadrantes">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Section Header Modern Clean -->
        <div class="mb-5 sm:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-3 sm:gap-4 reveal-init"
             [class.reveal-active]="isVisible">
          <div>
            <h2 class="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading mb-1">
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
              class="px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2">
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
              class="px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2">
              <i class="fa-solid fa-calendar-plus" [class.text-emerald-400]="activeWeek === 2" [class.text-emerald-600]="activeWeek !== 2"></i>
              <span>Próxima Semana</span>
            </button>
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
              <div *ngIf="q.diaModificado && q.motivoModificacion" class="mb-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-snug flex items-start gap-2">
                <i class="fa-solid fa-circle-exclamation text-amber-600 mt-0.5 shrink-0 text-xs"></i>
                <div>
                  <span class="font-bold">Aviso DIMAO:</span> {{ q.motivoModificacion }}
                </div>
              </div>

              <!-- Placa Material Asignado -->
              <div class="p-3 rounded-xl border border-slate-200/90 bg-slate-50/70 flex items-center justify-between gap-3 mb-3">
                <div class="min-w-0">
                  <h4 class="font-heading font-extrabold text-base text-slate-900 leading-snug truncate">{{ q.materialNombre }}</h4>
                  <p class="text-xs text-slate-500 mt-0.5 line-clamp-1">{{ q.materialDescripcion }}</p>
                </div>

                <div class="w-11 h-11 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center text-slate-700 shrink-0 shadow-2xs">
                  <svg *ngIf="q.categoryKey === 'VIDRIO'" class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 2h6v3l1.5 2.5a2 2 0 0 1 .5 1.3V20a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8.8a2 2 0 0 1 .5-1.3L9 5V2z"/><line x1="8" y1="2" x2="16" y2="2"/><line x1="10" y1="13" x2="14" y2="13"/></svg>
                  <svg *ngIf="q.categoryKey === 'CARTON'" class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 12v10"/></svg>
                  <svg *ngIf="q.categoryKey === 'PLASTICO'" class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="10" y="2" width="4" height="2" rx="0.5"/><path d="M10 4h4v2a2 2 0 0 0 .5 1.3l1.2 1.4A2 2 0 0 1 16 10v9a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-9a2 2 0 0 1 .3-1.3l1.2-1.4A2 2 0 0 0 10 6V4z"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="16" x2="15" y2="16"/></svg>
                  <svg *ngIf="q.categoryKey === 'LATAS'" class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="5.5" ry="2"/><path d="M6.5 5v14c0 1.1 2.46 2 5.5 2s5.5-.9 5.5-2V5"/><path d="M6.5 13c0 1.1 2.46 2 5.5 2s5.5-.9 5.5-2"/><ellipse cx="12" cy="5" rx="1.8" ry="0.7"/></svg>
                  <svg *ngIf="q.categoryKey !== 'VIDRIO' && q.categoryKey !== 'CARTON' && q.categoryKey !== 'PLASTICO' && q.categoryKey !== 'LATAS'" class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v8m-4-4h8"/></svg>
                </div>
              </div>

              <!-- Fila Día y Condición Compacta -->
              <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                <div class="px-3 py-2 rounded-lg bg-slate-50/70 border border-slate-200/80 flex items-center gap-2">
                  <i class="fa-regular fa-calendar text-slate-400 text-xs"></i>
                  <div class="min-w-0">
                    <span class="font-bold text-slate-900 block leading-tight truncate">{{ q.day }}</span>
                    <span class="text-[10px] text-slate-500 block truncate">{{ q.hours }}</span>
                  </div>
                </div>
                <div class="px-3 py-2 rounded-lg bg-slate-50/70 border border-slate-200/80 flex items-center gap-2">
                  <i class="fa-solid fa-circle-check text-emerald-600 text-xs"></i>
                  <div class="min-w-0">
                    <span class="font-semibold text-slate-800 block leading-tight truncate">{{ q.requisitos }}</span>
                    <span class="text-[10px] text-slate-500 block truncate">En frontis</span>
                  </div>
                </div>
              </div>

              <!-- Acordeón protocolo -->
              <div class="border-t border-slate-100 pt-2.5">
                <button
                  type="button"
                  (click)="toggleAccordion(q.id)"
                  class="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer py-0.5"
                  [attr.aria-expanded]="expandedAccordionId === q.id">
                  <span class="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                    <i class="fa-regular fa-circle-question text-slate-400"></i>
                    <span>{{ expandedAccordionId === q.id ? 'Ocultar instrucciones' : '¿Cómo preparar tus residuos?' }}</span>
                  </span>
                  <i class="fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-200" [class.rotate-180]="expandedAccordionId === q.id"></i>
                </button>

                <div *ngIf="expandedAccordionId === q.id"
                     class="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  <strong class="text-slate-900 font-semibold">Norma DIMAO:</strong> {{ q.materialInstrucciones || 'Enjuagar y secar botellas y envases antes de depositar.' }}
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

                <span *ngIf="catalogLoaded" class="absolute top-2.5 right-4 text-[11px] font-semibold text-emerald-700 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-slate-200 flex items-center gap-1 shadow-2xs">
                  <i class="fa-solid fa-check-circle text-emerald-600 text-[10px]"></i> DIMAO
                </span>

                <!-- Titular del Sector en Overlay -->
                <div class="absolute bottom-2.5 left-4 right-4 flex items-baseline justify-between">
                  <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight drop-shadow-sm">
                    {{ q.name }}
                  </h3>
                </div>
              </div>

              <!-- Contenido Informativo Compacto -->
              <div class="p-4 sm:p-5 flex flex-col justify-between">
                <div *ngIf="q.diaModificado && q.motivoModificacion" class="mb-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-snug flex items-start gap-2">
                  <i class="fa-solid fa-triangle-exclamation text-amber-600 mt-0.5 shrink-0 text-xs"></i>
                  <div>
                    <span class="font-bold">Aviso Oficial DIMAO:</span> {{ q.motivoModificacion }}
                  </div>
                </div>

                <!-- Bloque Héroe del Material -->
                <div class="p-3 sm:p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/70 flex items-center justify-between gap-3 mb-3">
                  <div class="min-w-0">
                    <h4 class="font-heading font-extrabold text-base sm:text-lg text-slate-900 leading-snug truncate">{{ q.materialNombre }}</h4>
                    <p class="text-xs text-slate-500 mt-0.5 line-clamp-1">{{ q.materialDescripcion }}</p>
                  </div>

                  <div class="w-11 h-11 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center text-slate-700 shrink-0 shadow-2xs">
                    <svg *ngIf="q.categoryKey === 'VIDRIO'" class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 2h6v3l1.5 2.5a2 2 0 0 1 .5 1.3V20a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8.8a2 2 0 0 1 .5-1.3L9 5V2z"/><line x1="8" y1="2" x2="16" y2="2"/><line x1="10" y1="13" x2="14" y2="13"/></svg>
                    <svg *ngIf="q.categoryKey === 'CARTON'" class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 12v10"/></svg>
                    <svg *ngIf="q.categoryKey === 'PLASTICO'" class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="10" y="2" width="4" height="2" rx="0.5"/><path d="M10 4h4v2a2 2 0 0 0 .5 1.3l1.2 1.4A2 2 0 0 1 16 10v9a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-9a2 2 0 0 1 .3-1.3l1.2-1.4A2 2 0 0 0 10 6V4z"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="16" x2="15" y2="16"/></svg>
                    <svg *ngIf="q.categoryKey === 'LATAS'" class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="5.5" ry="2"/><path d="M6.5 5v14c0 1.1 2.46 2 5.5 2s5.5-.9 5.5-2V5"/><path d="M6.5 13c0 1.1 2.46 2 5.5 2s5.5-.9 5.5-2"/><ellipse cx="12" cy="5" rx="1.8" ry="0.7"/></svg>
                    <svg *ngIf="q.categoryKey !== 'VIDRIO' && q.categoryKey !== 'CARTON' && q.categoryKey !== 'PLASTICO' && q.categoryKey !== 'LATAS'" class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v8m-4-4h8"/></svg>
                  </div>
                </div>

                <!-- Fila Compacta Día y Condición -->
                <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div class="px-3 py-2 rounded-lg bg-slate-50/70 border border-slate-200/80 flex items-center gap-2">
                    <i class="fa-regular fa-calendar text-slate-400 text-xs"></i>
                    <div class="min-w-0">
                      <span class="font-bold text-slate-900 block leading-tight truncate">{{ q.day }}</span>
                      <span class="text-[10px] text-slate-500 block truncate">{{ q.hours }}</span>
                    </div>
                  </div>
                  <div class="px-3 py-2 rounded-lg bg-slate-50/70 border border-slate-200/80 flex items-center gap-2">
                    <i class="fa-solid fa-circle-check text-emerald-600 text-xs"></i>
                    <div class="min-w-0">
                      <span class="font-semibold text-slate-800 block leading-tight truncate">{{ q.requisitos }}</span>
                      <span class="text-[10px] text-slate-500 block truncate">En frontis</span>
                    </div>
                  </div>
                </div>

                <!-- Acordeón Desplegable para Instrucciones -->
                <div class="border-t border-slate-100 pt-2.5">
                  <button
                    type="button"
                    (click)="toggleAccordion(q.id)"
                    class="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer py-0.5"
                    [attr.aria-expanded]="expandedAccordionId === q.id">
                    <span class="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                      <i class="fa-regular fa-circle-question text-slate-400"></i>
                      <span>{{ expandedAccordionId === q.id ? 'Ocultar instrucciones' : '¿Cómo preparar tus residuos?' }}</span>
                    </span>
                    <i class="fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-200" [class.rotate-180]="expandedAccordionId === q.id"></i>
                  </button>

                  <!-- Panel Expandido del Acordeón -->
                  <div *ngIf="expandedAccordionId === q.id"
                       class="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
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
        day: override?.nuevoDia ?? q.day,
        hours: q.hours,
        image: q.image,
        categoryKey: baseMat.categoryKey,
        materialNombre: liveMat?.nombre || baseMat.materialNombre,
        materialDescripcion: liveMat?.descripcion || baseMat.materialDescripcion,
        materialInstrucciones: liveMat?.instrucciones || baseMat.materialInstrucciones,
        binImage: baseMat.binImage,
        iconClass: baseMat.iconClass || q.iconClass,
        diaModificado: !!override,
        diaOriginal: override?.diaOriginal ?? q.day,
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


