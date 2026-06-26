import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseActivity } from './exercise-activity';

describe('ExerciseActivity', () => {
  let component: ExerciseActivity;
  let fixture: ComponentFixture<ExerciseActivity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseActivity],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseActivity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
