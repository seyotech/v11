import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../toolbar/toolbar';

@Component({
  selector: 'app-builder-layout',
  standalone: true,
  imports: [CommonModule, ToolbarComponent],
  template: `
    <div style="display: flex; height: 100vh; overflow: hidden;">
      <div style="width: 280px; border-right: 1px solid #ddd; background: #f8f9fa; z-index: 20;">
        <app-toolbar (dragChanged)="handleDragState($any($event))"></app-toolbar>
      </div>

      <div style="flex: 1; position: relative; background: #e5e7eb;">
        <div *ngIf="isDragging" 
             style="position: absolute; inset: 0; z-index: 1000; cursor: grabbing; background: rgba(0,0,0,0.01);">
        </div>
        
        <iframe src="/canvas" 
                style="width: 100%; height: 100%; border: none; display: block;">
        </iframe>
      </div>
    </div>
  `
})
export class BuilderLayoutComponent {
  isDragging = false;

  handleDragState(state: boolean) {
    this.isDragging = state;
  }
}