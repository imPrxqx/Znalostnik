import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterExerciseDialog } from './filter-exercise-dialog';

describe('FilterExerciseDialog', () => {
  let component: FilterExerciseDialog;
  let fixture: ComponentFixture<FilterExerciseDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterExerciseDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterExerciseDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
