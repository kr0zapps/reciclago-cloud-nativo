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
    <section class="relative py-16 sm:py-24 bg-[#F9F8F5] overflow-hidden border-b border-[#E7E4DC]" id="impacto">
      
      <!-- Watermarked volcano silhouette background -->
      <div class="absolute inset-0 opacity-10 pointer-events-none flex items-end justify-center">
        <svg class="w-full h-auto text-[#163828] max-h-96" fill="currentColor" viewBox="0 0 1200 350">
          <path d="M0,350 L350,140 L450,220 L650,40 L850,230 L1000,160 L1200,350 Z"></path>
        </svg>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Encabezado de Sección Gazette -->
        <div class="mb-12 text-center sm:text-left">
          <span class="font-mono text-[11px] font-bold uppercase tracking-widest text-[#8C5D19] bg-[#FAF0DC] px-3 py-1 rounded border border-[#EADBCA] inline-flex items-center gap-1.5 mb-3 shadow-2xs">
            <i class="fa-solid fa-chart-pie text-[10px]"></i> Indicadores Oficiales DIMAO
          </span>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#163828] tracking-tight font-serif">
            Impacto Comunal y Trazabilidad
          </h2>
          <p class="text-sm sm:text-base text-[#6B726D] mt-2 max-w-2xl font-sans">
            Cada kilogramo reciclado es certificado digitalmente bajo la Ley REP, desviando toneladas de residuos de los vertederos de la Provincia de Llanquihue.
          </p>
        </div>

        <!-- 3 Tarjetas de Métricas Verticales Gazette -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <!-- Métrica 1: Kilos -->
          <div class="bg-white rounded-2xl p-7 text-center border border-[#E7E4DC] shadow-[0_2px_8px_rgba(22,56,40,0.03)] hover:border-[#C98A2C] hover:shadow-[0_8px_24px_rgba(22,56,40,0.08)] transition-all">
            <div class="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#FAF9F6] border border-[#E7E4DC] flex items-center justify-center text-[#163828]">
              <i class="fa-solid fa-scale-balanced text-xl text-[#C98A2C]"></i>
            </div>
            <p class="text-4xl sm:text-5xl font-bold text-[#163828] mb-1 font-serif">
              {{ displayKg }} <span class="text-2xl font-bold text-[#C98A2C]">kg</span>
            </p>
            <h3 class="text-sm font-serif font-bold text-[#163828] mb-1">Kilos Certificados en Báscula</h3>
            <p class="text-[11px] font-mono text-[#6B726D]">Pesaje digital verificado en ruta</p>
          </div>

          <!-- Métrica 2: Vertederos -->
          <div class="bg-white rounded-2xl p-7 text-center border border-[#E7E4DC] shadow-[0_2px_8px_rgba(22,56,40,0.03)] hover:border-[#C98A2C] hover:shadow-[0_8px_24px_rgba(22,56,40,0.08)] transition-all">
            <div class="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#FAF9F6] border border-[#E7E4DC] flex items-center justify-center text-[#163828]">
              <i class="fa-solid fa-arrow-trend-down text-xl text-[#22a652]"></i>
            </div>
            <p class="text-4xl sm:text-5xl font-bold text-[#163828] mb-1 font-serif">
              {{ currentPercent }}<span class="text-2xl font-bold text-[#C98A2C]">%</span>
            </p>
            <h3 class="text-sm font-serif font-bold text-[#163828] mb-1">Desviación de Vertederos</h3>
            <p class="text-[11px] font-mono text-[#6B726D]">Recuperación y valorización REP</p>
          </div>

          <!-- Métrica 3: Flota -->
          <div class="bg-white rounded-2xl p-7 text-center border border-[#E7E4DC] shadow-[0_2px_8px_rgba(22,56,40,0.03)] hover:border-[#C98A2C] hover:shadow-[0_8px_24px_rgba(22,56,40,0.08)] transition-all">
            <div class="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#FAF9F6] border border-[#E7E4DC] flex items-center justify-center text-[#163828]">
              <i class="fa-solid fa-truck-fast text-xl text-[#163828]"></i>
            </div>
            <p class="text-4xl sm:text-5xl font-bold text-[#163828] mb-1 font-serif">
              {{ currentTrucks }} <span class="text-xl font-bold text-[#C98A2C]">camiones</span>
            </p>
            <h3 class="text-sm font-serif font-bold text-[#163828] mb-1">Flota Activa con GPS</h3>
            <p class="text-[11px] font-mono text-[#6B726D]">Cobertura en los 4 cuadrantes</p>
          </div>

        </div>

        <!-- Banner Retiro Especial Panorámico Gazette con cta_lake_flowers.png -->
        <div class="relative rounded-2xl overflow-hidden shadow-md border border-[#E7E4DC] min-h-[220px] flex items-center">
          <img
            src="assets/stitch/cta_lake_flowers.png"
            alt="Paisaje Lago Llanquihue y flores Puerto Varas"
            class="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-[#F9F8F5]/98 via-[#F9F8F5]/92 to-[#F9F8F5]/30 sm:to-transparent"></div>
          
          <div class="relative z-10 p-6 sm:p-10 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div class="flex items-start gap-4 max-w-xl">
              <div class="shrink-0 w-12 h-12 rounded-xl bg-white border border-[#E7E4DC] flex items-center justify-center text-[#163828] mt-1 shadow-2xs">
                <i class="fa-solid fa-leaf text-xl text-[#22a652]"></i>
              </div>
              <div>
                <div class="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#8C5D19] mb-1">
                  <i class="fa-solid fa-truck-ramp-box"></i>
                  <span>Servicio Municipal DIMAO</span>
                </div>
                <h3 class="text-2xl sm:text-3xl font-bold text-[#163828] tracking-tight mb-1.5 font-serif">
                  Tu compromiso cuida nuestro lago
                </h3>
                <p class="text-xs sm:text-sm text-[#6B726D] font-sans leading-relaxed">
                  ¿Necesitas recolección especial para podas, escombros limpios o enseres mayores? Agenda tu visita domiciliaria en la plataforma.
                </p>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a routerLink="/dashboard" class="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2.5 bg-[#163828] hover:bg-[#1b5e37] text-white font-mono text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl transition shadow-sm cursor-pointer">
                <span>Agendar Retiro Especial</span>
                <i class="fa-solid fa-arrow-right text-xs"></i>
              </a>
              <button type="button" (click)="openInfoModal.emit()" class="w-full sm:w-auto text-center px-5 py-3.5 rounded-xl bg-white hover:bg-[#FAF9F6] text-[#163828] font-mono text-xs font-bold uppercase tracking-wider transition border border-[#E7E4DC] shadow-2xs cursor-pointer">
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

