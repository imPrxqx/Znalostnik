import { TestBed } from '@angular/core/testing';

import { EditorManager } from './editor-manager';

describe('EditorManager', () => {
  let service: EditorManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditorManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
