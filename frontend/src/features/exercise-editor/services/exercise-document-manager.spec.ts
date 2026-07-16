import { TestBed } from '@angular/core/testing';

import { ExerciseDocumentManager } from './exercise-document-manager';

describe('ExerciseDocumentManager', () => {
  let service: ExerciseDocumentManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseDocumentManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
