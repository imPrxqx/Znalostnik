import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStatistics } from './my-statistics';

describe('MyStatistics', () => {
  let component: MyStatistics;
  let fixture: ComponentFixture<MyStatistics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyStatistics],
    }).compileComponents();

    fixture = TestBed.createComponent(MyStatistics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
