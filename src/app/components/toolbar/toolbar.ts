import { Component, Output, EventEmitter } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BridgeService } from '../../services/dnd-bridge';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [DragDropModule],
  template: `
    <div class="toolbar">
      <div *ngFor="let w of widgets" 
           cdkDrag 
           (cdkDragStarted)="onStart(w)"
           (cdkDragEnded)="onEnd()"
           class="item">
        {{ w.label }}
      </div>
    </div>
  `
})
export class ToolbarComponent {
  @Output() dragChanged = new EventEmitter<boolean>();
  widgets = [
    { type: 'section', label: 'Section' },
    { type: 'heading', label: 'Heading' },
    { type: 'image', label: 'Image' }
  ];

  constructor(private bridge: BridgeService) {}
  onStart(w: any) {
    this.dragChanged.emit(true);
    this.bridge.publishDragStart(w);
  }
  onEnd() { this.dragChanged.emit(false); }
}