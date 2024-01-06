import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimTopupRequestComponent } from './esim-topup-request.component';

describe('EsimTopupRequestComponent', () => {
  let component: EsimTopupRequestComponent;
  let fixture: ComponentFixture<EsimTopupRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimTopupRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimTopupRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
