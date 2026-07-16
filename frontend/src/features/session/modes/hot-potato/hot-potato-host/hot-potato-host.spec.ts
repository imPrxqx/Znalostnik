import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotPotatoHost } from './hot-potato-host';

describe('HotPotatoHost', () => {
  let component: HotPotatoHost;
  let fixture: ComponentFixture<HotPotatoHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotPotatoHost],
    }).compileComponents();

    fixture = TestBed.createComponent(HotPotatoHost);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
