import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimAdvancePaymentComponent } from './esim-advance-payment.component';

describe('EsimAdvancePaymentComponent', () => {
  let component: EsimAdvancePaymentComponent;
  let fixture: ComponentFixture<EsimAdvancePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimAdvancePaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimAdvancePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
