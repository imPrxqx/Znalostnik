import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrueFalseBlock } from './true-false-block';

describe('TrueFalseBlock', () => {
  let component: TrueFalseBlock;
  let fixture: ComponentFixture<TrueFalseBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrueFalseBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(TrueFalseBlock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
