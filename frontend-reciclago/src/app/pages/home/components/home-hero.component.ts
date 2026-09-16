import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- BEGIN: HeroSection -->
    <section class="relative overflow-hidden bg-slate-50 border-b border-slate-100 min-h-[580px] lg:min-h-[640px] flex items-center" id="inicio">
      <!-- Background Scenic Composition with Osorno Volcano, Truck & Bins -->
      <div class="absolute inset-0 z-0">
        <img
          alt="Volcán Osorno y camión de reciclaje en Puerto Varas"
          class="w-full h-full object-cover object-right lg:object-center filter brightness-[0.98]"
          src="assets/stitch/hero_composition.png"
        />
        <!-- Gradient overlay to keep text clearly legible on the left -->
        <div class="absolute inset-0 hero-mask-gradient"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full">
        <div class="max-w-2xl anim-fade-up">
          <!-- Category Badge / Pill -->
          <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#dcf2e3] border border-emerald-300 text-[#1f6f39] text-xs font-bold mb-4 shadow-xs">
            <svg class="w-3.5 h-3.5 fill-current text-[#256c38]" viewBox="0 0 24 24">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"></path>
            </svg>
            <span class="tracking-wide">Servicio Municipal de Reciclaje</span>
          </div>

          <!-- Main Heading -->
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#071f30] mb-2 flex items-center gap-3">
            <span>Recic<span class="text-[#256c38]">LaGo</span></span>
            <span class="text-3xl sm:text-4xl lg:text-5xl text-[#256c38] transform rotate-12 inline-block">🍃</span>
          </h1>

          <h2 class="text-xl sm:text-2xl lg:text-[1.7rem] font-extrabold text-[#0d2a45] leading-snug mb-5 font-heading">
            Retiro Domiciliario Inteligente<br class="hidden sm:inline"> de Residuos Reciclables
          </h2>

          <!-- Description text -->
          <p class="text-sm sm:text-base text-slate-700 font-medium leading-relaxed mb-7 max-w-xl">
            Desde los antiguos formularios manuales, hoy avanzamos hacia un sistema de recolección puerta a puerta con pesaje digital in situ, para proteger la cuenca del Lago Llanquihue y un futuro más sostenible para Puerto Varas.
          </p>

          <!-- Value Proposition Chips -->
          <div class="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-8">
            <div class="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-full px-3.5 py-1.5 shadow-xs text-xs font-bold text-slate-800">
              <svg class="w-3.5 h-3.5 text-[#256c38] fill-current" viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"></path>
              </svg>
              <span>Más eficiencia en la recolección</span>
            </div>

            <div class="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-full px-3.5 py-1.5 shadow-xs text-xs font-bold text-slate-800">
              <span class="text-[#256c38] text-xs font-bold bg-[#dcf2e3] rounded-sm w-4 h-4 flex items-center justify-center">+</span>
              <span>Datos reales y trazabilidad</span>
            </div>

            <div class="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-full px-3.5 py-1.5 shadow-xs text-xs font-bold text-slate-800">
              <svg class="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
              </svg>
              <span>Cuidamos el Lago Llanquihue</span>
            </div>
          </div>

          <!-- Botones de Acción Funcionales -->
          <div class="flex flex-wrap items-center gap-3.5">
            <a
              routerLink="/dashboard"
              class="inline-flex items-center gap-2.5 bg-[#256c38] hover:bg-[#1f5a2e] text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer">
              <i class="fa-solid fa-house-laptop text-sm"></i>
              <span>Ingresar al Portal Vecinal</span>
              <i class="fa-solid fa-arrow-right text-xs"></i>
            </a>

            <a
              href="#cuadrantes"
              class="inline-flex items-center gap-2 bg-white/95 hover:bg-white text-[#093554] border border-slate-300 text-xs sm:text-sm font-bold px-5 py-3.5 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer">
              <i class="fa-regular fa-calendar-days text-[#256c38]"></i>
              <span>Ver Cuadrantes de Reciclaje</span>
            </a>

            <a
              href="#como-funciona"
              class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#256c38] px-2 py-2 transition-colors cursor-pointer">
              <span>¿Cómo funciona?</span>
              <i class="fa-solid fa-chevron-down text-[10px]"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-mask-gradient {
      background: linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 45%, rgba(255,255,255,0.25) 75%, rgba(255,255,255,0) 100%);
    }
    @media (max-width: 1024px) {
      .hero-mask-gradient {
        background: linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.90) 65%, rgba(255,255,255,0.4) 100%);
      }
    }
  `]
})
export class HomeHeroComponent {}

