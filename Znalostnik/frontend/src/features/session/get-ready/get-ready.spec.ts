import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetReady } from './get-ready';

describe('GetReady', () => {
  let component: GetReady;
  let fixture: ComponentFixture<GetReady>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetReady],
    }).compileComponents();

    fixture = TestBed.createComponent(GetReady);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
