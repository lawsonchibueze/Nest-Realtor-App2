import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';
import { PropertyType } from '@prisma/client';

interface CreateHomeParams {
  address: string;
  city: string;
  price: number;
  propertyType: PropertyType;
  numberOfBathrooms: number;
  numberOfBedrooms: number;
  landSize: number;
  // images: string;
}

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getHomes(): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        propertyType: true,
        number_of_bathrooms: true,
        number_of_bedrooms: true,
      },
    });
    return homes.map((home) => new HomeResponseDto(home));
  }

  async createHome({
    address,
    city,
    price,
    propertyType,
    numberOfBathrooms,
    numberOfBedrooms,
    landSize,
  }: CreateHomeParams): Promise<HomeResponseDto> {
    const home = await this.prismaService.home.create({
      data: {
        address,
        city,
        price,
        propertyType,
        number_of_bathrooms: numberOfBathrooms,
        number_of_bedrooms: numberOfBedrooms,
        land_size: landSize,
        realtor_id: 12,
        // images,
        // images: {
        //   create: images,
        // },
      },
    });

    // const homeImages = images.map((image) => {
    //   return { ...image, home_id: home.id };
    // });

    // await this.prismaService.image.createMany({
    //   data: homeImages,
    // });
    return new HomeResponseDto(home);
  }
}
