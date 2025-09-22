import { TestBed } from '@angular/core/testing';

import { ToolbarManager } from './toolbar-manager';

describe('ToolbarManager', () => {
  let service: ToolbarManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToolbarManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
