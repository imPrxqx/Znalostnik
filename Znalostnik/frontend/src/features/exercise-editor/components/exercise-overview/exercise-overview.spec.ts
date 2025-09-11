import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseOverview } from './exercise-overview';

describe('ExerciseOverview', () => {
  let component: ExerciseOverview;
  let fixture: ComponentFixture<ExerciseOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseOverview],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
