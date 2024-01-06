import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimBillingPlanComponent } from './esim-billing-plan.component';

describe('EsimBillingPlanComponent', () => {
  let component: EsimBillingPlanComponent;
  let fixture: ComponentFixture<EsimBillingPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimBillingPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimBillingPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
