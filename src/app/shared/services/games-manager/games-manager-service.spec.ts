import { TestBed } from '@angular/core/testing';

import { GamesManagerService } from './games-manager-service';

describe('GamesManagerService', () => {
  let service: GamesManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamesManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
