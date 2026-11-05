import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get(['health', 'api/health'])
  checkHealth() {
    return {
      status: 'ok',
      message: 'Marketplace backend is running',
      timestamp: new Date().toISOString(),
    };
  }
}
