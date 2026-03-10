import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseTask } from './exercise-task';

describe('ExerciseTask', () => {
  let component: ExerciseTask;
  let fixture: ComponentFixture<ExerciseTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseTask],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseTask);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
