import { Component, ElementRef, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CycleStep {
  stepNumber: number;
  title: string;
  summary: string;
  iconClass: string;
}

@Component({
  selector: 'app-home-cycle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- BEGIN: HowItWorks -->
    <section class="py-16 sm:py-20 bg-white border-b border-slate-200 relative overflow-hidden" id="como-funciona">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <!-- Title & Subtitle (Sin badges/pills cliché) -->
        <h2 class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading mb-3">
          El Ciclo de Vida del Retiro
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mb-12 font-sans">
          Proceso trazable regulado bajo la Ley REP, desde tu puerta hasta la báscula y certificación digital.
        </p>

        <!-- 5-Step Process Modern Clean Cards -->
        <div class="relative">
          
          <!-- Línea de Conexión de Fondo Animada (Desktop) -->
          <div class="hidden lg:block absolute top-12 left-12 right-12 h-0.5 bg-slate-200 -z-0">
            <div 
              class="h-full bg-slate-900 transition-all duration-500 ease-out"
              [style.width]="((hoveredStep || 1) / 5 * 100) + '%'">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 text-left relative z-10">
            <div 
              *ngFor="let step of steps; let isLast = last" 
              (mouseenter)="hoveredStep = step.stepNumber"
              (mouseleave)="hoveredStep = 0"
              class="group bg-slate-50/80 rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:bg-white hover:shadow-lg hover:-translate-y-2 hover:border-slate-400 transition-all duration-300 flex flex-col justify-between cursor-pointer">
              
              <div>
                <!-- Top Row: Number + Icon Medallion -->
                <div class="flex items-center justify-between mb-5">
                  <span class="font-heading font-black text-2xl sm:text-3xl text-slate-400 group-hover:text-slate-900 transition-colors duration-200">
                    0{{ step.stepNumber }}
                  </span>
                  <div class="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 text-sm shadow-2xs group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 group-hover:scale-110 transition-all duration-300">
                    <i [class]="step.iconClass"></i>
                  </div>
                </div>

                <!-- Step Title (Limpio, sin spans innecesarios) -->
                <h3 class="font-heading font-extrabold text-base text-slate-900 mb-2 leading-snug">
                  {{ step.title }}
                </h3>

                <!-- Summary (Texto corto y directo, cero relleno) -->
                <p class="text-xs text-slate-500 leading-relaxed font-sans">
                  {{ step.summary }}
                </p>
              </div>

              <!-- Bottom Indicator -->
              <div class="mt-6 pt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span class="group-hover:text-slate-700 transition-colors">Paso {{ step.stepNumber }}/5</span>
                <i *ngIf="!isLast" class="fa-solid fa-arrow-right text-xs text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1.5 transition-all duration-200"></i>
                <i *ngIf="isLast" class="fa-solid fa-circle-check text-slate-900 text-xs"></i>
              </div>

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
  hoveredStep = 0;

  steps: CycleStep[] = [
    {
      stepNumber: 1,
      title: 'Solicitado',
      summary: 'Registro de dirección y tipo de residuo.',
      iconClass: 'fa-solid fa-user-check'
    },
    {
      stepNumber: 2,
      title: 'Programado',
      summary: 'Asignación de turno según tu cuadrante.',
      iconClass: 'fa-solid fa-calendar-check'
    },
    {
      stepNumber: 3,
      title: 'En Ruta',
      summary: 'Seguimiento telemático del camión en mapa.',
      iconClass: 'fa-solid fa-truck-fast'
    },
    {
      stepNumber: 4,
      title: 'Retirado',
      summary: 'Carga selectiva en el frontis de tu hogar.',
      iconClass: 'fa-solid fa-house'
    },
    {
      stepNumber: 5,
      title: 'Certificado',
      summary: 'Pesaje oficial en báscula y balance CO₂.',
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
