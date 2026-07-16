import { TestBed } from '@angular/core/testing';

import { ExercisesManager } from './exercises-manager';

describe('ExercisesManager', () => {
  let service: ExercisesManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExercisesManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
