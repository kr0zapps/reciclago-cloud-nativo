import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="text-align: center; padding: 40px;">
      <h2>Portal Público RecicLaGo</h2>
      <p>Bienvenido al sistema de gestión de residuos reciclables para municipios y vecinos.</p>
      <p>Para gestionar o solicitar retiros de reciclaje, inicia sesión con tu cuenta institucional.</p>
      <div style="margin-top: 20px;">
        <a routerLink="/dashboard" style="display: inline-block; padding: 10px 20px; background-color: #2e7d32; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Ir al Panel de Control (Protegido)
        </a>
      </div>
    </div>
  `
})
export class HomeComponent {}
