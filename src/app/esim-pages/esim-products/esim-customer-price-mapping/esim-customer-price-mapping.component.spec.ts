import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimCustomerPriceMappingComponent } from './esim-customer-price-mapping.component';

describe('EsimCustomerPriceMappingComponent', () => {
  let component: EsimCustomerPriceMappingComponent;
  let fixture: ComponentFixture<EsimCustomerPriceMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimCustomerPriceMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimCustomerPriceMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
