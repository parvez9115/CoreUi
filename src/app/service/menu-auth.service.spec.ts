import { TestBed } from '@angular/core/testing';

import { MenuAuthService } from './menu-auth.service';

describe('MenuAuthService', () => {
  let service: MenuAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
