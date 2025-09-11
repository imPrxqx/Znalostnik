import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinRoomForm } from './join-room-form';

describe('JoinRoomForm', () => {
  let component: JoinRoomForm;
  let fixture: ComponentFixture<JoinRoomForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinRoomForm],
    }).compileComponents();

    fixture = TestBed.createComponent(JoinRoomForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
