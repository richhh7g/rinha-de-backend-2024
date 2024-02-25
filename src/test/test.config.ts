import { ConfigureType } from "node-runner-ts";
import * as glob from "glob";
import path from "path";
import { Service } from "typedi";

@Service()
export class TestConfig implements ConfigureType {
  constructor() {}

  async configure() {
    const files = ["src/**/*.test.ts"]
      .reduce<string[]>(
        (allDirs, dir) => allDirs.concat(glob.sync(path.normalize(dir))),
        []
      )
      .map((file) => file.replace("src/", "").replace(".ts", ""));

    for (const file of files) {
      await import(file);
    }
  }
}
