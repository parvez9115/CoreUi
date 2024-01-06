import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimAccountMappingComponent } from './esim-account-mapping.component';

describe('EsimAccountMappingComponent', () => {
  let component: EsimAccountMappingComponent;
  let fixture: ComponentFixture<EsimAccountMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimAccountMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimAccountMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
