import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinTeamDialog } from './join-team-dialog';

describe('JoinTeamDialog', () => {
  let component: JoinTeamDialog;
  let fixture: ComponentFixture<JoinTeamDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinTeamDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(JoinTeamDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
