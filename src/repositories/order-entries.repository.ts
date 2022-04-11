import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OrderEntriesInput } from 'src/interfaces/order-entries/order-entries.input';
import { CreateOneOrderEntryArgs } from 'src/@generated/prisma-nestjs-graphql/order-entry/create-one-order-entry.args';
import { OrderEntry, Prisma } from '@prisma/client';
import { UpdateOneOrderEntryArgs } from 'src/@generated/prisma-nestjs-graphql/order-entry/update-one-order-entry.args';
import { FirstOrderEntryInput } from 'src/interfaces/order-entries/first-order-entry.input';

@Injectable()
export class OrderEntriesRepository {
  constructor(private readonly prisma: PrismaService) {}
  // constructor(private prisma: PrismaService) {
  //   prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
  //     console.log('Query: ' + event.query);
  //     console.log('Duration: ' + event.duration + 'ms');
  //   });
  // }

  async findOrderEntries(
    params: OrderEntriesInput,
  ): Promise<OrderEntry[] | null> {
    const { skip, take, orderEntriesWhereInput, cursor } = params;
    return this.prisma.orderEntry.findMany({
      skip,
      take,
      cursor,
      include: {
        orderRequest: {
          include: {
            orderRequestDetail: true,
          },
        },
        maker: {
          include: {
            product: {
              include: { orderArrivalData: true, orderRequestDetail: true },
            },
          },
        },
      },
      where: {
        makerCd: orderEntriesWhereInput.makerCd,
        orderRequest: {
          some: {
            orderRequestNo: orderEntriesWhereInput.orderRequestNo,
            discarded: false,
            orderRequestDetail: {
              // everyは全ての明細が指定の商品コードのものを取ってくる
              // someはどれかの明細に指定の商品コードが入っていたら取ってくる。この際、明細は商品コードが指定のものじゃなくても全部取ってくる
              some: {
                prodCd: orderEntriesWhereInput.prodCd,
              },
            },
          },
        },
      },
      orderBy: {
        makerCd: 'asc',
      },
    });
  }

  async findFirstOrderEntry(
    params: FirstOrderEntryInput,
  ): Promise<OrderEntry | null> {
    const { makerCd, orderRequestNo, prodCd } = params;
    return this.prisma.orderEntry.findFirst({
      include: {
        orderRequest: {
          include: {
            orderRequestDetail: {
              where: { prodCd: prodCd },
            },
          },
          where: {
            discarded: false,
          },
        },
        maker: {
          include: {
            product: {
              include: { orderArrivalData: true, orderRequestDetail: true },
            },
          },
        },
      },
      where: {
        makerCd: makerCd,
        orderRequest: {
          some: {
            discarded: false,
            orderRequestNo: orderRequestNo,
            orderRequestDetail: {
              // everyは全ての明細が指定の商品コードのものを取ってくる
              // someはどれかの明細に指定の商品コードが入っていたら取ってくる。この際、明細は商品コードが指定のものじゃなくても全部取ってくる
              some: {
                prodCd: prodCd,
              },
            },
          },
        },
      },
      orderBy: {
        makerCd: 'asc',
      },
    });
  }

  async createOrderEntry(args: CreateOneOrderEntryArgs): Promise<OrderEntry> {
    return this.prisma.orderEntry.create(args);
  }

  async updateOrderEntry(args: UpdateOneOrderEntryArgs): Promise<OrderEntry> {
    return this.prisma.orderEntry.update(args);
  }
}