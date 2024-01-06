import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimCaRequestComponent } from './esim-ca-request.component';

describe('EsimCaRequestComponent', () => {
  let component: EsimCaRequestComponent;
  let fixture: ComponentFixture<EsimCaRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimCaRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimCaRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
