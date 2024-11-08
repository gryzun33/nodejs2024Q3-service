import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { Album } from 'src/album/entities/album.entity';
import { ArtistService } from 'src/artist/artist.service';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
import { TrackService } from 'src/track/track.service';
import { FavoritesResponse } from './entities/favorites.entity';

@Injectable()
export class FavoritesService {
  private favArtists: Set<string> = new Set();
  private favAlbums: Set<string> = new Set();
  private favTracks: Set<string> = new Set();

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  getFavorites(): FavoritesResponse {
    const artists = Array.from(this.favArtists).map((id) =>
      this.artistService.findOne(id),
    );
    const albums = Array.from(this.favAlbums).map((id) =>
      this.albumService.findOne(id),
    );
    const tracks = Array.from(this.favTracks).map((id) =>
      this.trackService.findOne(id),
    );

    return { artists, albums, tracks };
  }

  addArtist(id: string): void {
    const artist = this.artistService.findOne(id);
    if (!artist) {
      throw new HttpException(
        `Artist with id ${id} doesn't exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    this.favArtists.add(id);
  }

  addAlbum(id: string): void {
    const album = this.albumService.findOne(id);
    if (!album) {
      throw new HttpException(
        `Album with id ${id} doesn't exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    this.favAlbums.add(id);
  }

  addTrack(id: string): void {
    const track = this.trackService.findOne(id);
    if (!track) {
      throw new HttpException(
        `Track with id ${id} doesn't exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    this.favTracks.add(id);
  }

  removeArtist(id: string): void {
    if (!this.favArtists.has(id)) {
      throw new NotFoundException(`Artist with id ${id} not in favorites`);
    }
    this.favArtists.delete(id);
  }

  removeAlbum(id: string): void {
    if (!this.favAlbums.has(id)) {
      throw new NotFoundException(`Album with id ${id} not in favorites`);
    }
    this.favAlbums.delete(id);
  }

  removeTrack(id: string): void {
    if (!this.favTracks.has(id)) {
      throw new NotFoundException(`Track with id ${id} not in favorites`);
    }
    this.favTracks.delete(id);
  }
}
