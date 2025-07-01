import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAuthentication } from './user-authentication';

describe('UserAuthentication', () => {
  let component: UserAuthentication;
  let fixture: ComponentFixture<UserAuthentication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAuthentication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAuthentication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
