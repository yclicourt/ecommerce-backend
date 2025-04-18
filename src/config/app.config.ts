export const PORT = process.env.PORT;
export const HOST = `http://localhost:${PORT}/api/v1`
export const PAYPAL_API_SECRET = process.env.PAYPAL_API_SECRET ?? 'test';
export const PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT ?? 'test';
export const PAYPAL_API = process.env.PAYPAL_API ?? 'http://localhost:1234';
