import * as dotenv from "dotenv";
import GoogleCloud from "./Drivers/GoogleCloud/GoogleCloud";
import DigitalOceanSpaces from "./Drivers/DigitalOceanSpaces/DigitalOceanSpaces";
import ErrorNotify from "../ErrorNotify";
import config from "../Config/Config";

export default class BackupStorage {
  protected driver: any;

  protected file_name: string;

  constructor(file_name: string = "") {
    dotenv.config();
    this.driver = config.STORAGE_DRIVER;

    this.file_name = file_name;
  }

  public async upload(): Promise<string> {
    if (this.driver == "spaces") {
      return await new DigitalOceanSpaces().upload(this.file_name);
    }

    if (this.driver == "googleCloud") {
      return await new GoogleCloud().upload(this.file_name);
    }

    await new ErrorNotify().run(
      `Unsupported storage driver (${this.driver})`,
      true
    );
    return "";
  }

  public async prune() {
    if (this.driver == "spaces") {
      return await new DigitalOceanSpaces().prune();
    }

    if (this.driver == "googleCloud") {
      return await new GoogleCloud().prune();
    }

    await new ErrorNotify().run(
      `Unsupported storage driver (${this.driver})`,
      true
    );
  }
}
