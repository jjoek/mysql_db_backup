import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  S3,
  S3ClientConfig,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import config from "../Config/Config";
import ErrorNotify from "../ErrorNotify";
import { DateTime } from "luxon";

export default class DigitalOceanSpaces {
  private s3Client;

  private base_upload_path: string;

  constructor() {
    const s3ClientConfig = {
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
      const file = fs.readFileSync(path.join(dirname, "../", file_name));

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
    } catch (err) {
      new ErrorNotify().run(
        `Unable to upload file to digital ocean spaces`,
        true
      );
      return "";
    }
  }

  public async prune() {
    const command = new ListObjectsV2Command({
      Bucket: config.DO_SPACES_BUCKET!,
      Prefix: `${this.base_upload_path}/`,
    });

    try {
      const { Contents } = await this.s3Client.send(command);

      const backupsByDate: any = this.groupFilesByDate(Contents);

      await this.deleteDaily(backupsByDate);
    } catch (e) {
      new ErrorNotify().run(
        `Unable to fetch objects from spaces for deletion`,
        true
      );
    }
  }

  private async deleteDaily(backupsByDate: any) {
    const obj_keys = Object.keys(backupsByDate);

    // ignore the last backed up date
    for (let i = obj_keys.length - 2; i >= 0; i--) {
      const key = obj_keys[i];

      const backupsToDelete = backupsByDate[key].slice(0, -1);

      for (let obj_key of backupsToDelete) {
        const command = new DeleteObjectCommand({
          Bucket: config.DO_SPACES_BUCKET!,
          Key: `${this.base_upload_path}/${obj_key}`,
        });

        try {
          await this.s3Client.send(command);
        } catch (e) {
          await new ErrorNotify().run(
            `Error deleting backup ${this.base_upload_path}/${obj_key}`
          );
        }

        console.log(
          `Backup:  "${this.base_upload_path}/${obj_key}" deleted successfully!`
        );
      }
    }
  }

  private groupFilesByDate(Contents: any) {
    const files_by_date: any = [];

    for (const object of Contents) {
      const file_path = object.Key;
      const file_name = file_path?.split("/")[file_path?.split("/").length - 1];

      const match = file_name?.match(
        /backup-(\w+)-(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})_\d+\.sql\.gz/
      );

      if (match) {
        const [, dbName, year, month, day, hour, minute, second] = match;
        const date = DateTime.fromObject({
          year: parseInt(year, 10),
          month: parseInt(month, 10),
          day: parseInt(day, 10),
          hour: parseInt(hour, 10),
          minute: parseInt(minute, 10),
          second: parseInt(second, 10),
        }).toFormat("yyyy-MM-dd");
        if (!files_by_date[date]) {
          files_by_date[date] = [];
        }
        files_by_date[date].push(file_name);
      }
    }

    return files_by_date;
  }
}
