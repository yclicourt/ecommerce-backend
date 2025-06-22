import { HttpException, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class FileUploadCloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  async uploadFileCloudinary(file: Express.Multer.File): Promise<string> {
    try {
      if (!file || !file.buffer || !file.originalname) {
        throw new HttpException('Invalid file', 400);
      }

      // Convert buffer to readable stream
      const stream = Readable.from(file.buffer);

      // Upload to Cloudinary
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          {
            folder: 'uploads',
            resource_type: 'auto', // Automatically determine the resource type (image, video, etc.)
          },
          (error, result) => {
            if (error || !result) {
              const rejectionError =
                error instanceof Error
                  ? error
                  : new Error(
                      error
                        ? typeof error === 'object'
                          ? JSON.stringify(error)
                          : String(error)
                        : 'Upload failed',
                    );
              return reject(rejectionError);
            }
            resolve(result);
          },
        );
        stream.pipe(upload);
      });

      return result.secure_url;
    } catch (error) {
      console.error('Error to upload to Cloudinary:', error);
      throw new HttpException('Error uploading file', 500);
    }
  }
}
