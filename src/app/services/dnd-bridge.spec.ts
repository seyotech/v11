import { TestBed } from '@angular/core/testing';

import { DndBridge } from './dnd-bridge';

describe('DndBridge', () => {
  let service: DndBridge;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DndBridge);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
