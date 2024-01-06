import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BsnlInvoiceComponent } from './bsnl-invoice.component';

describe('BsnlInvoiceComponent', () => {
  let component: BsnlInvoiceComponent;
  let fixture: ComponentFixture<BsnlInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BsnlInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BsnlInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
