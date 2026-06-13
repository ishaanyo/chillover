import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    // We use the UNPOOLED URL for creating tables/migrations!
    url: env('DATABASE_URL_UNPOOLED'), 
  },
});