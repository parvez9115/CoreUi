import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopupInvoiceComponent } from './topup-invoice.component';

describe('TopupInvoiceComponent', () => {
  let component: TopupInvoiceComponent;
  let fixture: ComponentFixture<TopupInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopupInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopupInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
