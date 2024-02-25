import { RunnerType } from "node-runner-ts";
import Container, { Service } from "typedi";
import mocha from "mocha";
import { TestConfig } from "./test.config";

@Service()
export default class TestRunner implements RunnerType {
  constructor() {}

  async configure() {
    const testConfig = Container.get(TestConfig);
    await testConfig.configure();
  }

  async run() {
    mocha.run();
  }
}
