import { TestBed } from '@angular/core/testing';

import { ResponseManager } from './response-manager';

describe('ResponseManager', () => {
  let service: ResponseManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponseManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
