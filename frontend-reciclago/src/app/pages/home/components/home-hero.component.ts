import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- BEGIN: HeroSection -->
    <section class="relative min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] flex items-center bg-[#072438] overflow-hidden" id="inicio">
      <!-- Fondo Fotográfico Panorámico 4K con Volcán Osorno y Lago Llanquihue -->
      <div class="absolute inset-0 z-0">
        <img
          alt="Lago Llanquihue y Volcán Osorno - Puerto Varas"
          class="w-full h-full object-cover object-right sm:object-center transform scale-100 transition-transform duration-1000"
          src="assets/puerto-varas-hero-clean.jpg"
        />
        <!-- Degradado de lectura cívica a la izquierda -->
        <div class="absolute inset-0 bg-gradient-to-r from-[#072438] via-[#072438]/85 sm:via-[#072438]/60 to-transparent"></div>
        <!-- Difuminado inferior suave con la siguiente sección (#f7faf7) -->
        <div class="absolute inset-0 bg-gradient-to-t from-[#f7faf7] via-transparent to-black/30"></div>
      </div>

      <!-- Contenido Hero Informativo -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full flex flex-col justify-center anim-fade-up">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          <!-- Columna Izquierda: Información Central del Caso Comunal -->
          <div class="lg:col-span-8 max-w-2xl">
            <!-- Título Principal Institucional -->
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-heading drop-shadow-md mb-2 leading-tight">
              Recic<span class="text-[#72be36]">LaGo</span>
            </h1>

            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white/95 leading-snug mb-5 font-sans drop-shadow-sm">
              Retiro Domiciliario Inteligente de Residuos Reciclables
            </h2>

            <!-- Descripción Detallada del Caso -->
            <p class="text-white/90 text-sm sm:text-base font-normal leading-relaxed drop-shadow mb-8 max-w-xl">
              Desde los antiguos formularios manuales, hoy avanzamos hacia un sistema de recolección puerta a puerta con pesaje digital in situ, para proteger la cuenca del Lago Llanquihue y un futuro más sostenible para Puerto Varas.
            </p>

            <!-- Botones de Acción Funcionales -->
            <div class="flex flex-wrap items-center gap-3.5">
              <a
                routerLink="/dashboard"
                class="inline-flex items-center gap-2.5 bg-[#437d32] hover:bg-[#366827] active:bg-[#2a541d] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer">
                <i class="fa-solid fa-house-laptop"></i>
                <span>Ingresar al Portal Vecinal</span>
                <i class="fa-solid fa-arrow-right text-xs"></i>
              </a>

              <a
                href="#cuadrantes"
                class="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl border border-white/30 backdrop-blur-sm transition-all cursor-pointer">
                <i class="fa-solid fa-calendar-days text-[#72be36]"></i>
                <span>Ver Cuadrantes de Reciclaje</span>
              </a>

              <a
                href="#como-funciona"
                class="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-xs sm:text-sm font-medium px-3 py-2 transition-colors cursor-pointer">
                <span>¿Cómo funciona?</span>
                <i class="fa-solid fa-chevron-down text-xs"></i>
              </a>
            </div>
          </div>

          <!-- Columna Derecha: Lema manuscrito cursivo sobre el lago -->
          <div class="lg:col-span-4 hidden lg:flex justify-end pointer-events-none">
            <div class="text-right max-w-xs rotate-[-6deg] anim-float mr-4">
              <p class="font-script text-white text-3xl sm:text-4xl font-bold leading-tight" style="text-shadow: 0 4px 14px rgba(0,0,0,0.65);">
                Reciclar también es<br>cuidar nuestro<br>lago
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  `
})
export class HomeHeroComponent {}


