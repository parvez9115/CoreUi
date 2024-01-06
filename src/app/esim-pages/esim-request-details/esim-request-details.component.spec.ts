import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimRequestDetailsComponent } from './esim-request-details.component';

describe('EsimRequestDetailsComponent', () => {
  let component: EsimRequestDetailsComponent;
  let fixture: ComponentFixture<EsimRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimRequestDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
