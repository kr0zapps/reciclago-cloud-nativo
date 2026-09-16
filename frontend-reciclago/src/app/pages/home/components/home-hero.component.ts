import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SectorInfo } from '../data/home-sectors.data';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="relative min-h-[460px] sm:min-h-[500px] lg:h-[530px] flex items-center bg-[#072438] overflow-hidden">
      <!-- Fondo Fotográfico Panorámico con Volcán Osorno y Lago Llanquihue (Limpio 4K) -->
      <div class="absolute inset-0 z-0">
        <img
          alt="Lago Llanquihue y Volcán Osorno"
          class="w-full h-full object-cover object-right sm:object-center transform scale-100 transition-transform duration-1000"
          src="assets/puerto-varas-hero-clean.jpg"
        />
        <!-- Degradado de lectura cívica -->
        <div class="absolute inset-0 bg-gradient-to-r from-[#072438] via-[#072438]/85 sm:via-[#072438]/60 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-[#072438]/40 via-transparent to-black/10"></div>
      </div>

      <!-- Contenido Hero -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full flex flex-col justify-center anim-fade-up anim-delay-1">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          <!-- Columna Izquierda: Mensaje y Buscador -->
          <div class="lg:col-span-8 max-w-2xl">
            <!-- Saludo manuscrito -->
            <div class="flex items-center gap-2 mb-1.5">
              <span class="font-script text-white text-2xl sm:text-3xl font-bold tracking-wide drop-shadow-md -rotate-1 inline-block">
                Juntos por una Puerto Varas más limpia
              </span>
              <span class="text-lg sm:text-xl drop-shadow text-[#72be36]"><i class="fa-solid fa-leaf"></i></span>
            </div>

            <!-- Título Principal -->
            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight font-heading drop-shadow-lg mb-3">
              Recic<span class="text-[#72be36]">LaGo</span>
            </h1>

            <!-- Subtítulo -->
            <p class="text-white/95 text-sm sm:text-base font-normal leading-relaxed drop-shadow mb-7 max-w-xl">
              El servicio municipal de retiro de reciclaje puerta a puerta, para una comuna más limpia y sustentable.
            </p>

            <!-- Barra de Búsqueda Flotante -->
            <div class="relative max-w-2xl">
              <div class="bg-white/95 sm:bg-white backdrop-blur-md rounded-2xl sm:rounded-full p-2.5 sm:p-2 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-2 border border-white/90 ring-1 ring-black/5 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#437d32]">
                
                <!-- Input con Icono Cívico -->
                <div class="flex items-center gap-3 pl-2 sm:pl-3.5 py-1 flex-1 relative min-w-0">
                  <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-full bg-[#edf8ed] text-[#437d32] border border-[#d2ead0] flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <i class="fa-solid fa-location-dot text-base sm:text-lg"></i>
                  </div>
                  
                  <div class="flex flex-col text-left flex-1 min-w-0">
                    <span class="text-[10px] sm:text-[11px] font-black text-[#093554] uppercase tracking-wider leading-tight flex items-center gap-1.5">
                      <span>Ingresa tu dirección o sector</span>
                    </span>
                    <input
                      [(ngModel)]="searchQuery"
                      (focus)="isSearchFocused = true"
                      (blur)="onSearchBlur()"
                      (keyup.enter)="onSubmit()"
                      class="p-0 text-xs sm:text-sm text-slate-700 font-medium placeholder-slate-400 border-none focus:ring-0 focus:outline-none bg-transparent w-full truncate"
                      placeholder="Ej: Calle del Lago 123, Nueva Braunau..."
                      type="text"
                      aria-label="Ingresa tu dirección o sector"
                    />
                  </div>

                  <!-- Botón Limpiar si hay texto -->
                  <button *ngIf="searchQuery"
                          (mousedown)="clearSearch()"
                          type="button"
                          class="w-7 h-7 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center text-xs transition-colors flex-shrink-0 cursor-pointer"
                          aria-label="Limpiar búsqueda">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <!-- Botón Acción Principal -->
                <button
                  (click)="onSubmit()"
                  type="button"
                  class="w-full sm:w-auto bg-[#437d32] hover:bg-[#366827] active:bg-[#2a541d] active:scale-[0.99] text-white px-6 py-3.5 sm:py-3 rounded-xl sm:rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer flex-shrink-0">
                  <span>Ver mi día de retiro</span>
                  <i class="fa-solid fa-arrow-right text-xs"></i>
                </button>
              </div>

              <!-- Desplegable Autocomplete Inteligente -->
              <div *ngIf="isSearchFocused && filteredSectors.length > 0"
                   class="absolute left-0 right-0 top-[calc(100%+8px)] z-30 bg-white rounded-2xl shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel py-2 text-left">
                <div class="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between border-b border-slate-100 mb-1">
                  <span>Sectores Oficiales de Puerto Varas</span>
                  <span class="text-[#437d32] font-bold">Día asignado</span>
                </div>
                <div class="max-h-56 overflow-y-auto">
                  <button *ngFor="let sector of filteredSectors"
                          (mousedown)="onSelectSector(sector)"
                          type="button"
                          class="w-full px-4 py-2.5 hover:bg-[#f6faf6] flex items-center justify-between text-left transition-colors cursor-pointer group border-b border-slate-50 last:border-0">
                    <div class="flex items-center gap-2.5 min-w-0 pr-2">
                      <div class="w-7 h-7 rounded-lg bg-[#edf8ed] group-hover:bg-[#437d32] text-[#437d32] group-hover:text-white flex items-center justify-center text-xs transition-colors flex-shrink-0">
                        <i class="fa-solid fa-location-arrow"></i>
                      </div>
                      <div class="truncate">
                        <span class="text-xs sm:text-sm font-bold text-[#093554] block truncate">{{ sector.name }}</span>
                        <span class="text-[11px] text-slate-500">{{ sector.hours }}</span>
                      </div>
                    </div>
                    <span class="text-xs font-extrabold text-[#437d32] bg-[#edf8ed] border border-[#d2ead0] px-3 py-1 rounded-full whitespace-nowrap">
                      {{ sector.day }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Barra de Sectores Populares -->
              <div class="mt-3 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span class="text-[11px] font-bold text-white/90 drop-shadow-sm flex items-center gap-1.5 flex-shrink-0 mr-1">
                  <i class="fa-solid fa-compass text-[#72be36] text-xs"></i>
                  <span>Sectores:</span>
                </span>
                <button
                  *ngFor="let s of popularSectors"
                  (click)="onSelectSector(s)"
                  type="button"
                  class="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
                  [ngClass]="selectedSector?.id === s.id ? 'bg-[#437d32] text-white ring-2 ring-white/80 shadow-md font-bold' : 'bg-white/20 hover:bg-white/35 text-white border border-white/25'">
                  {{ s.shortName }}
                </button>
              </div>
            </div>
          </div>

          <!-- Columna Derecha: Lema manuscrito sobre el lago -->
          <div class="lg:col-span-4 hidden lg:flex justify-end pointer-events-none">
            <div class="text-right max-w-xs rotate-[-6deg] anim-float mr-4">
              <p class="font-script text-white text-3xl font-bold leading-tight" style="text-shadow: 0 4px 14px rgba(0,0,0,0.65);">
                Reciclar también es<br>cuidar nuestro<br>lago
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  `
})
export class HomeHeroComponent {
  @Input() allSectors: SectorInfo[] = [];
  @Input() popularSectors: SectorInfo[] = [];
  @Input() selectedSector: SectorInfo | null = null;

  @Output() sectorSelected = new EventEmitter<SectorInfo>();
  @Output() searchSubmitted = new EventEmitter<SectorInfo>();

  searchQuery = '';
  isSearchFocused = false;

  get filteredSectors(): SectorInfo[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.allSectors;
    return this.allSectors.filter(s =>
      s.name.toLowerCase().includes(q) || s.shortName.toLowerCase().includes(q) || s.day.toLowerCase().includes(q)
    );
  }

  onSelectSector(sector: SectorInfo): void {
    this.searchQuery = sector.name;
    this.isSearchFocused = false;
    this.sectorSelected.emit(sector);
  }

  onSubmit(): void {
    const matches = this.filteredSectors;
    if (matches.length > 0) {
      this.onSelectSector(matches[0]);
      this.searchSubmitted.emit(matches[0]);
    } else {
      this.isSearchFocused = false;
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.isSearchFocused = true;
  }

  onSearchBlur(): void {
    setTimeout(() => {
      this.isSearchFocused = false;
    }, 200);
  }
}
