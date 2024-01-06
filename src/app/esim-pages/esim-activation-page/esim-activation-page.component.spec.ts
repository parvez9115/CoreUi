import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimActivationPageComponent } from './esim-activation-page.component';

describe('EsimActivationPageComponent', () => {
  let component: EsimActivationPageComponent;
  let fixture: ComponentFixture<EsimActivationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimActivationPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimActivationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
