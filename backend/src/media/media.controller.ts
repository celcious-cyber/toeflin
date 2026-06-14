import { Controller, Post, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Controller('media')
export class MediaController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req: any, file: any, cb: any) => {
        const path = './uploads';
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path, { recursive: true });
        }
        cb(null, path);
      },
      filename: (req: any, file: any, cb: any) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      }
    })
  }))
  uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new HttpException('File required', HttpStatus.BAD_REQUEST);
    }
    return {
      url: `/uploads/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}
