import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class CertificatesService {
  async generateCertificatePdf(data: any): Promise<Buffer> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    const htmlContent = `
      <html>
        <body style="font-family: Arial; padding: 50px; text-align: center;">
          <h1>TOEFL ITP Simulation Certificate</h1>
          <h2>Universitas Cordova</h2>
          <p>This is to certify that <b>${data.name}</b></p>
          <p>Has completed the TOEFL ITP Simulation on ${new Date().toLocaleDateString()}</p>
          <h3>Total Score: ${data.totalScore}</h3>
          <p><i>Note: Hasil Simulasi - Bukan Sertifikat Resmi TOEFL</i></p>
        </body>
      </html>
    `;
    
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    
    await browser.close();
    return Buffer.from(pdfBuffer);
  }
}
