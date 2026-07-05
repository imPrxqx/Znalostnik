import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTextSolutionCommandUi } from './update-text-solution-command-ui';

describe('UpdateTextSolutionCommandUi', () => {
  let component: UpdateTextSolutionCommandUi;
  let fixture: ComponentFixture<UpdateTextSolutionCommandUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTextSolutionCommandUi],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTextSolutionCommandUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
