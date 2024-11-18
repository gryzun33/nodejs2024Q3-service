import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import { FavoritesResponse } from './entities/favorites.entity';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FavoritesService {
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
    const [favoriteArtists, favoriteAlbums, favoriteTracks] = await Promise.all(
      [
        this.prisma.favoriteArtist.findMany({
          include: {
            artist: true,
          },
        }),
        this.prisma.favoriteAlbum.findMany({
          include: {
            album: true,
          },
        }),
        this.prisma.favoriteTrack.findMany({
          include: {
            track: true,
          },
        }),
      ],
    );

    const artists = favoriteArtists
      .map((fav) => fav.artist)
      .filter((artist) => artist !== null);
    const albums = favoriteAlbums
      .map((fav) => fav.album)
      .filter((album) => album !== null);
    const tracks = favoriteTracks
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
      throw new UnprocessableEntityException(
        `Artist with id ${id} doesn't exist`,
      );
    }
    await this.prisma.favoriteArtist.create({
      data: {
        artistId: id,
      },
    });
  }

  async addAlbum(id: string): Promise<void> {
    const album = await this.albumService.findOne(id);
    if (!album) {
      throw new UnprocessableEntityException(
        `Album with id ${id} doesn't exist`,
      );
    }
    await this.prisma.favoriteAlbum.create({
      data: {
        albumId: id,
      },
    });
  }

  async addTrack(id: string): Promise<void> {
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new UnprocessableEntityException(
        `Track with id ${id} doesn't exist`,
      );
    }
    await this.prisma.favoriteTrack.create({
      data: {
        trackId: id,
      },
    });
  }

  async removeArtist(id: string): Promise<void> {
    const favoriteArtist = await this.prisma.favoriteArtist.findUnique({
      where: {
        artistId: id,
      },
    });

    if (!favoriteArtist) {
      throw new NotFoundException(`Artist with id ${id} not in favorites`);
    }

    await this.prisma.favoriteArtist.delete({
      where: {
        artistId: id,
      },
    });
  }

  async removeAlbum(id: string): Promise<void> {
    const favoriteAlbum = await this.prisma.favoriteAlbum.findUnique({
      where: {
        albumId: id,
      },
    });

    if (!favoriteAlbum) {
      throw new NotFoundException(`Album with id ${id} not in favorites`);
    }

    await this.prisma.favoriteAlbum.delete({
      where: {
        albumId: id,
      },
    });
  }

  async removeTrack(trackId: string): Promise<void> {
    const favorite = await this.prisma.favoriteTrack.findUnique({
      where: {
        trackId: trackId,
      },
    });

    if (!favorite) {
      throw new NotFoundException('Track not found in favorites');
    }

    await this.prisma.favoriteTrack.delete({
      where: {
        trackId: trackId,
      },
    });
  }
}
