import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile, Query, Res } from '@nestjs/common';
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

  @Get('passages')
  findAllPassages() {
    return this.questionsService.findAllPassages();
  }

  @Get('template')
  async downloadTemplate(@Res() res: any) {
    const buffer = await this.questionsService.generateTemplate();
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=template_import_soal.xlsx',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
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
  async importExcel(@UploadedFile() file: any, @Query('packageId') packageId?: string) {
    if (!file) throw new Error('File is required');
    return this.questionsService.importFromExcel(file.buffer, packageId);
  }

  @Post('seed')
  seed() {
    return this.questionsService.seed();
  }
}
