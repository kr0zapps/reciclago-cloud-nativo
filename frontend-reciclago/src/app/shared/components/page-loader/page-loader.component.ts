import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-loader',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'contents' },
  template: `
    <!-- Top loader sutil -->
    <div *ngIf="isLoading" class="fixed top-0 left-0 right-0 h-1 z-[9999] pointer-events-none overflow-hidden bg-transparent">
      <div class="h-full bg-gradient-to-r from-[#4F8A3D] via-[#38BDF8] to-[#123F5B] anim-top-loader shadow-[0_0_12px_rgba(56,189,248,0.7)]"></div>
    </div>

    <!-- Loader con identidad visual RecicLaGo -->
    <div *ngIf="isLoading"
         class="fixed inset-0 z-[100] flex items-center justify-center bg-[#041D2D]/20 backdrop-blur-[4px] transition-all duration-300 pointer-events-none">
      <div class="bg-white/95 backdrop-blur-md rounded-3xl p-7 shadow-2xl border border-white/90 flex flex-col items-center text-center max-w-xs mx-4 anim-page-deploy pointer-events-auto">
        
        <!-- Logo RecicLaGo Oficial -->
        <div class="relative w-16 h-16 mb-2.5 flex items-center justify-center">
          <svg class="w-16 h-16 relative z-10 anim-float-soft drop-shadow-sm" fill="none" viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 56L34 24L52 50L60 38L78 56H12Z" fill="#123F5B"></path>
            <path d="M34 24L41 34L34 38L27 34L34 24Z" fill="#FFFFFF"></path>
            <path d="M60 38L66 46L60 50L55 45L60 38Z" fill="#FFFFFF"></path>
            <path d="M48 56C48 40 64 26 84 26C84 42 68 56 48 56Z" fill="#4F8A3D" class="anim-pulse-gentle"></path>
            <path d="M52 56C58 48 68 40 84 26" stroke="#FFFFFF" stroke-linecap="round" stroke-width="2.2"></path>
            <path d="M8 64C16 61 24 67 32 64C40 61 48 67 56 64C64 61 72 67 80 64C88 61 92 64 96 64" stroke="#1F6685" stroke-linecap="round" stroke-width="2.5"></path>
            <path d="M14 71C20 69 26 73 32 71C38 69 44 73 50 71C56 69 62 73 68 71C74 69 80 73 86 71" stroke="#8EAD73" stroke-linecap="round" stroke-width="2"></path>
          </svg>
        </div>

        <!-- Tipografía Oficial RecicLaGo -->
        <div class="flex items-baseline tracking-tight mb-1">
          <span class="font-heading font-black text-2xl text-[#123F5B]">Recic</span>
          <span class="font-heading font-black text-2xl text-[#4F8A3D]">LaGo</span>
        </div>

        <!-- Barra de progreso miniatura -->
        <div class="w-32 h-1.5 bg-[#E2E9E4] rounded-full overflow-hidden mt-1.5 mb-2">
          <div class="h-full bg-gradient-to-r from-[#4F8A3D] via-[#38BDF8] to-[#123F5B] anim-top-loader rounded-full"></div>
        </div>

        <!-- Lema Comunal -->
        <p class="text-[11px] font-bold text-[#546571] uppercase tracking-wider">
          Puerto Varas recicla
        </p>
      </div>
    </div>
  `
})
export class PageLoaderComponent {
  @Input() isLoading = false;
}
