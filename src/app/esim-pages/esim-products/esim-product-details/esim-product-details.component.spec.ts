import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimProductDetailsComponent } from './esim-product-details.component';

describe('EsimProductDetailsComponent', () => {
  let component: EsimProductDetailsComponent;
  let fixture: ComponentFixture<EsimProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimProductDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
