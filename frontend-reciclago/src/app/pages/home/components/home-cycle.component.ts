import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CycleStep {
  stepNumber: number;
  title: string;
  role: string;
  description: string;
  svgIconPath: string;
}

@Component({
  selector: 'app-home-cycle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- BEGIN: HowItWorks -->
    <section class="py-12 sm:py-16 bg-[#f7faf7] border-b border-emerald-50" id="como-funciona">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <!-- Section Tag -->
        <span class="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-[#256c38] font-bold text-xs mb-2.5 shadow-2xs">
          ¿Cómo funciona?
        </span>

        <!-- Title & Subtitle -->
        <h2 class="text-2xl sm:text-3xl font-extrabold text-[#0a233b] tracking-tight mb-2 font-heading">
          El ciclo de vida del retiro
        </h2>
        <p class="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed">
          Un proceso simple, ordenado y transparente, desde tu solicitud hasta la certificación del impacto ambiental.
        </p>

        <!-- VERSIÓN MÓVIL: Timeline Vertical Ultra-Compacta (35% menos espacio) -->
        <div class="md:hidden max-w-sm mx-auto text-left relative pl-6 border-l-2 border-emerald-300 space-y-6 my-2">
          <!-- 01 Solicitas -->
          <div class="relative">
            <div class="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#206935] border-2 border-white shadow-xs"></div>
            <div class="flex items-baseline gap-2">
              <span class="text-xs font-black text-emerald-700 font-mono">01</span>
              <h4 class="font-bold text-sm text-[#0a233b]">Solicitas</h4>
              <span class="text-[11px] text-slate-400 font-medium">· Vecino</span>
            </div>
            <p class="text-xs text-slate-600 mt-0.5">Agendas tu retiro desde la web o portal vecinal.</p>
          </div>

          <!-- 02 Se programa -->
          <div class="relative">
            <div class="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#206935] border-2 border-white shadow-xs"></div>
            <div class="flex items-baseline gap-2">
              <span class="text-xs font-black text-emerald-700 font-mono">02</span>
              <h4 class="font-bold text-sm text-[#0a233b]">Se programa</h4>
              <span class="text-[11px] text-slate-400 font-medium">· Coordinador</span>
            </div>
            <p class="text-xs text-slate-600 mt-0.5">Se asigna camión y fecha según el cuadrante comunal.</p>
          </div>

          <!-- 03 Camión en ruta -->
          <div class="relative">
            <div class="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#206935] border-2 border-white shadow-xs"></div>
            <div class="flex items-baseline gap-2">
              <span class="text-xs font-black text-emerald-700 font-mono">03</span>
              <h4 class="font-bold text-sm text-[#0a233b]">Camión en ruta</h4>
              <span class="text-[11px] text-slate-400 font-medium">· GPS</span>
            </div>
            <p class="text-xs text-slate-600 mt-0.5">Seguimiento en tiempo real del camión recolector.</p>
          </div>

          <!-- 04 Retiramos -->
          <div class="relative">
            <div class="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#206935] border-2 border-white shadow-xs"></div>
            <div class="flex items-baseline gap-2">
              <span class="text-xs font-black text-emerald-700 font-mono">04</span>
              <h4 class="font-bold text-sm text-[#0a233b]">Retiramos</h4>
              <span class="text-[11px] text-slate-400 font-medium">· Puerta a puerta</span>
            </div>
            <p class="text-xs text-slate-600 mt-0.5">El camión retira tus residuos en el frontis domiciliario.</p>
          </div>

          <!-- 05 Pesamos y certificamos -->
          <div class="relative">
            <div class="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#206935] border-2 border-white shadow-xs"></div>
            <div class="flex items-baseline gap-2">
              <span class="text-xs font-black text-emerald-700 font-mono">05</span>
              <h4 class="font-bold text-sm text-[#0a233b]">Pesamos y certificamos</h4>
              <span class="text-[11px] text-slate-400 font-medium">· Báscula digital</span>
            </div>
            <p class="text-xs text-slate-600 mt-0.5">Pesaje certificado in situ y emisión de huella de CO₂.</p>
          </div>
        </div>

        <!-- VERSIÓN DESKTOP / TABLET: 5 Pasos Horizontales -->
        <div class="hidden md:grid md:grid-cols-5 gap-4 relative items-start">

          <!-- Paso 1: Solicitado -->
          <div class="flex flex-col items-center text-center relative group">
            <div class="relative mb-3.5">
              <div class="w-16 h-16 rounded-full bg-[#dcf2e3] flex items-center justify-center text-[#206935] shadow-xs transition-transform transform group-hover:scale-105 duration-200">
                <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                </svg>
              </div>
              <span class="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-[#206935] text-white text-[11px] font-bold flex items-center justify-center border border-white shadow-2xs">
                1
              </span>
            </div>
            <h3 class="font-bold text-[#0a233b] text-sm mb-0.5">Solicitado</h3>
            <span class="text-[11px] font-semibold text-slate-500 mb-1.5">Vecino</span>
            <p class="text-[11px] text-slate-600 leading-relaxed max-w-[160px]">
              El vecino agenda su retiro desde la web o en la municipalidad.
            </p>
            <div class="absolute top-8 -right-2 transform -translate-y-1/2 text-slate-300 font-bold text-lg select-none">
              →
            </div>
          </div>

          <!-- Paso 2: Programado -->
          <div class="flex flex-col items-center text-center relative group">
            <div class="relative mb-3.5">
              <div class="w-16 h-16 rounded-full bg-[#dcf2e3] flex items-center justify-center text-[#206935] shadow-xs transition-transform transform group-hover:scale-105 duration-200">
                <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"></path>
                </svg>
              </div>
              <span class="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-[#206935] text-white text-[11px] font-bold flex items-center justify-center border border-white shadow-2xs">
                2
              </span>
            </div>
            <h3 class="font-bold text-[#0a233b] text-sm mb-0.5">Programado</h3>
            <span class="text-[11px] font-semibold text-slate-500 mb-1.5">Coordinador asigna camión</span>
            <p class="text-[11px] text-slate-600 leading-relaxed max-w-[160px]">
              Se organiza la ruta y el cuadrante según el calendario comunal.
            </p>
            <div class="absolute top-8 -right-2 transform -translate-y-1/2 text-slate-300 font-bold text-lg select-none">
              →
            </div>
          </div>

          <!-- Paso 3: En Ruta -->
          <div class="flex flex-col items-center text-center relative group">
            <div class="relative mb-3.5">
              <div class="w-16 h-16 rounded-full bg-[#dcf2e3] flex items-center justify-center text-[#206935] shadow-xs transition-transform transform group-hover:scale-105 duration-200">
                <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 8h-3V4H1v13h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-5-2v2H4V6h11zm-9 12c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-4h-2.5l-2-2.5H15V14h3v-2z"></path>
                </svg>
              </div>
              <span class="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-[#206935] text-white text-[11px] font-bold flex items-center justify-center border border-white shadow-2xs">
                3
              </span>
            </div>
            <h3 class="font-bold text-[#0a233b] text-sm mb-0.5">En Ruta</h3>
            <span class="text-[11px] font-semibold text-slate-500 mb-1.5">Seguimiento GPS</span>
            <p class="text-[11px] text-slate-600 leading-relaxed max-w-[160px]">
              Puedes ver el recorrido del camión en tiempo real desde tu celular.
            </p>
            <div class="absolute top-8 -right-2 transform -translate-y-1/2 text-slate-300 font-bold text-lg select-none">
              →
            </div>
          </div>

          <!-- Paso 4: Retirado -->
          <div class="flex flex-col items-center text-center relative group">
            <div class="relative mb-3.5">
              <div class="w-16 h-16 rounded-full bg-[#dcf2e3] flex items-center justify-center text-[#206935] shadow-xs transition-transform transform group-hover:scale-105 duration-200">
                <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
                </svg>
              </div>
              <span class="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-[#206935] text-white text-[11px] font-bold flex items-center justify-center border border-white shadow-2xs">
                4
              </span>
            </div>
            <h3 class="font-bold text-[#0a233b] text-sm mb-0.5">Retirado</h3>
            <span class="text-[11px] font-semibold text-slate-500 mb-1.5">Puerta a puerta</span>
            <p class="text-[11px] text-slate-600 leading-relaxed max-w-[160px]">
              El camión retira tus residuos en el frontis domiciliario.
            </p>
            <div class="absolute top-8 -right-2 transform -translate-y-1/2 text-slate-300 font-bold text-lg select-none">
              →
            </div>
          </div>

          <!-- Paso 5: Pesado y Certificado -->
          <div class="flex flex-col items-center text-center relative group">
            <div class="relative mb-3.5">
              <div class="w-16 h-16 rounded-full bg-[#dcf2e3] flex items-center justify-center text-[#206935] shadow-xs transition-transform transform group-hover:scale-105 duration-200">
                <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm5 12H7v-1.5c0-1.67 3.33-2.5 5-2.5s5 .83 5 2.5V18z"></path>
                </svg>
              </div>
              <span class="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-[#206935] text-white text-[11px] font-bold flex items-center justify-center border border-white shadow-2xs">
                5
              </span>
            </div>
            <h3 class="font-bold text-[#0a233b] text-sm mb-0.5">Pesado y Certificado</h3>
            <span class="text-[11px] font-semibold text-slate-500 mb-1.5">Báscula digital y CO₂</span>
            <p class="text-[11px] text-slate-600 leading-relaxed max-w-[160px]">
              Se registra el peso exacto y se genera tu certificado ambiental.
            </p>
          </div>

        </div>
      </div>
    </section>
    <!-- END: HowItWorks -->
  `
})
export class HomeCycleComponent {}
