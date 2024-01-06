import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimTopupDetailsComponent } from './esim-topup-details.component';

describe('EsimTopupDetailsComponent', () => {
  let component: EsimTopupDetailsComponent;
  let fixture: ComponentFixture<EsimTopupDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimTopupDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimTopupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
