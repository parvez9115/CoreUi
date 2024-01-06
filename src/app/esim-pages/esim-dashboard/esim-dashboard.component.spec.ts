import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimDashboardComponent } from './esim-dashboard.component';

describe('EsimDashboardComponent', () => {
  let component: EsimDashboardComponent;
  let fixture: ComponentFixture<EsimDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
