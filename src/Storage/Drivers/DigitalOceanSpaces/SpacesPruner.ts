import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  S3,
} from "@aws-sdk/client-s3";
import config from "../../../Config/Config";
import { DateTime } from "luxon";
import ErrorNotify from "../../../ErrorNotify";
import chalk from "chalk";

function log(msg: string) {
  console.log(`\t ${msg}`);
}

export default class SpacesPruner {
  private base_upload_path = "";

  private s3Client;

  constructor(s3Client: S3) {
    this.base_upload_path = `db_backups/${config.APP_NAME}`;
    this.s3Client = s3Client;
  }

  public async run() {
    // delete yesterdays or any day before yesterday with more than one backup
    log(chalk.yellow(`Deleting any daily excesses apart from today`));
    const backupsByDate = await this.getAllFilesGrouped("date");
    await this.removeExcess(backupsByDate);

    // delete last weeks or any other week before that with more than one backup
    log(chalk.yellow(`Deleting any weekly excesses apart from this week`));
    const backupsByWeek = await this.getAllFilesGrouped("week");
    await this.removeExcess(backupsByWeek);

    // delete last months or any other month before that with more than one backup
    log(chalk.yellow(`Deleting any monthly excesses apart from this month`));
    const backupsByMonth = await this.getAllFilesGrouped("month");
    await this.removeExcess(backupsByMonth);

    // delete last year or any other year before that with more than one backup
    log(chalk.yellow(`Deleting any yearly excesses apart from this year`));
    const backupsByYear = await this.getAllFilesGrouped("year");
    await this.removeExcess(backupsByYear);
  }

  /**
   * Delete any excesses either from the date, week or month
   * except for the latest group
   * @param backupGroupings
   */
  private async removeExcess(backupGroupings: any) {
    const obj_keys = Object.keys(backupGroupings);

    // ignore the last backed up date
    for (let i = obj_keys.length - 2; i >= 0; i--) {
      const key = obj_keys[i];

      const backupsToDelete = backupGroupings[key].slice(0, -1);

      for (let obj_key of backupsToDelete) {
        const command = new DeleteObjectCommand({
          Bucket: config.DO_SPACES_BUCKET!,
          Key: `${this.base_upload_path}/${obj_key}`,
        });

        try {
          await this.s3Client.send(command);
        } catch (e: any) {
          await new ErrorNotify().run(
            `Error deleting backup ${this.base_upload_path}/${obj_key}: Error ${e.message}`
          );
        }

        log(
          chalk.red(
            `\t Backup group (${key}): "${this.base_upload_path}/${obj_key}" deleted successfully!`
          )
        );
      }
    }
  }

  private async getAllFilesGrouped(group_type: string = "date") {
    const command = new ListObjectsV2Command({
      Bucket: config.DO_SPACES_BUCKET!,
      Prefix: `${this.base_upload_path}/`,
    });

    let data = null;
    try {
      const { Contents } = await this.s3Client.send(command);
      data = Contents;
    } catch (e: any) {
      await new ErrorNotify().run(
        `Unable to fetch objects from spaces for deletion: ${e.message}`,
        true
      );
    }

    console.log("Data: ", data);
    return await this.groupFilesBy(data, group_type);
  }

  private groupFilesBy(Contents: any, group_by: string = "date") {
    const files_by_date: any = [];

    let format = "yyyy-MM-dd";

    if (group_by == "week") {
      format = "yyyy-MM-W";
    }

    if (group_by == "month") {
      format = "yyyy-MM";
    }

    if (group_by == "year") {
      format = "yyyy";
    }

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
        }).toFormat(format);
        if (!files_by_date[date]) {
          files_by_date[date] = [];
        }
        files_by_date[date].push(file_name);
      }
    }

    return files_by_date;
  }
}
