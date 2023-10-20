import * as dotenv from "dotenv";
import GoogleCloud from "./GoogleCloud";
import DigitalOceanSpaces from "./DigitalOceanSpaces";

export default class SaveDumpFile {
  protected driver: any;

  protected file_name: string;

  constructor(file_name: string) {
    dotenv.config();
    this.driver = process.env.STORAGE_DRIVER;

    this.file_name = file_name;
  }

  public async upload(): Promise<string> {
    if (this.driver == "googleCloud") {
      return await new GoogleCloud().upload(this.file_name);
    } else if (this.driver == "spaces") {
      return await new DigitalOceanSpaces().upload(this.file_name);
    } else {
      throw new Error(`Unsupported storage driver (${this.driver})`);
    }
  }
}
