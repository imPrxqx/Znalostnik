import { TestBed } from '@angular/core/testing';

import { ExerciseDocument } from './exercise-document';

describe('ExerciseDocument', () => {
  let service: ExerciseDocument;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseDocument);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
