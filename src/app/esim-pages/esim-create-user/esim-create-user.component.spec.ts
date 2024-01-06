import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimCreateUserComponent } from './esim-create-user.component';

describe('EsimCreateUserComponent', () => {
  let component: EsimCreateUserComponent;
  let fixture: ComponentFixture<EsimCreateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimCreateUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimCreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
