import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordEmailSent } from './forgot-password-email-sent';

describe('ForgotPasswordEmailSent', () => {
  let component: ForgotPasswordEmailSent;
  let fixture: ComponentFixture<ForgotPasswordEmailSent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordEmailSent],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordEmailSent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
