import { TestBed } from '@angular/core/testing';

import { SessionsApi } from './sessions-api';

describe('SessionsApi', () => {
  let service: SessionsApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionsApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
