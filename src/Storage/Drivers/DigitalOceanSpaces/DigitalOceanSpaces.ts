import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { S3, S3ClientConfig, PutObjectCommand } from "@aws-sdk/client-s3";
import config from "../../../Config/Config";
import ErrorNotify from "../../../ErrorNotify";
import SpacesPruner from "./SpacesPruner";

export default class DigitalOceanSpaces {
  private s3Client;

  private base_upload_path: string;

  constructor() {
    const s3ClientConfig: S3ClientConfig = {
      forcePathStyle: false,
      endpoint: config.DO_SPACES_ENDPOINT!,
      region: config.DO_SPACES_REGION,
      credentials: {
        accessKeyId: config.DO_SPACES_KEY!,
        secretAccessKey: config.DO_SPACES_SECRET!,
      },
    };

    this.s3Client = new S3(s3ClientConfig);

    this.base_upload_path = `db_backups/${config.APP_NAME}`;
  }

  public async upload(file_name: string): Promise<string> {
    try {
      const dirname = path.dirname(
        path.dirname(fileURLToPath(import.meta.url))
      );
      const file = fs.readFileSync(path.join(dirname, "../../../", file_name));

      const upload_path = `${this.base_upload_path}/${
        file_name.split("/")[file_name.split("/").length - 1]
      }`;
      const bucketParams = {
        Bucket: config.DO_SPACES_BUCKET!,
        Key: upload_path,
        Body: file,
      };

      await this.s3Client.send(new PutObjectCommand(bucketParams));

      return `https://${config.DO_SPACES_BUCKET}.sfo2.digitaloceanspaces.com/${upload_path}`;
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
    await new SpacesPruner(this.s3Client).run();
  }
}
