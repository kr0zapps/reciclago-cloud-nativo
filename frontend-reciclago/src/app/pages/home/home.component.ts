import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SectorInfo, ALL_HOME_SECTORS, POPULAR_HOME_SECTORS } from './data/home-sectors.data';
import { HomeHeroComponent } from './components/home-hero.component';
import { HomeScheduleBinsComponent } from './components/home-schedule-bins.component';
import { HomeSpecialPickupComponent } from './components/home-special-pickup.component';
import { HomeCommitmentComponent } from './components/home-commitment.component';
import { HomeModalsComponent } from './components/home-modals.component';

export { SectorInfo };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HomeHeroComponent,
    HomeScheduleBinsComponent,
    HomeSpecialPickupComponent,
    HomeCommitmentComponent,
    HomeModalsComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  showMaterialsModal = false;
  showFaqModal = false;
  justUpdated = false;

  allSectors: SectorInfo[] = [...ALL_HOME_SECTORS];
  popularSectors: SectorInfo[] = [...POPULAR_HOME_SECTORS];
  selectedSector: SectorInfo = this.allSectors[0];

  onSectorSelected(sector: SectorInfo): void {
    this.selectedSector = sector;
    this.justUpdated = true;
    setTimeout(() => {
      this.justUpdated = false;
    }, 2500);
  }

  onSearchSubmitted(sector: SectorInfo): void {
    this.onSectorSelected(sector);
    const el = document.getElementById('tu-dia-de-retiro');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.showMaterialsModal = false;
    this.showFaqModal = false;
    document.body.style.overflow = '';
  }
}
