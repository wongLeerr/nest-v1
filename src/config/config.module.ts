import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';

export interface Options {
  num: number;
}

@Global()
@Module({
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {
  static forRoot(options: Options): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
      ],
      exports: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
      ],
    };
  }
}
