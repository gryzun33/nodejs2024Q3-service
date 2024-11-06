import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlbumService {
  private albums: Map<string, Album> = new Map();
  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum: Album = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    };

    this.albums.set(newAlbum.id, newAlbum);
    return newAlbum;
  }

  findAll(): Album[] {
    return Array.from(this.albums.values());
  }

  findOne(id: string): Album {
    const album = this.albums.get(id);
    if (!album) {
      throw new NotFoundException(`Album not found.`);
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = this.albums.get(id);
    if (!album) {
      throw new NotFoundException(`Album not found.`);
    }
    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;
    album.artistId = updateAlbumDto.artistId;
    return album;
  }

  remove(id: string) {
    const album = this.albums.delete(id);
    if (!album) {
      throw new NotFoundException(`Album not found.`);
    }
  }

  updateArtistIdToNull(id: string) {
    const albums = Array.from(this.albums.values()).filter(
      (album: Album) => album.artistId === id,
    );
    albums.forEach((album: Album) => {
      album.artistId = null;
      this.albums.set(album.id, album);
      console.log(`Updated album ${album.id} with artistId: null`);
    });
  }
}
