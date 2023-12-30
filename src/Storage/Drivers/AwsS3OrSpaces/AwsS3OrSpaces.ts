import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { S3, S3ClientConfig, PutObjectCommand } from "@aws-sdk/client-s3";
import config from "../../../Config/Config";
import ErrorNotify from "../../../ErrorNotify";
import AwsS3OrSpacesPruner from "./AwsS3OrSpacesPruner";
import BaseStorageDriver from "../../BaseStorageDriver";

export default class AwsS3OrSpaces extends BaseStorageDriver {
  private s3Client;

  private bucket_name: string;
  private region: string;

  private is_aws = true;

  constructor() {
    super();

    this.is_aws = config.STORAGE_DRIVER === "aws_s3";

    const endpoint = this.is_aws
      ? config.AWS_S3_ENDPOINT!
      : config.DO_SPACES_ENDPOINT!;
    this.region = this.is_aws
      ? config.AWS_S3_REGION!
      : config.DO_SPACES_REGION!;
    const key = this.is_aws ? config.AWS_S3_KEY! : config.DO_SPACES_KEY!;
    const secret = this.is_aws
      ? config.AWS_S3_SECRET!
      : config.DO_SPACES_SECRET!;
    this.bucket_name = this.is_aws
      ? config.AWS_S3_BUCKET!
      : config.DO_SPACES_BUCKET!;

    const s3ClientConfig: S3ClientConfig = {
      forcePathStyle: false,
      endpoint,
      region: this.region,
      credentials: {
        accessKeyId: key,
        secretAccessKey: secret,
      },
    };

    this.s3Client = new S3(s3ClientConfig);
  }

  public async upload(file_name: string) {
    try {
      const dirname = path.dirname(
        path.dirname(fileURLToPath(import.meta.url))
      );
      const file = fs.readFileSync(path.join(dirname, "../../../", file_name));

      const upload_path = `${this.base_upload_path}/${
        file_name.split("/")[file_name.split("/").length - 1]
      }`;
      const bucketParams = {
        Bucket: this.bucket_name,
        Key: upload_path,
        Body: file,
      };

      await this.s3Client.send(new PutObjectCommand(bucketParams));

      return "";
    } catch (err: any) {
      await new ErrorNotify().run(
        `Unable to upload file to digital ocean spaces ${err.message}`,
        true,
        err
      );
      return "";
    }
  }

  public async prune() {
    await new AwsS3OrSpacesPruner(this.s3Client, this.base_upload_path).run();
  }
}
