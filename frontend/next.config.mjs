/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const nextConfig = {
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
    BACKEND_PORT: process.env.BACKEND_PORT,
    REMOTE_API_URL: process.env.REMOTE_API_URL
  },
  reactStrictMode: true,
};

export default nextConfig;
