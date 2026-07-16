import { TestBed } from '@angular/core/testing';

import { TagsApi } from './tags-api';

describe('TagsApi', () => {
  let service: TagsApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagsApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
