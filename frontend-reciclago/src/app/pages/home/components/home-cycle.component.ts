import { Component, ElementRef, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CycleStep {
  stepNumber: number;
  title: string;
  role: string;
  description: string;
  iconClass: string;
}

@Component({
  selector: 'app-home-cycle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- BEGIN: HowItWorks -->
    <section class="py-14 sm:py-20 bg-[#f7faf7] border-b border-emerald-50 relative overflow-hidden" id="como-funciona">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <!-- Section Tag -->
        <span class="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-[#256c38] font-bold text-xs mb-2.5 shadow-2xs">
          ¿Cómo funciona?
        </span>

        <!-- Title & Subtitle -->
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a233b] tracking-tight mb-2.5 font-heading">
          El ciclo de vida del retiro
        </h2>
        <p class="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mb-10 sm:mb-14 leading-relaxed">
          Un proceso simple, ordenado y transparente, desde tu solicitud hasta la certificación del impacto ambiental.
        </p>

        <!-- VERSIÓN MÓVIL: Timeline Vertical con Círculos Grandes e Íconos Representativos (md:hidden) -->
        <div class="md:hidden max-w-md mx-auto text-left relative pl-10 border-l-2 border-emerald-300 space-y-8 my-4">
          <div *ngFor="let step of steps; let i = index"
               class="relative transition-all duration-500"
               [ngClass]="{ 'anim-fade-up': isVisible }"
               [style.animation-delay]="(i * 0.1) + 's'">
            <!-- Círculo Grande con Ícono -->
            <div class="absolute -left-[57px] top-0 w-11 h-11 rounded-2xl bg-white border-2 border-emerald-400 shadow-sm flex items-center justify-center text-[#206935] flex-shrink-0">
              <i [class]="step.iconClass + ' text-base'"></i>
              <span class="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-[#206935] text-white text-[10px] font-black flex items-center justify-center border border-white">
                {{ step.stepNumber }}
              </span>
            </div>

            <!-- Contenido del Paso -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
              <div class="flex items-baseline justify-between gap-2 mb-1">
                <h3 class="font-extrabold text-sm text-[#0a233b] font-heading">{{ step.title }}</h3>
                <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                  {{ step.role }}
                </span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">{{ step.description }}</p>
            </div>
          </div>
        </div>

        <!-- VERSIÓN DESKTOP / TABLET: 5 Pasos Horizontales con Conectores Flotantes -->
        <div class="hidden md:grid md:grid-cols-5 gap-4 relative items-start">
          <div *ngFor="let step of steps; let i = index"
               class="flex flex-col items-center text-center relative group p-3 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-xs"
               [ngClass]="{ 'anim-fade-up': isVisible }"
               [style.animation-delay]="(i * 0.12) + 's'">
            
            <!-- Contenedor Circular Amplio con Ícono Representativo -->
            <div class="relative mb-4">
              <div class="w-18 h-18 rounded-2xl bg-[#dcf2e3] group-hover:bg-[#cceed6] flex items-center justify-center text-[#206935] shadow-xs transition-transform transform group-hover:scale-105 duration-200">
                <i [class]="step.iconClass + ' text-2xl'"></i>
              </div>
              <!-- Badge de Número -->
              <span class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-[#206935] text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-2xs">
                {{ step.stepNumber }}
              </span>
            </div>

            <h3 class="font-extrabold text-[#0a233b] text-base mb-0.5 font-heading">
              {{ step.title }}
            </h3>
            <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-2">
              {{ step.role }}
            </span>
            <p class="text-xs text-slate-600 leading-relaxed max-w-[170px]">
              {{ step.description }}
            </p>

            <!-- Conector de Flecha entre Pasos (oculto en el último) -->
            <div *ngIf="i < steps.length - 1"
                 class="hidden lg:flex absolute top-12 -right-3 transform -translate-y-1/2 text-emerald-300 font-black text-xl select-none pointer-events-none">
              <i class="fa-solid fa-arrow-right text-xs text-emerald-400/80"></i>
            </div>
          </div>
        </div>

      </div>
    </section>
    <!-- END: HowItWorks -->
  `
})
export class HomeCycleComponent implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private observer: IntersectionObserver | null = null;
  isVisible = false;

  steps: CycleStep[] = [
    {
      stepNumber: 1,
      title: 'Solicitas',
      role: 'Vecino',
      description: 'El vecino agenda su retiro desde la web o en el portal vecinal.',
      iconClass: 'fa-solid fa-file-lines'
    },
    {
      stepNumber: 2,
      title: 'Se programa',
      role: 'Coordinador DIMAO',
      description: 'Se organiza la ruta y el cuadrante según el calendario comunal oficial.',
      iconClass: 'fa-solid fa-calendar-check'
    },
    {
      stepNumber: 3,
      title: 'Camión en ruta',
      role: 'Seguimiento GPS',
      description: 'Puedes ver el recorrido del camión en tiempo real desde tu teléfono.',
      iconClass: 'fa-solid fa-truck-fast'
    },
    {
      stepNumber: 4,
      title: 'Retiramos',
      role: 'Puerta a puerta',
      description: 'La cuadrilla retira tus residuos clasificados en el frontis domiciliario.',
      iconClass: 'fa-solid fa-house-chimney'
    },
    {
      stepNumber: 5,
      title: 'Pesamos y certificamos',
      role: 'Báscula y CO₂',
      description: 'Se registra el peso exacto in situ y se computa la huella de carbono mitigada.',
      iconClass: 'fa-solid fa-scale-balanced'
    }
  ];

  ngOnInit(): void {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.isVisible = true;
            this.observer?.disconnect();
          }
        });
      }, { threshold: 0.15 });

      this.observer.observe(this.elementRef.nativeElement);
    } else {
      this.isVisible = true;
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
