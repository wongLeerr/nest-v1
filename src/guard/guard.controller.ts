import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GuardService } from './guard.service';
import { CreateGuardDto } from './dto/create-guard.dto';
import { UpdateGuardDto } from './dto/update-guard.dto';
import { RoleGuard } from './role/role.guard';
import {
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('guard')
@UseGuards(RoleGuard)
@ApiTags('守卫接口们')
export class GuardController {
  constructor(private readonly guardService: GuardService) {}

  @Post()
  @ApiOperation({ summary: '创建守卫', description: '创建守卫更详细的描述' })
  create(@Body() createGuardDto: CreateGuardDto) {
    return this.guardService.create(createGuardDto);
  }

  @Get()
  @ApiOperation({ summary: '获取守卫列表' })
  findAll() {
    return this.guardService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取守卫详情' })
  @ApiParam({ name: 'id', description: '守卫id', required: true })
  @ApiResponse({
    status: 200,
    description: '获取守卫详情成功',
  })
  findOne(@Param('id') id: string) {
    return this.guardService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新守卫' })
  update(@Param('id') id: string, @Body() updateGuardDto: UpdateGuardDto) {
    return this.guardService.update(+id, updateGuardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除守卫' })
  remove(@Param('id') id: string) {
    return this.guardService.remove(+id);
  }
}
