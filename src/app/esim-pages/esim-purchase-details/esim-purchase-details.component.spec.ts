import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimPurchaseDetailsComponent } from './esim-purchase-details.component';

describe('EsimPurchaseDetailsComponent', () => {
  let component: EsimPurchaseDetailsComponent;
  let fixture: ComponentFixture<EsimPurchaseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimPurchaseDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimPurchaseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
