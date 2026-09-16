import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- BEGIN: HeroSection -->
    <section class="relative min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex items-center bg-[#072438] overflow-hidden" id="inicio">
      <!-- Fondo Fotográfico Panorámico 4K con Volcán Osorno y Lago Llanquihue -->
      <div class="absolute inset-0 z-0 pointer-events-none">
        <img
          alt="Lago Llanquihue y Volcán Osorno - Puerto Varas"
          class="w-full h-full object-cover object-[center_35%] lg:object-center transform scale-100 transition-transform duration-1000 opacity-100"
          src="assets/puerto-varas-hero-clean.jpg"
        />

        <!-- Overlay Direccional Sutil (Desktop: Oscurece sólo el texto a la izquierda, dejando el volcán y lago luminosos) -->
        <div class="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#072438]/85 via-[#072438]/45 to-transparent w-9/12"></div>

        <!-- Overlay Direccional Sutil (Móvil: Gradiente suave vertical para máxima legibilidad sin apagar el paisaje) -->
        <div class="lg:hidden absolute inset-0 bg-gradient-to-t from-[#072438]/90 via-[#072438]/60 to-[#072438]/25"></div>

        <!-- Difuminado inferior suave hacia la siguiente sección (#f7faf7) -->
        <div class="absolute bottom-0 inset-x-0 h-28 sm:h-36 bg-gradient-to-t from-[#f7faf7] via-[#f7faf7]/60 to-transparent"></div>
      </div>

      <!-- Contenido Hero Informativo y Balanceado -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 w-full flex flex-col justify-center anim-fade-up">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          <!-- Columna Izquierda: Información Central y Jerarquía Tipográfica -->
          <div class="lg:col-span-7 max-w-xl">
            <!-- Badge Institucional DIMAO -->
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide uppercase mb-4 backdrop-blur-sm shadow-xs">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Servicio Municipal · Puerto Varas</span>
            </div>

            <!-- Título Principal: RecicLaGo con máximo peso visual -->
            <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight font-heading leading-tight drop-shadow-md mb-2">
              Recic<span class="text-[#4ade80]">LaGo</span>
            </h1>

            <!-- Subtítulo Claro y Refinado -->
            <p class="text-xs sm:text-sm lg:text-base font-bold text-emerald-100/90 uppercase tracking-wider mb-4 font-sans drop-shadow-sm">
              Retiro Domiciliario Inteligente de Residuos Reciclables
            </p>

            <!-- Descripción Narrativa del Caso -->
            <p class="text-white/90 text-xs sm:text-sm lg:text-base font-normal leading-relaxed drop-shadow mb-8 max-w-lg">
              Sistema de recolección municipal puerta a puerta con pesaje digital in situ, diseñado para proteger la cuenca del Lago Llanquihue y optimizar el reciclaje en los cuadrantes de Puerto Varas.
            </p>

            <!-- 2 Acciones Principales con Jerarquía Clara -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <!-- Botón Primario Verde Destacado -->
              <a
                routerLink="/dashboard"
                class="inline-flex items-center justify-center gap-2.5 bg-[#25853b] hover:bg-[#1e6f31] text-white font-extrabold text-xs sm:text-sm px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl shadow-lg shadow-emerald-950/40 hover:shadow-xl hover:shadow-emerald-900/50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                <i class="fa-solid fa-house-laptop text-emerald-200 text-sm"></i>
                <span>Ingresar al Portal Vecinal</span>
                <i class="fa-solid fa-arrow-right text-xs"></i>
              </a>

              <!-- Botón Secundario Outline Translúcido con Backdrop-Blur -->
              <a
                href="#cuadrantes"
                class="inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl border-2 border-white/80 hover:border-white backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm hover:shadow">
                <i class="fa-solid fa-calendar-days text-emerald-300"></i>
                <span>Ver Cuadrantes de Reciclaje</span>
              </a>
            </div>

            <!-- Chip Ambiental Integrado (Móvil) -->
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-xs font-semibold backdrop-blur-sm mt-6 lg:hidden">
              <i class="fa-solid fa-water text-cyan-300"></i>
              <span class="font-script text-sm font-bold text-white">“Reciclar también es cuidar nuestro lago”</span>
            </div>
          </div>

          <!-- Columna Derecha: Tarjeta de Impacto Comunal y Lema Integrado (Desktop) -->
          <div class="lg:col-span-5 hidden lg:flex flex-col items-end">
            <div class="bg-[#072438]/50 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-7 text-white shadow-2xl max-w-sm w-full transition-all duration-300 hover:border-white/30">
              
              <!-- Encabezado de la Tarjeta con Lema Manuscrito Integrado -->
              <div class="mb-5 pb-4 border-b border-white/15">
                <div class="flex items-center justify-between mb-2">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/30 text-emerald-200 text-[11px] font-bold">
                    <i class="fa-solid fa-leaf text-emerald-300"></i> Compromiso Verde
                  </span>
                  <span class="text-[11px] text-white/60 font-medium">Puerto Varas</span>
                </div>
                <p class="font-script text-white text-2xl font-bold leading-snug" style="text-shadow: 0 2px 8px rgba(0,0,0,0.5);">
                  “Reciclar también es cuidar nuestro lago”
                </p>
              </div>

              <!-- Estadísticas Clave del Programa -->
              <div class="space-y-3 mb-5">
                <div class="bg-white/10 rounded-xl p-3.5 border border-white/10 backdrop-blur-sm">
                  <span class="block text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Reciclaje Certificado</span>
                  <div class="flex items-baseline justify-between mt-0.5">
                    <span class="text-2xl font-black text-white font-heading">248.650 kg</span>
                    <span class="text-[11px] text-white/75 font-medium">Trazabilidad DIMAO</span>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2.5">
                  <div class="bg-white/5 rounded-xl p-3 border border-white/10">
                    <span class="block text-[10px] text-white/70 uppercase">Cobertura</span>
                    <span class="block text-base font-extrabold text-white font-heading">4 Cuadrantes</span>
                  </div>
                  <div class="bg-white/5 rounded-xl p-3 border border-white/10">
                    <span class="block text-[10px] text-white/70 uppercase">Pesaje</span>
                    <span class="block text-base font-extrabold text-emerald-300 font-heading">In Situ Digital</span>
                  </div>
                </div>
              </div>

              <!-- Estado Activo -->
              <div class="flex items-center gap-2 text-xs text-white/85 pt-1">
                <span class="relative flex h-2.5 w-2.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span class="text-[11px] text-white/80 font-medium">Recolección activa según calendario oficial</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
    <!-- END: HeroSection -->
  `
})
export class HomeHeroComponent {}


