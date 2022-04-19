import { TestBed } from '@angular/core/testing';

import { RekognitionFabioariasService } from './rekognition-fabioarias.service';

describe('RekognitionFabioariasService', () => {
  let service: RekognitionFabioariasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RekognitionFabioariasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
