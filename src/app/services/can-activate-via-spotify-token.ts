import { CanActivate, Router } from '@angular/router';
import { SpotifyTokenService } from './spotify-token.service';
import { SpotifyAuthService } from './spotify-auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CanActivateViaSpotifyToken implements CanActivate {

    constructor(
        private spotifyTokenService: SpotifyTokenService,
        private spotifyAuthService: SpotifyAuthService,
        private router: Router) { }

    canActivate(): boolean {
        if (this.spotifyTokenService.hasToken()) {
            return true;
        }
        this.spotifyAuthService.login();
        this.router.navigateByUrl('invalid-login');
        return false;
    }
}
