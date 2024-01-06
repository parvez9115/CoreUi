import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimDetailsUploadComponent } from './sim-details-upload.component';

describe('SimDetailsUploadComponent', () => {
  let component: SimDetailsUploadComponent;
  let fixture: ComponentFixture<SimDetailsUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimDetailsUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimDetailsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
