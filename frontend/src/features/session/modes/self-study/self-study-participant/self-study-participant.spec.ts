import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfStudyParticipant } from './self-study-participant';

describe('SelfStudyParticipant', () => {
  let component: SelfStudyParticipant;
  let fixture: ComponentFixture<SelfStudyParticipant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfStudyParticipant],
    }).compileComponents();

    fixture = TestBed.createComponent(SelfStudyParticipant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
