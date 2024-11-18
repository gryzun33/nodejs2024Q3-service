import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.prisma.album.create({
      data: {
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artistId: createAlbumDto.artistId,
      },
    });
  }

  async findAll(): Promise<Album[]> {
    return this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found.`);
    }

    return this.prisma.album.update({
      where: { id },
      data: {
        name: updateAlbumDto.name,
        year: updateAlbumDto.year,
        artistId: updateAlbumDto.artistId,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found.`);
    }

    await this.prisma.album.delete({
      where: { id },
    });
  }
}
