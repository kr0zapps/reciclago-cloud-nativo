import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- BEGIN: HeroSection -->
    <section class="relative min-h-[100svh] lg:min-h-screen flex flex-col justify-between bg-[#041624] text-white overflow-hidden" id="inicio">
      
      <!-- 1. Escenario Fotográfico: Volcán Osorno y Lago Llanquihue con Parallax Sutil y sangrado inferior de seguridad -->
      <div class="absolute inset-0 -bottom-2 z-0 pointer-events-none overflow-hidden">
        <img
          alt="Lago Llanquihue y Volcán Osorno - Puerto Varas"
          class="w-full h-full object-cover object-[62%_34%] sm:object-[66%_35%] lg:object-[center_38%] scale-105 select-none pointer-events-none transition-transform duration-100 ease-out will-change-transform"
          [ngStyle]="{ transform: 'translate3d(0, ' + parallaxOffset + 'px, 0)' }"
          src="assets/ultrawide.jpg"
        />

        <!-- Viñeta Superior para Contraste Impecable del Header Transparente -->
        <div class="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#041624]/85 via-[#041624]/40 to-transparent"></div>

        <!-- Overlay Direccional Desktop: Azul institucional con apertura hacia el paisaje -->
        <div class="hidden lg:block absolute inset-0 hero-overlay-desktop"></div>
        <div class="hidden lg:block absolute inset-0 hero-overlay-spotlight"></div>

        <!-- Overlay Direccional Móvil / Tablet: Contraste vertical robusto con legibilidad AAA garantizada -->
        <div class="lg:hidden absolute inset-0 hero-overlay-mobile"></div>

        <!-- Sombra de anclaje inferior hacia el fondo de la página -->
        <div class="absolute -bottom-2 inset-x-0 h-28 sm:h-36 bg-gradient-to-t from-[#041624] via-[#041624]/80 to-transparent"></div>
      </div>

      <!-- 2. Espaciador Superior para Compensar el Navbar Sticky (80px) -->
      <div class="h-20 flex-shrink-0 pointer-events-none"></div>

      <!-- 3. Contenido Editorial Principal y Acento Cursivo Comunal -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 w-full my-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          <!-- Columna Izquierda: Título de Autoridad Municipal, Bajada y CTAs -->
          <div class="lg:col-span-7 xl:col-span-8 max-w-2xl xl:max-w-3xl">

            <!-- Título Principal de Autoridad Municipal con Stagger 1 y Sombra Nítida -->
            <h1 class="anim-fade-up text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[58px] font-extrabold text-white tracking-tight uppercase leading-[1.08] mb-5 font-heading break-words hero-text-shadow">
              JUNTOS CUIDAMOS<br />
              PUERTO VARAS
            </h1>

            <!-- Bajada / Subtítulo Oficial con Stagger 2, Peso Mediano y Contraste Impecable -->
            <p class="anim-fade-up anim-delay-1 text-[15px] sm:text-base lg:text-[17px] text-white/95 sm:text-slate-100 font-medium leading-relaxed max-w-xl mb-8 break-words hero-subtext-shadow">
              Reciclar hoy, es construir el futuro sustentable que queremos para nuestra comuna y la cuenca del Lago Llanquihue.
            </p>

            <!-- Botones de Acción Sobrios con Stagger 3 y Micro-interacciones -->
            <div class="anim-fade-up anim-delay-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <!-- Botón Primario: Verde Institucional RecicLaGo con Elevación y Presión -->
              <a
                routerLink="/dashboard"
                class="group btn-interactive w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-12 px-6 sm:px-7 rounded-xl bg-[#22a652] hover:bg-[#1b8e45] text-white font-bold text-xs sm:text-[13px] uppercase tracking-wider cursor-pointer text-center shadow-md hover:shadow-lg hover:shadow-emerald-950/40">
                <i class="fa-solid fa-recycle text-sm group-hover:rotate-45 transition-transform duration-300 ease-out"></i>
                <span>Ingresar al Portal Vecinal</span>
              </a>

              <!-- Botón Secundario Discreto (Outline con fondo glass en mobile para legibilidad garantizada) -->
              <a
                href="#cuadrantes"
                (click)="scrollToSection($event, 'cuadrantes')"
                class="group btn-interactive w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-12 px-6 sm:px-7 rounded-xl bg-[#041624]/60 sm:bg-white/10 hover:bg-white/15 active:bg-white/25 text-white font-bold text-xs sm:text-[13px] uppercase tracking-wider border border-white/40 hover:border-white/80 cursor-pointer text-center backdrop-blur-sm sm:backdrop-blur-none shadow-sm">
                <i class="fa-solid fa-location-dot text-sm text-emerald-400 group-hover:-translate-y-0.5 transition-transform duration-300 ease-out"></i>
                <span>Ver Cuadrantes de Reciclaje</span>
              </a>
            </div>

            <!-- Agendamiento Telefónico (Línea sobria integrada, sin tarjeta ni estética de IA) -->
            <p class="anim-fade-up anim-delay-3 mt-4 text-xs sm:text-[13px] text-slate-300 font-medium flex items-center gap-2 flex-wrap">
              <i class="fa-solid fa-phone text-emerald-400 text-xs"></i>
              <span>¿Prefieres agendar por teléfono?</span>
              <a href="tel:+56652361200" class="text-white font-bold hover:text-emerald-300 underline underline-offset-2 transition-colors">
                Llama al 65 236 1200
              </a>
            </p>
          </div>

          <!-- Columna Derecha: Lema en Cursiva Cálido / Humano que Rellena y Da Equilibrio en Desktop -->
          <div class="lg:col-span-5 xl:col-span-4 hidden lg:flex justify-end items-center pointer-events-none pr-2 xl:pr-6 anim-fade-up anim-delay-2">
            <div class="text-right rotate-[-4deg] select-none anim-float-subtle">
              <p class="font-script text-white text-4xl xl:text-[48px] font-bold leading-[1.25] tracking-wide drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)]">
                Reciclar también es<br />
                cuidar nuestro<br />
                <span class="text-[#4ade80]">lago</span>
              </p>
              <div class="mt-3.5 flex items-center justify-end gap-2 text-emerald-300 drop-shadow-md">
                <i class="fa-solid fa-water text-xs"></i>
                <span class="font-script text-slate-200 text-xl font-bold tracking-wide">Cuenca Llanquihue</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- 4. Indicador Inferior Discreto hacia el Ciclo Comunal con Flotación Suave -->
      <div class="relative z-10 pb-5 sm:pb-6 flex justify-center pointer-events-auto anim-fade-up anim-delay-3">
        <a
          href="#como-funciona"
          (click)="scrollToSection($event, 'como-funciona')"
          class="hidden sm:inline-flex flex-col items-center gap-1.5 text-white/60 hover:text-white transition-colors duration-300 group cursor-pointer"
          aria-label="Ir a la sección ¿Cómo funciona?">
          <span class="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase opacity-75 group-hover:opacity-100 transition-opacity">
            Conoce el ciclo
          </span>
          <div class="anim-float-subtle">
            <i class="fa-solid fa-chevron-down text-[10px] text-white/70 group-hover:text-white transition-colors"></i>
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
