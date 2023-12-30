import fs from "fs";
import path from "path";
import { Storage } from "@google-cloud/storage";
import config from "../../../Config/Config";
import { fileURLToPath } from "url";
import BaseStorageDriver from "../../BaseStorageDriver";
import ErrorNotify from "../../../ErrorNotify";
import GoogleCloudStoragePrunner from "./GoogleCloudStoragePrunner";

export default class GoogleCloud extends BaseStorageDriver {
  private dirname;

  private db_backup_bucket;

  constructor() {
    super();
    this.dirname = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

    const storage = new Storage({
      projectId: config.GOOGLE_PROJECT_ID,
      keyFilename: path.join(
        this.dirname,
        "../../../",
        config.GOOGLE_SERVICES_KEY_NAME!
      ),
    });

    const bucket_name = config.GOOGLE_BUCKET_NAME;
    this.db_backup_bucket = storage.bucket(bucket_name!);
  }

  public async upload(file_name: string) {
    const fileName = path.join(this.dirname, "../../../", file_name);

    const upload_path = `${this.base_upload_path}/${
      file_name.split("/")[file_name.split("/").length - 1]
    }`;

    this.db_backup_bucket.upload(
      fileName,
      {
        destination: upload_path,
      },
      function (err, file) {
        if (err) {
          new ErrorNotify().run(
            `Unable to upload file to the GCP bucket: ${err.message}`,
            true,
            err
          );
        }
      }
    );
  }

  public async prune() {
    await new GoogleCloudStoragePrunner(
      this.db_backup_bucket,
      this.base_upload_path
    ).run();
  }
}
