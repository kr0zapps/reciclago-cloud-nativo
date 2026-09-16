import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- BEGIN: HeroSection -->
    <section class="relative min-h-screen flex flex-col justify-center bg-[#041624] text-white overflow-hidden" id="inicio">
      
      <!-- 1. Fondo Panorámico Fotográfico Ultrawide a Pantalla Completa con Volcán Osorno y Lago Llanquihue -->
      <div class="absolute inset-0 z-0 pointer-events-none">
        <img
          alt="Lago Llanquihue y Volcán Osorno - Puerto Varas"
          class="w-full h-full object-cover object-[center_35%] lg:object-[center_38%]"
          src="assets/ultrawide.jpg"
        />

        <!-- Overlay Direccional Sutil (Oscuro sólido en el cuadrante superior/izquierdo para contraste tipográfico, transparente en el volcán) -->
        <div class="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#041624]/95 via-[#041624]/75 via-45% to-transparent to-75%"></div>

        <!-- Overlay Direccional en Móvil / Tablet -->
        <div class="lg:hidden absolute inset-0 bg-gradient-to-b from-[#041624]/95 via-[#041624]/75 to-[#041624]/45"></div>

        <!-- Sombra de anclaje inferior natural sobre la fotografía -->
        <div class="absolute bottom-0 inset-x-0 h-28 sm:h-36 bg-gradient-to-t from-[#041624]/90 via-[#041624]/40 to-transparent"></div>
      </div>



      <!-- 3. Contenido Editorial Principal con Cursiva Flotante a la Derecha (Sin Cards) -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-20 sm:pb-24 lg:pb-28 w-full">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          <!-- Columna Izquierda: Mensaje Central Comunal -->
          <div class="lg:col-span-7 xl:col-span-8 max-w-2xl">
            <!-- Eyebrow: PORTAL AMBIENTAL CIUDADANO · RECICLAGOO -->
            <div class="text-xs sm:text-sm font-bold text-[#22c55e] tracking-widest uppercase mb-3.5 drop-shadow-sm">
              PORTAL AMBIENTAL CIUDADANO · RECICLAGOO
            </div>

            <!-- Título Principal con Tipografía de Impacto Condensada: JUNTOS CUIDAMOS PUERTO VARAS -->
            <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[0.95] mb-5 font-heading drop-shadow-md">
              JUNTOS CUIDAMOS<br />
              PUERTO VARAS
            </h1>

            <!-- Bajada / Subtítulo Oficial -->
            <p class="text-sm sm:text-base lg:text-lg text-slate-100 font-normal leading-relaxed max-w-xl mb-8 drop-shadow-sm">
              Reciclar hoy, es construir el futuro sustentable que queremos para nuestra comuna y la cuenca del Lago Llanquihue.
            </p>

            <!-- Botones de Acción Sobrios y Directos -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <!-- Botón Primario Verde Sólido -->
              <a
                routerLink="/dashboard"
                class="inline-flex items-center justify-center gap-2.5 bg-[#22a652] hover:bg-[#1b8e45] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-7 py-4 rounded-lg transition-all cursor-pointer text-center shadow-lg shadow-emerald-950/40">
                <i class="fa-solid fa-recycle text-sm"></i>
                <span>Ingresar al Portal Vecinal</span>
              </a>

              <!-- Botón Secundario Outline con Fondo Translúcido -->
              <a
                href="#cuadrantes"
                class="inline-flex items-center justify-center gap-2 border border-white/80 hover:border-white bg-[#041624]/40 hover:bg-[#041624]/70 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-7 py-4 rounded-lg backdrop-blur-xs transition-all cursor-pointer text-center">
                <i class="fa-solid fa-location-dot text-sm text-emerald-400"></i>
                <span>Ver Cuadrantes de Reciclaje</span>
              </a>
            </div>
          </div>

          <!-- Columna Derecha: Lema Manuscrito Cursivo Suelto sobre el Lago (Sin Cards) -->
          <div class="lg:col-span-5 xl:col-span-4 hidden lg:flex justify-end items-center pointer-events-none pr-4 lg:pr-8">
            <div class="text-right rotate-[-5deg] anim-float select-none">
              <p class="font-script text-white text-4xl xl:text-5xl font-bold leading-snug drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
                Reciclar también es<br>cuidar nuestro<br>lago
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Indicador sutil de scroll hacia el ciclo comunal -->
      <a href="#como-funciona"
         class="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-1.5 text-white/60 hover:text-white transition-colors group cursor-pointer"
         aria-label="Ir a la sección ¿Cómo funciona?">
        <span class="text-[10px] font-bold tracking-widest uppercase opacity-75 group-hover:opacity-100 transition-opacity">Conoce el ciclo</span>
        <i class="fa-solid fa-chevron-down text-xs animate-bounce"></i>
      </a>

    </section>
    <!-- END: HeroSection -->
  `
})
export class HomeHeroComponent {}


