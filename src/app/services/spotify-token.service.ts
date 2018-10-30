import { Injectable } from '@angular/core';
import { isNullOrUndefined, isUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class SpotifyTokenService {

  private readonly LOCAL_STORAGE_TOKEN_KEY = 'spotify_api_token';

  constructor() { }

  public getToken(): AccessToken {
    const localStorageTokenString = localStorage[this.LOCAL_STORAGE_TOKEN_KEY];
    if (isNullOrUndefined(localStorageTokenString)) {
      return null;
    }
    const accessToken = <AccessToken>JSON.parse(localStorageTokenString);
    if (accessToken.expiresAt < new Date().getTime()) {
      return null;
    }
    return accessToken;
  }

  public setToken(token: AccessToken) {
    if (isNullOrUndefined(token) ||
      isNullOrUndefined(token.token) ||
      token.token === '') {
      return;
    }
    localStorage[this.LOCAL_STORAGE_TOKEN_KEY] = JSON.stringify(token);
  }

  public hasToken(): boolean {
    return !isNullOrUndefined(this.getToken());
  }
}
