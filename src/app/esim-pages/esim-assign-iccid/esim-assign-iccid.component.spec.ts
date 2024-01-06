import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimAssignICCIDComponent } from './esim-assign-iccid.component';

describe('EsimAssignICCIDComponent', () => {
  let component: EsimAssignICCIDComponent;
  let fixture: ComponentFixture<EsimAssignICCIDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimAssignICCIDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimAssignICCIDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
