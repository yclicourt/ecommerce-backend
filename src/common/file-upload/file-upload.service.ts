import { HttpException, Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      // Verification of the file
      if (!file || !file.buffer || !file.originalname) {
        throw new HttpException('Invalid file', 400);
      }

      // Create directory if it doesn't exist
      const uploadPath = path.join(process.cwd(), 'uploads');
      await fs.mkdir(uploadPath, { recursive: true });

      // Generate unique file name
      const fileExt = path.extname(file.originalname);
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
      const fullPath = path.join(uploadPath, fileName);

      // Save file
      await fs.writeFile(fullPath, file.buffer);

      return fileName;

    } catch (error) {
      console.error('Error to uploadFile:', error);
      throw new HttpException('Error to upload file', 500);
    }
  }
}
