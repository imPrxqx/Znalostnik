import { TestBed } from '@angular/core/testing';

import { SessionsManager } from './sessions-manager';

describe('SessionsManager', () => {
  let service: SessionsManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionsManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
