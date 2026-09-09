import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface SectorInfo {
  id: string;
  name: string;
  day: string;
  hours: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="anim-page-deploy">
      <!-- ==================== HERO SECTION (TAL CUAL MOCKUP) ==================== -->
      <section class="relative min-h-[460px] sm:min-h-[500px] lg:h-[530px] flex items-center bg-[#072438] overflow-hidden">
        <!-- Fondo Fotográfico Panorámico con Volcán Osorno y Lago Llanquihue (Limpio 4K sin texto quemado) -->
        <div class="absolute inset-0 z-0">
          <img
            alt="Lago Llanquihue y Volcán Osorno"
            class="w-full h-full object-cover object-right sm:object-center transform scale-100 transition-transform duration-1000"
            src="assets/puerto-varas-hero-clean.jpg"
          />
          <!-- Degradado de lectura a la izquierda tal como en el mockup -->
          <div class="absolute inset-0 bg-gradient-to-r from-[#072438] via-[#072438]/85 sm:via-[#072438]/60 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-[#072438]/40 via-transparent to-black/10"></div>
        </div>

        <!-- Contenido Hero -->
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full flex flex-col justify-center">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            <!-- Columna Izquierda: Mensaje y Buscador -->
            <div class="lg:col-span-8 max-w-2xl">
              <!-- Saludo manuscrito con hoja -->
              <div class="flex items-center gap-2 mb-1.5">
                <span class="font-script text-white text-2xl sm:text-3xl font-bold tracking-wide drop-shadow-md -rotate-1 inline-block">
                  Juntos por una Puerto Varas más limpia
                </span>
                <span class="text-xl sm:text-2xl anim-leaf drop-shadow">🍃</span>
              </div>

              <!-- Título Principal Nítido -->
              <h1 class="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight font-heading drop-shadow-lg mb-3">
                Recic<span class="text-[#72be36]">LaGo</span>
              </h1>

              <!-- Subtítulo -->
              <p class="text-white/95 text-sm sm:text-base font-normal leading-relaxed drop-shadow mb-7 max-w-xl">
                El servicio municipal de retiro de reciclaje puerta a puerta, para una comuna más limpia y sustentable.
              </p>

              <!-- Barra de Búsqueda Flotante Responsiva y Atractiva -->
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
                        (keyup.enter)="onSearchSubmit()"
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
                    (click)="onSearchSubmit()"
                    type="button"
                    class="w-full sm:w-auto bg-[#437d32] hover:bg-[#366827] active:bg-[#2a541d] active:scale-[0.99] text-white px-6 py-3.5 sm:py-3 rounded-xl sm:rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer flex-shrink-0">
                    <span>Ver mi día de retiro</span>
                    <i class="fa-solid fa-arrow-right text-xs"></i>
                  </button>
                </div>

                <!-- Desplegable Autocomplete Inteligente (Flotante) -->
                <div *ngIf="isSearchFocused && filteredSectors.length > 0"
                     class="absolute left-0 right-0 top-[calc(100%+8px)] z-30 bg-white rounded-2xl shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel py-2 text-left">
                  <div class="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between border-b border-slate-100 mb-1">
                    <span>Sectores Oficiales de Puerto Varas</span>
                    <span class="text-[#437d32] font-bold">Día asignado</span>
                  </div>
                  <div class="max-h-56 overflow-y-auto">
                    <button *ngFor="let sector of filteredSectors"
                            (mousedown)="selectSector(sector)"
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

                <!-- Chips Rápidos de Sectores (Atractivo en Mobile y Desktop) -->
                <div class="mt-3 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span class="text-[11px] font-bold text-white/90 drop-shadow-sm flex items-center gap-1 mr-0.5">
                    <i class="fa-solid fa-compass text-emerald-300 text-xs"></i> Sectores:
                  </span>
                  <button
                    *ngFor="let s of popularSectors"
                    (click)="selectSector(s)"
                    type="button"
                    class="text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-xs active:scale-95"
                    [ngClass]="selectedSector.id === s.id ? 'bg-[#437d32] text-white ring-2 ring-white/60 shadow-md' : 'bg-white/20 hover:bg-white/35 text-white border border-white/25'">
                    {{ s.name }} <span class="opacity-80 font-normal">({{ s.day }})</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Columna Derecha: Lema manuscrito sobre el lago -->
            <div class="lg:col-span-4 hidden lg:flex justify-end pointer-events-none">
              <div class="text-right max-w-xs rotate-[-6deg] anim-float mr-4">
                <p class="font-script text-white text-3xl font-bold leading-tight" style="text-shadow: 0 4px 14px rgba(0,0,0,0.65);">
                  Reciclar también es<br>cuidar nuestro<br>lago ♡
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ==================== SECCIÓN: DÍA DE RETIRO + 4 BINS + CAMIÓN (TAL CUAL MOCKUP) ==================== -->
      <section id="tu-dia-de-retiro" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 scroll-mt-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

          <!-- 1. Tarjeta Izquierda: Tu día de retiro esta semana (lg:col-span-3) -->
          <div class="lg:col-span-3 bg-[#f6faf6] rounded-2xl p-5 sm:p-6 border border-[#dceade] flex flex-col justify-between shadow-xs transition-all duration-300"
               [class.ring-2]="justUpdated"
               [class.ring-[#437d32]]="justUpdated">
            <div>
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2.5 text-[#093554]">
                  <div class="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#437d32] shadow-2xs border border-emerald-100">
                    <i class="fa-regular fa-calendar-check text-lg"></i>
                  </div>
                  <span class="text-xs font-bold text-[#093554] tracking-tight">Tu día de retiro</span>
                </div>
                <span *ngIf="justUpdated" class="text-[10px] font-black uppercase tracking-wider text-[#437d32] bg-[#edf8ed] border border-[#d2ead0] px-2 py-0.5 rounded-full animate-pulse">
                  Actualizado
                </span>
              </div>

              <div class="my-2">
                <span class="block text-3xl sm:text-4xl font-black text-[#093554] tracking-tight font-heading">
                  {{ selectedSector.day }}
                </span>
                <p class="text-xs font-bold text-[#437d32] mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-location-dot text-[10px]"></i>
                  {{ selectedSector.name }}
                </p>
              </div>
            </div>

            <div class="space-y-3 mt-4">
              <div class="bg-[#edf8ed] rounded-xl p-3 flex items-center gap-2.5 border border-[#d2ead0]">
                <div class="w-5 h-5 rounded-full bg-[#437d32] text-white flex items-center justify-center text-[10px] flex-shrink-0">
                  <i class="fa-solid fa-check"></i>
                </div>
                <p class="text-[11px] text-[#1c4d26] font-medium leading-snug">
                  El camión pasará entre las <strong class="font-bold text-[#0e3517]">{{ selectedSector.hours }}</strong>
                </p>
              </div>

              <div>
                <a routerLink="/dashboard" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#1479b8] hover:underline">
                  <span>Ver mapa de recorridos</span>
                  <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </a>
              </div>
            </div>
          </div>

          <!-- 2. Tarjetas Centrales: Esta semana te toca (4 Bins Pastel) (lg:col-span-6) -->
          <div class="lg:col-span-6 flex flex-col justify-between">
            <h2 class="text-base sm:text-lg font-extrabold text-[#093554] tracking-tight font-heading mb-3">
              Esta semana te toca:
            </h2>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 items-stretch flex-1">

              <!-- Bin 1: Vidrio -->
              <div class="bg-[#edf8ed] rounded-2xl p-3 sm:p-3.5 flex flex-col items-center text-center border border-[#d6ebd0] transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div class="h-24 flex items-center justify-center mb-2">
                  <img src="assets/bin_vidrio_clean.png" alt="Vidrio" class="h-20 w-auto object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105" />
                </div>
                <h3 class="font-bold text-sm text-[#238038] mb-0.5">Vidrio</h3>
                <p class="text-[11px] text-slate-500 leading-tight mb-3 flex-grow">Botellas, frascos, vasos (sin tapas).</p>
                <div class="w-5 h-5 rounded-full bg-[#238038] text-white flex items-center justify-center text-[10px] shadow-2xs">
                  <i class="fa-solid fa-check"></i>
                </div>
              </div>

              <!-- Bin 2: Cartón -->
              <div class="bg-[#edf4fb] rounded-2xl p-3 sm:p-3.5 flex flex-col items-center text-center border border-[#d0e5f5] transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div class="h-24 flex items-center justify-center mb-2">
                  <img src="assets/bin_carton_clean.png" alt="Cartón" class="h-20 w-auto object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105" />
                </div>
                <h3 class="font-bold text-sm text-[#176fa9] mb-0.5">Cartón</h3>
                <p class="text-[11px] text-slate-500 leading-tight mb-3 flex-grow">Cajas, papeles, revistas, diarios.</p>
                <div class="w-5 h-5 rounded-full bg-[#176fa9] text-white flex items-center justify-center text-[10px] shadow-2xs">
                  <i class="fa-solid fa-check"></i>
                </div>
              </div>

              <!-- Bin 3: Plásticos -->
              <div class="bg-[#fef8ed] rounded-2xl p-3 sm:p-3.5 flex flex-col items-center text-center border border-[#fbe9c8] transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div class="h-24 flex items-center justify-center mb-2">
                  <img src="assets/bin_plasticos_clean.png" alt="Plásticos" class="h-20 w-auto object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105" />
                </div>
                <h3 class="font-bold text-sm text-[#c4871d] mb-0.5">Plásticos</h3>
                <p class="text-[11px] text-slate-500 leading-tight mb-3 flex-grow">Envases, botellas, bolsas limpias.</p>
                <div class="w-5 h-5 rounded-full bg-[#c4871d] text-white flex items-center justify-center text-[10px] shadow-2xs">
                  <i class="fa-solid fa-check"></i>
                </div>
              </div>

              <!-- Bin 4: Latas -->
              <div class="bg-[#fdf0ef] rounded-2xl p-3 sm:p-3.5 flex flex-col items-center text-center border border-[#fad5d3] transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div class="h-24 flex items-center justify-center mb-2">
                  <img src="assets/bin_latas_clean.png" alt="Latas" class="h-20 w-auto object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105" />
                </div>
                <h3 class="font-bold text-sm text-[#c94b43] mb-0.5">Latas</h3>
                <p class="text-[11px] text-slate-500 leading-tight mb-3 flex-grow">Latas de bebidas y conservas.</p>
                <div class="w-5 h-5 rounded-full bg-[#c94b43] text-white flex items-center justify-center text-[10px] shadow-2xs">
                  <i class="fa-solid fa-check"></i>
                </div>
              </div>

            </div>
          </div>

          <!-- 3. Tarjeta Derecha: Camión Municipal en el Lago (lg:col-span-3) -->
          <div class="lg:col-span-3 rounded-2xl overflow-hidden shadow-xs border border-slate-100 bg-[#f0f7f9] relative group h-full min-h-[220px]">
            <img
              src="assets/card_truck.png"
              alt="Tu reciclaje también llega al lago - Camión RecicLaGo"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

        </div>
      </section>

      <!-- ==================== SECCIÓN: RETIRO ESPECIAL & 4 ACCIONES RÁPIDAS (TAL CUAL MOCKUP) ==================== -->
      <section class="bg-gradient-to-r from-[#eaf4ec] via-[#edf7ee] to-[#f4f9f4] py-10 sm:py-12 border-t border-[#e2efe4] relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            <!-- Columna Izquierda: Retiro especial -->
            <div class="lg:col-span-4 space-y-3.5 text-center sm:text-left">
              <div class="flex items-center justify-center sm:justify-start gap-2">
                <h2 class="font-script text-3xl sm:text-4xl text-[#0c3e5e] font-bold tracking-tight">
                  ¿Necesitas un retiro especial?
                </h2>
                <span class="text-2xl anim-leaf">🍃</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto sm:mx-0">
                Si tienes residuos fuera de lo común (electrónicos, muebles, escombros, etc.) puedes agendar un <strong class="text-[#093554] font-bold">retiro especial</strong> desde aquí.
              </p>
              <div class="pt-1">
                <a
                  routerLink="/dashboard"
                  class="inline-flex items-center justify-center gap-2 bg-[#437d32] hover:bg-[#366827] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-full transition-all shadow-sm hover:shadow w-full sm:w-auto cursor-pointer">
                  <i class="fa-regular fa-calendar-plus text-base"></i>
                  <span>Agendar retiro especial</span>
                  <i class="fa-solid fa-arrow-right text-xs"></i>
                </a>
              </div>
            </div>

            <!-- Columna Derecha: Tarjeta Blanca Flotante con 4 Acciones -->
            <div class="lg:col-span-8">
              <div class="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-5 divide-x-0 sm:divide-x divide-slate-100">

                <!-- 1. Ver mi día de retiro -->
                <a routerLink="/dashboard" class="flex flex-col items-center text-center px-1 sm:px-2 group cursor-pointer hover:-translate-y-1 transition-transform">
                  <div class="w-13 h-13 rounded-full bg-[#e3f2e7] text-[#2b7239] flex items-center justify-center text-xl mb-3 shadow-2xs group-hover:bg-[#2b7239] group-hover:text-white transition-colors">
                    <i class="fa-solid fa-mobile-screen"></i>
                  </div>
                  <h3 class="font-bold text-xs sm:text-sm text-[#093554] mb-1 font-heading">Ver mi día de retiro</h3>
                  <p class="text-[11px] text-slate-500 leading-snug">Consulta tu calendario por dirección.</p>
                </a>

                <!-- 2. Mapa de recorridos -->
                <a routerLink="/dashboard" class="flex flex-col items-center text-center px-1 sm:px-2 group cursor-pointer hover:-translate-y-1 transition-transform">
                  <div class="w-13 h-13 rounded-full bg-[#e3f2e7] text-[#2b7239] flex items-center justify-center text-xl mb-3 shadow-2xs group-hover:bg-[#2b7239] group-hover:text-white transition-colors">
                    <i class="fa-solid fa-map-location-dot"></i>
                  </div>
                  <h3 class="font-bold text-xs sm:text-sm text-[#093554] mb-1 font-heading">Mapa de recorridos</h3>
                  <p class="text-[11px] text-slate-500 leading-snug">Revisa las calles y sectores de la comuna.</p>
                </a>

                <!-- 3. Qué se puede reciclar -->
                <button (click)="showMaterialsModal = true" type="button" class="flex flex-col items-center text-center px-1 sm:px-2 group cursor-pointer hover:-translate-y-1 transition-transform bg-transparent border-none p-0">
                  <div class="w-13 h-13 rounded-full bg-[#e3f2e7] text-[#2b7239] flex items-center justify-center text-xl mb-3 shadow-2xs group-hover:bg-[#2b7239] group-hover:text-white transition-colors">
                    <i class="fa-solid fa-leaf"></i>
                  </div>
                  <h3 class="font-bold text-xs sm:text-sm text-[#093554] mb-1 font-heading">Qué se puede reciclar</h3>
                  <p class="text-[11px] text-slate-500 leading-snug">Conoce los materiales y sus condiciones.</p>
                </button>

                <!-- 4. Preguntas frecuentes -->
                <button (click)="showFaqModal = true" type="button" class="flex flex-col items-center text-center px-1 sm:px-2 group cursor-pointer hover:-translate-y-1 transition-transform bg-transparent border-none p-0">
                  <div class="w-13 h-13 rounded-full bg-[#e3f2e7] text-[#2b7239] flex items-center justify-center text-2xl font-serif font-bold mb-3 shadow-2xs group-hover:bg-[#2b7239] group-hover:text-white transition-colors">
                    ?
                  </div>
                  <h3 class="font-bold text-xs sm:text-sm text-[#093554] mb-1 font-heading">Preguntas frecuentes</h3>
                  <p class="text-[11px] text-slate-500 leading-snug">Resuelve tus dudas rápidamente.</p>
                </button>

              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ==================== SECCIÓN: COSTANERA PUERTO VARAS & COMPROMISO COMUNAL (TAL CUAL MOCKUP) ==================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          <!-- Foto Panorámica Costanera con Lema Manuscrito Completo -->
          <div class="lg:col-span-7 rounded-2xl overflow-hidden shadow-xs border border-slate-100 group relative">
            <img
              src="assets/promenade_varas.png"
              alt="Costanera Puerto Varas - Pequeñas acciones, grandes cambios"
              class="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-500 rounded-2xl"
            />
          </div>

          <!-- Compromiso Comunal Municipal -->
          <div class="lg:col-span-5 space-y-3.5 pl-0 lg:pl-4 text-center sm:text-left">
            <h2 class="text-xl sm:text-2xl font-extrabold text-[#093554] leading-snug font-heading">
              En Puerto Varas, el reciclaje lo hacemos entre todos.
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Gracias por ser parte de una comuna más limpia, verde y consciente.
            </p>

            <!-- Logo Puerto Varas Naturaleza · Comunidad · Futuro -->
            <div class="pt-3 flex items-center justify-center sm:justify-start gap-3">
              <div class="w-14 h-9 flex-shrink-0 flex items-center justify-center">
                <svg class="w-full h-full" fill="none" viewBox="0 0 70 40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 28C18 20 32 20 45 28C54 33 63 31 68 28" stroke="#093554" stroke-linecap="round" stroke-width="3"></path>
                  <path d="M12 34C24 27 38 27 50 34C58 38 64 36 68 34" stroke="#0ea5e9" stroke-linecap="round" stroke-width="2"></path>
                  <path d="M48 8C52 14 62 16 66 12C68 18 64 24 56 22C50 20 46 12 48 8Z" fill="#437d32"></path>
                </svg>
              </div>
              <div class="flex flex-col text-left">
                <span class="text-base font-black text-[#093554] tracking-tight uppercase">Puerto Varas</span>
                <span class="text-[10px] text-slate-500 font-bold tracking-wider">Naturaleza · Comunidad · Futuro</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- ==================== MODALES (GUÍA DE MATERIALES Y PREGUNTAS FRECUENTES) ==================== -->
      <!-- Modal Guía de Materiales -->
      <div *ngIf="showMaterialsModal"
           (click)="showMaterialsModal = false"
           class="fixed inset-0 z-50 overflow-y-auto bg-[#041D2D]/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 anim-modal-backdrop">
        
        <div (click)="$event.stopPropagation()"
             class="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel text-slate-800 my-auto">
          <div class="h-1.5 w-full bg-gradient-to-r from-[#437d32] via-[#38BDF8] to-[#093554]"></div>

          <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-[#E2E9E4] flex items-center justify-between bg-[#F8FAF7]">
            <div class="flex items-center gap-3.5">
              <div class="w-11 h-11 rounded-2xl bg-[#EEF5EB] border border-[#D5E6D2] flex items-center justify-center text-[#437d32] text-lg flex-shrink-0 shadow-xs">
                <i class="fa-solid fa-leaf"></i>
              </div>
              <div>
                <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#437d32] block">
                  Ordenanza Comunal · Clasificación
                </span>
                <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#093554] leading-tight">
                  Materiales Aceptados en Ruta
                </h3>
              </div>
            </div>
            <button (click)="showMaterialsModal = false"
                    type="button"
                    class="w-9 h-9 rounded-full bg-white border border-[#DFE8E1] hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm transition-colors shadow-xs cursor-pointer"
                    aria-label="Cerrar">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-4 text-sm text-slate-600 leading-relaxed">
            <p class="text-xs text-slate-500">
              Entrega tus materiales <strong>limpios, secos y compactados</strong> para asegurar su valorización:
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="p-3.5 rounded-2xl bg-[#edf8ed] border border-[#d6ebd0]">
                <span class="font-bold text-xs uppercase tracking-wider text-[#238038] block mb-1">1. Vidrio</span>
                <p class="text-xs text-slate-600">Botellas y frascos de conservas sin tapas metálicas. Limpios y secos.</p>
              </div>
              <div class="p-3.5 rounded-2xl bg-[#edf4fb] border border-[#d0e5f5]">
                <span class="font-bold text-xs uppercase tracking-wider text-[#176fa9] block mb-1">2. Cartón y Papel</span>
                <p class="text-xs text-slate-600">Cajas aplanadas, diarios, revistas y papel blanco seco.</p>
              </div>
              <div class="p-3.5 rounded-2xl bg-[#fef8ed] border border-[#fbe9c8]">
                <span class="font-bold text-xs uppercase tracking-wider text-[#c4871d] block mb-1">3. Plásticos</span>
                <p class="text-xs text-slate-600">Botellas de líquidos y envases limpios, aplastados y con tapa puesta.</p>
              </div>
              <div class="p-3.5 rounded-2xl bg-[#fdf0ef] border border-[#fad5d3]">
                <span class="font-bold text-xs uppercase tracking-wider text-[#c94b43] block mb-1">4. Latas</span>
                <p class="text-xs text-slate-600">Latas de aluminio y conservas metálicas enjuagadas y aplastadas.</p>
              </div>
            </div>
          </div>

          <div class="px-6 sm:px-8 py-4 bg-[#F8FAF7] border-t border-[#E2E9E4] flex items-center justify-between">
            <span class="text-xs text-slate-500 font-medium">DIMAO · Puerto Varas</span>
            <button (click)="showMaterialsModal = false"
                    type="button"
                    class="bg-[#437d32] hover:bg-[#366827] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-sm cursor-pointer">
              Entendido
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Preguntas Frecuentes -->
      <div *ngIf="showFaqModal"
           (click)="showFaqModal = false"
           class="fixed inset-0 z-50 overflow-y-auto bg-[#041D2D]/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 anim-modal-backdrop">
        <div (click)="$event.stopPropagation()"
             class="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel text-slate-800 my-auto">
          <div class="h-1.5 w-full bg-gradient-to-r from-[#437d32] via-[#38BDF8] to-[#093554]"></div>

          <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-[#E2E9E4] flex items-center justify-between bg-[#F8FAF7]">
            <div class="flex items-center gap-3.5">
              <div class="w-11 h-11 rounded-2xl bg-[#EEF5EB] border border-[#D5E6D2] flex items-center justify-center text-[#093554] text-lg flex-shrink-0 shadow-xs">
                <i class="fa-solid fa-circle-question"></i>
              </div>
              <div>
                <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-400 block">
                  Orientación Comunitaria
                </span>
                <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#093554] leading-tight">
                  Preguntas Frecuentes
                </h3>
              </div>
            </div>
            <button (click)="showFaqModal = false"
                    type="button"
                    class="w-9 h-9 rounded-full bg-white border border-[#DFE8E1] hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm transition-colors shadow-xs cursor-pointer"
                    aria-label="Cerrar">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-3.5 text-sm text-slate-600 leading-relaxed">
            <div class="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
              <h4 class="font-bold text-sm text-[#093554] flex items-center gap-2 mb-1">
                <i class="fa-solid fa-circle-check text-xs text-[#437d32]"></i>
                ¿Tiene algún costo el retiro municipal?
              </h4>
              <p class="text-xs text-slate-600 pl-4">No. El retiro regular puerta a puerta es un servicio comunal 100% gratuito financiado por la Municipalidad de Puerto Varas para proteger el entorno natural.</p>
            </div>

            <div class="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
              <h4 class="font-bold text-sm text-[#093554] flex items-center gap-2 mb-1">
                <i class="fa-solid fa-circle-check text-xs text-[#437d32]"></i>
                ¿Qué hago si no alcancé a sacar mis reciclables a tiempo?
              </h4>
              <p class="text-xs text-slate-600 pl-4">Puedes guardarlos limpios hasta tu día asignado de la próxima semana, o acercarlos a los Puntos Limpios autorizados en Puerto Chico y Costanera.</p>
            </div>

            <div class="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
              <h4 class="font-bold text-sm text-[#093554] flex items-center gap-2 mb-1">
                <i class="fa-solid fa-circle-check text-xs text-[#437d32]"></i>
                ¿Cómo solicito retiro de colchones o muebles?
              </h4>
              <p class="text-xs text-slate-600 pl-4">Inicia sesión en tu cuenta y usa la sección <strong>"Retiro especial"</strong> para coordinar una fecha de recolección de voluminosos con la cuadrilla municipal.</p>
            </div>
          </div>

          <div class="px-6 sm:px-8 py-4 bg-[#F8FAF7] border-t border-[#E2E9E4] flex items-center justify-between">
            <span class="text-xs text-slate-500 font-medium">DIMAO · Puerto Varas</span>
            <button (click)="showFaqModal = false"
                    type="button"
                    class="bg-[#093554] hover:bg-[#072438] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-sm cursor-pointer">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {
  showMaterialsModal = false;
  showFaqModal = false;

  searchQuery = '';
  isSearchFocused = false;
  justUpdated = false;

  allSectors: SectorInfo[] = [
    { id: 'braunau', name: 'Población Nueva Braunau', day: 'Martes', hours: '08:00 y 17:00 hrs.' },
    { id: 'chico', name: 'Puerto Chico / Los Colonos', day: 'Miércoles', hours: '08:00 y 17:00 hrs.' },
    { id: 'centro', name: 'Centro / Costanera', day: 'Lunes', hours: '08:00 y 17:00 hrs.' },
    { id: 'ensenada', name: 'Ensenada / Ruta 225', day: 'Jueves', hours: '08:00 y 17:00 hrs.' },
    { id: 'mirador', name: 'El Mirador / Alta Esperanza', day: 'Viernes', hours: '08:00 y 17:00 hrs.' }
  ];

  popularSectors: SectorInfo[] = [
    this.allSectors[0],
    this.allSectors[1],
    this.allSectors[2],
    this.allSectors[3]
  ];

  selectedSector: SectorInfo = this.allSectors[0];

  get filteredSectors(): SectorInfo[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.allSectors;
    }
    return this.allSectors.filter(s =>
      s.name.toLowerCase().includes(q) || s.day.toLowerCase().includes(q)
    );
  }

  selectSector(sector: SectorInfo): void {
    this.selectedSector = sector;
    this.searchQuery = sector.name;
    this.isSearchFocused = false;
    this.justUpdated = true;
    setTimeout(() => {
      this.justUpdated = false;
    }, 2500);

    const el = document.getElementById('tu-dia-de-retiro');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  onSearchSubmit(): void {
    const matches = this.filteredSectors;
    if (matches.length > 0) {
      this.selectSector(matches[0]);
    } else {
      this.isSearchFocused = false;
      const el = document.getElementById('tu-dia-de-retiro');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.showMaterialsModal = false;
    this.showFaqModal = false;
    this.isSearchFocused = false;
  }
}

