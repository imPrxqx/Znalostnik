import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseUndo } from './exercise-undo';

describe('ExerciseUndo', () => {
  let component: ExerciseUndo;
  let fixture: ComponentFixture<ExerciseUndo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseUndo],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseUndo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
