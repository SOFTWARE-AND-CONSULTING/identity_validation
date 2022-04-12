import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoknitionComponent } from './recoknition.component';

describe('RecoknitionComponent', () => {
  let component: RecoknitionComponent;
  let fixture: ComponentFixture<RecoknitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoknitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoknitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
