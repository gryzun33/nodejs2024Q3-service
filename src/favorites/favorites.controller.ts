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

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get('favs')
  getFavorites(): FavoritesResponse {
    return this.favoritesService.getFavorites();
  }

  @Post('favs/artist/:id')
  addArtistToFavorites(@Param('id', new ParseUUIDPipe()) id: string): void {
    this.favoritesService.addArtist(id);
  }

  @Post('favs/album/:id')
  addAlbumToFavorites(@Param('id', new ParseUUIDPipe()) id: string): void {
    this.favoritesService.addAlbum(id);
  }

  @Post('favs/track/:id')
  addTrackToFavorites(@Param('id', new ParseUUIDPipe()) id: string): void {
    this.favoritesService.addTrack(id);
  }

  @Delete('favs/artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtistFromFavorites(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): void {
    this.favoritesService.removeArtist(id);
  }

  @Delete('favs/album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbumFromFavorites(@Param('id', new ParseUUIDPipe()) id: string): void {
    this.favoritesService.removeAlbum(id);
  }

  @Delete('favs/track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrackFromFavorites(@Param('id', new ParseUUIDPipe()) id: string): void {
    this.favoritesService.removeTrack(id);
  }
}
