import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSessionDialog } from './create-session-dialog';

describe('CreateSessionDialog', () => {
  let component: CreateSessionDialog;
  let fixture: ComponentFixture<CreateSessionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSessionDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSessionDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
