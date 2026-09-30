import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- BEGIN: HeroSection Puerto Varas Recicla -->
    <section class="relative min-h-[100svh] lg:min-h-screen flex flex-col justify-between bg-[#041624] text-white overflow-hidden" id="inicio">
      
      <!-- 1. Escenario Fotográfico: Volcán Osorno y Lago Llanquihue al atardecer -->
      <div class="absolute inset-0 -bottom-2 z-0 pointer-events-none overflow-hidden">
        <img
          alt="Lago Llanquihue y Volcán Osorno al atardecer - Puerto Varas"
          class="w-full h-full object-cover object-[center_35%] sm:object-[center_38%] lg:object-[center_42%] scale-105 select-none pointer-events-none transition-transform duration-100 ease-out will-change-transform"
          [ngStyle]="{ transform: 'translate3d(0, ' + parallaxOffset + 'px, 0)' }"
          src="assets/ultrawide.jpg"
        />

        <!-- Viñeta Superior para Contraste Impecable del Header Transparente -->
        <div class="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#041624]/90 via-[#041624]/50 to-transparent"></div>

        <!-- Overlays Fotográficos Limpios (Cero neón, contraste natural y uniforme) -->
        <div class="hidden lg:block absolute inset-0 hero-overlay-desktop"></div>
        <div class="lg:hidden absolute inset-0 hero-overlay-mobile"></div>

        <!-- Sombra de anclaje inferior hacia el fondo de la página -->
        <div class="absolute -bottom-2 inset-x-0 h-28 sm:h-36 bg-gradient-to-t from-[#041624] via-[#041624]/80 to-transparent"></div>
      </div>

      <!-- 2. Espaciador Superior para Compensar el Header Sticky -->
      <div class="h-16 sm:h-20 lg:h-24 flex-shrink-0 pointer-events-none"></div>

      <!-- 3. Contenido Editorial Principal: Monumental, Centrado e Imponente -->
      <div class="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:py-12 w-full my-auto text-center flex flex-col items-center justify-center">

        <!-- Titular Monumental -->
        <h1 class="hero-title text-white leading-tight mt-6 sm:mt-10">
          <span class="block">Reciclaje Comunal</span>
          <span class="block">Puerto Varas</span>
        </h1>

        <!-- Subtítulo Corto -->
        <p class="text-sm sm:text-lg md:text-xl text-white/90 font-medium max-w-xl mx-auto mt-4 sm:mt-5 mb-8 sm:mb-10 drop-shadow-sm leading-relaxed">
          Retiro domiciliario a pedido y pesaje digital para proteger nuestro lago.
        </p>

        <!-- Botones de Acción Agrupados Elegantes -->
        <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full px-2">
          <a
            routerLink="/dashboard"
            class="inline-flex items-center justify-center gap-2.5 min-h-[44px] sm:min-h-[50px] px-6 sm:px-8 rounded-xl bg-[#22a652] hover:bg-[#1b8e45] text-white font-extrabold text-sm tracking-wide shadow-xl shadow-emerald-950/50 border-none transition-all active:scale-[0.98] cursor-pointer">
            <span>Pedir Retiro (Portal Vecinal)</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>

          <a
            href="#cuadrantes"
            (click)="scrollToSection($event, 'cuadrantes')"
            class="inline-flex items-center justify-center gap-2.5 min-h-[44px] sm:min-h-[50px] px-5 sm:px-7 rounded-xl bg-[#092232]/80 hover:bg-[#123F5B] text-white font-semibold text-sm border border-white/20 backdrop-blur-md shadow-lg transition-all active:scale-[0.98] cursor-pointer">
            <i class="fa-solid fa-map-location-dot text-[#22a652]"></i>
            <span>Ver Estado de Sectores</span>
          </a>
        </div>

        <!-- Fila de materiales aceptados (Muy visible para adultos mayores) -->
        <div class="mt-12 sm:mt-16 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 w-full max-w-2xl mx-auto">
          <p class="text-white font-bold text-sm sm:text-base mb-3 drop-shadow-sm">¿Qué puedes reciclar con nosotros?</p>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div class="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <i class="fa-solid fa-wine-bottle text-[#22a652] text-xl sm:text-2xl drop-shadow-md"></i>
              <span class="text-white text-xs font-semibold">Vidrio</span>
            </div>
            <div class="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <i class="fa-solid fa-box-open text-[#22a652] text-xl sm:text-2xl drop-shadow-md"></i>
              <span class="text-white text-xs font-semibold">Cartón / Papel</span>
            </div>
            <div class="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <i class="fa-solid fa-bottle-water text-[#22a652] text-xl sm:text-2xl drop-shadow-md"></i>
              <span class="text-white text-xs font-semibold">Plástico (PET)</span>
            </div>
            <div class="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <i class="fa-solid fa-boxes-stacked text-[#22a652] text-xl sm:text-2xl drop-shadow-md"></i>
              <span class="text-white text-xs font-semibold">Latas</span>
            </div>
          </div>
        </div>

      </div>

      <!-- 4. Scroll Indicator Abajo al Centro -->
      <div class="relative z-10 pb-5 sm:pb-7 flex justify-center pointer-events-auto anim-fade-up">
        <a
          href="#como-funciona"
          (click)="scrollToSection($event, 'como-funciona')"
          class="inline-flex flex-col items-center gap-1.5 text-white/70 hover:text-white transition-colors duration-300 group cursor-pointer font-heading"
          aria-label="Conoce el ciclo de reciclaje municipal">
          <p class="text-[11px] font-bold tracking-[0.2em] uppercase opacity-80 group-hover:opacity-100 transition-opacity m-0">
            Conoce el ciclo
          </p>
          <div class="anim-float-subtle">
            <i class="fa-solid fa-chevron-down text-xs text-white/80 group-hover:text-white transition-colors"></i>
          </div>
        </a>
      </div>

    </section>
    <!-- END: HeroSection -->
  `
})
export class HomeHeroComponent {
  parallaxOffset = 0;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      const scroll = window.scrollY;
      if (scroll <= 850) {
        this.parallaxOffset = Math.round(scroll * 0.15);
      }
    }
  }

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    if (typeof document !== 'undefined') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
