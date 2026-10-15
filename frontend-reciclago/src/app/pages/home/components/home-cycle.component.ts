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
    <section class="scroll-mt-24 py-10 sm:py-16 bg-white border-b border-slate-200 relative overflow-hidden" id="como-funciona">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Title & Subtitle Header -->
        <div class="text-center mb-6 sm:mb-10">
          <h2 class="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading mb-1">
            ¿Cómo Funciona el Retiro Domiciliario?
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto font-sans">
            El ciclo de reciclaje oficial de Puerto Varas en 5 etapas trazables, desde tu puerta hasta la valorización final.
          </p>
        </div>

        <!-- Mobile View (lg:hidden): Stepper Vertical Conectado en 1 Sola Pantalla (CERO DESLIZAR) -->
        <div class="lg:hidden max-w-sm mx-auto space-y-2 relative text-left">
          <div *ngFor="let step of steps; let isLast = last" class="flex items-center gap-2.5 relative">
            <!-- Línea vertical conectora -->
            <div *ngIf="!isLast" class="absolute left-3.5 top-6 bottom-[-8px] w-0.5 bg-slate-200 -z-0"></div>

            <!-- Número del Paso -->
            <div class="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[11px] font-semibold shrink-0 z-10 shadow-2xs">
              0{{ step.stepNumber }}
            </div>

            <!-- Fila Compacta del Paso -->
            <div class="flex-1 bg-slate-50/90 border border-slate-200/90 rounded-xl px-3 py-1.5 flex items-center justify-between shadow-2xs">
              <div class="min-w-0 pr-2">
                <h3 class="font-heading font-bold text-xs text-slate-900 leading-tight truncate">
                  {{ step.title }}
                </h3>
                <p class="text-[11px] text-slate-500 leading-tight truncate">
                  {{ step.summary }}
                </p>
              </div>
              <div class="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 text-[10px] shrink-0">
                <i [class]="step.iconClass"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop View (hidden lg:block): Grilla Horizontal de 5 Pasos con Línea Conectora -->
        <div class="hidden lg:block relative">
          
          <!-- Línea de Conexión de Fondo Animada (Desktop) -->
          <div class="absolute top-9 left-10 right-10 h-0.5 bg-slate-200 -z-0">
            <div 
              class="h-full bg-slate-900 transition-all duration-500 ease-out"
              [style.width]="((hoveredStep || 1) / 5 * 100) + '%'">
            </div>
          </div>

          <div class="grid grid-cols-5 gap-3.5 text-left relative z-10">
            <div 
              *ngFor="let step of steps; let isLast = last" 
              (mouseenter)="hoveredStep = step.stepNumber"
              (mouseleave)="hoveredStep = 0"
              class="group bg-slate-50/90 rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:bg-white hover:shadow-md hover:-translate-y-1 hover:border-slate-400 transition-all duration-300 flex flex-col justify-between cursor-pointer">
              
              <!-- Top Row: Number + Icon Medallion -->
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-semibold text-slate-400 group-hover:text-emerald-700 transition-colors">
                  0{{ step.stepNumber }}
                </span>
                <div class="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 text-xs shadow-2xs group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-200">
                  <i [class]="step.iconClass"></i>
                </div>
              </div>

              <!-- Step Title & Summary -->
              <div>
                <h3 class="font-heading font-extrabold text-sm sm:text-base text-slate-900 mb-0.5 leading-snug">
                  {{ step.title }}
                </h3>
                <p class="text-xs text-slate-500 leading-snug font-sans">
                  {{ step.summary }}
                </p>
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
  private readonly elementRef = inject(ElementRef);
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
