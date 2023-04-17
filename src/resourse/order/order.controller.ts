import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import mongoose, { Model } from 'mongoose';
import { UserAccessGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { Order, OrderDocument } from 'src/schema';
import { ServiceStatus, UserType } from 'src/utils/enum';
import { Roles } from '../auth/roles.decorator';
import { OrderDto } from './order.dto';
import { OrderService } from './order.service';

@Controller('order')
@ApiTags('Orders')
@UseGuards(UserAccessGuard, RoleGuard)
@ApiBearerAuth('access-token')
export class OrderController {
  constructor(
    private readonly service: OrderService,
    @InjectModel(Order.name) private model: Model<OrderDocument>,
  ) {}

  @Post('')
  async createOrder(@Request() { user }, @Body() dto: OrderDto) {
    try {
      if (!user) throw new HttpException('error', HttpStatus.UNAUTHORIZED);
      let lawyerId = new mongoose.mongo.ObjectId(dto.lawyerId);
      let serviceId = new mongoose.mongo.ObjectId(dto.serviceId);
      let order = await this.model.create({
        clientId: user['_id'],
        date: dto.date,
        lawyerId: lawyerId,
        location: dto.location,
        expiredTime: dto.expiredTime,
        serviceStatus: dto.serviceStatus,
        serviceId: serviceId,
        subServiceId: dto.subServiceId,
        serviceType: dto.serviceType,
        userToken: dto.userToken,
        price: dto.price,
        lawyerToken: dto.lawyerToken,
        channelName: dto.channelName,
      });
      return order;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Get('user/token/:id/:channelName/:token')
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'channelName' })
  @ApiQuery({ name: 'token' })
  async setOrderTokenUser(
    @Request() { user },
    @Param('id') id: string,
    @Param('channelName') channelName: string,
    @Query('token') token: string,
  ) {
    try {
      let order = await this.model.findById(id);
      order.channelName = channelName;
      order.userToken = token;
      await order.save();
      return await this.service.getOrderById(order['_id']);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
  @Get('lawyer/token/:id/:channelName/:token')
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'channelName' })
  @ApiQuery({ name: 'token' })
  @Roles(UserType.lawyer)
  async setOrderTokenLawyer(
    @Request() { user },
    @Param('id') id: string,
    @Param('channelName') channelName: string,
    @Query('token') token: string,
  ) {
    try {
      let order = await this.model.findById(id);
      order.channelName = channelName;
      order.lawyerToken = token;
      await order.save();
      return await this.service.getOrderById(order['_id']);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @Get('user/:id')
  @ApiParam({ name: 'id' })
  getOrderById(@Param('id') id: string) {
    return this.service.getOrderById(id);
  }
  @Roles(UserType.admin)
  @Get()
  async allOrders(@Request() { user }) {
    return await this.model.find();
  }

  @Get('user')
  getUserOrders(@Request() { user }) {
    return this.service.getUserOrders(user['_id']);
  }

  @Put('/:id/:status')
  @ApiParam({ name: 'id' })
  @ApiQuery({ name: 'status' })
  updateOrderStatus(
    @Request() { user },
    @Param('id') id: string,
    @Query('status') status: ServiceStatus,
  ) {
    return this.service.updateOrderStatus(id, status);
  }
}
