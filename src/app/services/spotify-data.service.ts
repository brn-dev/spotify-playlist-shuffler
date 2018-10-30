import { Injectable } from '@angular/core';
import {
  ListOfCurrentUsersPlaylistsResponse, UserObjectPublic,
  PlaylistBaseObject, PlaylistTrackObject, PlaylistTracksResponse, Track
} from '../models/spotify-models';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { SpotifyTokenService } from './spotify-token.service';
import { isNullOrUndefined } from 'util';

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

  private async getPlaylistByName(playlistName: string, refetchPlaylists = false): Promise<PlaylistBaseObject> {
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

  private async getTracksOfPlaylist(playlist: PlaylistBaseObject): Promise<PlaylistTracksResponse> {
    const headers = this.getAuthHeaders();
    return await this.http
      .get<PlaylistTracksResponse>(
        `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
        { headers }).toPromise();
  }

  private async removeAllTracksFromPlaylist(playlist: PlaylistBaseObject): Promise<void> {
    const tracksResponse = await this.getTracksOfPlaylist(playlist);
    if (tracksResponse.items.length === 0) {
      return;
    }
    const tracks = tracksResponse.items.map((item) => <any>{ uri: item.track.uri });
    const body = { tracks: tracks };

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
    const headers = this.getAuthHeaders();
    const trackUris = tracks
      .filter(track => !track.track.uri.startsWith('spotify:local:'))
      .map(track => track.track.uri);
    const body = { 'uris': trackUris };
    await this.http.post(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, body, { headers }).toPromise();
  }

  private async transferTracksRandomly(
    sourcePlaylist: PlaylistBaseObject,
    destPlaylist: PlaylistBaseObject): Promise<void> {
    const tracks = await this.getTracksOfPlaylist(sourcePlaylist);
    const trackCount = tracks.items.length;
    const newTracks = new Array<PlaylistTrackObject>();
    for (let i = 0; i < trackCount; i++) {
      const randIndex = this.randIntBetween(0, tracks.items.length);
      const track = tracks.items.splice(randIndex, 1)[0];
      newTracks.push(track);
    }
    this.addTracksToPlaylist(destPlaylist, newTracks);
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

  public async shufflePlaylist(playlist: PlaylistBaseObject, destPlaylistName: string) {
    if (isNullOrUndefined(this.user)) {
      await this.loadUser();
    }
    const destPlaylist = await this.getPlaylistByName(destPlaylistName);
    if (destPlaylist !== null) {
      await this.removeAllTracksFromPlaylist(destPlaylist);
      await this.transferTracksRandomly(playlist, destPlaylist);
    } else {
      const newPlaylist = await this.createPlaylistFromName(destPlaylistName);
      await this.transferTracksRandomly(playlist, newPlaylist);
      await this.loadPlaylists();
    }
  }
}
