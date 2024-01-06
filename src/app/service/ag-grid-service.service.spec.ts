import { TestBed } from '@angular/core/testing';

import { AgGridService } from './ag-grid-service.service';

describe('AgGridServiceService', () => {
  let service: AgGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
