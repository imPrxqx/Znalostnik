import { TestBed } from '@angular/core/testing';

import { ExercisesApi } from './exercises-api';

describe('ExercisesApi', () => {
  let service: ExercisesApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExercisesApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
