import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Albums')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new album' })
  @ApiResponse({
    status: 201,
    description: 'The album has been successfully created.',
    type: Album,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid input data.',
  })
  async create(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all albums' })
  @ApiResponse({
    status: 200,
    description: 'List of all albums',
    type: [Album],
  })
  async findAll(): Promise<Album[]> {
    return this.albumService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single album by ID' })
  @ApiResponse({
    status: 200,
    description: 'The album was successfully retrieved.',
    type: Album,
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format.' })
  @ApiResponse({
    status: 404,
    description: 'Album not found.',
  })
  async indOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Album> {
    const album = this.albumService.findOne(id);
    if (!album) {
      throw new NotFoundException(`Album not found.`);
    }
    return album;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update album details' })
  @ApiResponse({
    status: 200,
    description: 'The album has been successfully updated.',
    type: Album,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid input data.',
  })
  @ApiResponse({
    status: 404,
    description: 'Album not found.',
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an album' })
  @ApiResponse({
    status: 204,
    description: 'The album has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format.' })
  @ApiResponse({
    status: 404,
    description: 'Album not found.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.albumService.remove(id);
  }
}
