import { TestBed } from '@angular/core/testing';

import { DocumentOkGuard } from './document-ok.guard';

describe('DocumentOkGuard', () => {
  let guard: DocumentOkGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DocumentOkGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
