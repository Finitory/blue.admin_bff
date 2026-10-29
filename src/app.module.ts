import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ConnectivityController } from "./connectivity/connectivity.controller.js";
import { ConnectivityService } from "./connectivity/conectivity.service.js";

const localConnectivityEnabled = process.env.BLUE_LOCAL_CONNECTIVITY_ENABLED === 'true';
if (localConnectivityEnabled && !process.env.CONNECTIVITY_GATEWAY_URL) {
  throw new Error('CONNECTIVITY_GATEWAY_URL is required when local connectivity is enabled');
}


@Module({
  imports: [],
  controllers: [
    AppController,
    ...(localConnectivityEnabled
      ? [ConnectivityController]
      : []),
  ],
  providers: localConnectivityEnabled ? [ConnectivityService] : [],
})

export class AppModule {
}
