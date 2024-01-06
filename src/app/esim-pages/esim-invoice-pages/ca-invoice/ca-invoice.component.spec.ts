import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaInvoiceComponent } from './ca-invoice.component';

describe('CaInvoiceComponent', () => {
  let component: CaInvoiceComponent;
  let fixture: ComponentFixture<CaInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
