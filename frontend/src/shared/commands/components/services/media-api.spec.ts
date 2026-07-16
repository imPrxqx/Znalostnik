import { TestBed } from '@angular/core/testing';

import { MediaApi } from './media-api';

describe('MediaApi', () => {
  let service: MediaApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
