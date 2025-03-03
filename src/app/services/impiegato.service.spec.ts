import { TestBed } from '@angular/core/testing';

import { ImpiegatoService } from './impiegato.service';

describe('ImpiegatoService', () => {
  let service: ImpiegatoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpiegatoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
