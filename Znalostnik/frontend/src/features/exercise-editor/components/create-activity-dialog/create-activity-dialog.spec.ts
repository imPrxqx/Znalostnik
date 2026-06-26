import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateActivityDialog } from './create-activity-dialog';

describe('CreateActivityDialog', () => {
  let component: CreateActivityDialog;
  let fixture: ComponentFixture<CreateActivityDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateActivityDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateActivityDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
