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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Artist } from './entities/artist.entity';

@ApiTags('Artists')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @ApiOperation({ summary: 'Create new artist' })
  @ApiResponse({
    status: 201,
    description: 'The artist has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid input.' })
  create(@Body() createArtistDto: CreateArtistDto): Artist {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all artists' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation.',
    type: [Artist],
  })
  findAll(): Artist[] {
    return this.artistService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single artist by id' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation.',
    type: Artist,
  })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid UUID.' })
  @ApiResponse({ status: 404, description: 'Artist not found.' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Artist {
    const artist = this.artistService.findOne(id);
    if (!artist) {
      throw new NotFoundException('Artist not found.');
    }
    return artist;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update artist info' })
  @ApiResponse({
    status: 200,
    description: 'The artist has been successfully updated.',
    type: Artist,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid UUID or input.',
  })
  @ApiResponse({ status: 404, description: 'Artist not found.' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): Artist {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete artist' })
  @ApiResponse({
    status: 204,
    description: 'The artist has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid UUID.' })
  @ApiResponse({ status: 404, description: 'Artist not found.' })
  remove(@Param('id', new ParseUUIDPipe()) id: string): void {
    return this.artistService.remove(id);
  }
}
