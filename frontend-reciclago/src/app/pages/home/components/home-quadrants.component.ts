import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BffService } from '../../../services/bff.service';
import { QuadrantCardInfo, INITIAL_QUADRANTS } from '../data/home-sectors.data';
import { Residuo } from '../../dashboard/data/sectors.data';

@Component({
  selector: 'app-home-quadrants',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- BEGIN: QuadrantsSection -->
    <section class="py-16 sm:py-20 bg-white" id="cuadrantes">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Section Tag & Heading -->
        <div class="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span class="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-[#256c38] font-bold text-xs mb-3 shadow-2xs">
              Tu comuna, cuatro cuadrantes
            </span>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a233b] tracking-tight mb-2 font-heading">
              Cuadrantes y Residuos Comunales
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 max-w-xl">
              Revisa tu cuadrante, el día de retiro y qué material corresponde esta semana según el catálogo oficial DIMAO.
            </p>
          </div>

          <!-- Selector / Indicador Reactivo de Rotación Municipal -->
          <div class="inline-flex items-center gap-2 bg-[#f0f7f2] p-1.5 rounded-xl border border-emerald-200/80 self-start md:self-auto">
            <button
              type="button"
              (click)="selectWeek(1)"
              [class.bg-white]="activeWeek === 1"
              [class.text-[#206935]]="activeWeek === 1"
              [class.shadow-xs]="activeWeek === 1"
              [class.font-bold]="activeWeek === 1"
              class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 transition-all cursor-pointer">
              <i class="fa-solid fa-calendar-check mr-1.5 text-emerald-600"></i>Semana Actual
            </button>
            <button
              type="button"
              (click)="selectWeek(2)"
              [class.bg-white]="activeWeek === 2"
              [class.text-[#206935]]="activeWeek === 2"
              [class.shadow-xs]="activeWeek === 2"
              [class.font-bold]="activeWeek === 2"
              class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 transition-all cursor-pointer">
              <i class="fa-solid fa-calendar-plus mr-1.5 text-emerald-600"></i>Próxima Semana
            </button>
          </div>
        </div>

        <!-- Mobile View: 1 sola tarjeta interactiva compacta (md:hidden) -->
        <div class="md:hidden">
          <!-- Selector Pills Cuadrantes -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3.5 no-scrollbar">
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
              class="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer">
              {{ q.name }}
            </button>
          </div>

          <!-- Single Interactive Card -->
          <article
            *ngIf="quadrants[selectedMobileIndex] as q"
            (click)="onSelectQuadrant(q)"
            class="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col">
            
            <!-- Imagen Paisajística del Sector con Badge Cuadrante y Controles Flechas -->
            <div class="relative h-44 w-full overflow-hidden bg-slate-100">
              <img
                [src]="q.image"
                [alt]="'Sector ' + q.name + ' - Puerto Varas'"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

              <span
                class="absolute bottom-3 left-3 bg-[#236836] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md tracking-wide">
                Cuadrante {{ q.cuadranteNumber }} · {{ q.name }}
              </span>

              <!-- Badge Catálogo Live -->
              <span *ngIf="catalogLoaded" class="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[10px] font-bold text-emerald-800 px-2 py-0.5 rounded shadow-2xs border border-emerald-200">
                <i class="fa-solid fa-circle-check text-emerald-600 mr-1"></i>Catálogo Activo
              </span>

              <!-- Controles Flechas ← 1 / 4 → flotantes -->
              <div class="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs font-bold" (click)="$event.stopPropagation()">
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
                    <span class="block text-xs font-extrabold text-slate-800">{{ q.day }}</span>
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

              <!-- Fila Inferior: Material Asignado + Ilustración -->
              <div class="pt-3 flex items-center justify-between">
                <div>
                  <span class="block text-[10px] text-slate-500 font-medium">Material esta semana</span>
                  <span class="block text-base font-extrabold text-[#11324d]">
                    {{ q.materialNombre }}
                  </span>
                  <span *ngIf="q.materialDescripcion" class="block text-[11px] text-slate-500 mt-0.5 line-clamp-1 max-w-[200px]">
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

            <!-- Botón de detalle accesible al tap -->
            <div class="px-4 pb-3.5 pt-1 flex items-center justify-between text-xs text-emerald-700 font-bold border-t border-slate-50">
              <span class="inline-flex items-center gap-1.5">
                <i class="fa-solid fa-circle-info text-emerald-600"></i>
                Ver preparación para la entrega
              </span>
              <span class="text-slate-400">→</span>
            </div>
          </article>
        </div>

        <!-- Desktop View: 4 Quadrants Grid (Fiel al diseño Stitch y a la imagen) -->
        <div class="hidden md:grid md:grid-cols-2 gap-8">
          <article
            *ngFor="let q of quadrants"
            (click)="onSelectQuadrant(q)"
            class="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col justify-between">
            
            <div>
              <!-- Imagen Paisajística del Sector con Badge Cuadrante -->
              <div class="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                <img
                  [src]="q.image"
                  [alt]="'Sector ' + q.name + ' - Puerto Varas'"
                  class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  loading="lazy"
                />
                <span
                  class="absolute bottom-3 left-4 bg-[#236836] text-white text-xs font-bold px-3 py-1 rounded-md shadow-md tracking-wide">
                  Cuadrante {{ q.cuadranteNumber }}
                </span>
                
                <!-- Badge Catálogo Live -->
                <span *ngIf="catalogLoaded" class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-emerald-800 px-2 py-0.5 rounded shadow-2xs border border-emerald-200">
                  <i class="fa-solid fa-circle-check text-emerald-600 mr-1"></i>Catálogo Activo
                </span>
              </div>

              <!-- Contenido Informativo de la Tarjeta -->
              <div class="p-5 sm:p-6">
                <div class="flex items-baseline justify-between mb-4">
                  <h3 class="text-xl sm:text-2xl font-extrabold text-[#0a233b] tracking-tight font-heading">
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
                      <span class="block text-sm font-extrabold text-slate-800">{{ q.day }}</span>
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

                <!-- Fila Inferior: Material Asignado + Ilustración -->
                <div class="pt-4 flex items-center justify-between">
                  <div>
                    <span class="block text-[11px] text-slate-500 font-medium">Material esta semana</span>
                    <span class="block text-base sm:text-lg font-extrabold text-[#11324d]">
                      {{ q.materialNombre }}
                    </span>
                    <span *ngIf="q.materialDescripcion" class="block text-[11px] text-slate-500 mt-0.5 line-clamp-1 max-w-xs">
                      {{ q.materialDescripcion }}
                    </span>
                  </div>

                  <!-- Ilustración de Material / Bin Fiel al Diseño -->
                  <div class="flex items-center gap-2 pl-2">
                    <img
                      [src]="q.binImage"
                      [alt]="q.materialNombre"
                      class="h-16 w-auto object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Botón de detalle accesible al hover -->
            <div class="px-5 sm:px-6 pb-4 pt-1 flex items-center justify-between text-xs text-emerald-700 font-bold border-t border-slate-50">
              <span class="inline-flex items-center gap-1.5 group-hover:underline">
                <i class="fa-solid fa-circle-info text-emerald-600"></i>
                Ver preparación para la entrega
              </span>
              <span class="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
            </div>

          </article>
        </div>

      </div>
    </section>
    <!-- END: QuadrantsSection -->
  `
})
export class HomeQuadrantsComponent implements OnInit {
  @Output() quadrantSelected = new EventEmitter<QuadrantCardInfo>();

  quadrants: QuadrantCardInfo[] = [...INITIAL_QUADRANTS];
  catalogLoaded = false;
  activeWeek: number = 1;
  selectedMobileIndex: number = 0;

  constructor(private bffService: BffService) {}

  setMobileQuadrant(index: number): void {
    this.selectedMobileIndex = index;
  }

  nextMobileQuadrant(): void {
    if (this.quadrants.length > 0) {
      this.selectedMobileIndex = (this.selectedMobileIndex + 1) % this.quadrants.length;
    }
  }

  prevMobileQuadrant(): void {
    if (this.quadrants.length > 0) {
      this.selectedMobileIndex = (this.selectedMobileIndex - 1 + this.quadrants.length) % this.quadrants.length;
    }
  }

  ngOnInit(): void {
    this.loadCatalogResiduos();
  }

  loadCatalogResiduos(): void {
    this.bffService.getResiduos().subscribe({
      next: (residuos: Residuo[]) => {
        if (residuos && residuos.length > 0) {
          this.catalogLoaded = true;
          this.enrichWithCatalog(residuos);
        }
      },
      error: () => {
        // En caso de que el backend esté offline o cargando, se conservan los datos de INITIAL_QUADRANTS
        this.catalogLoaded = false;
      }
    });
  }

  enrichWithCatalog(residuos: Residuo[]): void {
    const residuosMap = new Map<string, Residuo>();
    residuos.forEach(r => {
      const cat = (r.categoria || r.tipo || '').toUpperCase();
      if (cat.includes('VIDRIO')) residuosMap.set('VIDRIO', r);
      else if (cat.includes('CARTON')) residuosMap.set('CARTON', r);
      else if (cat.includes('PLASTICO')) residuosMap.set('PLASTICO', r);
      else if (cat.includes('LATA') || cat.includes('METAL')) residuosMap.set('LATAS', r);
    });

    this.quadrants = this.quadrants.map(q => {
      const liveResiduo = residuosMap.get(q.categoryKey);
      if (liveResiduo) {
        return {
          ...q,
          materialNombre: liveResiduo.nombre,
          materialDescripcion: liveResiduo.descripcion || q.materialDescripcion,
          materialInstrucciones: liveResiduo.instrucciones || q.materialInstrucciones
        };
      }
      return q;
    });
  }

  selectWeek(weekNumber: number): void {
    this.activeWeek = weekNumber;
    // Si cambia de semana, rota ligeramente el material para reflejar la dinámica del retiro
    if (weekNumber === 2) {
      const rotated = [...this.quadrants];
      const first = rotated.shift()!;
      rotated.push(first);
      this.quadrants = rotated.map((q, idx) => ({
        ...q,
        cuadranteNumber: idx + 1,
        day: INITIAL_QUADRANTS[idx].day
      }));
    } else {
      this.quadrants = [...INITIAL_QUADRANTS];
      this.loadCatalogResiduos();
    }
  }

  onSelectQuadrant(q: QuadrantCardInfo): void {
    this.quadrantSelected.emit(q);
  }
}
