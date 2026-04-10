import { Routes } from '@angular/router';
import { CanvasComponent } from './components/canvas/canvas';
import { BuilderLayoutComponent } from './components/builder-layout/builder-layout';

export const routes: Routes = [
  // This is the main URL (e.g., http://localhost:63891/)
  { path: '', component: BuilderLayoutComponent }, 
  
  // This is the Iframe URL (e.g., http://localhost:63891/canvas)
  { path: 'canvas', component: CanvasComponent } 
];