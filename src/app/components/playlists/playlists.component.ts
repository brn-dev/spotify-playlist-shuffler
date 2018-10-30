import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { headersToString } from 'selenium-webdriver/http';
import { SpotifyTokenService } from 'src/app/services/spotify-token.service';
import { ListOfCurrentUsersPlaylistsResponse, PlaylistBaseObject } from 'src/app/models/spotify-models';
import { SpotifyDataService } from 'src/app/services/spotify-data.service';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {

  constructor(public spotifyDataService: SpotifyDataService) { }

  ngOnInit() {
    this.spotifyDataService.loadPlaylists();
  }

  public async confirmShuffle(playlist: PlaylistBaseObject): Promise<void> {
    // TODO: some confirmation via a modal or something
    this.spotifyDataService.shufflePlaylist(playlist, playlist.name + ' - shuffled');
    alert('Your playlist ist now shuffled!');
  }

}
