import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotPotatoParticipant } from './hot-potato-participant';

describe('HotPotatoParticipant', () => {
  let component: HotPotatoParticipant;
  let fixture: ComponentFixture<HotPotatoParticipant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotPotatoParticipant],
    }).compileComponents();

    fixture = TestBed.createComponent(HotPotatoParticipant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
