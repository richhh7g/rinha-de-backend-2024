import "reflect-metadata";
import "@core/env/env.config";
import { useContainer } from "routing-controllers";
import Container from "typedi";
import { ActionType, customActions, getCurrentAction } from "@core/runner";

useContainer(Container);

void customActions(ActionType[getCurrentAction]);
