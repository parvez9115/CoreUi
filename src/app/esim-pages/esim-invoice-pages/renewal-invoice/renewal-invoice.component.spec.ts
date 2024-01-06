import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalInvoiceComponent } from './renewal-invoice.component';

describe('RenewalInvoiceComponent', () => {
  let component: RenewalInvoiceComponent;
  let fixture: ComponentFixture<RenewalInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewalInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewalInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
