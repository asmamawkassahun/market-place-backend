import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { VisualSearchService } from './visual-search.service';
import { VisualSearchDto } from './dto/visual-search.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('visual-search')
export class VisualSearchController {
  constructor(private readonly visualSearchService: VisualSearchService) {}

  @Post()
  searchSimilarProducts(@Body() visualSearchDto: VisualSearchDto) {
    return this.visualSearchService.searchSimilarProducts(visualSearchDto);
  }
}
