import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuadrantCardInfo, SectorInfo, ALL_HOME_SECTORS } from './data/home-sectors.data';
import { HomeHeroComponent } from './components/home-hero.component';
import { HomeCycleComponent } from './components/home-cycle.component';
import { HomeQuadrantsComponent } from './components/home-quadrants.component';
import { HomeImpactComponent } from './components/home-impact.component';
import { HomeModalsComponent } from './components/home-modals.component';

export { SectorInfo, QuadrantCardInfo };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HomeHeroComponent,
    HomeCycleComponent,
    HomeQuadrantsComponent,
    HomeImpactComponent,
    HomeModalsComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  showMaterialsModal = false;
  showFaqModal = false;
  selectedQuadrantForModal: QuadrantCardInfo | null = null;

  onQuadrantSelected(quadrant: QuadrantCardInfo): void {
    this.selectedQuadrantForModal = quadrant;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.showMaterialsModal = false;
    this.showFaqModal = false;
    this.selectedQuadrantForModal = null;
    document.body.style.overflow = '';
  }
}

