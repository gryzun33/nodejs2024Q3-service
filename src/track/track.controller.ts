import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Track } from './entities/track.entity';

@ApiTags('Tracks')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new track' })
  @ApiResponse({
    status: 201,
    description: 'The track has been successfully created.',
    type: Track,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid input data.',
  })
  async create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tracks' })
  @ApiResponse({
    status: 200,
    description: 'List of all tracks',
    type: [Track],
  })
  async findAll(): Promise<Track[]> {
    return this.trackService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single track by ID' })
  @ApiResponse({
    status: 200,
    description: 'The track was successfully retrieved.',
    type: Track,
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format.' })
  @ApiResponse({
    status: 404,
    description: 'Track not found.',
  })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Track> {
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new NotFoundException(`Track not found.`);
    }
    return track;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update track details' })
  @ApiResponse({
    status: 200,
    description: 'The track has been successfully updated.',
    type: Track,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid input data.',
  })
  @ApiResponse({
    status: 404,
    description: 'Track not found.',
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a track' })
  @ApiResponse({
    status: 204,
    description: 'The track has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format.' })
  @ApiResponse({
    status: 404,
    description: 'Track not found.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.trackService.remove(id);
  }
}
