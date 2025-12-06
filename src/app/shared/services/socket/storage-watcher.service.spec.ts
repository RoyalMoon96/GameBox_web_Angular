import { TestBed } from '@angular/core/testing';

import { StorageWatcherService } from './storage-watcher.service';

describe('StorageWatcherService', () => {
  let service: StorageWatcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageWatcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
