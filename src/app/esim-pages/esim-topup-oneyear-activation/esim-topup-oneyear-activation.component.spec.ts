import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimTopupOneyearActivationComponent } from './esim-topup-oneyear-activation.component';

describe('EsimTopupOneyearActivationComponent', () => {
  let component: EsimTopupOneyearActivationComponent;
  let fixture: ComponentFixture<EsimTopupOneyearActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimTopupOneyearActivationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimTopupOneyearActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
