import { TestBed } from '@angular/core/testing';

import { RekognitionGuard } from './rekognition.guard';

describe('RekognitionGuard', () => {
  let guard: RekognitionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RekognitionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
