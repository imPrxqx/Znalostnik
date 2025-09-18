import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseTaskContainer } from './exercise-task-container';

describe('ExerciseTaskContainer', () => {
  let component: ExerciseTaskContainer;
  let fixture: ComponentFixture<ExerciseTaskContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseTaskContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseTaskContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
