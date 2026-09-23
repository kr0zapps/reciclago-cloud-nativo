import { Component, ElementRef, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CycleStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  iconClass: string;
}

@Component({
  selector: 'app-home-cycle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- BEGIN: HowItWorks -->
    <section class="py-14 sm:py-20 bg-[#f7faf7] border-b border-emerald-50/80" id="como-funciona">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <!-- Section Tag -->
        <span class="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-[#206935] font-bold text-xs mb-3 shadow-2xs">
          ¿Cómo funciona?
        </span>

        <!-- Title & Subtitle -->
        <h2 class="text-2xl sm:text-3xl font-extrabold text-[#0a233b] tracking-tight mb-2 font-heading">
          El ciclo de vida del retiro
        </h2>
        <p class="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto mb-12 sm:mb-14">
          Un proceso simple, ordenado y transparente, desde tu solicitud hasta la certificación oficial del pesaje.
        </p>

        <!-- 5-Step Process Timeline connected with arrows -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-6 relative">
          <div *ngFor="let step of steps; let isLast = last" class="flex flex-col items-center text-center relative group">
            
            <!-- Circular Medallion with step badge -->
            <div class="relative mb-4">
              <div class="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#dcf2e3] flex items-center justify-center text-[#206935] text-2xl shadow-xs transition-transform transform group-hover:scale-105">
                <i [class]="step.iconClass"></i>
              </div>
              <span class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-[#206935] text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-xs">
                {{ step.stepNumber }}
              </span>
            </div>

            <!-- Content -->
            <h3 class="font-bold text-[#0a233b] text-base mb-0.5 font-heading">
              {{ step.title }}
            </h3>
            <span class="text-xs font-semibold text-slate-500 mb-1.5">
              {{ step.subtitle }}
            </span>
            <p class="text-[11px] text-slate-600 leading-relaxed max-w-[170px]">
              {{ step.description }}
            </p>

            <!-- Arrow to next step (hidden on mobile, shown on desktop) -->
            <div *ngIf="!isLast" class="hidden lg:block absolute top-9 -right-3.5 transform -translate-y-1/2 text-slate-300 font-bold text-xl select-none pointer-events-none">
              →
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
      title: 'Solicitado',
      subtitle: 'Vecino',
      description: 'El vecino agenda su retiro desde la web o teléfono municipal.',
      iconClass: 'fa-solid fa-user-check'
    },
    {
      stepNumber: 2,
      title: 'Programado',
      subtitle: 'Coordinador DIMAO',
      description: 'Se organiza la ruta y el cuadrante según el calendario comunal.',
      iconClass: 'fa-solid fa-calendar-check'
    },
    {
      stepNumber: 3,
      title: 'En Ruta',
      subtitle: 'Seguimiento GPS',
      description: 'Puedes ver el recorrido del camión en tiempo real desde tu celular.',
      iconClass: 'fa-solid fa-truck-fast'
    },
    {
      stepNumber: 4,
      title: 'Retirado',
      subtitle: 'Puerta a puerta',
      description: 'La cuadrilla municipal retira tus residuos en el frontis de tu hogar.',
      iconClass: 'fa-solid fa-house'
    },
    {
      stepNumber: 5,
      title: 'Pesado y Certificado',
      subtitle: 'Báscula y Ley REP',
      description: 'Se registra el peso exacto y se genera tu comprobante oficial de CO₂.',
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

