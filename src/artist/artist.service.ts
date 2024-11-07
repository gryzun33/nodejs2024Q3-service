import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuidv4 } from 'uuid';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class ArtistService {
  private artists: Map<string, Artist> = new Map();

  constructor(
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}
  create(createArtistDto: CreateArtistDto): Artist {
    const newArtist: Artist = {
      id: uuidv4(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };

    this.artists.set(newArtist.id, newArtist);
    return newArtist;
  }

  findAll(): Artist[] {
    return Array.from(this.artists.values());
  }

  findOne(id: string): Artist {
    const artist = this.artists.get(id);
    if (!artist) {
      throw new NotFoundException(`Artist not found.`);
    }
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.artists.get(id);
    if (!artist) {
      throw new NotFoundException(`Artist not found.`);
    }
    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;
    return artist;
  }

  remove(id: string): void {
    const result = this.artists.delete(id);
    if (!result) {
      throw new NotFoundException('Artist not found');
    }
    this.albumService.updateArtistIdToNull(id);
    this.trackService.updateArtistIdToNull(id);
    this.favoritesService.removeArtist(id);
  }
}
