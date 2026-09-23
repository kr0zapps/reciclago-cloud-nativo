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
    <section class="relative py-12 sm:py-16 bg-white overflow-hidden border-b border-slate-200" id="impacto">
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Encabezado de Sección Modern Clean -->
        <div class="mb-8 text-center sm:text-left">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading mb-1.5">
            Impacto en Puerto Varas
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 max-w-xl font-sans">
            Seguimiento del programa municipal de retiro selectivo y reciclaje domiciliario.
          </p>
        </div>

        <!-- 3 Tarjetas de Métricas Simétricas (Horizontal en Móvil / Grid en Desktop) -->
        <div class="flex md:grid md:grid-cols-3 gap-3 sm:gap-5 overflow-x-auto md:overflow-visible pb-3 md:pb-0 px-1 snap-x snap-mandatory scroll-smooth no-scrollbar mb-6 md:mb-8">
          
          <!-- Métrica 1: Kilos -->
          <div class="w-[240px] sm:w-[260px] md:w-auto shrink-0 snap-center bg-slate-50/70 rounded-2xl p-5 text-center border border-slate-200/90 shadow-2xs hover:shadow-md hover:-translate-y-1 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between items-center group">
            <div class="w-11 h-11 mx-auto mb-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 text-base shadow-2xs group-hover:scale-105 group-hover:border-emerald-300 transition-all duration-300">
              <i class="fa-solid fa-scale-balanced text-emerald-600"></i>
            </div>
            <div>
              <p class="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-1 font-heading tracking-tight">
                {{ displayKg }} <span class="text-xl font-bold text-emerald-600">kg</span>
              </p>
              <h3 class="text-sm font-heading font-bold text-slate-800 mb-0.5">Kilos Recolectados</h3>
              <p class="text-xs text-slate-500">Material clasificado y pesado en ruta</p>
            </div>
            <div class="mt-3.5 pt-2.5 border-t border-slate-200/70 w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500">
              <i class="fa-solid fa-check text-emerald-600"></i>
              <span>Certificado en planta de acopio</span>
            </div>
          </div>

          <!-- Métrica 2: Meta Comunal (Limpia, Sin Donut) -->
          <div class="w-[240px] sm:w-[260px] md:w-auto shrink-0 snap-center bg-slate-50/70 rounded-2xl p-5 text-center border border-slate-200/90 shadow-2xs hover:shadow-md hover:-translate-y-1 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between items-center group">
            <div class="w-11 h-11 mx-auto mb-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 text-base shadow-2xs group-hover:scale-105 group-hover:border-emerald-300 transition-all duration-300">
              <i class="fa-solid fa-leaf text-emerald-600"></i>
            </div>
            <div>
              <p class="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-1 font-heading tracking-tight">
                {{ currentPercent }}%
              </p>
              <h3 class="text-sm font-heading font-bold text-slate-800 mb-0.5">Meta Comunal 2024</h3>
              <p class="text-xs text-slate-500">Reducción de basura hacia vertedero</p>
            </div>
            <div class="mt-3.5 pt-2.5 border-t border-slate-200/70 w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500">
              <i class="fa-solid fa-arrow-trend-up text-emerald-600"></i>
              <span>Compromiso municipal activo</span>
            </div>
          </div>

          <!-- Métrica 3: Cobertura de Cuadrantes -->
          <div class="w-[240px] sm:w-[260px] md:w-auto shrink-0 snap-center bg-slate-50/70 rounded-2xl p-5 text-center border border-slate-200/90 shadow-2xs hover:shadow-md hover:-translate-y-1 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between items-center group">
            <div class="w-11 h-11 mx-auto mb-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 text-base shadow-2xs group-hover:scale-105 group-hover:border-emerald-300 transition-all duration-300">
              <i class="fa-solid fa-truck-fast text-slate-800"></i>
            </div>
            <div>
              <p class="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-1 font-heading tracking-tight">
                4 <span class="text-lg font-bold text-emerald-600">cuadrantes</span>
              </p>
              <h3 class="text-sm font-heading font-bold text-slate-800 mb-0.5">Cobertura Comunal</h3>
              <p class="text-xs text-slate-500">Recorridos semanales en Puerto Varas</p>
            </div>
            <div class="mt-3.5 pt-2.5 border-t border-slate-200/70 w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500">
              <i class="fa-solid fa-location-dot text-emerald-600"></i>
              <span>Puerto Chico, Costanera, Ensenada, N. Braunau</span>
            </div>
          </div>

        </div>

        <!-- Indicador visual de deslizamiento en móvil -->
        <div class="md:hidden flex items-center justify-center gap-1.5 mb-6 text-[11px] text-slate-400 font-medium">
          <span>Desliza para ver métricas</span>
          <i class="fa-solid fa-arrow-right-long text-xs animate-pulse text-slate-500"></i>
        </div>

        <!-- Banner Retiro Especial (Legibilidad y Lenguaje Claro) -->
        <div class="relative rounded-2xl overflow-hidden shadow-md border border-slate-800 bg-slate-950 min-h-[150px] flex items-center">
          <img
            src="assets/stitch/cta_lake_flowers.png"
            alt="Paisaje Lago Llanquihue y flores Puerto Varas"
            class="absolute right-0 inset-y-0 w-full md:w-3/5 h-full object-cover object-center opacity-65"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/20 sm:to-transparent"></div>
          
          <div class="relative z-10 p-5 sm:p-7 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div class="flex items-start gap-3.5 max-w-xl">
              <div class="shrink-0 w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mt-0.5 shadow-2xs">
                <i class="fa-solid fa-truck-ramp-box text-base"></i>
              </div>
              <div>
                <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  Retiros Especiales
                </span>
                <h3 class="text-lg sm:text-xl font-extrabold text-white tracking-tight mb-1 font-heading">
                  ¿Muebles viejos, ramas o escombros?
                </h3>
                <p class="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  Coordina una fecha de recolección especial a domicilio directamente con el servicio municipal.
                </p>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
              <a routerLink="/dashboard" class="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition shadow-sm cursor-pointer font-heading">
                <span>Agendar Retiro Especial</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </a>
              <button type="button" (click)="openInfoModal.emit()" class="w-full sm:w-auto text-center px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition border border-white/20 shadow-2xs cursor-pointer font-heading">
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

  targetKg = 14820;
  targetPercent = 25;
  targetTrucks = 4;

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

