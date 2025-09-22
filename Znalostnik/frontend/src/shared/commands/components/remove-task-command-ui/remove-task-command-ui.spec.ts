import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveTaskCommandUi } from './remove-task-command-ui';

describe('RemoveTaskCommandUi', () => {
  let component: RemoveTaskCommandUi;
  let fixture: ComponentFixture<RemoveTaskCommandUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveTaskCommandUi],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveTaskCommandUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
