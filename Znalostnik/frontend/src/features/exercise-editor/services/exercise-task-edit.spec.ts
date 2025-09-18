import { TestBed } from '@angular/core/testing';

import { ExerciseTaskEdit } from './exercise-task-edit';

describe('ExerciseTaskEdit', () => {
  let service: ExerciseTaskEdit;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseTaskEdit);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
