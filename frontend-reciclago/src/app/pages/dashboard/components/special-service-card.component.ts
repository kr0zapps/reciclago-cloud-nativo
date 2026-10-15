import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-special-service-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm h-full flex flex-col justify-between">
      <div>
        <h3 class="font-heading font-bold text-xl text-[#123F5B] mb-2">¿Necesitas un retiro especial?</h3>
        <p class="text-sm text-gray-500 mb-4">
          Para aparatos electrónicos, colchones, muebles u otros residuos voluminosos, coordinamos el retiro directamente con la cuadrilla municipal en tu puerta.
        </p>
      </div>
      <button (click)="scheduleRequested.emit()" type="button" class="btn-stitch-primary w-full text-center cursor-pointer mt-2">
        <i class="fa-regular fa-calendar-plus text-sm mr-2"></i>
        <span>Agendar retiro a domicilio</span>
      </button>
    </div>
  `
})
export class SpecialServiceCardComponent {
  @Output() scheduleRequested = new EventEmitter<void>();
}
