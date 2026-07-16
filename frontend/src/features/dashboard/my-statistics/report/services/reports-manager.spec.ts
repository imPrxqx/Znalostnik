import { TestBed } from '@angular/core/testing';

import { ReportsManager } from './reports-manager';

describe('ReportsManager', () => {
  let service: ReportsManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportsManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
