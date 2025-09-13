import { TestBed } from '@angular/core/testing';

import { ExerciseDocumentHistoryManager } from './exercise-document-history-manager';

describe('ExerciseDocumentHistoryManager', () => {
  let service: ExerciseDocumentHistoryManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseDocumentHistoryManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
