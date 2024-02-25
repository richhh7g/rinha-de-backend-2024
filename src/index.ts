import "reflect-metadata";
import "@app/config/env.config";
import { ActionType, customActions, getCurrentAction } from "./action-strategy";

void customActions(ActionType[getCurrentAction]);
