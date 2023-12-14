import path from "path";
import { Storage } from "@google-cloud/storage";

export default class GoogleCloud {
  public async upload(file_name: string): Promise<string> {
    const storage = new Storage({
      keyFilename: `${path.join(
        __dirname,
        "../",
        process.env.GOOGLE_SERVICES_KEY_NAME!
      )}`,
    });

    const bucket_name = process.env.GOOGLE_BUCKET_NAME;
    const bucket = storage.bucket(bucket_name!);

    bucket.upload(
      path.join(__dirname, "../", file_name),
      {
        destination: `db_backups/${process.env.APP_NAME}/${file_name.replace(
          "/",
          "_"
        )}`,
      },
      function (err, file) {
        if (err) {
          console.error(`Error uploading ../../${file_name}: ${err}`);
        } else {
          console.log(`Image ${file_name} uploaded to ${bucket_name}.`);
        }
      }
    );

    return "path";
  }
}
