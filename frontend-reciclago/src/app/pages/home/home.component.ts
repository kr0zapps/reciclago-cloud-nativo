import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="anim-page-deploy">
    <!-- ==================== HERO SECTION 4K ==================== -->
    <section class="relative min-h-[560px] sm:min-h-[580px] lg:h-[620px] flex items-center bg-slate-950 overflow-hidden">
      <!-- Fotografía Panorámica Ultra-HD 4K (Sin texto quemado) -->
      <div class="absolute inset-0 z-0">
        <img
          alt="Lago Llanquihue y Volcán Osorno en Puerto Varas"
          class="w-full h-full object-cover object-center transform scale-100 sm:scale-105 transition-transform duration-1000"
          src="/assets/puerto-varas-hero-clean.jpg"
        />
        <!-- Degradados atmosféricos sutiles para legibilidad -->
        <div class="absolute inset-0 bg-gradient-to-r from-[#031724f5] via-[#042033b4] sm:via-[#04203366] to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-[#041d2dcc] via-transparent to-black/20"></div>
      </div>

      <!-- Contenido Hero Responsivo -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full flex flex-col justify-center">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          <!-- Columna Izquierda: Mensaje y Buscador -->
          <div class="lg:col-span-8 max-w-2xl">
            <!-- Saludo manuscrito con hoja animada -->
            <div class="flex items-center gap-2 mb-2">
              <span class="font-script text-emerald-300 text-2xl sm:text-3xl font-bold tracking-wide drop-shadow-md">
                Juntos por una Puerto Varas más limpia
              </span>
              <span class="text-2xl anim-leaf drop-shadow">🍃</span>
            </div>

            <!-- Título Principal Nítido -->
            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight font-heading drop-shadow-lg mb-3">
              Recic<span class="text-[#72be36]">LaGo</span>
            </h1>

            <!-- Subtítulo -->
            <p class="text-white/95 text-base lg:text-lg font-normal leading-relaxed drop-shadow mb-8 max-w-xl">
              El servicio municipal de retiro de reciclaje puerta a puerta, para proteger la cuenca del Lago Llanquihue y construir una comuna sustentable.
            </p>

            <!-- Barra de Búsqueda Flotante Responsiva -->
            <div class="bg-white/95 backdrop-blur-md p-2 rounded-2xl sm:rounded-full shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl border border-white/60">
              <div class="flex items-center gap-3 pl-3 sm:pl-4 py-2 sm:py-1 flex-1">
                <i class="fa-solid fa-location-dot text-[#123F5B] text-lg sm:text-xl"></i>
                <div class="flex flex-col text-left w-full overflow-hidden">
                  <span class="text-[10px] sm:text-[11px] font-bold text-[#093554] uppercase tracking-wider leading-tight">
                    Ingresa tu dirección
                  </span>
                  <input
                    class="p-0 text-xs sm:text-sm text-slate-600 placeholder-slate-400 border-none focus:ring-0 focus:outline-none bg-transparent w-full"
                    placeholder="Ej: Pérez Rosales 850, Puerto Varas"
                    type="text"
                  />
                </div>
              </div>
              <a
                routerLink="/dashboard"
                class="bg-[#4F8A3D] hover:bg-[#3B6E2C] active:bg-[#2F5923] text-white px-5 sm:px-6 py-3 rounded-xl sm:rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer">
                <span>Ver mi día de retiro</span>
                <i class="fa-solid fa-arrow-right text-xs"></i>
              </a>
            </div>
          </div>

          <!-- Columna Derecha: Lema manuscrito libre flotando -->
          <div class="lg:col-span-4 flex justify-end">
            <!-- RESTAURADO: Sin tarjeta de vidrio, flotando libremente como en Stitch Original -->
            <div class="hidden lg:block absolute right-16 top-1/2 -translate-y-4 text-right max-w-xs pointer-events-none rotate-[-6deg] anim-float">
              <p class="font-script text-white text-3xl lg:text-4xl font-bold leading-tight" style="text-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                Reciclar también es<br>cuidar nuestro<br>lago ♡
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ==================== CALENDARIO & BINS SEMANALES ==================== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20 pb-12">

      <!-- Tarjeta Principal del Día Asignado -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch mb-6">

        <!-- Columna Izquierda: Tu día de retiro -->
        <div class="lg:col-span-4 bg-[#eff7ed] rounded-3xl p-6 sm:p-7 border border-[#d6ebd0] flex flex-col justify-center shadow-soft">
          <div>
            <div class="flex items-center gap-3 text-[#093554] mb-3">
              <div class="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-[#4F8A3D] shadow-xs border border-emerald-100">
                <i class="fa-regular fa-calendar-check text-xl"></i>
              </div>
              <div>
                <span class="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">Cronograma Comunal</span>
                <h2 class="text-sm font-bold text-[#093554] tracking-tight">Tu día de retiro esta semana</h2>
              </div>
            </div>
            <div class="my-3">
              <span class="block text-4xl sm:text-5xl font-black text-[#082a40] tracking-tight font-heading">
                Martes
              </span>
              <p class="text-sm font-medium text-slate-600 mt-1 flex items-center gap-1.5">
                <i class="fa-solid fa-map-pin text-[#4F8A3D] text-xs"></i>
                <span>Cuadrante Costanera Sur y Nueva Braunau</span>
              </p>
            </div>
          </div>

          <div class="space-y-3.5 mt-3">
            <div class="bg-[#dcf0d6] rounded-2xl p-4 flex items-center justify-center gap-3.5 border border-[#cbe4c3] shadow-xs">
              <div class="w-7 h-7 rounded-full bg-[#4F8A3D] text-white flex items-center justify-center text-xs flex-shrink-0 shadow-xs">
                <i class="fa-solid fa-check"></i>
              </div>
              <p class="text-xs sm:text-[13px] text-[#1a4023] font-medium leading-snug">
                El camión pasará entre las <strong class="font-bold text-[#0f2e16]">08:00 y 17:00 hrs.</strong>
              </p>
            </div>

            <div class="flex items-center justify-center sm:justify-start">
              <a routerLink="/dashboard" class="inline-flex items-center gap-2 text-xs font-bold text-[#093554] hover:text-[#4F8A3D] transition-colors pl-1">
                <span>Ver cuadrantes y sectores en vivo</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Cuadrícula Equilibrada de 4 Bins de Reciclaje -->
        <div class="lg:col-span-8 flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E9E4] shadow-soft">
          <div class="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 class="text-lg sm:text-xl font-extrabold text-[#093554] tracking-tight font-heading flex items-center gap-2">
              <i class="fa-solid fa-recycle text-[#4F8A3D]"></i>
              <span>Esta semana te toca separar:</span>
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 items-stretch">

            <!-- Bin 1: Vidrio -->
            <div class="bg-[#f0f8ef] rounded-2xl p-4 flex flex-col items-center text-center border border-[#d6ebd0] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md">
              <div class="h-28 flex items-end justify-center mb-3">
                <div class="relative flex flex-col items-center">
                  <div class="flex items-end gap-1 -mb-1 z-0 opacity-90">
                    <div class="w-3.5 h-12 bg-emerald-600/90 rounded-t-sm"></div>
                    <div class="w-4 h-16 bg-emerald-700/80 rounded-t-sm"></div>
                    <div class="w-3 h-10 bg-teal-500/80 rounded-t-sm"></div>
                  </div>
                  <div class="w-20 h-14 bg-[#239244] rounded-md shadow-md border-t-4 border-[#1c7837] flex items-center justify-center text-white/40">
                    <i class="fa-solid fa-recycle text-xl"></i>
                  </div>
                </div>
              </div>
              <h4 class="font-bold text-sm text-[#093554] mb-1">Vidrio</h4>
              <p class="text-[11px] text-slate-500 leading-tight mb-4 flex-grow">Botellas, frascos, vasos (sin tapas).</p>
              <div class="w-6 h-6 rounded-full bg-[#239244] text-white flex items-center justify-center text-xs shadow-xs">
                <i class="fa-solid fa-check"></i>
              </div>
            </div>

            <!-- Bin 2: Cartón -->
            <div class="bg-[#f0f7fb] rounded-2xl p-4 flex flex-col items-center text-center border border-[#d2e7f3] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md">
              <div class="h-28 flex items-end justify-center mb-3">
                <div class="relative flex flex-col items-center">
                  <div class="flex items-end gap-0.5 -mb-1 z-0">
                    <div class="w-7 h-12 bg-[#bfa17c] rounded-t transform -rotate-6 border border-amber-900/10"></div>
                    <div class="w-8 h-15 bg-[#cbb291] rounded-t shadow-sm"></div>
                    <div class="w-6 h-9 bg-[#ddcbaf] rounded-t transform rotate-6"></div>
                  </div>
                  <div class="w-20 h-14 bg-[#1479b8] rounded-md shadow-md border-t-4 border-[#0e5c8c] flex items-center justify-center text-white/40">
                    <i class="fa-solid fa-box-archive text-xl"></i>
                  </div>
                </div>
              </div>
              <h4 class="font-bold text-sm text-[#093554] mb-1">Cartón</h4>
              <p class="text-[11px] text-slate-500 leading-tight mb-4 flex-grow">Cajas, papeles, revistas, diarios.</p>
              <div class="w-6 h-6 rounded-full bg-[#1479b8] text-white flex items-center justify-center text-xs shadow-xs">
                <i class="fa-solid fa-check"></i>
              </div>
            </div>

            <!-- Bin 3: Plásticos -->
            <div class="bg-[#fef9ed] rounded-2xl p-4 flex flex-col items-center text-center border border-[#faeecf] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md">
              <div class="h-28 flex items-end justify-center mb-3">
                <div class="relative flex flex-col items-center">
                  <div class="flex items-end gap-1 -mb-1 z-0">
                    <div class="w-3.5 h-14 bg-sky-300/80 rounded-t-full border border-sky-400"></div>
                    <div class="w-4 h-12 bg-amber-200/90 rounded-t-md border border-amber-300"></div>
                    <div class="w-3 h-15 bg-emerald-300/80 rounded-t-full border border-emerald-400"></div>
                  </div>
                  <div class="w-20 h-14 bg-[#f0a500] rounded-md shadow-md border-t-4 border-[#c78800] flex items-center justify-center text-white/40">
                    <i class="fa-solid fa-bottle-water text-xl"></i>
                  </div>
                </div>
              </div>
              <h4 class="font-bold text-sm text-[#093554] mb-1">Plásticos</h4>
              <p class="text-[11px] text-slate-500 leading-tight mb-4 flex-grow">Envases, botellas, bolsas limpias.</p>
              <div class="w-6 h-6 rounded-full bg-[#f0a500] text-white flex items-center justify-center text-xs shadow-xs">
                <i class="fa-solid fa-check"></i>
              </div>
            </div>

            <!-- Bin 4: Latas -->
            <div class="bg-[#fdf2f2] rounded-2xl p-4 flex flex-col items-center text-center border border-[#fadada] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md">
              <div class="h-28 flex items-end justify-center mb-3">
                <div class="relative flex flex-col items-center">
                  <div class="flex items-end gap-1 -mb-1 z-0">
                    <div class="w-4 h-11 bg-rose-500 rounded-t-sm shadow-inner"></div>
                    <div class="w-4 h-13 bg-slate-300 rounded-t-sm border border-slate-400"></div>
                  </div>
                  <div class="w-20 h-14 bg-[#d93829] rounded-md shadow-md border-t-4 border-[#b52618] flex items-center justify-center text-white/40">
                    <i class="fa-solid fa-cubes-stacked text-xl"></i>
                  </div>
                </div>
              </div>
              <h4 class="font-bold text-sm text-[#093554] mb-1">Latas</h4>
              <p class="text-[11px] text-slate-500 leading-tight mb-4 flex-grow">Latas de bebidas y conservas.</p>
              <div class="w-6 h-6 rounded-full bg-[#d93829] text-white flex items-center justify-center text-xs shadow-xs">
                <i class="fa-solid fa-check"></i>
              </div>
            </div>

          </div>
        </div>

      </div>

      <!-- ==================== BANNER PROTAGONISTA DEL CAMIÓN MUNICIPAL ==================== -->
      <div class="civic-card p-6 sm:p-7 bg-white text-[#183247] shadow-sm relative overflow-hidden border-2 border-[#D3E3D6]">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">

          <!-- Foto Real del Camión Municipal de Puerto Varas -->
          <div class="md:col-span-5 lg:col-span-4">
            <div class="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden shadow-sm border border-[#E2E9E4] group">
              <img
                alt="Camión RecicLaGo Puerto Varas"
                class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                src="/assets/camion-puerto-varas.jpg"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div class="absolute bottom-2.5 left-3 bg-white/95 px-3 py-1 rounded-full text-[11px] font-bold text-[#123F5B] flex items-center gap-1.5 shadow-sm">
                <i class="fa-solid fa-truck-moving text-[#4F8A3D]"></i>
                <span>Flota Municipal Puerto Varas</span>
              </div>
            </div>
          </div>

          <!-- Información y Lema del Camión -->
          <div class="md:col-span-7 lg:col-span-8 space-y-3">
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-1.5 bg-[#EEF5EB] border border-[#CDE5C8] text-[#3B6E2C] px-3 py-1 rounded-full text-xs font-bold shadow-xs">
                <i class="fa-solid fa-truck-fast"></i>
                <span>Ruta Activa • 100% Municipal</span>
              </span>
              <span class="text-xs text-[#61717A] font-semibold">
                Supervisado por DIMAO
              </span>
            </div>

            <h3 class="font-script text-[#123F5B] text-3xl sm:text-4xl font-bold leading-tight">
              Tu reciclaje también llega al lago 彡
            </h3>

            <p class="text-sm text-[#61717A] max-w-xl leading-relaxed">
              Cada camión cuenta con pesaje y registro de trazabilidad para certificar que tus residuos se reciclen íntegramente y no terminen en el Lago Llanquihue ni en vertederos ilegales.
            </p>

            <div class="pt-2 flex flex-wrap items-center gap-4">
              <a
                routerLink="/dashboard"
                class="inline-flex items-center gap-2 bg-[#123F5B] hover:bg-[#0D3549] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all shadow-sm">
                <i class="fa-solid fa-map-location-dot"></i>
                <span>Seguir mi camión en el panel</span>
              </a>
              <span class="text-xs text-[#61717A]">
                Horario hoy: <strong>08:00 – 17:00 hrs</strong>
              </span>
            </div>
          </div>

        </div>
      </div>

    </section>

    <!-- ==================== RETIRO ESPECIAL & QUICK LINKS ==================== -->
    <section class="bg-gradient-to-b from-[#F4F9F2] to-white py-12 sm:py-14 border-t border-[#EAEFE8] relative overflow-hidden">
      <div class="absolute -left-10 top-0 w-48 h-48 bg-[#EEF5EB] rounded-full blur-2xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          <!-- Columna Izquierda: Retiro Especial -->
          <div class="lg:col-span-4 space-y-4 text-center sm:text-left">
            <div class="flex items-center justify-center sm:justify-start gap-2">
              <h2 class="font-heading text-2xl sm:text-3xl text-[#123F5B] font-extrabold tracking-tight">
                ¿Necesitas un retiro especial?
              </h2>
            </div>
            <p class="text-sm text-[#61717A] leading-relaxed max-w-sm mx-auto sm:mx-0">
              Si tienes residuos voluminosos (electrónicos, muebles o podas) puedes agendar un <strong class="text-[#183247] font-bold">retiro especial</strong> con el municipio.
            </p>
            <div class="pt-2">
              <a
                routerLink="/dashboard"
                class="inline-flex items-center justify-center gap-2.5 bg-[#4F8A3D] hover:bg-[#3B6E2C] text-white text-sm font-semibold px-6 py-3 rounded-full transition-all shadow-sm hover:shadow w-full sm:w-auto">
                <i class="fa-regular fa-calendar-plus text-base"></i>
                <span>Agendar retiro especial</span>
              </a>
            </div>
          </div>

          <!-- Columna Derecha: 4 Quick Links Responsivos -->
          <div class="lg:col-span-8">
            <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E2E9E4] grid grid-cols-2 md:grid-cols-4 gap-6 divide-x-0 md:divide-x divide-[#EAEFE8]">

              <a routerLink="/dashboard" class="flex flex-col items-center text-center px-2 group hover:-translate-y-1 transition-transform">
                <div class="w-12 h-12 rounded-2xl bg-[#EEF7EC] text-[#4F8A3D] flex items-center justify-center text-xl mb-3 shadow-xs border border-[#D3E3D6] group-hover:bg-[#4F8A3D] group-hover:text-white transition-colors">
                  <i class="fa-solid fa-mobile-screen"></i>
                </div>
                <h3 class="font-bold text-sm text-[#123F5B] mb-1 font-heading">Ver mi día</h3>
                <p class="text-[11px] text-[#61717A] leading-snug">Consulta tu calendario por dirección.</p>
              </a>

              <a routerLink="/dashboard" class="flex flex-col items-center text-center px-2 group hover:-translate-y-1 transition-transform">
                <div class="w-12 h-12 rounded-2xl bg-[#EEF7EC] text-[#4F8A3D] flex items-center justify-center text-xl mb-3 shadow-xs border border-[#D3E3D6] group-hover:bg-[#4F8A3D] group-hover:text-white transition-colors">
                  <i class="fa-solid fa-map-location-dot"></i>
                </div>
                <h3 class="font-bold text-sm text-[#123F5B] mb-1 font-heading">Mapa de rutas</h3>
                <p class="text-[11px] text-[#61717A] leading-snug">Calles y sectores de la comuna.</p>
              </a>

              <button (click)="showMaterialsModal = true" type="button" class="flex flex-col items-center text-center px-2 group hover:-translate-y-1 transition-transform cursor-pointer bg-transparent border-none p-0">
                <div class="w-12 h-12 rounded-2xl bg-[#EEF7EC] text-[#4F8A3D] flex items-center justify-center text-xl mb-3 shadow-xs border border-[#D3E3D6] group-hover:bg-[#4F8A3D] group-hover:text-white transition-colors">
                  <i class="fa-solid fa-leaf"></i>
                </div>
                <h3 class="font-bold text-sm text-[#123F5B] mb-1 font-heading">Qué reciclar</h3>
                <p class="text-[11px] text-[#61717A] leading-snug">Materiales y condiciones de entrega.</p>
              </button>

              <button (click)="showFaqModal = true" type="button" class="flex flex-col items-center text-center px-2 group hover:-translate-y-1 transition-transform cursor-pointer bg-transparent border-none p-0">
                <div class="w-12 h-12 rounded-2xl bg-[#EEF7EC] text-[#4F8A3D] flex items-center justify-center text-xl mb-3 shadow-xs border border-[#D3E3D6] group-hover:bg-[#4F8A3D] group-hover:text-white transition-colors">
                  <i class="fa-solid fa-circle-question"></i>
                </div>
                <h3 class="font-bold text-sm text-[#123F5B] mb-1 font-heading">Preguntas frecuentes</h3>
                <p class="text-[11px] text-[#61717A] leading-snug">Resuelve tus dudas rápidamente.</p>
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ==================== BANNER COMUNAL ==================== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- Foto Panorámica Costanera -->
        <div class="lg:col-span-7 rounded-3xl overflow-hidden relative shadow-sm min-h-[260px] flex items-end">
          <img
            alt="Costanera Puerto Varas"
            class="absolute inset-0 w-full h-full object-cover object-center"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPVB7gOs6Al6PmwgfKFlWYou1gfAts5MD28L4va-Vb-Tt--62sBNbhsDKPa26WuHuA2RGS0_iKiEJSSvAnCXIuks2KgfIPnOZOsUZyqfXA177GRuMR8BnlcuaNzQh2zrEA-jd5mhg__4aWEwf24cODj-20Y_DrwciqSNOWWVt6Z3fvbJ_1sVfFgABCX1ufvFLn2K3Dprr606xT0M_LZxswwSRcWvhXQABHL7gBPVXW9rCLAxWiR5Vj"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#123F5B]/80 via-black/20 to-transparent"></div>
          <div class="relative z-10 p-6 sm:p-8 flex items-center gap-2">
            <p class="font-script text-white text-3xl sm:text-4xl font-bold tracking-wide drop-shadow-md">
              Pequeñas acciones, grandes cambios
            </p>
            <span class="text-2xl anim-leaf drop-shadow">🍃</span>
          </div>
        </div>

        <!-- Compromiso Municipal -->
        <div class="lg:col-span-5 space-y-4 pl-0 lg:pl-4 text-center sm:text-left">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#123F5B] leading-tight font-heading">
            En Puerto Varas, el reciclaje lo hacemos entre todos.
          </h2>
          <p class="text-sm text-[#61717A] leading-relaxed">
            Gracias por ser parte de una comuna más limpia, verde y consciente. Cuidemos juntos la biodiversidad de nuestra cuenca.
          </p>

          <div class="pt-2 flex items-center justify-center sm:justify-start gap-3">
            <div class="w-14 h-10 flex-shrink-0 flex items-center justify-center">
              <svg class="w-full h-full" fill="none" viewBox="0 0 70 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 28C18 20 32 20 45 28C54 33 63 31 68 28" stroke="#123F5B" stroke-linecap="round" stroke-width="3"></path>
                <path d="M12 34C24 27 38 27 50 34C58 38 64 36 68 34" stroke="#0ea5e9" stroke-linecap="round" stroke-width="2"></path>
                <path d="M48 8C52 14 62 16 66 12C68 18 64 24 56 22C50 20 46 12 48 8Z" fill="#4F8A3D"></path>
              </svg>
            </div>
            <div class="flex flex-col text-left">
              <span class="text-base font-black text-[#123F5B] tracking-tight uppercase">Puerto Varas</span>
              <span class="text-[10px] text-[#61717A] font-bold tracking-wider">Naturaleza · Comunidad · Futuro</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== MODAL: GUÍA DE MATERIALES ==================== -->
    <div *ngIf="showMaterialsModal"
         (click)="showMaterialsModal = false"
         class="fixed inset-0 z-50 overflow-y-auto bg-[#041D2D]/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel text-slate-800 my-auto">
        
        <div class="h-1.5 w-full bg-gradient-to-r from-[#4F8A3D] via-[#38BDF8] to-[#123F5B]"></div>

        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-[#E2E9E4] flex items-center justify-between bg-[#F8FAF7]">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-[#EEF5EB] border border-[#D5E6D2] flex items-center justify-center text-[#4F8A3D] text-lg flex-shrink-0 shadow-xs">
              <i class="fa-solid fa-leaf"></i>
            </div>
            <div>
              <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#4F8A3D] block">
                Ordenanza Comunal • Clasificación
              </span>
              <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#123F5B] leading-tight">
                Materiales Aceptados en Ruta
              </h3>
            </div>
          </div>
          <button (click)="showMaterialsModal = false"
                  type="button"
                  class="w-9 h-9 rounded-full bg-white border border-[#DFE8E1] hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm transition-colors shadow-xs cursor-pointer"
                  aria-label="Cerrar ventana">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-4 text-sm text-slate-600 leading-relaxed">
          <p class="text-xs text-slate-500">
            Entrega tus materiales <strong>limpios, secos y compactados</strong> para asegurar su valorización:
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3.5 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
              <span class="font-bold text-xs uppercase tracking-wider text-[#4F8A3D] block mb-1">1. Vidrio</span>
              <p class="text-xs text-slate-600">Botellas y frascos de conservas sin tapas metálicas. Limpios y secos.</p>
            </div>
            <div class="p-3.5 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
              <span class="font-bold text-xs uppercase tracking-wider text-[#0284C7] block mb-1">2. Cartón y Papel</span>
              <p class="text-xs text-slate-600">Cajas aplanadas, diarios, revistas y papel blanco seco.</p>
            </div>
            <div class="p-3.5 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
              <span class="font-bold text-xs uppercase tracking-wider text-[#123F5B] block mb-1">3. Plásticos (PET 1 / PEAD 2)</span>
              <p class="text-xs text-slate-600">Botellas de líquidos y bidones enjuagados, aplastados y tapados.</p>
            </div>
            <div class="p-3.5 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
              <span class="font-bold text-xs uppercase tracking-wider text-[#72be36] block mb-1">4. Latas y Metales</span>
              <p class="text-xs text-slate-600">Latas de aluminio y conservas metálicas enjuagadas y aplastadas.</p>
            </div>
          </div>

          <div class="p-3.5 rounded-2xl bg-[#FDF4E7] border border-[#F6DCBA] flex items-start gap-3 text-xs text-amber-900">
            <i class="fa-solid fa-triangle-exclamation text-amber-700 text-sm mt-0.5 flex-shrink-0"></i>
            <span>No recibimos loza, cerámica, plumavit ni vidrios de ventanas en ruta normal.</span>
          </div>
        </div>

        <div class="px-6 sm:px-8 py-4 bg-[#F8FAF7] border-t border-[#E2E9E4] flex items-center justify-between">
          <span class="text-xs text-slate-500 font-medium">DIMAO • Puerto Varas</span>
          <button (click)="showMaterialsModal = false"
                  type="button"
                  class="bg-[#4F8A3D] hover:bg-[#3D6E2E] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-sm cursor-pointer">
            Entendido
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL: PREGUNTAS FRECUENTES ==================== -->
    <div *ngIf="showFaqModal"
         (click)="showFaqModal = false"
         class="fixed inset-0 z-50 overflow-y-auto bg-[#041D2D]/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 anim-modal-backdrop">
      
      <div (click)="$event.stopPropagation()"
           class="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-[#E2E9E4] overflow-hidden anim-modal-panel text-slate-800 my-auto">
        
        <div class="h-1.5 w-full bg-gradient-to-r from-[#4F8A3D] via-[#38BDF8] to-[#123F5B]"></div>

        <div class="px-6 sm:px-8 pt-6 pb-4 border-b border-[#E2E9E4] flex items-center justify-between bg-[#F8FAF7]">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-[#EEF5EB] border border-[#D5E6D2] flex items-center justify-center text-[#123F5B] text-lg flex-shrink-0 shadow-xs">
              <i class="fa-solid fa-circle-question"></i>
            </div>
            <div>
              <span class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-400 block">
                Orientación Comunitaria
              </span>
              <h3 class="font-heading font-extrabold text-xl sm:text-2xl text-[#123F5B] leading-tight">
                Preguntas Frecuentes
              </h3>
            </div>
          </div>
          <button (click)="showFaqModal = false"
                  type="button"
                  class="w-9 h-9 rounded-full bg-white border border-[#DFE8E1] hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm transition-colors shadow-xs cursor-pointer"
                  aria-label="Cerrar ventana">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="px-6 sm:px-8 py-6 max-h-[calc(85vh-140px)] overflow-y-auto space-y-3.5 text-sm text-slate-600 leading-relaxed">
          
          <div class="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
            <h4 class="font-bold text-sm text-[#123F5B] flex items-center gap-2 mb-1">
              <i class="fa-solid fa-circle-check text-xs text-[#4F8A3D]"></i>
              ¿Tiene algún costo el retiro municipal?
            </h4>
            <p class="text-xs text-slate-600 pl-4">No. El retiro regular puerta a puerta es un servicio comunal 100% gratuito financiado por la Municipalidad de Puerto Varas para proteger el entorno natural.</p>
          </div>

          <div class="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
            <h4 class="font-bold text-sm text-[#123F5B] flex items-center gap-2 mb-1">
              <i class="fa-solid fa-circle-check text-xs text-[#4F8A3D]"></i>
              ¿Qué hago si no alcancé a sacar mis reciclables a tiempo?
            </h4>
            <p class="text-xs text-slate-600 pl-4">Puedes guardarlos limpios hasta tu día asignado de la próxima semana, o acercarlos a los Puntos Limpios autorizados en Puerto Chico y Costanera.</p>
          </div>

          <div class="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E9E4]">
            <h4 class="font-bold text-sm text-[#123F5B] flex items-center gap-2 mb-1">
              <i class="fa-solid fa-circle-check text-xs text-[#4F8A3D]"></i>
              ¿Cómo solicito retiro de colchones o muebles?
            </h4>
            <p class="text-xs text-slate-600 pl-4">Inicia sesión en tu cuenta y usa la sección <strong>"Retiro especial"</strong> para coordinar una fecha de recolección de voluminosos con la cuadrilla municipal.</p>
          </div>

        </div>

        <div class="px-6 sm:px-8 py-4 bg-[#F8FAF7] border-t border-[#E2E9E4] flex items-center justify-between">
          <span class="text-xs text-slate-500 font-medium">DIMAO • Puerto Varas</span>
          <button (click)="showFaqModal = false"
                  type="button"
                  class="bg-[#123F5B] hover:bg-[#0D3549] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-sm cursor-pointer">
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
