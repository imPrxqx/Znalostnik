import { TestBed } from '@angular/core/testing';

import { CommandHistory } from './command-history';

describe('CommandHistory', () => {
  let service: CommandHistory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandHistory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
