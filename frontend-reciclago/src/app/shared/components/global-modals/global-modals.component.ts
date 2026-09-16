import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HowItWorksModalComponent } from './how-it-works-modal.component';
import { MaterialsModalComponent } from './materials-modal.component';
import { ContactModalComponent } from './contact-modal.component';

@Component({
  selector: 'app-global-modals',
  standalone: true,
  imports: [
    CommonModule,
    HowItWorksModalComponent,
    MaterialsModalComponent,
    ContactModalComponent
  ],
  template: `
    <app-how-it-works-modal
      [isOpen]="showHowItWorks"
      (close)="closeHowItWorks.emit()">
    </app-how-it-works-modal>

    <app-materials-modal
      [isOpen]="showMaterials"
      (close)="closeMaterials.emit()">
    </app-materials-modal>

    <app-contact-modal
      [isOpen]="showContact"
      (close)="closeContact.emit()">
    </app-contact-modal>
  `
})
export class GlobalModalsComponent {
  @Input() showHowItWorks = false;
  @Input() showMaterials = false;
  @Input() showContact = false;

  @Output() closeHowItWorks = new EventEmitter<void>();
  @Output() closeMaterials = new EventEmitter<void>();
  @Output() closeContact = new EventEmitter<void>();
}
