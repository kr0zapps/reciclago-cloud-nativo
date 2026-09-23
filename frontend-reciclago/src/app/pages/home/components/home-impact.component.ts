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
    <section class="relative py-16 sm:py-20 bg-white overflow-hidden border-b border-slate-200" id="impacto">
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Encabezado de Sección Modern Clean -->
        <div class="mb-10 text-center sm:text-left">
          <h2 class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading mb-2">
            Impacto en la Comuna
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 max-w-xl font-sans">
            Cada kilogramo recolectado se pesa in situ y se certifica para valorización, evitando su disposición en vertederos provinciales.
          </p>
        </div>

        <!-- 3 Tarjetas de Métricas Modernas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          
          <!-- Métrica 1: Kilos -->
          <div class="bg-slate-50/70 rounded-2xl p-7 text-center border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-1.5 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between items-center group">
            <div class="w-12 h-12 mx-auto mb-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 text-lg shadow-2xs group-hover:scale-110 group-hover:border-emerald-300 transition-all duration-300">
              <i class="fa-solid fa-scale-balanced text-emerald-600"></i>
            </div>
            <div>
              <p class="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-1 font-heading tracking-tight">
                {{ displayKg }} <span class="text-2xl font-bold text-emerald-600">kg</span>
              </p>
              <h3 class="text-sm font-heading font-bold text-slate-800 mb-0.5">Kilos Certificados en Báscula</h3>
              <p class="text-xs text-slate-500">Pesaje digital verificado en ruta</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-200/70 w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-700">
              <i class="fa-solid fa-arrow-trend-up text-xs"></i>
              <span>Trazabilidad 100% Digital</span>
            </div>
          </div>

          <!-- Métrica 2: Vertederos con Anillo Circular SVG Animado -->
          <div class="bg-slate-50/70 rounded-2xl p-7 text-center border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-1.5 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between items-center group">
            <!-- Anillo SVG Circular en Vivo -->
            <div class="relative w-24 h-24 mx-auto mb-2 flex items-center justify-center">
              <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#E2E8F0" stroke-width="7" fill="none" />
                <circle cx="50" cy="50" r="38" stroke="#16A34A" stroke-width="7" fill="none" stroke-linecap="round"
                        stroke-dasharray="238.76"
                        [style.stroke-dashoffset]="238.76 - (238.76 * currentPercent / 100)"
                        class="transition-all duration-700 ease-out" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span class="text-2xl font-extrabold text-slate-900 font-heading leading-none">{{ currentPercent }}%</span>
                <span class="text-[9px] font-bold text-emerald-700 uppercase tracking-wider mt-0.5">Meta</span>
              </div>
            </div>
            <div>
              <h3 class="text-sm font-heading font-bold text-slate-800 mb-0.5">Desviación de Vertederos</h3>
              <p class="text-xs text-slate-500">Recuperación y valorización REP</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-200/70 w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500">
              <span>Evitando saturación comunal</span>
            </div>
          </div>

          <!-- Métrica 3: Flota -->
          <div class="bg-slate-50/70 rounded-2xl p-7 text-center border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-1.5 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between items-center group">
            <div class="w-12 h-12 mx-auto mb-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 text-lg shadow-2xs group-hover:scale-110 group-hover:border-emerald-300 transition-all duration-300">
              <i class="fa-solid fa-truck-fast text-slate-800"></i>
            </div>
            <div>
              <p class="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-1 font-heading tracking-tight">
                {{ currentTrucks }} <span class="text-xl font-bold text-emerald-600">camiones</span>
              </p>
              <h3 class="text-sm font-heading font-bold text-slate-800 mb-0.5">Flota Activa con GPS</h3>
              <p class="text-xs text-slate-500">Cobertura en los 4 cuadrantes</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-200/70 w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-700">
              <i class="fa-solid fa-satellite-dish text-xs"></i>
              <span>Monitoreo Satelital</span>
            </div>
          </div>

        </div>

        <!-- Banner Retiro Especial de Alto Contraste (Legibilidad 100% Garantizada) -->
        <div class="relative rounded-3xl overflow-hidden shadow-lg border border-slate-800 bg-slate-950 min-h-[200px] flex items-center">
          <img
            src="assets/stitch/cta_lake_flowers.png"
            alt="Paisaje Lago Llanquihue y flores Puerto Varas"
            class="absolute right-0 inset-y-0 w-full md:w-3/5 h-full object-cover object-center opacity-65"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/20 sm:to-transparent"></div>
          
          <div class="relative z-10 p-6 sm:p-10 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div class="flex items-start gap-4 max-w-xl">
              <div class="shrink-0 w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mt-1 shadow-2xs">
                <i class="fa-solid fa-leaf text-lg"></i>
              </div>
              <div>
                <div class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  <i class="fa-solid fa-truck-ramp-box"></i>
                  <span>Servicio Municipal DIMAO</span>
                </div>
                <h3 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-1 font-heading">
                  ¿Necesitas retirar voluminosos o podas?
                </h3>
                <p class="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  Agenda una fecha de recolección especial para muebles en desuso, escombros limpios o ramas directamente desde el portal.
                </p>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a routerLink="/dashboard" class="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-3 px-5 rounded-xl transition shadow-sm cursor-pointer font-heading">
                <span>Agendar Retiro Especial</span>
                <i class="fa-solid fa-arrow-right text-[11px]"></i>
              </a>
              <button type="button" (click)="openInfoModal.emit()" class="w-full sm:w-auto text-center px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition border border-white/20 shadow-2xs cursor-pointer font-heading">
                Preguntas Frecuentes
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

