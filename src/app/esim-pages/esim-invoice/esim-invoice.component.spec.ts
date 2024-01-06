import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimInvoiceComponent } from './esim-invoice.component';

describe('EsimInvoiceComponent', () => {
  let component: EsimInvoiceComponent;
  let fixture: ComponentFixture<EsimInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
