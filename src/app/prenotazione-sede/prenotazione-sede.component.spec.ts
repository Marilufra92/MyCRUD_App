import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrenotazioneSedeComponent } from './prenotazione-sede.component';

describe('PrenotazioneSedeComponent', () => {
  let component: PrenotazioneSedeComponent;
  let fixture: ComponentFixture<PrenotazioneSedeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrenotazioneSedeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrenotazioneSedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
