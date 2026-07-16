import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchUp } from './match-up';

describe('MatchUp', () => {
  let component: MatchUp;
  let fixture: ComponentFixture<MatchUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchUp],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchUp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
