import { config } from "dotenv";
import { ConfigureType } from "node-runner-ts";
import path from "path";
import Container, { Service } from "typedi";

export const ENV_FILE = process.env.ENV as string;

@Service()
export class EnvConfig implements ConfigureType {
  async configure() {
    const envFilePath = path.resolve(__dirname, "..", "..", "..", ENV_FILE);

    config({
      path: envFilePath,
    });
  }
}

const configureEnv = async () => {
  await Container.get(EnvConfig).configure();
};

configureEnv().then();
