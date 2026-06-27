import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PutInOrder } from './put-in-order';

describe('PutInOrder', () => {
  let component: PutInOrder;
  let fixture: ComponentFixture<PutInOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PutInOrder],
    }).compileComponents();

    fixture = TestBed.createComponent(PutInOrder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
