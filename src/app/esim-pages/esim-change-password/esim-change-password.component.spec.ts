import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimChangePasswordComponent } from './esim-change-password.component';

describe('EsimChangePasswordComponent', () => {
  let component: EsimChangePasswordComponent;
  let fixture: ComponentFixture<EsimChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimChangePasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
