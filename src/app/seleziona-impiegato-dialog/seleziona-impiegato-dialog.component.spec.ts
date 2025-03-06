import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelezionaImpiegatoDialogComponent } from './seleziona-impiegato-dialog.component';

describe('SelezionaImpiegatoDialogComponent', () => {
  let component: SelezionaImpiegatoDialogComponent;
  let fixture: ComponentFixture<SelezionaImpiegatoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelezionaImpiegatoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelezionaImpiegatoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
