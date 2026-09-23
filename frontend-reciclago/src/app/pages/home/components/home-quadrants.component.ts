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
    <section class="py-16 sm:py-24 bg-[#F9F8F5] relative overflow-hidden border-b border-[#E7E4DC]" id="cuadrantes">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Section Header Editorial Gazette -->
        <div class="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 reveal-init"
             [class.reveal-active]="isVisible">
          <div>
            <span class="font-mono text-[11px] font-bold uppercase tracking-widest text-[#8C5D19] bg-[#FAF0DC] px-3 py-1 rounded border border-[#EADBCA] inline-flex items-center gap-1.5 mb-3 shadow-2xs">
              <i class="fa-solid fa-scale-balanced text-[10px]"></i> Ordenanza Comunal N° 1.402 · Cuenca Lago Llanquihue
            </span>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#163828] tracking-tight mb-3 font-serif">
              Cuadrantes y Residuos Semanales
            </h2>
            <p class="text-sm sm:text-base text-[#6B726D] max-w-2xl font-sans">
              Calendario oficial del servicio municipal de recolección diferenciada puerta a puerta para la comuna de Puerto Varas.
            </p>
          </div>

          <!-- Selector de Semana Ejecutivo Gazette -->
          <div class="inline-flex rounded-xl p-1 bg-[#EAE8E1] border border-[#DDD9CE] shadow-xs self-start md:self-auto">
            <button
              type="button"
              (click)="selectWeek(1)"
              [class.bg-[#163828]]="activeWeek === 1"
              [class.text-white]="activeWeek === 1"
              [class.shadow-xs]="activeWeek === 1"
              [class.text-[#6B726D]]="activeWeek !== 1"
              [class.hover:text-[#163828]]="activeWeek !== 1"
              class="px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2">
              <i class="fa-solid fa-calendar-check" [class.text-[#C98A2C]]="activeWeek === 1"></i>
              <span>Semana Actual</span>
            </button>
            <button
              type="button"
              (click)="selectWeek(2)"
              [class.bg-[#163828]]="activeWeek === 2"
              [class.text-white]="activeWeek === 2"
              [class.shadow-xs]="activeWeek === 2"
              [class.text-[#6B726D]]="activeWeek !== 2"
              [class.hover:text-[#163828]]="activeWeek !== 2"
              class="px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2">
              <i class="fa-solid fa-calendar-plus" [class.text-[#C98A2C]]="activeWeek === 2"></i>
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
                [class.bg-[#163828]]="selectedMobileIndex === i"
                [class.text-white]="selectedMobileIndex === i"
                [class.border-[#163828]]="selectedMobileIndex === i"
                [class.shadow-xs]="selectedMobileIndex === i"
                [class.bg-white]="selectedMobileIndex !== i"
                [class.text-[#6B726D]]="selectedMobileIndex !== i"
                [class.border-[#E7E4DC]]="selectedMobileIndex !== i"
                class="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer">
                C{{ q.cuadranteNumber }} · {{ q.shortName }}
              </button>
            </div>
          </div>

          <!-- Single Interactive Card Móvil -->
          <article
            *ngIf="quadrants[selectedMobileIndex] as q"
            class="bg-white rounded-2xl overflow-hidden border border-[#E7E4DC] shadow-[0_2px_8px_rgba(22,56,40,0.04)] flex flex-col"
            [ngClass]="{ 'opacity-0 translate-y-3 scale-[0.98] pointer-events-none': isFadingOut, 'anim-week-switch': !isFadingOut }">
            
            <!-- Imagen Paisajística del Sector -->
            <div class="relative h-48 w-full overflow-hidden bg-[#EAE8E1]">
              <img
                [src]="q.image"
                [alt]="'Sector ' + q.name + ' - Puerto Varas'"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#163828]/95 via-[#163828]/35 to-transparent pointer-events-none"></div>

              <!-- Badges de cabecera -->
              <div class="absolute top-3 left-3 flex items-center gap-2">
                <span class="font-mono text-[10px] font-bold uppercase tracking-widest text-white bg-[#163828]/95 px-2.5 py-1 rounded border border-white/20 backdrop-blur-xs">
                  Cuadrante {{ q.cuadranteNumber }}
                </span>
                <span *ngIf="q.diaModificado" class="font-mono text-[10px] font-bold text-amber-900 bg-amber-100/95 px-2 py-1 rounded border border-amber-300 flex items-center gap-1">
                  <i class="fa-solid fa-triangle-exclamation"></i> Reprogramado
                </span>
              </div>

              <span *ngIf="catalogLoaded" class="absolute top-3 right-3 font-mono text-[10px] font-bold text-[#163828] bg-[#FFFDF9]/95 px-2.5 py-1 rounded border border-[#E7E4DC] flex items-center gap-1.5 shadow-2xs">
                <i class="fa-solid fa-stamp text-[#C98A2C]"></i> DIMAO
              </span>

              <!-- Controles Flechas ← 1 / 4 → flotantes -->
              <div class="absolute top-12 right-3 flex items-center gap-1.5 bg-[#163828]/80 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs font-mono font-bold border border-white/20">
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
                <span class="font-mono text-[10px] font-bold tracking-wider text-emerald-200 block uppercase">Sector Residencial</span>
                <h3 class="font-serif text-2xl font-bold text-white tracking-tight drop-shadow-sm">
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

              <!-- 2-column info grid Gazette -->
              <div class="grid grid-cols-2 gap-3 mb-4">
                <div class="p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E4DC] flex flex-col justify-between">
                  <div class="flex items-center gap-1.5 text-[#8C5D19] font-mono text-[10px] uppercase font-bold tracking-wider mb-1">
                    <i class="fa-solid fa-calendar-day"></i> Día de Retiro
                  </div>
                  <span class="font-serif text-base font-bold text-[#163828]">{{ q.day }}</span>
                  <span class="font-mono text-[10px] text-[#6B726D] mt-0.5"><i class="fa-regular fa-clock mr-1"></i>{{ q.hours }}</span>
                </div>
                <div class="p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E4DC] flex flex-col justify-between">
                  <div class="flex items-center gap-1.5 text-[#163828] font-mono text-[10px] uppercase font-bold tracking-wider mb-1">
                    <i class="fa-solid fa-circle-check text-[#22a652]"></i> Condición
                  </div>
                  <span class="font-sans text-xs font-semibold text-[#232826] leading-snug">{{ q.requisitos }}</span>
                  <span class="font-mono text-[10px] text-[#6B726D] mt-0.5">Frontis del hogar</span>
                </div>
              </div>

              <!-- Placa Material Asignado -->
              <div class="p-4 rounded-xl border border-[#E7E4DC] bg-white flex items-center justify-between shadow-2xs mb-4">
                <div>
                  <div class="flex items-center gap-2 mb-0.5">
                    <span class="w-2 h-2 rounded-full" [class.bg-[#C98A2C]]="activeWeek === 1" [class.bg-[#163828]]="activeWeek === 2"></span>
                    <span class="font-mono text-[10px] font-bold uppercase tracking-widest" [class.text-[#8C5D19]]="activeWeek === 1" [class.text-[#163828]]="activeWeek === 2">
                      {{ activeWeek === 1 ? 'Material Esta Semana' : 'Material Próxima Semana' }}
                    </span>
                  </div>
                  <h4 class="font-serif text-lg font-bold text-[#163828]">{{ q.materialNombre }}</h4>
                  <p class="font-sans text-xs text-[#6B726D] mt-0.5 line-clamp-1">{{ q.materialDescripcion }}</p>
                </div>

                <div class="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#E7E4DC] flex items-center justify-center text-xl shrink-0 shadow-2xs">
                  <svg *ngIf="q.categoryKey === 'VIDRIO'" class="w-6 h-6 text-[#163828]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 2h8v4l-2 3v13H10V9L8 6V2z"></path><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="10" x2="14" y1="2" y2="2"></line></svg>
                  <svg *ngIf="q.categoryKey === 'CARTON'" class="w-6 h-6 text-[#C98A2C]" fill="currentColor" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                  <svg *ngIf="q.categoryKey === 'PLASTICO'" class="w-6 h-6 text-sky-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 2h8v2H8V2zm1 3h6v2.5l2 3.5v11H7V11l2-3.5V5z"></path></svg>
                  <svg *ngIf="q.categoryKey === 'LATAS'" class="w-6 h-6 text-slate-600" fill="currentColor" viewBox="0 0 24 24"><rect height="16" rx="2" width="10" x="7" y="4"></rect><path d="M9 2h6v2H9z"></path></svg>
                </div>
              </div>

              <!-- Acordeón protocolo -->
              <div class="border-t border-[#E7E4DC] pt-3">
                <button
                  type="button"
                  (click)="toggleAccordion(q.id)"
                  class="w-full flex items-center justify-between text-xs font-mono font-bold text-[#163828] hover:text-[#C98A2C] transition-colors cursor-pointer py-1"
                  [attr.aria-expanded]="expandedAccordionId === q.id">
                  <span class="inline-flex items-center gap-2">
                    <i class="fa-solid fa-book-open-reader text-[#C98A2C]"></i>
                    <span>{{ expandedAccordionId === q.id ? 'Ocultar protocolo de entrega' : 'Protocolo de entrega DIMAO' }}</span>
                  </span>
                  <i class="fa-solid fa-chevron-down text-[10px] text-[#6B726D] transition-transform duration-200" [class.rotate-180]="expandedAccordionId === q.id"></i>
                </button>

                <div *ngIf="expandedAccordionId === q.id"
                     class="mt-2.5 p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E7E4DC] text-xs font-sans text-[#232826] leading-relaxed">
                  <div class="flex items-start gap-2.5 mb-1.5">
                    <i class="fa-solid fa-circle-info text-[#163828] mt-0.5 shrink-0"></i>
                    <div>
                      <strong class="text-[#163828] font-bold">Instrucción Oficial:</strong> {{ q.materialInstrucciones || 'Enjuagar y secar botellas y envases antes de depositar.' }}
                    </div>
                  </div>
                  <div class="text-[10px] font-mono text-[#8C5D19] border-t border-[#E7E4DC] pt-2 mt-2 flex items-center gap-1.5">
                    <i class="fa-solid fa-stamp"></i> Certificación DIMAO Puerto Varas · Res. Exenta 1.402
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Desktop View: 2 Columnas Elegantes Gazette -->
        <div class="hidden md:grid md:grid-cols-2 gap-8">
          <article
            *ngFor="let q of quadrants; let i = index"
            class="group bg-white rounded-2xl overflow-hidden border border-[#E7E4DC] shadow-[0_2px_8px_rgba(22,56,40,0.04)] hover:shadow-[0_12px_32px_rgba(22,56,40,0.1)] hover:border-[#C98A2C] transition-all duration-300 flex flex-col justify-between reveal-init"
            [class.reveal-active]="isVisible"
            [style.transition-delay]="(i * 100) + 'ms'"
            [ngClass]="{ 'opacity-0 translate-y-3 scale-[0.98] pointer-events-none': isFadingOut, 'anim-week-switch': !isFadingOut && isVisible }">
            
            <div>
              <!-- Imagen Paisajística del Sector con Encuadre Editorial -->
              <div class="relative h-56 w-full overflow-hidden bg-[#EAE8E1]">
                <img
                  [src]="q.image"
                  [alt]="'Sector ' + q.name + ' - Puerto Varas'"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-[#163828]/95 via-[#163828]/35 to-transparent pointer-events-none"></div>

                <!-- Badges de cabecera -->
                <div class="absolute top-3.5 left-4 flex items-center gap-2">
                  <span class="font-mono text-[10px] font-bold uppercase tracking-widest text-white bg-[#163828]/95 px-2.5 py-1 rounded border border-white/20 backdrop-blur-xs shadow-xs">
                    Cuadrante {{ q.cuadranteNumber }}
                  </span>
                  <span *ngIf="q.diaModificado" class="font-mono text-[10px] font-bold text-amber-900 bg-amber-100/95 px-2.5 py-1 rounded border border-amber-300 flex items-center gap-1.5 shadow-xs">
                    <i class="fa-solid fa-triangle-exclamation text-[9px]"></i> Reprogramado
                  </span>
                </div>

                <span *ngIf="catalogLoaded" class="absolute top-3.5 right-4 font-mono text-[10px] font-bold text-[#163828] bg-[#FFFDF9]/95 px-2.5 py-1 rounded border border-[#E7E4DC] flex items-center gap-1.5 shadow-xs backdrop-blur-xs">
                  <i class="fa-solid fa-stamp text-[#C98A2C]"></i> DIMAO OFICIAL
                </span>

                <!-- Titular del Sector en Overlay -->
                <div class="absolute bottom-3.5 left-5 right-5">
                  <span class="font-mono text-[11px] font-bold tracking-wider text-emerald-200 block uppercase">Sector Residencial</span>
                  <h3 class="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-sm">
                    {{ q.name }}
                  </h3>
                </div>
              </div>

              <!-- Contenido Informativo de la Tarjeta Gazette -->
              <div class="p-6 sm:p-7">
                <div *ngIf="q.diaModificado && q.motivoModificacion" class="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                  <i class="fa-solid fa-triangle-exclamation text-amber-600 mt-0.5 shrink-0"></i>
                  <div>
                    <span class="font-bold">Aviso Oficial DIMAO:</span> {{ q.motivoModificacion }}
                  </div>
                </div>

                <!-- 2-column metadata grid Gazette -->
                <div class="grid grid-cols-2 gap-4 mb-5">
                  <div class="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E7E4DC] flex flex-col justify-between">
                    <div class="flex items-center gap-1.5 text-[#8C5D19] font-mono text-[10px] uppercase font-bold tracking-wider mb-1">
                      <i class="fa-solid fa-calendar-day"></i> Día de Retiro
                    </div>
                    <span class="font-serif text-base sm:text-lg font-bold text-[#163828]">{{ q.day }}</span>
                    <span class="font-mono text-[11px] text-[#6B726D] mt-0.5"><i class="fa-regular fa-clock text-[10px] mr-1"></i>{{ q.hours }}</span>
                  </div>
                  <div class="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E7E4DC] flex flex-col justify-between">
                    <div class="flex items-center gap-1.5 text-[#163828] font-mono text-[10px] uppercase font-bold tracking-wider mb-1">
                      <i class="fa-solid fa-circle-check text-[#22a652]"></i> Condición
                    </div>
                    <span class="font-sans text-xs font-semibold text-[#232826] leading-snug">{{ q.requisitos }}</span>
                    <span class="font-mono text-[10px] text-[#6B726D] mt-0.5">En frontis de hogar</span>
                  </div>
                </div>

                <!-- Material Row con pure vector SVG icon -->
                <div class="p-4 rounded-xl border border-[#E7E4DC] bg-white flex items-center justify-between shadow-2xs mb-5">
                  <div>
                    <div class="flex items-center gap-2 mb-0.5">
                      <span class="w-2.5 h-2.5 rounded-full" [class.bg-[#C98A2C]]="activeWeek === 1" [class.bg-[#163828]]="activeWeek === 2"></span>
                      <span class="font-mono text-[10px] font-bold uppercase tracking-widest" [class.text-[#8C5D19]]="activeWeek === 1" [class.text-[#163828]]="activeWeek === 2">
                        {{ activeWeek === 1 ? 'Material Esta Semana' : 'Material Próxima Semana' }}
                      </span>
                    </div>
                    <h4 class="font-serif text-lg sm:text-xl font-bold text-[#163828]">{{ q.materialNombre }}</h4>
                    <p class="font-sans text-xs text-[#6B726D] mt-0.5 line-clamp-1">{{ q.materialDescripcion }}</p>
                  </div>

                  <div class="w-13 h-13 rounded-xl bg-[#FAF9F6] border border-[#E7E4DC] flex items-center justify-center text-xl shrink-0 shadow-2xs">
                    <svg *ngIf="q.categoryKey === 'VIDRIO'" class="w-7 h-7 text-[#163828]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 2h8v4l-2 3v13H10V9L8 6V2z"></path><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="10" x2="14" y1="2" y2="2"></line></svg>
                    <svg *ngIf="q.categoryKey === 'CARTON'" class="w-7 h-7 text-[#C98A2C]" fill="currentColor" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    <svg *ngIf="q.categoryKey === 'PLASTICO'" class="w-7 h-7 text-sky-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 2h8v2H8V2zm1 3h6v2.5l2 3.5v11H7V11l2-3.5V5z"></path></svg>
                    <svg *ngIf="q.categoryKey === 'LATAS'" class="w-7 h-7 text-slate-600" fill="currentColor" viewBox="0 0 24 24"><rect height="16" rx="2" width="10" x="7" y="4"></rect><path d="M9 2h6v2H9z"></path></svg>
                  </div>
                </div>

                <!-- Acordeón Desplegable para Instrucciones -->
                <div class="border-t border-[#E7E4DC] pt-3.5">
                  <button
                    type="button"
                    (click)="toggleAccordion(q.id)"
                    class="w-full flex items-center justify-between text-xs font-mono font-bold text-[#163828] hover:text-[#C98A2C] transition-colors cursor-pointer py-1"
                    [attr.aria-expanded]="expandedAccordionId === q.id">
                    <span class="inline-flex items-center gap-2">
                      <i class="fa-solid fa-book-open-reader text-[#C98A2C]"></i>
                      <span>{{ expandedAccordionId === q.id ? 'Ocultar protocolo de entrega' : 'Protocolo de entrega DIMAO' }}</span>
                    </span>
                    <i class="fa-solid fa-chevron-down text-[10px] text-[#6B726D] transition-transform duration-200" [class.rotate-180]="expandedAccordionId === q.id"></i>
                  </button>

                  <!-- Panel Expandido del Acordeón -->
                  <div *ngIf="expandedAccordionId === q.id"
                       class="mt-3 p-4 rounded-xl bg-[#FAF9F6] border border-[#E7E4DC] text-xs font-sans text-[#232826] leading-relaxed">
                    <div class="flex items-start gap-2.5 mb-2">
                      <i class="fa-solid fa-circle-info text-[#163828] mt-0.5 shrink-0"></i>
                      <div>
                        <strong class="text-[#163828] font-bold">Instrucción Oficial:</strong> {{ q.materialInstrucciones || 'Enjuagar y secar botellas y envases antes de depositar.' }}
                      </div>
                    </div>
                    <div class="text-[11px] font-mono text-[#8C5D19] border-t border-[#E7E4DC] pt-2 mt-2 flex items-center gap-1.5">
                      <i class="fa-solid fa-stamp"></i> Certificación DIMAO Puerto Varas · Res. Exenta 1.402
                    </div>
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


