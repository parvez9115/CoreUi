import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimExtendValidityRequestComponent } from './esim-extend-validity-request.component';

describe('EsimExtendValidityRequestComponent', () => {
  let component: EsimExtendValidityRequestComponent;
  let fixture: ComponentFixture<EsimExtendValidityRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimExtendValidityRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimExtendValidityRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
