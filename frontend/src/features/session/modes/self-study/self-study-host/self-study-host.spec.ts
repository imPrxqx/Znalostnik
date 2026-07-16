import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfStudyHost } from './self-study-host';

describe('SelfStudyHost', () => {
  let component: SelfStudyHost;
  let fixture: ComponentFixture<SelfStudyHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfStudyHost],
    }).compileComponents();

    fixture = TestBed.createComponent(SelfStudyHost);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
