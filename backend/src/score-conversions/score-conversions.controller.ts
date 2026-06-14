import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { ScoreConversionsService } from './score-conversions.service';
import { ScoreConversion } from '../entities/score-conversion.entity';

@Controller('score-conversions')
export class ScoreConversionsController {
  constructor(private readonly scoreConversionsService: ScoreConversionsService) {}

  @Get()
  findAll() {
    return this.scoreConversionsService.findAll();
  }

  @Post()
  createOrUpdate(@Body() data: Partial<ScoreConversion>) {
    return this.scoreConversionsService.createOrUpdate(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scoreConversionsService.remove(+id);
  }
}
