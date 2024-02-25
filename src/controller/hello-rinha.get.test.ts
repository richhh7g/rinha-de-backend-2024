import { expect } from "chai";
import { RequestMaker } from "@test";

describe("REST - HelloRinhaController - helloRinha(Get)", () => {
  const requestMaker = new RequestMaker<string>("/");

  it("should check welcome message", async () => {
    const response = await requestMaker.request();

    expect(response).to.be.equal("Welcome to rinha");
  });
});
