import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseRedo } from './exercise-redo';

describe('ExerciseRedo', () => {
  let component: ExerciseRedo;
  let fixture: ComponentFixture<ExerciseRedo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseRedo],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseRedo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
