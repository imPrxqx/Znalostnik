import { TestBed } from '@angular/core/testing';

import { CentralEditor } from './central-editor';

describe('CentralEditor', () => {
  let service: CentralEditor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentralEditor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
