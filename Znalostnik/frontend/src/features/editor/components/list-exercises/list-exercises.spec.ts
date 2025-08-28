import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListExercises } from './list-exercises';

describe('ListExercises', () => {
  let component: ListExercises;
  let fixture: ComponentFixture<ListExercises>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListExercises],
    }).compileComponents();

    fixture = TestBed.createComponent(ListExercises);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
