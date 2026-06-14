import { Controller, Post, Body, Res } from '@nestjs/common';
import { CertificatesService } from './certificates.service';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post('generate')
  async generate(@Body() body: any, @Res() res: any) {
    const buffer = await this.certificatesService.generateCertificatePdf(body);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=certificate.pdf',
      'Content-Length': String(buffer.length),
    });
    res.end(buffer);
  }
}
