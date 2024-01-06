import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimUsersComponent } from './esim-users.component';

describe('EsimUsersComponent', () => {
  let component: EsimUsersComponent;
  let fixture: ComponentFixture<EsimUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
