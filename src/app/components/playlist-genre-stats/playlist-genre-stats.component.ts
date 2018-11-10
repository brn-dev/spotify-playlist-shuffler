import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyDataService } from 'src/app/services/spotify-data.service';
import { PlaylistBaseObject } from 'src/app/models/spotify-models';
import { ProgressObject } from 'src/app/models/progress-object';
import { Chart } from 'chart.js';

class GenreWithCount {
  constructor(public name: string, public count: number) { }
}

@Component({
  selector: 'app-playlist-genre-stats',
  templateUrl: './playlist-genre-stats.component.html',
  styleUrls: ['./playlist-genre-stats.component.scss']
})
export class PlaylistGenreStatsComponent implements OnInit {

  public playlist: PlaylistBaseObject = null;
  public progressObj: ProgressObject = null;
  public chart: Chart;
  public genres: GenreWithCount[];

  constructor(
    private route: ActivatedRoute,
    private spotifyDataService: SpotifyDataService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async (paramMap) => {
      const playlistId = paramMap.get('id');
      this.playlist = await this.spotifyDataService.getPlaylistById(playlistId, true);
      await this.getGenres();
    });
  }

  public async getGenres() {
    this.progressObj = new ProgressObject();
    const rawGenres = await this.spotifyDataService.getGenresForPlaylist(this.playlist, this.progressObj);

    this.genres = new Array<GenreWithCount>();
    // tslint:disable-next-line:forin
    for (const genre in rawGenres) {
      this.genres.push(new GenreWithCount(genre, rawGenres[genre]));
    }
    this.genres.sort((a, b) => a.count > b.count ? -1 : 1);
    this.progressObj = null;

    const top10Genres = window.innerWidth < 800 ? this.genres.slice(0, 5) : this.genres.slice(0, 10);

    this.chart = new Chart('genresChart', {
      type: 'bar',
      data: {
        labels: top10Genres.map(genre => genre.name),
        datasets: [
          {
            label: 'occurence',
            data: top10Genres.map(genre => genre.count)
          }
        ]
      },
      options: {
        responsive: true,
        title: {
          text: 'Genres in playlist',
          display: true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

}
