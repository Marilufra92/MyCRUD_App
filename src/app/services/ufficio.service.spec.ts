import { TestBed } from '@angular/core/testing';

import { UfficioService } from './ufficio.service';

describe('UfficioService', () => {
  let service: UfficioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UfficioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
