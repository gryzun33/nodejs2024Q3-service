import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { v4 as uuidv4 } from 'uuid';
// import { Track } from './entities/track.entity';
import { FavoritesService } from 'src/favorites/favorites.service';
import { PrismaService } from 'src/prisma.service';
import { Track } from '@prisma/client';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    return this.prisma.track.create({
      data: {
        name: createTrackDto.name,
        duration: createTrackDto.duration,
        albumId: createTrackDto.albumId,
        artistId: createTrackDto.artistId,
      },
    });
  }

  async findAll(): Promise<Track[]> {
    return this.prisma.track.findMany();
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    // if (!track) {
    //   throw new NotFoundException(`Track with id ${id} not found.`);
    // }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found.`);
    }

    return this.prisma.track.update({
      where: { id },
      data: {
        name: updateTrackDto.name,
        duration: updateTrackDto.duration,
        albumId: updateTrackDto.albumId,
        artistId: updateTrackDto.artistId,
      },
    });
  }

  async remove(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException('Track not found.');
    }

    await this.prisma.track.delete({
      where: { id },
    });
  }
  // updateAlbumIdToNull(albumId: string) {
  //   const tracks = Array.from(this.tracks.values()).filter(
  //     (track: Track) => track.albumId === albumId,
  //   );
  //   tracks.forEach((track: Track) => {
  //     track.albumId = null;
  //     this.tracks.set(track.id, track);
  //     // console.log(`Updated track ${track.id} with albumId: null`);
  //   });
  // }

  // updateArtistIdToNull(artistId: string) {
  //   const tracks = Array.from(this.tracks.values()).filter(
  //     (track: Track) => track.artistId === artistId,
  //   );
  //   tracks.forEach((track: Track) => {
  //     track.artistId = null;
  //     this.tracks.set(track.id, track);
  //     // console.log(`Updated track ${track.id} with artistId: null`);
  //   });
  // }
}
