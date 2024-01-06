import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimCompanyCreationComponent } from './esim-company-creation.component';

describe('EsimCompanyCreationComponent', () => {
  let component: EsimCompanyCreationComponent;
  let fixture: ComponentFixture<EsimCompanyCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimCompanyCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimCompanyCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
