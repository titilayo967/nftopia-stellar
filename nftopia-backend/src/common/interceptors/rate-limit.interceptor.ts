import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

interface Entry {
  count: number;
  timer?: NodeJS.Timeout;
}

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private readonly map = new Map<string, Entry>();
  private readonly limit: number;
  private readonly ttlSeconds: number;

  constructor(private readonly config: ConfigService) {
    this.limit = parseInt(this.config.get('RATE_LIMIT') || '100', 10);
    this.ttlSeconds = parseInt(this.config.get('RATE_LIMIT_TTL') || '60', 10);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const ip =
      req.headers['x-forwarded-for'] ||
      req.ip ||
      req.connection?.remoteAddress ||
      'unknown';
    const key = String(ip);

    let entry = this.map.get(key);
    if (!entry) {
      entry = { count: 0 };
      entry.timer = setTimeout(
        () => this.map.delete(key),
        this.ttlSeconds * 1000,
      );
      this.map.set(key, entry);
    }

    entry.count += 1;

    const remaining = Math.max(0, this.limit - entry.count);

    try {
      res.setHeader('X-RateLimit-Limit', String(this.limit));
      res.setHeader('X-RateLimit-Remaining', String(remaining));
    } catch {
      // ignore if response headers cannot be set
    }

    if (entry.count > this.limit) {
      throw new HttpException(
        'Too Many Requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return next.handle();
  }
}
