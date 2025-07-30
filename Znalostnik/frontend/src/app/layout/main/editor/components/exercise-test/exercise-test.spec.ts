import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseTest } from './exercise-test';

describe('ExerciseTest', () => {
  let component: ExerciseTest;
  let fixture: ComponentFixture<ExerciseTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseTest],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
