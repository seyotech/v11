import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BridgeService {
  private dragSubject = new Subject<any>();
  dragData$ = this.dragSubject.asObservable();

  // প্যারেন্ট থেকে কল হবে
  publishDragStart(data: any) {
    const iframe = document.querySelector('iframe') as HTMLIFrameElement;
    iframe?.contentWindow?.postMessage({ type: 'DRAG_START', payload: data }, '*');
  }

  // আইফ্রেমের ভেতর কল হবে
  initIframeListener() {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'DRAG_START') {
        this.dragSubject.next(event.data.payload);
      }
    });
  }
}