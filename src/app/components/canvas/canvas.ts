import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RendererComponent } from '../renderer/renderer.component';
import { BridgeService } from '../../services/dnd-bridge';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, RendererComponent],
  template: `
    <div id="drop-zone" class="canvas-container" style="min-height: 100vh; background: #fff;">
      <app-renderer *ngFor="let item of canvasData" [node]="item"></app-renderer>
      
      <div *ngIf="canvasData.length === 0" class="placeholder">
        Drop Section here to start building
      </div>
    </div>
  `
})
export class CanvasComponent implements OnInit {
  canvasData: any[] = [];
  activeWidget: any = null;

  constructor(private bridge: BridgeService) {}

  ngOnInit() {
    this.bridge.initIframeListener();
    this.bridge.dragData$.subscribe(data => this.activeWidget = data);
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this.activeWidget) {
      // Basic Drop logic (Adding to root)
      this.canvasData.push({
        id: Math.random().toString(36).substr(2, 9),
        type: this.activeWidget.type,
        name: this.activeWidget.label,
        content: this.activeWidget.type === 'section' ? [] : 'New Element',
        style: {}
      });
      this.activeWidget = null;
    }
  }
}