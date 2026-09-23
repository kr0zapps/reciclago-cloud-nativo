import { Component, Output, EventEmitter, OnInit, AfterViewInit, OnDestroy, ElementRef, ChangeDetectorRef, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BffService } from '../../../services/bff.service';

@Component({
  selector: 'app-home-impact',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- BEGIN: ImpactSection -->
    <section class="relative py-16 sm:py-20 bg-gradient-to-b from-sky-50/60 via-emerald-50/25 to-[#F8FAF7] overflow-hidden border-t border-slate-200/60" id="impacto">
      <!-- Watermarked volcano silhouette background -->
      <div class="absolute inset-0 opacity-10 pointer-events-none flex items-end justify-center" aria-hidden="true">
        <svg class="w-full h-auto text-[#123F5B] max-h-96" fill="currentColor" viewBox="0 0 1200 350">
          <path d="M0,350 L350,140 L450,220 L650,40 L850,230 L1000,160 L1200,350 Z"></path>
        </svg>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Heading con Scroll Reveal -->
        <div class="mb-10 sm:mb-14 text-center sm:text-left reveal-init" [class.reveal-active]="isVisible">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#041624] tracking-tight mb-2 font-heading">
            Impacto en Puerto Varas
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Cada kilo reciclado cuenta para proteger la cuenca del Lago Llanquihue y el entorno natural del Volcán Osorno. Así avanzamos como comunidad.
          </p>
        </div>

        <!-- Metric Cards: Responsive unified grid con Staggered Entrance y Físicas Suaves -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12">
          
          <!-- Métrica 1: Kilos certificados -->
          <div class="group hover-lift bg-white rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-lg border border-slate-200/80 hover:border-emerald-500/40 flex flex-col justify-between reveal-init"
               [class.reveal-active]="isVisible"
               style="transition-delay: 50ms">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-[#22a652] flex items-center justify-center text-lg shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ease-out mb-4">
                <i class="fa-solid fa-scale-balanced"></i>
              </div>
              <p class="text-3xl sm:text-4xl lg:text-5xl font-black text-[#041624] font-heading tracking-tight mb-1 whitespace-nowrap">
                {{ displayKg }} <span class="text-lg sm:text-xl font-bold text-[#22a652]">kg</span>
              </p>
              <h3 class="text-sm sm:text-base font-bold text-slate-800 leading-snug group-hover:text-[#22a652] transition-colors duration-200">
                Kilos de reciclaje certificados
              </h3>
            </div>
            <p class="text-xs text-slate-500 mt-2 leading-relaxed border-t border-slate-100 pt-2.5">
              Pesaje digital en ruta vecinal bajo estándar Ley REP con certificación municipal.
            </p>
          </div>

          <!-- Métrica 2: Disminución en vertederos -->
          <div class="group hover-lift bg-white rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-lg border border-slate-200/80 hover:border-sky-500/40 flex flex-col justify-between reveal-init"
               [class.reveal-active]="isVisible"
               style="transition-delay: 140ms">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284c7] flex items-center justify-center text-lg shadow-xs group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 ease-out mb-4">
                <i class="fa-solid fa-arrow-trend-down"></i>
              </div>
              <p class="text-3xl sm:text-4xl lg:text-5xl font-black text-[#041624] font-heading tracking-tight mb-1 whitespace-nowrap">
                {{ currentPercent }}<span class="text-2xl sm:text-3xl font-bold text-[#0284c7]">%</span>
              </p>
              <h3 class="text-sm sm:text-base font-bold text-slate-800 leading-snug group-hover:text-[#0284c7] transition-colors duration-200">
                Menos residuos en vertederos
              </h3>
            </div>
            <p class="text-xs text-slate-500 mt-2 leading-relaxed border-t border-slate-100 pt-2.5">
              Disminución de residuos domiciliarios transportados a vertederos provinciales.
            </p>
          </div>

          <!-- Métrica 3: Flota activa -->
          <div class="group hover-lift bg-white rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-lg border border-slate-200/80 hover:border-indigo-500/40 flex flex-col justify-between reveal-init"
               [class.reveal-active]="isVisible"
               style="transition-delay: 230ms">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-[#4f46e5] flex items-center justify-center text-lg shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ease-out mb-4">
                <i class="fa-solid fa-truck-fast"></i>
              </div>
              <p class="text-3xl sm:text-4xl lg:text-5xl font-black text-[#041624] font-heading tracking-tight mb-1 whitespace-nowrap">
                {{ currentTrucks }} <span class="text-lg sm:text-xl font-bold text-[#4f46e5]">camiones</span>
              </p>
              <h3 class="text-sm sm:text-base font-bold text-slate-800 leading-snug group-hover:text-[#4f46e5] transition-colors duration-200">
                Capacidad operativa en ruta
              </h3>
            </div>
            <p class="text-xs text-slate-500 mt-2 leading-relaxed border-t border-slate-100 pt-2.5">
              Recorriendo los 4 cuadrantes de la comuna con pesaje y recolección programada.
            </p>
          </div>

        </div>

        <!-- Panoramic Scenic Banner con Zoom Sutil y Hover-Lift: ¿Necesitas un retiro especial? -->
        <div class="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl border border-slate-200/90 min-h-[200px] sm:min-h-[230px] flex items-center reveal-init"
             [class.reveal-active]="isVisible"
             style="transition-delay: 300ms">
          <!-- Scenic background photo: Lake, flowers, and volcano -->
          <img
            alt="Paisaje Lago Llanquihue y flores Puerto Varas"
            class="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
            src="assets/stitch/cta_lake_flowers.png"
            loading="lazy"
          />
          <!-- Multi-stop gradient overlay ensuring AAA text contrast -->
          <div class="absolute inset-0 bg-gradient-to-r from-white/95 via-white/92 to-white/75 sm:to-white/50 backdrop-blur-2xs"></div>

          <!-- Content Box -->
          <div class="relative z-10 p-6 sm:p-10 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div class="flex items-start gap-4 max-w-xl">
              <div class="shrink-0 w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-[#22a652] text-xl mt-1 shadow-xs group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ease-out">
                <i class="fa-solid fa-truck-ramp-box"></i>
              </div>
              <div>
                <h3 class="text-xl sm:text-2xl lg:text-3xl font-black text-[#041624] tracking-tight mb-1.5 font-heading">
                  ¿Necesitas un retiro especial?
                </h3>
                <p class="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  Solicita a la DIMAO una recolección programada para podas de jardín, escombros limpios o enseres fuera de tu cuadrante semanal.
                </p>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <a
                routerLink="/dashboard"
                class="btn-interactive group/btn inline-flex items-center justify-center gap-2.5 bg-[#22a652] hover:bg-[#1b8c44] active:bg-[#17773a] text-white text-xs sm:text-sm font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22a652] focus-visible:ring-offset-2 cursor-pointer text-center">
                <span>Agendar retiro especial</span>
                <i class="fa-solid fa-arrow-right text-xs transform group-hover/btn:translate-x-1.5 transition-transform duration-200"></i>
              </a>
              <button
                type="button"
                (click)="openInfoModal.emit()"
                class="btn-interactive inline-flex items-center justify-center gap-2 bg-white/95 hover:bg-white active:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-semibold py-3 px-4 rounded-xl border border-slate-300/90 hover:border-slate-400 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#041624] focus-visible:ring-offset-2 cursor-pointer">
                <i class="fa-solid fa-circle-question text-emerald-600 text-sm"></i>
                <span>Preguntas frecuentes</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
    <!-- END: ImpactSection -->
  `
})
export class HomeImpactComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() openInfoModal = new EventEmitter<void>();

  targetKg = 0;
  targetPercent = 25;
  targetTrucks = 2;

  currentKg = 0;
  currentPercent = 0;
  currentTrucks = 0;
  displayKg = '0';
  isVisible = false;
  isLiveConnected = false;
  liveKilosEnVivo = 0;

  private observer?: IntersectionObserver;
  private animFrameId?: number;
  private isBrowser: boolean;

  constructor(
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private bffService: BffService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.cargarMetricasEnVivo();
    if (!this.isBrowser) {
      this.currentKg = this.targetKg;
      this.currentPercent = this.targetPercent;
      this.currentTrucks = this.targetTrucks;
      this.displayKg = this.targetKg.toLocaleString('es-CL');
      this.isVisible = true;
    }
  }

  cargarMetricasEnVivo(): void {
    this.bffService.getImpactoComunal().subscribe({
      next: (data) => {
        if (data) {
          this.isLiveConnected = true;
          if (data.kilosCertificados !== undefined && data.kilosCertificados !== null) this.targetKg = Number(data.kilosCertificados);
          if (data.porcentajeVertederos !== undefined && data.porcentajeVertederos !== null) this.targetPercent = Number(data.porcentajeVertederos);
          if (data.camionesOperativos !== undefined && data.camionesOperativos !== null) this.targetTrucks = Number(data.camionesOperativos);
          if (data.kilosEnVivo !== undefined && data.kilosEnVivo !== null) this.liveKilosEnVivo = Number(data.kilosEnVivo);
          if (this.isVisible) {
            this.startCountAnimation();
          } else {
            this.displayKg = this.targetKg.toLocaleString('es-CL');
          }
          this.cdr.markForCheck();
        }
      },
      error: () => {
        // Fallback: intentar al menos obtener el conteo de camiones reales desde ms-reciclago-catalog
        this.bffService.getCamiones().subscribe({
          next: (camiones) => {
            if (camiones && camiones.length > 0) {
              this.targetTrucks = camiones.length;
              this.isLiveConnected = true;
              this.cdr.markForCheck();
            }
          },
          error: () => {}
        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.isVisible = true;
          this.cdr.markForCheck();
          this.observer?.disconnect();
          this.startCountAnimation();
        }
      }, { threshold: 0.15 });

      this.observer.observe(this.el.nativeElement);
    } else {
      this.isVisible = true;
      this.startCountAnimation();
    }
  }

  startCountAnimation(): void {
    const duration = 1500;
    const startTime = performance.now();

    this.ngZone.runOutsideAngular(() => {
      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing: easeOutCubic
        const ease = 1 - Math.pow(1 - progress, 3);

        const valKg = Math.floor(ease * this.targetKg);
        const valPercent = Math.floor(ease * this.targetPercent);
        const valTrucks = Math.floor(ease * this.targetTrucks);

        this.ngZone.run(() => {
          this.currentKg = valKg;
          this.displayKg = valKg.toLocaleString('es-CL');
          this.currentPercent = valPercent;
          this.currentTrucks = valTrucks;
          this.cdr.markForCheck();
        });

        if (progress < 1) {
          this.animFrameId = requestAnimationFrame(step);
        } else {
          this.ngZone.run(() => {
            this.currentKg = this.targetKg;
            this.displayKg = this.targetKg.toLocaleString('es-CL');
            this.currentPercent = this.targetPercent;
            this.currentTrucks = this.targetTrucks;
            this.cdr.markForCheck();
          });
        }
      };

      this.animFrameId = requestAnimationFrame(step);
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }
}

