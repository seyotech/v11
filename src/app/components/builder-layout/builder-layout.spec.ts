import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderLayout } from './builder-layout';

describe('BuilderLayout', () => {
  let component: BuilderLayout;
  let fixture: ComponentFixture<BuilderLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
