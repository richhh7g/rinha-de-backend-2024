import "reflect-metadata";
import "@core/env/env.config";
import { ActionType, customActions, getCurrentAction } from "@core/runner";

void customActions(ActionType[getCurrentAction]);
