export interface PagingObject<T> {
    href: string;
    items: T[];
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
}

export interface ExternalUrlObject {
    spotify: string;
}

export interface ImageObject {
    height?: number;
    url: string;
    width?: number;
}

export interface FollowersObject {
    href: string;
    total: number;
}

export interface UserObjectPublic {
    display_name?: string;
    external_urls: ExternalUrlObject;
    followers?: FollowersObject;
    href: string;
    id: string;
    images?: ImageObject[];
    type: 'user';
    uri: string;
}

export interface PlaylistBaseObject {
    collaborative: boolean;
    external_urls: ExternalUrlObject;
    href: string;
    id: string;
    images: ImageObject[];
    name: string;
    owner: UserObjectPublic;
    public: boolean;
    snapshot_id: string;
    type: 'playlist';
    uri: string;
}

export interface ListOfCurrentUsersPlaylistsResponse
    extends PagingObject<PlaylistBaseObject> { }

export interface UserObjectPublic {
    display_name?: string;
    external_urls: ExternalUrlObject;
    followers?: FollowersObject;
    href: string;
    id: string;
    images?: ImageObject[];
    type: 'user';
    uri: string;
}

export interface Track {
    id: string;
    uri: string;
}

export interface PlaylistTrackObject {
    track: Track;
}

export interface PlaylistTracksResponse extends PagingObject<PlaylistTrackObject> { }
