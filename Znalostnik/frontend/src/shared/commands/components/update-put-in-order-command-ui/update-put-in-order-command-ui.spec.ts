import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePutInOrderCommandUi } from './update-put-in-order-command-ui';

describe('UpdatePutInOrderCommandUi', () => {
  let component: UpdatePutInOrderCommandUi;
  let fixture: ComponentFixture<UpdatePutInOrderCommandUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePutInOrderCommandUi],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePutInOrderCommandUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
