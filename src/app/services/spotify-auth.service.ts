import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyTokenService } from './spotify-token.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyAuthService {

  constructor(
    private router: Router,
    private spotifyTokenService: SpotifyTokenService) {

  }

  private CLIENT_ID = 'c7d128c546bb4d1884fd460e0245a9c8';
  private REDIRECT_URI = 'C:/Users/Brn/GitHub/spotify-playlist-shuffler/src/callback.html';
  private SCOPES = [
    'user-read-private',
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
  ];

  private getLoginURL(): string {
    return 'https://accounts.spotify.com/authorize?client_id=' + this.CLIENT_ID
      + '&redirect_uri=' + encodeURIComponent(this.REDIRECT_URI)
      + '&scope=' + encodeURIComponent(this.SCOPES.join(' '))
      + '&response_type=token';
  }

  public login(): void {
    const url = this.getLoginURL();
    const width = 450,
      height = 730,
      left = (screen.width / 2) - (width / 2),
      top = (screen.height / 2) - (height / 2);

    const w = window.open(url,
      'Spotify',
      'menubar=no,location=no,resizable=no,scrollbars=no,status=no'
      + ', width=' + width
      + ', height=' + height
      + ', top=' + top
      + ', left=' + left
    );

    const timer = setInterval(() => {
      if (w.closed) {
        clearInterval(timer);
        if (this.spotifyTokenService.hasToken()) {
          this.router.navigateByUrl('');
        }
      }
    }, 250);
  }

}
