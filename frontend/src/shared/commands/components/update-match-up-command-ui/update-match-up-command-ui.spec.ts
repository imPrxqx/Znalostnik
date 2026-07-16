import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMatchUpCommandUi } from './update-match-up-command-ui';

describe('UpdateMatchUpCommandUi', () => {
  let component: UpdateMatchUpCommandUi;
  let fixture: ComponentFixture<UpdateMatchUpCommandUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateMatchUpCommandUi],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateMatchUpCommandUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
