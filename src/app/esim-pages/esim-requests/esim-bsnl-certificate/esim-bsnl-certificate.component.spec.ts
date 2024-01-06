import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimBsnlCertificateComponent } from './esim-bsnl-certificate.component';

describe('EsimBsnlCertificateComponent', () => {
  let component: EsimBsnlCertificateComponent;
  let fixture: ComponentFixture<EsimBsnlCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimBsnlCertificateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimBsnlCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
