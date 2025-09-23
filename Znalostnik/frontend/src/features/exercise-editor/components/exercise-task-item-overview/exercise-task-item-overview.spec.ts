import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseTaskItemOverview } from './exercise-task-item-overview';

describe('ExerciseTaskItemOverview', () => {
  let component: ExerciseTaskItemOverview;
  let fixture: ComponentFixture<ExerciseTaskItemOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseTaskItemOverview],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseTaskItemOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
