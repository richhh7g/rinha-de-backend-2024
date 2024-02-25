import { Runner } from "node-runner-ts";
import path from "path";
import { exit } from "process";
import { IS_SERVER, IS_TEST } from "@app/config";

export enum ActionType {
  Test = "Test",
  Server = "Server",
}

export const customActions = async (action: ActionType): Promise<void> => {
  switch (action) {
    case ActionType.Test:
      return Runner.parallelism(
        {
          path: path.resolve(__dirname, "server.runner"),
          forever: true,
        },
        {
          path: path.resolve(__dirname, "test", "test.runner"),
          forever: true,
        }
      );
    case ActionType.Server:
      return Runner.exec({
        path: path.resolve(__dirname, "server.runner"),
        forever: true,
      });
    default:
      return exit(0);
  }
};

const availableActions = {
  [ActionType.Test]: IS_TEST ? ActionType.Test : false,
  [ActionType.Server]: IS_SERVER ? ActionType.Server : false,
};

export const getCurrentAction = Object.values(availableActions).find(
  (action) => typeof action !== "boolean"
) as ActionType;
