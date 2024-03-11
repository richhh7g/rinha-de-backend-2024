import { DotenvPopulateInput, config } from "dotenv";
import { existsSync } from "fs";
import { ConfigureType } from "node-runner-ts";
import path from "path";
import Container, { Service } from "typedi";

export const ENV_FILE = process.env.ENV as string;

@Service()
export class EnvConfig implements ConfigureType {
  async configure() {
    const envFilePath = path.resolve(__dirname, "..", "..", "..", ENV_FILE);

    let envConfig: DotenvPopulateInput;

    if (existsSync(envFilePath)) {
      envConfig = {
        path: envFilePath,
      };
    } else {
      envConfig = {};
      for (const key in process.env) {
        const value = process.env[key];
        if (typeof value === "string") {
          envConfig[key] = value;
        }
      }
    }

    config(envConfig);
  }
}

const configureEnv = async () => {
  await Container.get(EnvConfig).configure();
};

configureEnv().then();
