import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="node.type" [ngStyle]="node.style" class="node-wrapper">
      
      <ng-container *ngIf="isArray(node.content); else leafElement">
        <app-renderer *ngFor="let child of node.content" [node]="child"></app-renderer>
      </ng-container>

      <ng-template #leafElement>
        <div [ngSwitch]="node.type">
          <h1 *ngSwitchCase="'heading'" [ngStyle]="node.style" [innerHTML]="node.content"></h1>
          <p *ngSwitchCase="'text'" [ngStyle]="node.style" [innerHTML]="node.content"></p>
          <img *ngSwitchCase="'image'" [src]="node.attr?.src" [ngStyle]="node.style">
          <button *ngSwitchCase="'button'" [ngStyle]="node.style">{{ node.content }}</button>
          
          </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .section { width: 100%; display: block; position: relative; padding: 20px 0; }
    .row { display: flex; width: 100%; }
    .column { flex: 1; padding: 10px; }
    .node-wrapper:hover { outline: 1px dashed #3b82f6; }
  `]
})
export class RendererComponent {
  @Input() node: any;
  isArray = (val: any) => Array.isArray(val);
}