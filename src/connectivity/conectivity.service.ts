import {
  BadGatewayException,
  GatewayTimeoutException,
  Injectable,
} from '@nestjs/common';

export type ConnectivityResponse = {
  service: string;
  status: string;
};

export type AuthHealthResponse = {
  status: string;
};

@Injectable()
export class ConnectivityService {
  private async fetchGateway(path: string): Promise<unknown> {
    const baseUrl = process.env.CONNECTIVITY_GATEWAY_URL;
    if (!baseUrl) {
      throw new Error('CONNECTIVITY_GATEWAY_URL is required');
    }

    let response: Response;

    try {
      response = await fetch(
        new URL(path, `${baseUrl.replace(/\/+$/, '')}/`),
        {
          method: 'GET',
          signal: AbortSignal.timeout(3000),
        },
      );
    } catch (error: unknown) {
      if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
        throw new GatewayTimeoutException('Gateway request timed out');
      }

      throw new BadGatewayException('Gateway is unavailable');
    }

    if (!response.ok) {
      throw new BadGatewayException('Gateway returned an unsuccessful response');
    }

    try {
      const body: unknown = await response.json();
      return body;
    } catch {
      throw new BadGatewayException('Gateway returned invalid JSON');
    }
  }

  async getMock(): Promise<ConnectivityResponse> {
    const body = await this.fetchGateway('/internal/connectivity/mock');

    if (
      typeof body !== 'object' ||
      body === null ||
      !('service' in body) ||
      !('status' in body) ||
      typeof body.service !== 'string' ||
      typeof body.status !== 'string'
    ) {
      throw new BadGatewayException('Gateway returned an invalid mock response');
    }

    return {
      service: body.service,
      status: body.status,
    };
  }

  async getAuthHealth(): Promise<AuthHealthResponse> {
    const body = await this.fetchGateway('/internal/connectivity/auth-health');

    if (
      typeof body !== 'object' ||
      body === null ||
      !('status' in body) ||
      typeof body.status !== 'string'
    ) {
      throw new BadGatewayException('Gateway returned an invalid auth health response');
    }

    return {
      status: body.status,
    };
  }
}
