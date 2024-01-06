import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimRenewalRequestComponent } from './esim-renewal-request.component';

describe('EsimRenewalRequestComponent', () => {
  let component: EsimRenewalRequestComponent;
  let fixture: ComponentFixture<EsimRenewalRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EsimRenewalRequestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EsimRenewalRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
