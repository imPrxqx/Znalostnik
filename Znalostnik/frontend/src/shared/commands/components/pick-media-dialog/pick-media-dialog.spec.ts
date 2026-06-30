import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickMediaDialog } from './pick-media-dialog';

describe('PickMediaDialog', () => {
  let component: PickMediaDialog;
  let fixture: ComponentFixture<PickMediaDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickMediaDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(PickMediaDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
