import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlaylistBaseObject, PlaylistTrackObject } from 'src/app/models/spotify-models';
import { SpotifyDataService } from 'src/app/services/spotify-data.service';
import { ProgressObject } from 'src/app/models/progress-object';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.scss']
})
export class PlaylistDetailComponent implements OnInit {

  public playlist: PlaylistBaseObject;
  public tracks: PlaylistTrackObject[];
  public actionsEnabled = true;
  public progressObj: ProgressObject = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spotifyDataService: SpotifyDataService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async (paramMap) => {
      const playlistId = paramMap.get('id');
      this.playlist = await this.spotifyDataService.getPlaylistById(playlistId, true);
      await this.fetchTracks();
    });
  }

  private async fetchTracks(): Promise<void> {
    this.tracks = (await this.spotifyDataService.getTracksOfPlaylist(this.playlist)).items;
  }

  public async copyShuffle(): Promise<void> {
    this.actionsEnabled = false;
    // TODO: let the user choose the name of the new playlist
    const destinationPlaylistName = this.playlist.name + ' - shuffled';
    this.progressObj = new ProgressObject();
    await this.spotifyDataService.copyShufflePlaylist(this.playlist, destinationPlaylistName, this.progressObj);
    this.progressObj = null;
    alert(`Your playlist has been copied to and shuffled at "${destinationPlaylistName}"`);
    this.actionsEnabled = true;
  }

  public async localShuffle():  Promise<void> {
    this.actionsEnabled = false;
    this.progressObj = new ProgressObject();
    await this.spotifyDataService.localShufflePlaylist(this.playlist, this.progressObj);
    await this.fetchTracks();
    this.progressObj = null;
    alert('Your playlist has been shuffled');
    this.actionsEnabled = true;
  }

  public async genreStatistics(): Promise<void> {
    await this.router.navigateByUrl(`playlist-genres/${this.playlist.id}`);
  }

}
