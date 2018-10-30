import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { CanActivateViaSpotifyToken } from './services/can-activate-via-spotify-token';
import { PleaseLoginComponent } from './components/please-login/please-login.component';

const routes: Routes = [
  { path: '', redirectTo: '/playlists', pathMatch: 'full' },
  { path: 'playlists', component: PlaylistsComponent, canActivate: [CanActivateViaSpotifyToken]  },
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
