import { Controller, Get } from "routing-controllers";
import { Service } from "typedi";

@Service()
@Controller()
export class HelloRinhaController {
  constructor() {}

  @Get("/")
  helloRinha() {
    return "Welcome to rinha";
  }
}
