import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { QuestionsService } from './questions.service';
import { Question } from '../entities/question.entity';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  findAll() {
    return this.questionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Question>) {
    return this.questionsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Question>) {
    return this.questionsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: any) {
    if (!file) throw new Error('File is required');
    return this.questionsService.importFromExcel(file.buffer);
  }

  @Post('seed')
  seed() {
    return this.questionsService.seed();
  }
}
