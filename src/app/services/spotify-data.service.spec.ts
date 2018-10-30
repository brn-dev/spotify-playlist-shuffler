import { TestBed } from '@angular/core/testing';

import { SpotifyDataService } from './spotify-data.service';

describe('SpotifyDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpotifyDataService = TestBed.get(SpotifyDataService);
    expect(service).toBeTruthy();
  });
});
