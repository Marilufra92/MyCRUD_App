import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioImpiegatiDialogComponent } from './dettaglio-impiegati-dialog.component';

describe('DettaglioImpiegatiDialogComponent', () => {
  let component: DettaglioImpiegatiDialogComponent;
  let fixture: ComponentFixture<DettaglioImpiegatiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DettaglioImpiegatiDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DettaglioImpiegatiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
