import { TestBed } from '@angular/core/testing';

import { ExerciseActivityEdit } from './exercise-activity-edit';

describe('ExerciseActivityEdit', () => {
  let service: ExerciseActivityEdit;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseActivityEdit);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
