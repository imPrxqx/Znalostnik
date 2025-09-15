import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseTaskItem } from './exercise-task-item';

describe('ExerciseTaskItem', () => {
  let component: ExerciseTaskItem;
  let fixture: ComponentFixture<ExerciseTaskItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseTaskItem],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseTaskItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
