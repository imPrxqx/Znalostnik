import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseToolbar } from './exercise-toolbar';

describe('ExerciseToolbar', () => {
  let component: ExerciseToolbar;
  let fixture: ComponentFixture<ExerciseToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseToolbar],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
