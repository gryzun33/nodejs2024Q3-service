import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { v4 as uuidv4 } from 'uuid';
import { Track } from './entities/track.entity';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class TrackService {
  private tracks: Map<string, Track> = new Map();

  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  create(createTrackDto: CreateTrackDto): Track {
    const newTrack: Track = {
      id: uuidv4(),
      name: createTrackDto.name,
      duration: createTrackDto.duration,
      albumId: createTrackDto.albumId,
      artistId: createTrackDto.artistId,
    };

    this.tracks.set(newTrack.id, newTrack);
    return newTrack;
  }

  findAll(): Track[] {
    return Array.from(this.tracks.values());
  }

  findOne(id: string): Track {
    const track = this.tracks.get(id);
    if (!track) {
      throw new NotFoundException(`Track not found.`);
    }
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    const track = this.tracks.get(id);
    if (!track) {
      throw new NotFoundException(`Track not found.`);
    }
    track.name = updateTrackDto.name;
    track.duration = updateTrackDto.duration;
    track.albumId = updateTrackDto.albumId;
    track.artistId = updateTrackDto.artistId;
    return track;
  }

  remove(id: string): void {
    const result = this.tracks.delete(id);
    if (!result) {
      throw new NotFoundException('Track not found');
    }
    this.favoritesService.removeTrack(id);
  }

  updateAlbumIdToNull(albumId: string) {
    const tracks = Array.from(this.tracks.values()).filter(
      (track: Track) => track.albumId === albumId,
    );
    tracks.forEach((track: Track) => {
      track.albumId = null;
      this.tracks.set(track.id, track);
      // console.log(`Updated track ${track.id} with albumId: null`);
    });
  }

  updateArtistIdToNull(artistId: string) {
    const tracks = Array.from(this.tracks.values()).filter(
      (track: Track) => track.artistId === artistId,
    );
    tracks.forEach((track: Track) => {
      track.artistId = null;
      this.tracks.set(track.id, track);
      // console.log(`Updated track ${track.id} with artistId: null`);
    });
  }
}
