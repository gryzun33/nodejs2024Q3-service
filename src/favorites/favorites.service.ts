import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import { FavoritesResponse } from './entities/favorites.entity';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FavoritesService {
  public favArtists: Set<string> = new Set();
  public favAlbums: Set<string> = new Set();
  public favTracks: Set<string> = new Set();

  // constructor(
  // @Inject(forwardRef(() => ArtistService))
  // private readonly artistService: ArtistService,
  // @Inject(forwardRef(() => AlbumService))
  // private readonly albumService: AlbumService,
  // @Inject(forwardRef(() => TrackService))
  // private readonly trackService: TrackService,

  // ) {}

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  async getFavorites(): Promise<FavoritesResponse> {
    const favorites = await this.prisma.favorites.findMany({
      include: {
        artist: true,
        album: true,
        track: true,
      },
    });

    const artists = favorites
      .map((fav) => fav.artist)
      .filter((artist) => artist !== null);
    const albums = favorites
      .map((fav) => fav.album)
      .filter((album) => album !== null);
    const tracks = favorites
      .map((fav) => fav.track)
      .filter((track) => track !== null);

    return {
      artists,
      albums,
      tracks,
    };
  }

  async addArtist(id: string): Promise<void> {
    const artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new HttpException(
        `Artist with id ${id} doesn't exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await this.prisma.favorites.create({
      data: {
        artistId: id,
      },
    });
  }

  async addAlbum(id: string): Promise<void> {
    const album = await this.albumService.findOne(id);
    if (!album) {
      throw new HttpException(
        `Album with id ${id} doesn't exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await this.prisma.favorites.create({
      data: {
        albumId: id,
      },
    });
  }

  async addTrack(id: string): Promise<void> {
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new HttpException(
        `Track with id ${id} doesn't exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await this.prisma.favorites.create({
      data: {
        trackId: id,
      },
    });
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

  async removeTrack(trackId: string): Promise<void> {
    const favorite = await this.prisma.favorites.findUnique({
      where: {
        trackId: trackId,
      },
    });

    if (!favorite) {
      throw new NotFoundException('Track not found in favorites');
    }

    await this.prisma.favorites.delete({
      where: {
        trackId: trackId,
      },
    });
  }
}
