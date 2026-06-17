import { Controller, Post, Body, Param, Get, Put } from '@nestjs/common';
import { TestEngineService } from './test-engine.service';
import { RequestStatus } from '../entities/test-request.entity';

@Controller('test-engine')
export class TestEngineController {
  constructor(private readonly testEngineService: TestEngineService) {}

  @Post('start')
  startTest(@Body() body: { userId: string, packageId: string }) {
    return this.testEngineService.startTest(body.userId, body.packageId);
  }

  @Post(':id/save')
  saveAnswers(@Param('id') id: string, @Body() body: { answers: any, durationSeconds: number }) {
    return this.testEngineService.saveAnswers(id, body.answers, body.durationSeconds);
  }

  @Post(':id/submit')
  submitTest(@Param('id') id: string) {
    return this.testEngineService.submitTest(id);
  }

  @Post('request-attempt')
  requestAttempt(@Body() body: { userId: string, packageId: string }) {
    return this.testEngineService.requestAttempt(body.userId, body.packageId);
  }

  @Get('attempts/user/:userId')
  getUserAttempts(@Param('userId') userId: string) {
    return this.testEngineService.getUserAttempts(userId);
  }

  @Get('packages/:packageId/questions')
  getQuestionsForPackage(@Param('packageId') packageId: string) {
    return this.testEngineService.getQuestionsForPackage(packageId);
  }

  @Get('requests')
  getRequests() {
    return this.testEngineService.getRequests();
  }

  @Put('requests/:id/status')
  updateRequestStatus(@Param('id') id: string, @Body('status') status: RequestStatus) {
    return this.testEngineService.updateRequestStatus(id, status);
  }
}
