import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseEdit } from './exercise-edit';

describe('ExerciseEdit', () => {
  let component: ExerciseEdit;
  let fixture: ComponentFixture<ExerciseEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
