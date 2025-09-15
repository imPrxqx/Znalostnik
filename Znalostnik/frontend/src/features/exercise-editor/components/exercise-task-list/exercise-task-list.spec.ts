import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseTaskList } from './exercise-task-list';

describe('ExerciseTaskList', () => {
  let component: ExerciseTaskList;
  let fixture: ComponentFixture<ExerciseTaskList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseTaskList],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseTaskList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
