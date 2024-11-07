import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TrackModule } from 'src/track/track.module';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { ArtistModule } from 'src/artist/artist.module';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
  imports: [
    forwardRef(() => TrackModule),
    forwardRef(() => FavoritesModule),
    // forwardRef(() => ArtistModule),
  ],
})
export class AlbumModule {}
