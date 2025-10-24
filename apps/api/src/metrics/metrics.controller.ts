import { Controller, Get, Header } from '@nestjs/common';
import { Registry, collectDefaultMetrics } from 'prom-client';

const registry = new Registry();
collectDefaultMetrics({ register: registry });

@Controller('metrics')
export class MetricsController {
  @Get()
  @Header('Content-Type', registry.contentType)
  async getMetrics() {
    return await registry.metrics();
  }
}


