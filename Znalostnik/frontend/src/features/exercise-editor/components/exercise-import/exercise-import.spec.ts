import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseImport } from './exercise-import';

describe('ExerciseImport', () => {
  let component: ExerciseImport;
  let fixture: ComponentFixture<ExerciseImport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseImport],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseImport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
