import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaUfficiComponent } from './lista-uffici.component';

describe('ListaUfficiComponent', () => {
  let component: ListaUfficiComponent;
  let fixture: ComponentFixture<ListaUfficiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaUfficiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaUfficiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
