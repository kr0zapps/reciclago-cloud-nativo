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
    <section class="py-16 sm:py-20 bg-[#f7faf7] border-b border-emerald-50" id="como-funciona">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <!-- Section Tag -->
        <span class="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-[#256c38] font-bold text-xs mb-3 shadow-2xs">
          ¿Cómo funciona?
        </span>

        <!-- Title & Subtitle -->
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a233b] tracking-tight mb-2 font-heading">
          El ciclo de vida del retiro
        </h2>
        <p class="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto mb-12 sm:mb-16 leading-relaxed">
          Un proceso simple, ordenado y transparente, desde tu solicitud hasta la certificación del impacto ambiental.
        </p>

        <!-- 5-Step Process Timeline -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 relative items-start">

          <!-- Paso 1: Solicitado -->
          <div class="flex flex-col items-center text-center relative group">
            <div class="relative mb-4">
              <div class="w-20 h-20 rounded-full bg-[#dcf2e3] flex items-center justify-center text-[#206935] shadow-xs transition-transform transform group-hover:scale-105 duration-200">
                <svg class="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                </svg>
              </div>
              <span class="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-[#206935] text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow">
                1
              </span>
            </div>
            <h3 class="font-bold text-[#0a233b] text-base mb-0.5">Solicitado</h3>
            <span class="text-xs font-semibold text-slate-500 mb-2">Vecino</span>
            <p class="text-[11.5px] text-slate-600 leading-relaxed max-w-[190px]">
              El vecino agenda su retiro desde la web o en la municipalidad.
            </p>
            <div class="hidden lg:block absolute top-10 -right-2 transform -translate-y-1/2 text-slate-300 font-bold text-xl select-none">
              →
            </div>
          </div>

          <!-- Paso 2: Programado -->
          <div class="flex flex-col items-center text-center relative group">
            <div class="relative mb-4">
              <div class="w-20 h-20 rounded-full bg-[#dcf2e3] flex items-center justify-center text-[#206935] shadow-xs transition-transform transform group-hover:scale-105 duration-200">
                <svg class="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"></path>
                </svg>
              </div>
              <span class="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-[#206935] text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow">
                2
              </span>
            </div>
            <h3 class="font-bold text-[#0a233b] text-base mb-0.5">Programado</h3>
            <span class="text-xs font-semibold text-slate-500 mb-2">Coordinador asigna camión</span>
            <p class="text-[11.5px] text-slate-600 leading-relaxed max-w-[190px]">
              Se organiza la ruta y el cuadrante según el calendario comunal.
            </p>
            <div class="hidden lg:block absolute top-10 -right-2 transform -translate-y-1/2 text-slate-300 font-bold text-xl select-none">
              →
            </div>
          </div>

          <!-- Paso 3: En Ruta -->
          <div class="flex flex-col items-center text-center relative group">
            <div class="relative mb-4">
              <div class="w-20 h-20 rounded-full bg-[#dcf2e3] flex items-center justify-center text-[#206935] shadow-xs transition-transform transform group-hover:scale-105 duration-200">
                <svg class="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 8h-3V4H1v13h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-5-2v2H4V6h11zm-9 12c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-4h-2.5l-2-2.5H15V14h3v-2z"></path>
                </svg>
              </div>
              <span class="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-[#206935] text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow">
                3
              </span>
            </div>
            <h3 class="font-bold text-[#0a233b] text-base mb-0.5">En Ruta</h3>
            <span class="text-xs font-semibold text-slate-500 mb-2">Seguimiento GPS</span>
            <p class="text-[11.5px] text-slate-600 leading-relaxed max-w-[190px]">
              Puedes ver el recorrido del camión en tiempo real desde tu celular.
            </p>
            <div class="hidden lg:block absolute top-10 -right-2 transform -translate-y-1/2 text-slate-300 font-bold text-xl select-none">
              →
            </div>
          </div>

          <!-- Paso 4: Retirado -->
          <div class="flex flex-col items-center text-center relative group">
            <div class="relative mb-4">
              <div class="w-20 h-20 rounded-full bg-[#dcf2e3] flex items-center justify-center text-[#206935] shadow-xs transition-transform transform group-hover:scale-105 duration-200">
                <svg class="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
                </svg>
              </div>
              <span class="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-[#206935] text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow">
                4
              </span>
            </div>
            <h3 class="font-bold text-[#0a233b] text-base mb-0.5">Retirado</h3>
            <span class="text-xs font-semibold text-slate-500 mb-2">Puerta a puerta</span>
            <p class="text-[11.5px] text-slate-600 leading-relaxed max-w-[190px]">
              El camión retira tus residuos en el frontis de tu domicilio el día programado.
            </p>
            <div class="hidden lg:block absolute top-10 -right-2 transform -translate-y-1/2 text-slate-300 font-bold text-xl select-none">
              →
            </div>
          </div>

          <!-- Paso 5: Pesado y Certificado -->
          <div class="flex flex-col items-center text-center relative group">
            <div class="relative mb-4">
              <div class="w-20 h-20 rounded-full bg-[#dcf2e3] flex items-center justify-center text-[#206935] shadow-xs transition-transform transform group-hover:scale-105 duration-200">
                <svg class="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm5 12H7v-1.5c0-1.67 3.33-2.5 5-2.5s5 .83 5 2.5V18z"></path>
                </svg>
              </div>
              <span class="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-[#206935] text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow">
                5
              </span>
            </div>
            <h3 class="font-bold text-[#0a233b] text-base mb-0.5">Pesado y Certificado</h3>
            <span class="text-xs font-semibold text-slate-500 mb-2">Báscula digital y huella CO₂</span>
            <p class="text-[11.5px] text-slate-600 leading-relaxed max-w-[190px]">
              Se registra el peso exacto y se genera tu certificado de reciclaje y ahorro de CO₂.
            </p>
          </div>

        </div>
      </div>
    </section>
  `
})
export class HomeCycleComponent {}
