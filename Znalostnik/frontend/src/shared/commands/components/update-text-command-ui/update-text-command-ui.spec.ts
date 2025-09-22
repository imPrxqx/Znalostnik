import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTextCommandUi } from './update-text-command-ui';

describe('UpdateTextCommandUi', () => {
  let component: UpdateTextCommandUi;
  let fixture: ComponentFixture<UpdateTextCommandUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTextCommandUi],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTextCommandUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
