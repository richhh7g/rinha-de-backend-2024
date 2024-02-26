import { useContainer } from "class-validator";
import compression from "compression";
import express, { Express } from "express";
import helmet from "helmet";
import { ConfigureType } from "node-runner-ts";
import { join } from "path";
import { useExpressServer } from "routing-controllers";
import Container, { Service } from "typedi";

@Service()
export class ExpressConfig implements ConfigureType {
  configure(): Promise<Express> {
    const app = express();

    app.use(express.json());
    app.use(compression());
    app.use(helmet());

    useContainer(Container);
    useExpressServer(app, {
      defaultErrorHandler: false,
      controllers: [
        join(
          __dirname,
          "..",
          "..",
          "api",
          "controller",
          "*.controller.{ts,js}"
        ),
      ],
      middlewares: [
        join(
          __dirname,
          "..",
          "..",
          "api",
          "middleware",
          "*.middleware.{ts,js}"
        ),
      ],
      validation: true,
    });

    return Promise.resolve(app);
  }
}
