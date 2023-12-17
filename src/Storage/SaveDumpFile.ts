import * as dotenv from "dotenv";
import GoogleCloud from "./GoogleCloud";
import DigitalOceanSpaces from "./DigitalOceanSpaces";
import ErrorNotify from "../ErrorNotify";

export default class SaveDumpFile {
  protected driver: any;

  protected file_name: string;

  constructor(file_name: string) {
    dotenv.config();
    this.driver = process.env.STORAGE_DRIVER;

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
}
