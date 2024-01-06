import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimExtendOneyearDetailsComponent } from './esim-extend-oneyear-details.component';

describe('EsimExtendOneyearDetailsComponent', () => {
  let component: EsimExtendOneyearDetailsComponent;
  let fixture: ComponentFixture<EsimExtendOneyearDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsimExtendOneyearDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsimExtendOneyearDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
