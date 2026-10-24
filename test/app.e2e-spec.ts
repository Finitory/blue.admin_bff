import {afterAll, beforeAll, describe, expect} from "vitest";
import {INestApplication} from "@nestjs/common";
import {Test} from '@nestjs/testing';
import {AppModule} from "../src/app.module.js";
import request from 'supertest';

describe('BFF HTTP (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('GET /health -> 200 UP', async () => {
    const response = await request(app.getHttpServer())
      .get('/health')
      .expect(200);

    expect(response.body).toEqual({status: 'UP'});
  });

  it('GET /unknown -> 404', async () => {
    await request(app.getHttpServer())
      .get('/unknown')
      .expect(404);
  });
});