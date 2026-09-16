import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- BEGIN: HeroSection -->
    <section class="relative min-h-[620px] lg:min-h-[700px] flex flex-col justify-between bg-[#041624] text-white overflow-hidden" id="inicio">
      
      <!-- 1. Fondo Panorámico Fotográfico Ultrawide con Volcán Osorno y Lago Llanquihue -->
      <div class="absolute inset-0 z-0 pointer-events-none">
        <img
          alt="Lago Llanquihue y Volcán Osorno - Puerto Varas"
          class="w-full h-full object-cover object-[center_35%] lg:object-[center_38%]"
          src="assets/ultrawide.jpg"
        />

        <!-- Overlay Direccional Sutil (Oscuro sólido en el cuadrante superior/izquierdo para contraste tipográfico, transparente en el volcán) -->
        <div class="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#041624]/95 via-[#041624]/75 via-45% to-transparent to-75%"></div>

        <!-- Overlay Direccional en Móvil / Tablet -->
        <div class="lg:hidden absolute inset-0 bg-gradient-to-b from-[#041624]/95 via-[#041624]/75 to-[#041624]/50"></div>

        <!-- Sombra inferior suave hacia el pie del hero -->
        <div class="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#041624] via-[#041624]/60 to-transparent"></div>
      </div>

      <!-- 2. Contenido Editorial Superior e Intermedio -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 lg:pt-24 pb-6 sm:pb-8 w-full">
        <div class="max-w-2xl">

          <!-- Eyebrow: PORTAL AMBIENTAL CIUDADANO · RECICLAGOO -->
          <div class="text-xs sm:text-sm font-bold text-[#22c55e] tracking-widest uppercase mb-3 drop-shadow-sm">
            PORTAL AMBIENTAL CIUDADANO · RECICLAGOO
          </div>

          <!-- Título Principal con Tipografía de Impacto Condensada: JUNTOS CUIDAMOS PUERTO VARAS -->
          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[0.95] mb-4 font-heading drop-shadow-md">
            JUNTOS CUIDAMOS<br />
            PUERTO VARAS
          </h1>

          <!-- Bajada / Subtítulo Oficial -->
          <p class="text-sm sm:text-base lg:text-lg text-slate-100 font-normal leading-relaxed max-w-xl mb-7 drop-shadow-sm">
            Reciclar hoy, es construir el futuro sustentable que queremos para nuestra comuna y la cuenca del Lago Llanquihue.
          </p>

          <!-- Botones de Acción (Fieles a la referencia) -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <!-- Botón Primario Verde Sólido -->
            <a
              routerLink="/dashboard"
              class="inline-flex items-center justify-center gap-2.5 bg-[#22a652] hover:bg-[#1b8e45] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-lg transition-all cursor-pointer text-center shadow-md">
              <i class="fa-solid fa-recycle text-sm"></i>
              <span>Ingresar al Portal Vecinal</span>
            </a>

            <!-- Botón Secundario Outline con Fondo Translúcido -->
            <a
              href="#cuadrantes"
              class="inline-flex items-center justify-center gap-2 border border-white/80 hover:border-white bg-[#041624]/40 hover:bg-[#041624]/70 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-lg backdrop-blur-xs transition-all cursor-pointer text-center">
              <i class="fa-solid fa-location-dot text-sm text-emerald-400"></i>
              <span>Ver Cuadrantes de Reciclaje</span>
            </a>
          </div>

        </div>
      </div>

      <!-- 3. Tarjeta Flotante de Estadísticas al Pie del Hero (Fiel a la referencia) -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 w-full">
        <div class="bg-[#051726]/80 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-6 shadow-2xl">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">

            <!-- Métrica 1: Kilos Certificados -->
            <div class="flex items-center gap-4 pt-3 md:pt-0 md:pr-4">
              <div class="w-12 h-12 rounded-full bg-[#1b5e20]/80 border border-[#2e7d32]/60 flex items-center justify-center text-[#4caf50] shrink-0 shadow-inner">
                <i class="fa-solid fa-seedling text-lg"></i>
              </div>
              <div>
                <span class="block text-[11px] font-bold uppercase tracking-wider text-slate-300">KILOS CERTIFICADOS</span>
                <div class="flex items-baseline gap-1 mt-0.5">
                  <span class="text-2xl sm:text-3xl font-black text-emerald-400 font-heading leading-tight">248.650</span>
                  <span class="text-xs font-bold text-emerald-300">kg</span>
                </div>
                <span class="block text-[11px] text-slate-400">Material reciclado este mes <i class="fa-solid fa-circle-info text-[9px] ml-0.5 text-slate-400"></i></span>
              </div>
            </div>

            <!-- Métrica 2: Vecinos y Organizaciones -->
            <div class="flex items-center gap-4 pt-3 md:pt-0 md:px-4">
              <div class="w-12 h-12 rounded-full bg-[#0d47a1]/70 border border-[#1976d2]/60 flex items-center justify-center text-[#42a5f5] shrink-0 shadow-inner">
                <i class="fa-solid fa-users text-lg"></i>
              </div>
              <div>
                <span class="block text-[11px] font-bold uppercase tracking-wider text-slate-300">VECINOS Y ORGANIZACIONES</span>
                <div class="flex items-baseline gap-1 mt-0.5">
                  <span class="text-2xl sm:text-3xl font-black text-[#42a5f5] font-heading leading-tight">1.248</span>
                </div>
                <span class="block text-[11px] text-slate-400">Activos en el portal <i class="fa-solid fa-circle-info text-[9px] ml-0.5 text-slate-400"></i></span>
              </div>
            </div>

            <!-- Métrica 3: Cuadrantes Activos -->
            <div class="flex items-center gap-4 pt-3 md:pt-0 md:pl-4">
              <div class="w-12 h-12 rounded-full bg-[#e65100]/60 border border-[#f57c00]/60 flex items-center justify-center text-[#ffb74d] shrink-0 shadow-inner">
                <i class="fa-solid fa-map-location-dot text-lg"></i>
              </div>
              <div>
                <span class="block text-[11px] font-bold uppercase tracking-wider text-slate-300">CUADRANTES ACTIVOS</span>
                <div class="flex items-baseline gap-1 mt-0.5">
                  <span class="text-2xl sm:text-3xl font-black text-[#ffb74d] font-heading leading-tight">4</span>
                  <span class="text-sm font-extrabold text-slate-400">/ 4</span>
                </div>
                <span class="block text-[11px] text-slate-400">Cobertura comunal DIMAO <i class="fa-solid fa-circle-info text-[9px] ml-0.5 text-slate-400"></i></span>
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


