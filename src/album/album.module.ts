import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TrackModule } from 'src/track/track.module';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, PrismaService],
  exports: [AlbumService],
  imports: [forwardRef(() => TrackModule), forwardRef(() => FavoritesModule)],
})
export class AlbumModule {}
