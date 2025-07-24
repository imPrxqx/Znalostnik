import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleChoiceBlock } from './multiple-choice-block';

describe('MultipleChoiceBlock', () => {
  let component: MultipleChoiceBlock;
  let fixture: ComponentFixture<MultipleChoiceBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleChoiceBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleChoiceBlock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
