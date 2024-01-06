import { TestBed } from '@angular/core/testing';

import { GridPaginationService } from './grid-pagination.service';

describe('GridPaginationService', () => {
  let service: GridPaginationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridPaginationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
