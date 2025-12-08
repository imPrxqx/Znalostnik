import { TestBed } from '@angular/core/testing';

import { Preference } from './preference';

describe('Preference', () => {
  let service: Preference;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Preference);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
