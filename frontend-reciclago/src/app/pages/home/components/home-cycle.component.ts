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
    <section class="py-16 sm:py-20 bg-white border-b border-slate-200" id="como-funciona">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <!-- Section Tag Modern -->
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/70 mb-3 shadow-2xs">
          <i class="fa-solid fa-arrows-spin text-[10px]"></i> Trazabilidad Paso a Paso
        </span>

        <!-- Title & Subtitle -->
        <h2 class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading mb-2">
          El Ciclo de Vida del Retiro
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mb-10 sm:mb-12 font-sans">
          Un proceso simple, ordenado y transparente regulado bajo la Ley REP, desde tu puerta hasta la báscula y certificación digital.
        </p>

        <!-- 5-Step Process Modern Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 text-left">
          <div *ngFor="let step of steps; let isLast = last" 
               class="group bg-slate-50/70 rounded-2xl p-6 border border-slate-200 shadow-2xs hover:bg-white hover:shadow-md hover:-translate-y-1.5 hover:border-emerald-300/80 transition-all duration-300 flex flex-col justify-between cursor-default">
            
            <div>
              <!-- Top Row: Number + Icon Medallion -->
              <div class="flex items-center justify-between mb-4">
                <span class="font-heading font-black text-2xl sm:text-3xl text-slate-900 group-hover:text-emerald-700 transition-colors">
                  0{{ step.stepNumber }}
                </span>
                <div class="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 text-sm shadow-2xs group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 group-hover:scale-110 transition-all duration-300">
                  <i [class]="step.iconClass"></i>
                </div>
              </div>

              <!-- Step Title & Actor -->
              <h3 class="font-heading font-bold text-base text-slate-900 mb-0.5 leading-snug">
                {{ step.title }}
              </h3>
              <span class="text-xs font-semibold text-emerald-600 mb-2 block">
                {{ step.subtitle }}
              </span>

              <!-- Description -->
              <p class="text-xs text-slate-500 leading-relaxed font-sans">
                {{ step.description }}
              </p>
            </div>

            <!-- Bottom Progress Line Indicating Sequence -->
            <div class="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Etapa {{ step.stepNumber }}/5</span>
              <i *ngIf="!isLast" class="fa-solid fa-arrow-right text-slate-400 text-xs group-hover:text-emerald-600 group-hover:translate-x-1 transition-all"></i>
              <i *ngIf="isLast" class="fa-solid fa-check-circle text-emerald-600 text-xs"></i>
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

