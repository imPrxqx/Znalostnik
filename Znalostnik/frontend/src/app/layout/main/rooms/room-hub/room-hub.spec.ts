import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomHub } from './room-hub';

describe('RoomHub', () => {
  let component: RoomHub;
  let fixture: ComponentFixture<RoomHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomHub]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomHub);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
