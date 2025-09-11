import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseExport } from './exercise-export';

describe('ExerciseExport', () => {
  let component: ExerciseExport;
  let fixture: ComponentFixture<ExerciseExport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseExport],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseExport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
