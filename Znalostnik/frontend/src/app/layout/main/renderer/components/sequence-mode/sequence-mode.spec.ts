import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenceMode } from './sequence-mode';

describe('SequenceMode', () => {
  let component: SequenceMode;
  let fixture: ComponentFixture<SequenceMode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SequenceMode],
    }).compileComponents();

    fixture = TestBed.createComponent(SequenceMode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
