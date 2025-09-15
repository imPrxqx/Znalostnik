import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseNewTask } from './exercise-new-task';

describe('ExerciseNewTask', () => {
  let component: ExerciseNewTask;
  let fixture: ComponentFixture<ExerciseNewTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseNewTask],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseNewTask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
