import * as mysql from "mysql2/promise";
import config from "../Config/Config";
import Helpers from "../Helpers";
import chalk from "chalk";
import ErrorNotify from "../ErrorNotify";
import { exec } from "node:child_process";
import { promisify } from "util";
import BackupStorage from "../Storage/BackupStorage";
import SuccessNotify from "../SuccessNotify";

const log = (str: string) => {
  console.log(`\t${str}`);
};
const execAsync = promisify(exec);

export default class MysqlDumpBackupTask {
  /**
   * Run backup using mysqldump
   * @param date
   */
  public async run(date: Date) {
    let dump_path = this.getDumpPath(date);

    // connect and backup
    log("Downloading backup");
    await this.downloadBackupAndCompress(dump_path);

    // new path name after compression
    dump_path = `${dump_path}.gz`;

    // upload backup and get backup downloadable path
    log("Uploading backup");
    let download_path = await new BackupStorage(dump_path).upload();

    // Email out success
    log("Emailing success backup");
    await new SuccessNotify().run(download_path);

    // Remove local dump
    log("Removing the dump locally");
    await execAsync(`rm -rf ${dump_path}`);
  }

  /**
   * Download backup
   * @param dump_path
   * @param connection
   */
  private async downloadBackupAndCompress(dump_path: string) {
    // download backup
    const dumpCommand = `mysqldump --host=${config.DB_HOST} --user=${config.DB_USER} --password=${config.DB_PASSWORD} ${config.DB_NAME} > ${dump_path}`;
    try {
      await execAsync(dumpCommand);
    } catch (err: any) {
      const err_msg = `Error when downloading db backup: ${err.message}`;
      log(chalk.red(err_msg));
      await new ErrorNotify().run(err_msg, true, err);
      // clear any file if any was created
      await execAsync(`rm -rf ${dump_path}`);
    }

    // compress backup with gzip
    try {
      await execAsync(`gzip ${dump_path}`);
    } catch (err: any) {
      const err_msg = `Error when compressing db backup: ${err.message}`;
      log(chalk.red(err_msg));
      await new ErrorNotify().run(err_msg, true, err);
    }

    return;
  }

  /**
   * Get the local dump path
   * @param date
   * @returns
   */
  private getDumpPath(date: Date) {
    const dump_path = `tmp_backups/mysqldumps/backup-${
      config.DB_NAME
    }-${Helpers.dateFormatForFilename(date)}.sql`;

    log(`Dumping export to ${chalk.yellow(dump_path)}`);

    return dump_path;
  }
}
