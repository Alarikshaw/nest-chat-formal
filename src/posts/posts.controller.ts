import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('posts')
@ApiTags('测试文档')
export class PostsController {
  @Get()
  @ApiOperation({ summary: '第一个测试接口' })
  index() {
    return [{ id: 1 }, { id: 1 }, { id: 1 }, { id: 1 }];
  }
}

@Controller('测试2')
@ApiTags('测试新地址Api')
export class TestPostController {
  @Get()
  @ApiOperation({ summary: '第二个测试接口' })
  index() {
    return [{ id: 1 }, { id: 1 }, { id: 1 }, { id: 1 }];
  }
}
