import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RekognitionFabioariasComponent } from './rekognition-fabioarias.component';

describe('RekognitionFabioariasComponent', () => {
  let component: RekognitionFabioariasComponent;
  let fixture: ComponentFixture<RekognitionFabioariasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RekognitionFabioariasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RekognitionFabioariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
