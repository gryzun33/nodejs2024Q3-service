import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TrackModule } from 'src/track/track.module';
import { FavoritesModule } from 'src/favorites/favorites.module';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
  imports: [TrackModule, forwardRef(() => FavoritesModule)],
})
export class AlbumModule {}
