import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTagDialog } from './manage-tag-dialog';

describe('ManageTagDialog', () => {
  let component: ManageTagDialog;
  let fixture: ComponentFixture<ManageTagDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTagDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageTagDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
