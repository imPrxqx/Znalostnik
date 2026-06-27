import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Guess } from './guess';

describe('Guess', () => {
  let component: Guess;
  let fixture: ComponentFixture<Guess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Guess],
    }).compileComponents();

    fixture = TestBed.createComponent(Guess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
