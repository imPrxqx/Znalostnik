import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChoice } from './edit-choice';

describe('EditChoice', () => {
  let component: EditChoice;
  let fixture: ComponentFixture<EditChoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditChoice],
    }).compileComponents();

    fixture = TestBed.createComponent(EditChoice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
