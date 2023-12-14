import fs from "fs";
import path from "path";
import { S3, S3ClientConfig, PutObjectCommand } from "@aws-sdk/client-s3";

export default class DigitalOceanSpaces {
  public async upload(file_name: string) {
    const s3ClientConfig: S3ClientConfig = {
      forcePathStyle: false,
      endpoint: process.env.DO_SPACES_ENDPOINT!,
      region: process.env.DO_SPACES_REGION,
      credentials: {
        accessKeyId: process.env.DO_SPACES_KEY!,
        secretAccessKey: process.env.DO_SPACES_SECRET!,
      },
    };

    const s3Client = new S3(s3ClientConfig);

    try {
      const file = fs.readFileSync(path.join(__dirname, "../", file_name));

      const upload_path = `db_backups/${file_name.split("/")[1]}`;
      const bucketParams = {
        Bucket: process.env.DO_SPACES_BUCKET!,
        Key: upload_path,
        Body: file,
      };

      await s3Client.send(new PutObjectCommand(bucketParams));

      return `https://${process.env.DO_SPACES_BUCKET}.sfo2.digitaloceanspaces.com/${upload_path}`;
    } catch (err) {
      console.log(err);
      throw new Error("Unable to upload file to digital ocean spaces");
    }
  }
}
