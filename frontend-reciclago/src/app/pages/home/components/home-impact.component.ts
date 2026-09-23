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

        <!-- 3 Métricas en 1 Sola Fila (CERO DESLIZAR en Móvil y Desktop) -->
        <div class="grid grid-cols-3 gap-1.5 sm:gap-4 mb-4 sm:mb-6">
          
          <!-- Métrica 1: Kilos -->
          <div class="bg-slate-50/80 rounded-xl p-2 sm:p-4 text-center border border-slate-200/90 shadow-2xs hover:bg-white transition-all flex flex-col justify-center items-center group">
            <div class="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 rounded-md sm:rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-[10px] sm:text-xs shadow-2xs">
              <i class="fa-solid fa-scale-balanced"></i>
            </div>
            <p class="text-sm sm:text-2xl md:text-3xl font-extrabold text-slate-900 mb-0.5 font-heading tracking-tight">
              {{ displayKg }} <span class="text-[10px] sm:text-sm font-bold text-emerald-600">kg</span>
            </p>
            <h3 class="text-[10px] sm:text-xs md:text-sm font-heading font-bold text-slate-800 leading-tight">Kilos Recolectados</h3>
            <p class="hidden sm:block text-[11px] text-slate-500 mt-0.5 leading-tight">Pesado y retirado en ruta</p>
          </div>

          <!-- Métrica 2: Meta Comunal (Opción A) -->
          <div class="bg-slate-50/80 rounded-xl p-2 sm:p-4 text-center border border-slate-200/90 shadow-2xs hover:bg-white transition-all flex flex-col justify-center items-center group">
            <div class="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 rounded-md sm:rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-[10px] sm:text-xs shadow-2xs">
              <i class="fa-solid fa-leaf"></i>
            </div>
            <p class="text-sm sm:text-2xl md:text-3xl font-extrabold text-slate-900 mb-0.5 font-heading tracking-tight">
              {{ currentPercent }}%
            </p>
            <h3 class="text-[10px] sm:text-xs md:text-sm font-heading font-bold text-slate-800 leading-tight">Meta de Reciclaje</h3>
            <p class="hidden sm:block text-[11px] text-slate-500 mt-0.5 leading-tight">Menos residuos a vertedero</p>
          </div>

          <!-- Métrica 3: Cobertura Comunal (Opción A) -->
          <div class="bg-slate-50/80 rounded-xl p-2 sm:p-4 text-center border border-slate-200/90 shadow-2xs hover:bg-white transition-all flex flex-col justify-center items-center group">
            <div class="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 rounded-md sm:rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-[10px] sm:text-xs shadow-2xs">
              <i class="fa-solid fa-truck-fast"></i>
            </div>
            <p class="text-sm sm:text-2xl md:text-3xl font-extrabold text-slate-900 mb-0.5 font-heading tracking-tight">
              4 <span class="text-[10px] sm:text-sm font-bold text-emerald-600">sectores</span>
            </p>
            <h3 class="text-[10px] sm:text-xs md:text-sm font-heading font-bold text-slate-800 leading-tight">Cobertura Comunal</h3>
            <p class="hidden sm:block text-[11px] text-slate-500 mt-0.5 leading-tight">Rutas semanales activas</p>
          </div>

        </div>

        <!-- Banner Retiro Especial Compacto -->
        <div class="relative rounded-xl overflow-hidden shadow-sm border border-slate-800 bg-slate-950 min-h-[120px] sm:min-h-[140px] flex items-center">
          <img
            src="assets/stitch/cta_lake_flowers.png"
            alt="Paisaje Lago Llanquihue y flores Puerto Varas"
            class="absolute right-0 inset-y-0 w-full md:w-3/5 h-full object-cover object-center opacity-65"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/20 sm:to-transparent"></div>
          
          <div class="relative z-10 p-4 sm:p-6 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-5">
            <div class="flex items-start gap-3 max-w-xl">
              <div class="shrink-0 w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mt-0.5 shadow-2xs">
                <i class="fa-solid fa-truck-ramp-box text-sm"></i>
              </div>
              <div>
                <span class="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                  Retiros Especiales
                </span>
                <h3 class="text-base sm:text-lg font-extrabold text-white tracking-tight mb-0.5 font-heading">
                  ¿Muebles viejos o escombros?
                </h3>
                <p class="text-xs text-slate-300 font-sans leading-snug">
                  Coordina el retiro especial a domicilio directamente con el servicio municipal.
                </p>
              </div>
            </div>

            <!-- Botones Compactos en 1 Fila -->
            <div class="flex items-center gap-2 shrink-0">
              <a routerLink="/dashboard" class="flex-1 sm:flex-initial text-center inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 px-3.5 rounded-lg transition shadow-xs cursor-pointer font-heading">
                <span>Agendar Retiro</span>
                <i class="fa-solid fa-arrow-right text-[9px]"></i>
              </a>
              <button type="button" (click)="openInfoModal.emit()" class="flex-1 sm:flex-initial text-center px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition border border-white/20 shadow-2xs cursor-pointer font-heading">
                Preguntas
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

