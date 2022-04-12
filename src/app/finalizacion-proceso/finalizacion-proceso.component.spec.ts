import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizacionProcesoComponent } from './finalizacion-proceso.component';

describe('FinalizacionProcesoComponent', () => {
  let component: FinalizacionProcesoComponent;
  let fixture: ComponentFixture<FinalizacionProcesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalizacionProcesoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalizacionProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
