import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMultiChoiceCommandUi } from './update-multi-choice-command-ui';

describe('UpdateMultiChoiceCommandUi', () => {
  let component: UpdateMultiChoiceCommandUi;
  let fixture: ComponentFixture<UpdateMultiChoiceCommandUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateMultiChoiceCommandUi],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateMultiChoiceCommandUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
