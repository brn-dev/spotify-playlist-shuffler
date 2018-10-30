import { TestBed } from '@angular/core/testing';

import { SpotifyTokenService } from './spotify-token.service';

describe('SpotifyAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpotifyTokenService = TestBed.get(SpotifyTokenService);
    expect(service).toBeTruthy();
  });
});
