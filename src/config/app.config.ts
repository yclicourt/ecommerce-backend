export const PORT = process.env.PORT;
export const HOST = `http://localhost:${PORT}/api/v1`
export const PAYPAL_API_SECRET = process.env.PAYPAL_API_SECRET ?? 'test';
export const PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT ?? 'test';
export const PAYPAL_API = process.env.PAYPAL_API ?? 'http://localhost:1234';
export const ORIGIN_CLIENT_PRODUCTION = process.env.ORIGIN_CLIENT_PRODUCTION ?? 'http://localhost:3000';
export const ORIGIN_CLIENT_DEVELOPMENT = process.env.ORIGIN_CLIENT_DEVELOPMENT ?? 'http://localhost:3000';
export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME ?? 'test';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
