import { TestBed } from '@angular/core/testing';

import { ExerciseHistory } from './exercise-history';

describe('ExerciseHistory', () => {
  let service: ExerciseHistory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseHistory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
