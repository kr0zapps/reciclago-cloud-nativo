import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="anim-page-deploy">
      <!-- ==================== HERO SECTION (TAL CUAL MOCKUP) ==================== -->
      <section class="relative min-h-[460px] sm:min-h-[500px] lg:h-[530px] flex items-center bg-[#072438] overflow-hidden">
        <!-- Fondo Fotogr?fico Panor?mico con Volc?n Osorno y Lago Llanquihue -->
        <div class="absolute inset-0 z-0">
          <img
            alt="Lago Llanquihue y Volc?n Osorno"
            class="w-full h-full object-cover object-right sm:object-center transform scale-100 transition-transform duration-1000"
            src="assets/mockup_hero_bg.png"
          />
          <!-- Degradado de lectura a la izquierda tal como en el mockup -->
          <div class="absolute inset-0 bg-gradient-to-r from-[#072438] via-[#072438]/90 sm:via-[#072438]/60 to-transparent"></div>
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
                  Juntos por una Puerto Varas m?s limpia
                </span>
                <span class="text-xl sm:text-2xl anim-leaf drop-shadow">??</span>
              </div>

              <!-- T?tulo Principal N?tido -->
              <h1 class="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight font-heading drop-shadow-lg mb-3">
                Recic<span class="text-[#72be36]">LaGo</span>
              </h1>

              <!-- Subt?tulo -->
              <p class="text-white/95 text-sm sm:text-base font-normal leading-relaxed drop-shadow mb-7 max-w-xl">
                El servicio municipal de retiro de reciclaje puerta a puerta, para una comuna m?s limpia y sustentable.
              </p>

              <!-- Barra de B?squeda Flotante Responsiva Pill -->
              <div class="bg-white rounded-full p-2 sm:p-2.5 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-2xl border border-white/80">
                <div class="flex items-center gap-3 pl-3 sm:pl-4 py-1.5 sm:py-1 flex-1">
                  <i class="fa-solid fa-location-dot text-[#0e5584] text-xl"></i>
                  <div class="flex flex-col text-left w-full overflow-hidden">
                    <span class="text-[10px] sm:text-[11px] font-bold text-[#093554] uppercase tracking-wider leading-tight">
                      Ingresa tu direcci?n
                    </span>
                    <input
                      class="p-0 text-xs sm:text-sm text-slate-600 placeholder-slate-400 border-none focus:ring-0 focus:outline-none bg-transparent w-full"
                      placeholder="Ej: Calle del Lago 123, Puerto Varas"
                      type="text"
                    />
                  </div>
                </div>
                <a
                  routerLink="/dashboard"
                  class="bg-[#437d32] hover:bg-[#366827] active:bg-[#2a541d] text-white px-6 py-3 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer">
                  <span>Ver mi d?a de retiro</span>
                  <i class="fa-solid fa-arrow-right text-xs"></i>
                </a>
              </div>
            </div>

            <!-- Columna Derecha: Lema manuscrito sobre el lago -->
            <div class="lg:col-span-4 hidden lg:flex justify-end pointer-events-none">
              <div class="text-right max-w-xs rotate-[-6deg] anim-float mr-4">
                <p class="font-script text-white text-3xl font-bold leading-tight" style="text-shadow: 0 4px 14px rgba(0,0,0,0.65);">
                  Reciclar tambi?n es<br>cuidar nuestro<br>lago ?
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ==================== SECCI?N: D?A DE RETIRO + 4 BINS + CAMI?N (TAL CUAL MOCKUP) ==================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

          <!-- 1. Tarjeta Izquierda: Tu d?a de retiro esta semana (lg:col-span-3) -->
          <div class="lg:col-span-3 bg-[#f6faf6] rounded-2xl p-5 sm:p-6 border border-[#dceade] flex flex-col justify-between shadow-xs">
            <div>
              <div class="flex items-center gap-2.5 text-[#093554] mb-3">
                <div class="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#437d32] shadow-2xs border border-emerald-100">
                  <i class="fa-regular fa-calendar-check text-lg"></i>
                </div>
                <span class="text-xs font-bold text-[#093554] tracking-tight">Tu d?a de retiro esta semana</span>
              </div>

              <div class="my-2">
                <span class="block text-3xl sm:text-4xl font-black text-[#093554] tracking-tight font-heading">
                  Martes
                </span>
                <p class="text-xs font-medium text-slate-500 mt-1">
                  Poblaci?n Nueva Braunau
                </p>
              </div>
            </div>

            <div class="space-y-3 mt-4">
              <div class="bg-[#edf8ed] rounded-xl p-3 flex items-center gap-2.5 border border-[#d2ead0]">
                <div class="w-5 h-5 rounded-full bg-[#437d32] text-white flex items-center justify-center text-[10px] flex-shrink-0">
                  <i class="fa-solid fa-check"></i>
                </div>
                <p class="text-[11px] text-[#1c4d26] font-medium leading-snug">
                  El cami?n pasar? entre las <strong class="font-bold text-[#0e3517]">08:00 y 17:00 hrs.</strong>
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

              <!-- Bin 2: Cart?n -->
              <div class="bg-[#edf4fb] rounded-2xl p-3 sm:p-3.5 flex flex-col items-center text-center border border-[#d0e5f5] transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div class="h-24 flex items-center justify-center mb-2">
                  <img src="assets/bin_carton_clean.png" alt="Cart?n" class="h-20 w-auto object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105" />
                </div>
                <h3 class="font-bold text-sm text-[#176fa9] mb-0.5">Cart?n</h3>
                <p class="text-[11px] text-slate-500 leading-tight mb-3 flex-grow">Cajas, papeles, revistas, diarios.</p>
                <div class="w-5 h-5 rounded-full bg-[#176fa9] text-white flex items-center justify-center text-[10px] shadow-2xs">
                  <i class="fa-solid fa-check"></i>
                </div>
              </div>

              <!-- Bin 3: Pl?sticos -->
              <div class="bg-[#fef8ed] rounded-2xl p-3 sm:p-3.5 flex flex-col items-center text-center border border-[#fbe9c8] transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div class="h-24 flex items-center justify-center mb-2">
                  <img src="assets/bin_plasticos_clean.png" alt="Pl?sticos" class="h-20 w-auto object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105" />
                </div>
                <h3 class="font-bold text-sm text-[#c4871d] mb-0.5">Pl?sticos</h3>
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

          <!-- 3. Tarjeta Derecha: Cami?n Municipal en el Lago (lg:col-span-3) -->
          <div class="lg:col-span-3 rounded-2xl overflow-hidden shadow-xs border border-slate-100 bg-[#f0f7f9] relative group h-full min-h-[220px]">
            <img
              src="assets/card_truck.png"
              alt="Tu reciclaje tambi?n llega al lago - Cami?n RecicLaGo"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

        </div>
      </section>

      <!-- ==================== SECCI?N: RETIRO ESPECIAL & 4 ACCIONES R?PIDAS (TAL CUAL MOCKUP) ==================== -->
      <section class="bg-gradient-to-r from-[#eaf4ec] via-[#edf7ee] to-[#f4f9f4] py-10 sm:py-12 border-t border-[#e2efe4] relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            <!-- Columna Izquierda: Retiro especial -->
            <div class="lg:col-span-4 space-y-3.5 text-center sm:text-left">
              <div class="flex items-center justify-center sm:justify-start gap-2">
                <h2 class="font-script text-3xl sm:text-4xl text-[#0c3e5e] font-bold tracking-tight">
                  ?Necesitas un retiro especial?
                </h2>
                <span class="text-2xl anim-leaf">??</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto sm:mx-0">
                Si tienes residuos fuera de lo com?n (electr?nicos, muebles, escombros, etc.) puedes agendar un <strong class="text-[#093554] font-bold">retiro especial</strong> desde aqu?.
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

                <!-- 1. Ver mi d?a de retiro -->
                <a routerLink="/dashboard" class="flex flex-col items-center text-center px-1 sm:px-2 group cursor-pointer hover:-translate-y-1 transition-transform">
                  <div class="w-13 h-13 rounded-full bg-[#e3f2e7] text-[#2b7239] flex items-center justify-center text-xl mb-3 shadow-2xs group-hover:bg-[#2b7239] group-hover:text-white transition-colors">
                    <i class="fa-solid fa-mobile-screen"></i>
                  </div>
                  <h3 class="font-bold text-xs sm:text-sm text-[#093554] mb-1 font-heading">Ver mi d?a de retiro</h3>
                  <p class="text-[11px] text-slate-500 leading-snug">Consulta tu calendario por direcci?n.</p>
                </a>

                <!-- 2. Mapa de recorridos -->
                <a routerLink="/dashboard" class="flex flex-col items-center text-center px-1 sm:px-2 group cursor-pointer hover:-translate-y-1 transition-transform">
                  <div class="w-13 h-13 rounded-full bg-[#e3f2e7] text-[#2b7239] flex items-center justify-center text-xl mb-3 shadow-2xs group-hover:bg-[#2b7239] group-hover:text-white transition-colors">
                    <i class="fa-solid fa-map-location-dot"></i>
                  </div>
                  <h3 class="font-bold text-xs sm:text-sm text-[#093554] mb-1 font-heading">Mapa de recorridos</h3>
                  <p class="text-[11px] text-slate-500 leading-snug">Revisa las calles y sectores de la comuna.</p>
                </a>

                <!-- 3. Qu? se puede reciclar -->
                <button (click)="showMaterialsModal = true" type="button" class="flex flex-col items-center text-center px-1 sm:px-2 group cursor-pointer hover:-translate-y-1 transition-transform bg-transparent border-none p-0">
                  <div class="w-13 h-13 rounded-full bg-[#e3f2e7] text-[#2b7239] flex items-center justify-center text-xl mb-3 shadow-2xs group-hover:bg-[#2b7239] group-hover:text-white transition-colors">
                    <i class="fa-solid fa-leaf"></i>
                  </div>
                  <h3 class="font-bold text-xs sm:text-sm text-[#093554] mb-1 font-heading">Qu? se puede reciclar</h3>
                  <p class="text-[11px] text-slate-500 leading-snug">Conoce los materiales y sus condiciones.</p>
                </button>

                <!-- 4. Preguntas frecuentes -->
                <button (click)="showFaqModal = true" type="button" class="flex flex-col items-center text-center px-1 sm:px-2 group cursor-pointer hover:-translate-y-1 transition-transform bg-transparent border-none p-0">
                  <div class="w-13 h-13 rounded-full bg-[#e3f2e7] text-[#2b7239] flex items-center justify-center text-2xl font-serif font-bold mb-3 shadow-2xs group-hover:bg-[#2b7239] group-hover:text-white transition-colors">
                    ?
                  </div>
                  <h3 class="font-bold text-xs sm:text-sm text-[#093554] mb-1 font-heading">Preguntas frecuentes</h3>
                  <p class="text-[11px] text-slate-500 leading-snug">Resuelve tus dudas r?pidamente.</p>
                </button>

              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ==================== SECCI?N: COSTANERA PUERTO VARAS & COMPROMISO COMUNAL (TAL CUAL MOCKUP) ==================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          <!-- Foto Panor?mica Costanera con Lema Manuscrito -->
          <div class="lg:col-span-7 rounded-3xl overflow-hidden shadow-xs border border-slate-100 group relative h-56 sm:h-64">
            <img
              src="assets/promenade_varas.png"
              alt="Costanera Puerto Varas - Peque?as acciones, grandes cambios"
              class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
          </div>

          <!-- Compromiso Comunal Municipal -->
          <div class="lg:col-span-5 space-y-3.5 pl-0 lg:pl-4 text-center sm:text-left">
            <h2 class="text-xl sm:text-2xl font-extrabold text-[#093554] leading-snug font-heading">
              En Puerto Varas, el reciclaje lo hacemos entre todos.
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Gracias por ser parte de una comuna m?s limpia, verde y consciente.
            </p>

            <!-- Logo Puerto Varas Naturaleza Comunidad Futuro -->
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
                <span class="text-[10px] text-slate-500 font-bold tracking-wider">Naturaleza ? Comunidad ? Futuro</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- ==================== MODALES (GU?A DE MATERIALES Y PREGUNTAS FRECUENTES) ==================== -->
      <!-- Modal Gu?a de Materiales -->
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
                  Ordenanza Comunal ? Clasificaci?n
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
              Entrega tus materiales <strong>limpios, secos y compactados</strong> para asegurar su valorizaci?n:
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="p-3.5 rounded-2xl bg-[#edf8ed] border border-[#d6ebd0]">
                <span class="font-bold text-xs uppercase tracking-wider text-[#238038] block mb-1">1. Vidrio</span>
                <p class="text-xs text-slate-600">Botellas y frascos de conservas sin tapas met?licas. Limpios y secos.</p>
              </div>
              <div class="p-3.5 rounded-2xl bg-[#edf4fb] border border-[#d0e5f5]">
                <span class="font-bold text-xs uppercase tracking-wider text-[#176fa9] block mb-1">2. Cart?n y Papel</span>
                <p class="text-xs text-slate-600">Cajas aplanadas, diarios, revistas y papel blanco seco.</p>
              </div>
              <div class="p-3.5 rounded-2xl bg-[#fef8ed] border border-[#fbe9c8]">
                <span class="font-bold text-xs uppercase tracking-wider text-[#c4871d] block mb-1">3. Pl?sticos</span>
                <p class="text-xs text-slate-600">Botellas de l?quidos y envases limpios, aplastados y con tapa puesta.</p>
              </div>
              <div class="p-3.5 rounded-2xl bg-[#fdf0ef] border border-[#fad5d3]">
                <span class="font-bold text-xs uppercase tracking-wider text-[#c94b43] block mb-1">4. Latas</span>
                <p class="text-xs text-slate-600">Latas de aluminio y conservas met?licas enjuagadas y aplastadas.</p>
              </div>
            </div>
          </div>

          <div class="px-6 sm:px-8 py-4 bg-[#F8FAF7] border-t border-[#E2E9E4] flex items-center justify-between">
            <span class="text-xs text-slate-500 font-medium">DIMAO ? Puerto Varas</span>
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
                  Orientaci?n Comunitaria
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
                ?Tiene alg?n costo el retiro municipal?
              </h4>
              <p class="text-xs text-slate-600 pl-4">No. El retiro regular puerta a puerta es un servicio comunal 100% gratuito financiado por la Municipalidad de Puerto Varas para proteger el entorno natural.</p>
            </div>

            <div class="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
              <h4 class="font-bold text-sm text-[#093554] flex items-center gap-2 mb-1">
                <i class="fa-solid fa-circle-check text-xs text-[#437d32]"></i>
                ?Qu? hago si no alcanc? a sacar mis reciclables a tiempo?
              </h4>
              <p class="text-xs text-slate-600 pl-4">Puedes guardarlos limpios hasta tu d?a asignado de la pr?xima semana, o acercarlos a los Puntos Limpios autorizados en Puerto Chico y Costanera.</p>
            </div>

            <div class="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
              <h4 class="font-bold text-sm text-[#093554] flex items-center gap-2 mb-1">
                <i class="fa-solid fa-circle-check text-xs text-[#437d32]"></i>
                ?C?mo solicito retiro de colchones o muebles?
              </h4>
              <p class="text-xs text-slate-600 pl-4">Inicia sesi?n en tu cuenta y usa la secci?n <strong>"Retiro especial"</strong> para coordinar una fecha de recolecci?n de voluminosos con la cuadrilla municipal.</p>
            </div>
          </div>

          <div class="px-6 sm:px-8 py-4 bg-[#F8FAF7] border-t border-[#E2E9E4] flex items-center justify-between">
            <span class="text-xs text-slate-500 font-medium">DIMAO ? Puerto Varas</span>
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

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.showMaterialsModal = false;
    this.showFaqModal = false;
  }
}
