import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

import { Request, Response, NextFunction } from 'express';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);



  app.setGlobalPrefix('api');

  app.useGlobalPipes(

    new ValidationPipe({

      whitelist: true,

      transform: true,

      transformOptions: { enableImplicitConversion: true },

    }),

  );



  app.enableCors({

    origin: process.env.FRONTEND_URL || 'http://localhost:3000',

    credentials: true,

  });



  // Security headers (ISO 27001 / NIST / Ley 20.663)

  app.use((_req: Request, res: Response, next: NextFunction) => {

    res.setHeader('X-Content-Type-Options', 'nosniff');

    res.setHeader('X-Frame-Options', 'DENY');

    res.setHeader('X-XSS-Protection', '1; mode=block');

    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    res.setHeader(

      'Permissions-Policy',

      'camera=(), microphone=(), geolocation=()',

    );

    next();

  });



  const port = process.env.PORT || 3001;

  await app.listen(port);

  console.log(`ServiDiesel API running on http://localhost:${port}/api`);

}



bootstrap();

