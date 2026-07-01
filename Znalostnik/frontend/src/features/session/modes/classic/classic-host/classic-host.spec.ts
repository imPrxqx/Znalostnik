import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassicHost } from './classic-host';

describe('ClassicHost', () => {
  let component: ClassicHost;
  let fixture: ComponentFixture<ClassicHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassicHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassicHost);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
