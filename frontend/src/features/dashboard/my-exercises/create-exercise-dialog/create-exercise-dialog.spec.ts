import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExerciseDialog } from './create-exercise-dialog';

describe('CreateExerciseDialog', () => {
  let component: CreateExerciseDialog;
  let fixture: ComponentFixture<CreateExerciseDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateExerciseDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateExerciseDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
