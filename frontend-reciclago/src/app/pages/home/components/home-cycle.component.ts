import { Component, ElementRef, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CycleStep {
  stepNumber: number;
  title: string;
  description: string;
  iconClass: string;
}

@Component({
  selector: 'app-home-cycle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- BEGIN: HowItWorks -->
    <section class="py-12 sm:py-16 bg-[#F8FAF7] border-b border-[#E2E8F0]" id="como-funciona">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-xl mx-auto mb-10">
          <h2 class="text-2xl sm:text-3xl font-black text-[#123F5B] font-heading">
            El ciclo del retiro
          </h2>
          <p class="text-xs sm:text-sm text-gray-500 mt-1.5">
            5 pasos simples desde tu puerta hasta el pesaje oficial.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div *ngFor="let step of steps" class="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-2xs hover:border-[#22a652] transition-all">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-xl bg-[#ecf7e6] text-[#22a652] flex items-center justify-center text-sm font-black">
                <i [class]="step.iconClass"></i>
              </div>
              <span class="font-mono text-xs font-black text-gray-300">
                0{{ step.stepNumber }}
              </span>
            </div>
            <h3 class="font-extrabold text-[#123F5B] text-base font-heading mb-1">
              {{ step.title }}
            </h3>
            <p class="text-xs text-gray-500 leading-relaxed">
              {{ step.description }}
            </p>
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
      title: 'Pides tu retiro',
      description: 'Indica tu dirección y material a reciclar.',
      iconClass: 'fa-solid fa-clipboard-check'
    },
    {
      stepNumber: 2,
      title: 'DIMAO programa',
      description: 'Asigna el día según tu cuadrante.',
      iconClass: 'fa-solid fa-calendar-check'
    },
    {
      stepNumber: 3,
      title: 'Camión en camino',
      description: 'Sigue el camión por GPS en tu sector.',
      iconClass: 'fa-solid fa-truck-fast'
    },
    {
      stepNumber: 4,
      title: 'Retiro en puerta',
      description: 'La cuadrilla recoge en tu frontis.',
      iconClass: 'fa-solid fa-house'
    },
    {
      stepNumber: 5,
      title: 'Pesaje y Ley REP',
      description: 'Pesaje digital y comprobante oficial.',
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

