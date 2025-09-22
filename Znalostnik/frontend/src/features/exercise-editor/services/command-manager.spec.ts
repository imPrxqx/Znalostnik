import { TestBed } from '@angular/core/testing';

import { CommandManager } from './command-manager';

describe('CommandManager', () => {
  let service: CommandManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
