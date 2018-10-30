import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './components/app/app.component';
import { AppRoutingModule } from './app-routing.module';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { SpotifyTokenService } from './services/spotify-token.service';
import { CanActivateViaSpotifyToken } from './services/can-activate-via-spotify-token';
import { SpotifyAuthService } from './services/spotify-auth.service';
import { PleaseLoginComponent } from './components/please-login/please-login.component';
import { SpotifyDataService } from './services/spotify-data.service';
import { PlaylistDetailComponent } from './components/playlist-detail/playlist-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    PlaylistsComponent,
    PleaseLoginComponent,
    PlaylistDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    SpotifyAuthService,
    SpotifyTokenService,
    CanActivateViaSpotifyToken,
    SpotifyDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
