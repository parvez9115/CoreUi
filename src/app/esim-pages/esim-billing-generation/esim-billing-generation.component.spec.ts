import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimBillingGenerationComponent } from './esim-billing-generation.component';

describe('EsimBillingGenerationComponent', () => {
  let component: EsimBillingGenerationComponent;
  let fixture: ComponentFixture<EsimBillingGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimBillingGenerationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimBillingGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
