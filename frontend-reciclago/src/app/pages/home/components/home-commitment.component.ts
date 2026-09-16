import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-commitment',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 anim-fade-up anim-delay-4">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

        <!-- Foto Panorámica Costanera con Lema Manuscrito Completo -->
        <div class="lg:col-span-7 rounded-2xl overflow-hidden shadow-xs border border-slate-100 group relative">
          <img
            src="assets/promenade_varas.png"
            alt="Costanera Puerto Varas - Pequeñas acciones, grandes cambios"
            class="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-500 rounded-2xl"
          />
        </div>

        <!-- Compromiso Comunal Municipal -->
        <div class="lg:col-span-5 space-y-3.5 pl-0 lg:pl-4 text-center sm:text-left">
          <h2 class="text-xl sm:text-2xl font-extrabold text-[#093554] leading-snug font-heading">
            En Puerto Varas, el reciclaje lo hacemos entre todos.
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Gracias por ser parte de una comuna más limpia, verde y consciente.
          </p>

          <!-- Logo Puerto Varas Naturaleza · Comunidad · Futuro -->
          <div class="pt-3 flex items-center justify-center sm:justify-start gap-3">
            <div class="w-14 h-9 flex-shrink-0 flex items-center justify-center">
              <svg class="w-full h-full" fill="none" viewBox="0 0 70 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 28C18 20 32 20 45 28C54 33 63 31 68 28" stroke="#093554" stroke-linecap="round" stroke-width="3"></path>
                <path d="M12 34C24 27 38 27 50 34C58 38 64 36 68 34" stroke="#0ea5e9" stroke-linecap="round" stroke-width="2"></path>
                <path d="M48 8C52 14 62 16 66 12C68 18 64 24 56 22C50 20 46 12 48 8Z" fill="#437d32"></path>
              </svg>
            </div>
            <div class="flex flex-col text-left">
              <span class="text-base font-black text-[#093554] tracking-tight uppercase">Puerto Varas</span>
              <span class="text-[10px] text-slate-500 font-bold tracking-wider">Naturaleza · Comunidad · Futuro</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  `
})
export class HomeCommitmentComponent {}
