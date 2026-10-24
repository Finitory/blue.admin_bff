import {AppController} from "./app.controller.js";
import {expect} from "vitest";

describe('AppController', () => {
  it('returns health status', () => {
    const controller = new AppController();

    expect(controller.getHealth()).toEqual({status: 'UP'});
  });
})