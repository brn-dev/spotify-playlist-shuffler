import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { CanActivateViaSpotifyToken } from './services/can-activate-via-spotify-token';
import { PleaseLoginComponent } from './components/please-login/please-login.component';
import { PlaylistDetailComponent } from './components/playlist-detail/playlist-detail.component';
import { PlaylistGenreStatsComponent } from './components/playlist-genre-stats/playlist-genre-stats.component';

const routes: Routes = [
  { path: '', redirectTo: '/playlists', pathMatch: 'full' },
  { path: 'playlists', component: PlaylistsComponent, canActivate: [CanActivateViaSpotifyToken]  },
  { path: 'playlist/:id', component: PlaylistDetailComponent, canActivate: [CanActivateViaSpotifyToken]  },
  { path: 'playlist-genres/:id', component: PlaylistGenreStatsComponent, canActivate: [CanActivateViaSpotifyToken]  },
  { path: 'invalid-login', component: PleaseLoginComponent  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

 }
