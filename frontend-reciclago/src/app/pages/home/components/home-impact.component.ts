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
    <section class="relative py-16 sm:py-20 bg-gradient-to-b from-sky-50/70 via-emerald-50/30 to-white overflow-hidden border-t border-slate-100" id="impacto">
      
      <!-- Watermarked volcano silhouette background Stitch -->
      <div class="absolute inset-0 opacity-15 pointer-events-none flex items-end justify-center">
        <svg class="w-full h-auto text-sky-700 max-h-96" fill="currentColor" viewBox="0 0 1200 350">
          <path d="M0,350 L350,140 L450,220 L650,40 L850,230 L1000,160 L1200,350 Z"></path>
        </svg>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Encabezado de Sección Stitch -->
        <div class="mb-10 text-center sm:text-left">
          <span class="inline-block px-3.5 py-1 rounded-full bg-cyan-100 text-cyan-900 font-bold text-xs mb-3 shadow-2xs">
            Nuestra huella
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#0a233b] tracking-tight font-heading">
            Impacto en la comuna
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Cada kilo reciclado cuenta. Así avanzamos juntos hacia una Puerto Varas más limpia y sustentable en la cuenca del Lago Llanquihue.
          </p>
        </div>

        <!-- 3 Tarjetas de Métricas Verticales Centradas Stitch -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <!-- Métrica 1: Kilos -->
          <div class="bg-white rounded-2xl p-7 text-center shadow-xs hover:shadow-md border border-slate-100 transition-all">
            <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center text-[#206935]">
              <i class="fa-solid fa-scale-balanced text-xl"></i>
            </div>
            <p class="text-3xl sm:text-4xl font-black text-[#0a233b] mb-1 font-heading">
              {{ displayKg }} <span class="text-2xl font-bold text-[#206935]">kg</span>
            </p>
            <h3 class="text-xs sm:text-sm font-bold text-slate-700 mb-1">Kilos de reciclaje certificados</h3>
            <p class="text-[11px] text-slate-400 font-medium">Pesaje digital en ruta vecinal</p>
          </div>

          <!-- Métrica 2: Vertederos -->
          <div class="bg-white rounded-2xl p-7 text-center shadow-xs hover:shadow-md border border-slate-100 transition-all">
            <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center text-[#206935]">
              <i class="fa-solid fa-arrow-trend-down text-xl"></i>
            </div>
            <p class="text-3xl sm:text-4xl font-black text-[#0a233b] mb-1 font-heading">
              {{ currentPercent }}<span class="text-2xl font-bold text-[#206935]">%</span>
            </p>
            <h3 class="text-xs sm:text-sm font-bold text-slate-700 mb-1">Menos en vertederos provinciales</h3>
            <p class="text-[11px] text-slate-400 font-medium">Desviación hacia valorización REP</p>
          </div>

          <!-- Métrica 3: Flota -->
          <div class="bg-white rounded-2xl p-7 text-center shadow-xs hover:shadow-md border border-slate-100 transition-all">
            <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center text-[#206935]">
              <i class="fa-solid fa-truck-fast text-xl"></i>
            </div>
            <p class="text-3xl sm:text-4xl font-black text-[#0a233b] mb-1 font-heading">
              {{ currentTrucks }} <span class="text-xl font-bold text-[#206935]">camiones</span>
            </p>
            <h3 class="text-xs sm:text-sm font-bold text-slate-700 mb-1">Capacidad activa de flota</h3>
            <p class="text-[11px] text-slate-400 font-medium">Cobertura en 4 cuadrantes comunales</p>
          </div>

        </div>

        <!-- Banner Retiro Especial Panorámico Stitch con cta_lake_flowers.png -->
        <div class="relative rounded-3xl overflow-hidden shadow-md border border-slate-100 min-h-[200px] flex items-center">
          <img
            src="assets/stitch/cta_lake_flowers.png"
            alt="Paisaje Lago Llanquihue y flores Puerto Varas"
            class="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/20 sm:to-transparent"></div>
          
          <div class="relative z-10 p-6 sm:p-10 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div class="flex items-start gap-4 max-w-xl">
              <div class="shrink-0 w-12 h-12 rounded-full bg-[#dcf2e3] flex items-center justify-center text-[#206935] mt-1 shadow-2xs">
                <i class="fa-solid fa-leaf text-xl"></i>
              </div>
              <div>
                <div class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#206935] mb-1">
                  <i class="fa-solid fa-truck-ramp-box"></i>
                  <span>Servicio Municipal DIMAO</span>
                </div>
                <h3 class="text-xl sm:text-2xl font-black text-[#0a233b] tracking-tight mb-1 font-heading">
                  Tu compromiso hace la diferencia
                </h3>
                <p class="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  ¿Necesitas recolección para podas, escombros limpios o enseres mayores? Agenda tu visita domiciliaria.
                </p>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a routerLink="/dashboard" class="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 bg-[#286f34] hover:bg-[#205b2a] text-white text-xs sm:text-sm font-bold py-3.5 px-6 rounded-xl transition shadow-md group cursor-pointer">
                <span>Agendar Retiro Especial</span>
                <span class="transform group-hover:translate-x-1 transition-transform">→</span>
              </a>
              <button type="button" (click)="openInfoModal.emit()" class="w-full sm:w-auto text-center px-4 py-3.5 rounded-xl bg-white/90 hover:bg-white text-slate-700 text-xs sm:text-sm font-bold transition border border-slate-200 shadow-2xs cursor-pointer">
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

