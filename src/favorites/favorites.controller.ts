import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesResponse } from './entities/favorites.entity';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getFavorites(): FavoritesResponse {
    return this.favoritesService.getFavorites();
  }

  @Post('artist/:id')
  addArtistToFavorites(@Param('id', new ParseUUIDPipe()) id: string): void {
    this.favoritesService.addArtist(id);
  }

  @Post('album/:id')
  addAlbumToFavorites(@Param('id', new ParseUUIDPipe()) id: string): void {
    this.favoritesService.addAlbum(id);
  }

  @Post('track/:id')
  addTrackToFavorites(@Param('id', new ParseUUIDPipe()) id: string): void {
    this.favoritesService.addTrack(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtistFromFavorites(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): void {
    this.favoritesService.removeArtist(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbumFromFavorites(@Param('id', new ParseUUIDPipe()) id: string): void {
    this.favoritesService.removeAlbum(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrackFromFavorites(@Param('id', new ParseUUIDPipe()) id: string): void {
    this.favoritesService.removeTrack(id);
  }
}
