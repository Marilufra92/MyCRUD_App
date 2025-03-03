import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggModImpComponent } from './agg-mod-imp.component';

describe('AggModImpComponent', () => {
  let component: AggModImpComponent;
  let fixture: ComponentFixture<AggModImpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AggModImpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AggModImpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
