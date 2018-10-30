import { Component, OnInit } from '@angular/core';
import { SpotifyDataService } from 'src/app/services/spotify-data.service';
import { Router } from '@angular/router';
import { PlaylistBaseObject } from 'src/app/models/spotify-models';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {

  constructor(
    private router: Router,
    public spotifyDataService: SpotifyDataService) { }

  ngOnInit() {
    this.spotifyDataService.loadPlaylists();
  }

  public async showDetailsOfPlaylist(playlist: PlaylistBaseObject): Promise<void> {
    this.router.navigateByUrl(`playlist/${playlist.id}`);
  }

}
