import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaImpiegatiComponent } from './lista-impiegati.component';

describe('ListaImpiegatiComponent', () => {
  let component: ListaImpiegatiComponent;
  let fixture: ComponentFixture<ListaImpiegatiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaImpiegatiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaImpiegatiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
