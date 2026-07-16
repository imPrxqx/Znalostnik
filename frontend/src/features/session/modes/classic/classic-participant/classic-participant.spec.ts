import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassicParticipant } from './classic-participant';

describe('ClassicParticipant', () => {
  let component: ClassicParticipant;
  let fixture: ComponentFixture<ClassicParticipant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassicParticipant],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassicParticipant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
