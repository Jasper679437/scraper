/*
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
*/

import {Module} from '@nestjs/common';
import { ScraperModule } from './scraper/scraper.module';

@Module({
  imports: [ScraperModule]
})

export class AppModule{};