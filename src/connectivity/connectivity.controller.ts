import { Controller, Get } from "@nestjs/common";
import {
  AuthHealthResponse,
  ConnectivityResponse,
  ConnectivityService
} from "./conectivity.service.js";

@Controller('api/dev/connectivity')
export class ConnectivityController {
  constructor(private readonly connectivityService: ConnectivityService) {
  }

  @Get('mock')
  getMock(): Promise<ConnectivityResponse> {
    return this.connectivityService.getMock();
  }

  @Get('auth-health')
  getAuthHealth(): Promise<AuthHealthResponse> {
    return this.connectivityService.getAuthHealth();
  }
}