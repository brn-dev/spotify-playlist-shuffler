import { Injectable } from '@angular/core';
import {
  ListOfCurrentUsersPlaylistsResponse, UserObjectPublic,
  PlaylistBaseObject, PlaylistTrackObject, PlaylistTracksResponse, Track
} from '../models/spotify-models';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { SpotifyTokenService } from './spotify-token.service';
import { isNullOrUndefined } from 'util';
import { ProgressObject } from '../models/progress-object';


export interface StringNumberDict {
  [key: string]: number;
}

@Injectable({
  providedIn: 'root'
})
export class SpotifyDataService {

  public playlists: ListOfCurrentUsersPlaylistsResponse;
  public user: UserObjectPublic;

  constructor(
    private http: HttpClient,
    private spotifyTokenService: SpotifyTokenService
  ) {
    this.playlists = <ListOfCurrentUsersPlaylistsResponse>{ items: [] };
    this.user = null;
  }

  private getAuthHeaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization',
        `Bearer  ${this.spotifyTokenService.getToken().token}`)
      .set('Content-Type',
        'application/json');
    return headers;
  }

  private async removeTracksFromPlaylist(playlist: PlaylistBaseObject, tracks: PlaylistTrackObject[]): Promise<void> {
    if (tracks.length === 0) {
      return;
    }
    const trackUris = tracks.map((item) => <any>{ uri: item.track.uri });
    const body = { tracks: trackUris };

    const headers = this.getAuthHeaders();
    const request = new HttpRequest('DELETE', `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, body, { headers });
    await this.http.request(request).toPromise();
  }

  private async createPlaylistFromName(name: string): Promise<PlaylistBaseObject> {
    const headers = this.getAuthHeaders();
    return this.http
      .post<PlaylistBaseObject>
      (`https://api.spotify.com/v1/users/${this.user.id}/playlists`, { name, 'public': false }, { headers })
      .toPromise();
  }

  private randIntBetween(start: number, endExcl: number) {
    return Math.floor(Math.random() * endExcl) + start;
  }

  private async addTracksToPlaylist(
    playlist: PlaylistBaseObject,
    tracks: PlaylistTrackObject[]): Promise<void> {
    if (tracks.length === 0) {
      return;
    }
    const headers = this.getAuthHeaders();
    const trackUris = tracks
      .filter(track => !track.track.uri.startsWith('spotify:local:'))
      .map(track => track.track.uri);
    const body = { 'uris': trackUris };
    await this.http.post(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, body, { headers }).toPromise();
  }

  private doesArrayContainTrack(searchTrack: PlaylistTrackObject, arr: PlaylistTrackObject[]): boolean {
    for (const track of arr) {
      if (track.track.id === searchTrack.track.id) {
        return true;
      }
    }
    return false;
  }

  private async transferTracks(
    sourcePlaylist: PlaylistBaseObject,
    destPlaylist: PlaylistBaseObject): Promise<void> {
    const sourceTracks = (await this.getTracksOfPlaylist(sourcePlaylist)).items;
    const destTracks = (await this.getTracksOfPlaylist(destPlaylist)).items;
    const tracksToAdd = new Array<PlaylistTrackObject>();
    const tracksToRemove = new Array<PlaylistTrackObject>();
    for (const track of sourceTracks) {
      if (!this.doesArrayContainTrack(track, destTracks)) {
        tracksToAdd.push(track);
      }
    }
    for (const track of destTracks) {
      if (!this.doesArrayContainTrack(track, sourceTracks)) {
        tracksToRemove.push(track);
      }
    }
    await this.removeTracksFromPlaylist(destPlaylist, tracksToRemove);
    await this.addTracksToPlaylist(destPlaylist, tracksToAdd);
  }

  public async getPlaylistByName(playlistName: string, refetchPlaylists = false): Promise<PlaylistBaseObject> {
    if (refetchPlaylists) {
      await this.loadPlaylists();
    }
    for (const playlist of this.playlists.items) {
      if (playlist.name === playlistName) {
        return playlist;
      }
    }
    return null;
  }

  public async getPlaylistById(playlistId: string, refetchPlaylists = false): Promise<PlaylistBaseObject> {
    if (refetchPlaylists) {
      await this.loadPlaylists();
    }
    for (const playlist of this.playlists.items) {
      if (playlist.id === playlistId) {
        return playlist;
      }
    }
    return null;
  }

  private async moveTracks(
    playlist: PlaylistBaseObject,
    rangeStart: number,
    rangeLength: number,
    insertBefore: number): Promise<void> {
    const url = `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`;
    const body = {
      range_start: rangeStart,
      range_length: rangeLength,
      insert_before: insertBefore
    };
    const headers = this.getAuthHeaders();
    await this.http.put(url, body, { headers }).toPromise();
  }

  public async getTracksOfPlaylist(playlist: PlaylistBaseObject): Promise<PlaylistTracksResponse> {
    const headers = this.getAuthHeaders();
    return await this.http
      .get<PlaylistTracksResponse>(
        `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
        { headers }).toPromise();
  }

  public async loadPlaylists(): Promise<ListOfCurrentUsersPlaylistsResponse> {
    const headers = this.getAuthHeaders();
    this.playlists = await this.http.get<ListOfCurrentUsersPlaylistsResponse>
      ('https://api.spotify.com/v1/me/playlists', { headers }).toPromise();
    return this.playlists;
  }

  public async loadUser(): Promise<UserObjectPublic> {
    const headers = this.getAuthHeaders();
    this.user = await this.http.get<UserObjectPublic>
      ('https://api.spotify.com/v1/me', { headers }).toPromise();
    return this.user;
  }

  public async copyShufflePlaylist(
    playlist: PlaylistBaseObject,
    destPlaylistName: string,
    progressObj: ProgressObject = new ProgressObject()) {
    if (isNullOrUndefined(this.user)) {
      await this.loadUser();
    }
    let destPlaylist = await this.getPlaylistByName(destPlaylistName);
    if (destPlaylist === null) {
      destPlaylist = await this.createPlaylistFromName(destPlaylistName);
      await this.loadPlaylists();
    }
    await this.transferTracks(playlist, destPlaylist);
    await this.localShufflePlaylist(destPlaylist, progressObj);
  }

  // Fisher-Yates shuffle: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
  public async localShufflePlaylist(playlist: PlaylistBaseObject, progressObj: ProgressObject = new ProgressObject()) {
    const trackCount = (await this.getTracksOfPlaylist(playlist)).items.length;
    progressObj.start = 0;
    progressObj.end = trackCount - 1;
    progressObj.value = 0;
    for (let i = trackCount - 1; i >= 1; i--) {
      const j = this.randIntBetween(0, i + 1);
      if (i !== j) {
        await this.moveTracks(playlist, i, 1, j);
        await this.moveTracks(playlist, j + 1, 1, i);
      }
      progressObj.value++;
    }
  }

  private addOrIncrement(dict: StringNumberDict, key: string) {
    if (dict[key]) {
      dict[key]++;
    } else {
      dict[key] = 1;
    }
  }

  public async getGenresForPlaylist(
    playlist: PlaylistBaseObject,
    progressObj: ProgressObject = new ProgressObject()): Promise<StringNumberDict> {
    const tracks = (await this.getTracksOfPlaylist(playlist)).items.map(track => track.track);
    const genres = <StringNumberDict>{};

    progressObj.start = 0;
    progressObj.value = 0;
    progressObj.end = tracks.length;

    for (const track of tracks) {
      try {
        const response = await this.http.get<any>(
          `http://ws.audioscrobbler.com/2.0/`
          + `?method=track.getinfo`
          + `&api_key=54512842402670dd3d3b50d9057fdfea`
          + `&artist=${track.artists[0].name}`
          + `&track=${track.name}`
          + `&format=json`).toPromise();
        if (response.track.toptags.tag.length > 0) {
          for (const genre of response.track.toptags.tag) {
            this.addOrIncrement(genres, genre.name);
          }
        } else {
          this.addOrIncrement(genres, 'Unknown');
        }
      } catch (err) {
        this.addOrIncrement(genres, 'Unknown');
      }
      progressObj.value++;
    }

    return genres;
  }


}
