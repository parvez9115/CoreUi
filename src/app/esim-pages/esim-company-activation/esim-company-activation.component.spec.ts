import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimCompanyActivationComponent } from './esim-company-activation.component';

describe('EsimCompanyActivationComponent', () => {
  let component: EsimCompanyActivationComponent;
  let fixture: ComponentFixture<EsimCompanyActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimCompanyActivationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimCompanyActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
