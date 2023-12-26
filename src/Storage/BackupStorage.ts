import GoogleCloud from "./Drivers/GoogleCloud/GoogleCloud";
import ErrorNotify from "../ErrorNotify";
import config from "../Config/Config";
import AwsS3OrSpaces from "./Drivers/AwsS3OrSpaces/AwsS3OrSpaces";
export default class BackupStorage {
  protected driver: any;

  protected file_name: string;

  constructor(file_name: string = "") {
    this.driver = this.getDriver();
    this.file_name = file_name;
  }

  /**
   * Currently supporting Aws, DigitalOcean Spaces and GCP
   * Aws and Digi spaces have the same api and thus sharing the provider here
   * @returns
   */
  private getDriver() {
    const driver_assocs: any = {
      aws_s3: AwsS3OrSpaces,
      spaces: AwsS3OrSpaces,
      gcp_bucket: GoogleCloud,
    };

    const driver = driver_assocs[config.STORAGE_DRIVER];

    if (!driver) {
      const err_msg = `Unsupported storage driver (${config.STORAGE_DRIVER})`;
      new ErrorNotify().run(err_msg, true);
      throw new Error(err_msg);
    }

    return driver;
  }

  public async upload(): Promise<string> {
    return new this.driver().upload(this.file_name);
  }

  public async prune() {
    return new this.driver().prune();
  }
}
