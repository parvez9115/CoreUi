import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderViewComponent } from './sales-order-view.component';

describe('SalesOrderViewComponent', () => {
  let component: SalesOrderViewComponent;
  let fixture: ComponentFixture<SalesOrderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesOrderViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
