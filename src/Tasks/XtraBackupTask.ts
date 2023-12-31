import chalk from "chalk";
import config from "../Config/Config";
import Helpers from "../Helpers";
import { exec } from "node:child_process";
import { promisify } from "util";
import ErrorNotify from "../ErrorNotify";
import BackupStorage from "../Storage/BackupStorage";
import SuccessNotify from "../SuccessNotify";

const log = (str: string) => {
  console.log(`\t${str}`);
};

const execAsync = promisify(exec);

export default class XtraBackupTask {
  public async run(date: Date) {
    let dump_path = this.getDumpPath(date);

    // connect and backup
    log("Downloading and compressing backup");
    await this.downloadBackupAndCompress(dump_path);

    // new path name after compression
    dump_path = `${dump_path}.zip`;

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

  private async downloadBackupAndCompress(dump_path: string) {
    // download backup
    const backupCmd = `xtrabackup --backup --databases='${config.DB_NAME}' --target-dir='${dump_path}'  --host=${config.DB_HOST} --user=${config.DB_USER} --password=${config.DB_PASSWORD}`;

    try {
      await execAsync(backupCmd);
    } catch (err: any) {
      const err_msg = `Error when downloading the db backup: ${err.message}`;
      log(chalk.red(err_msg));
      await new ErrorNotify().run(err_msg, true, err);
      // clear any file if any was created
      await execAsync(`rm -rf ${dump_path}`);
    }

    // compress backup with gzip
    try {
      const file_name = dump_path.split("/")[dump_path.split("/").length - 1];
      await execAsync(
        `cd ${dump_path} && cd ../ && zip -r ${file_name}.zip ${file_name}`
      );
      await execAsync(`rm -rf ${file_name}`);
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
    const dump_path = `tmp_backups/xtrabackups/backup-${
      config.DB_NAME
    }-${Helpers.dateFormatForFilename(date)}`;

    log(`Dumping export to ${chalk.yellow(dump_path)}`);

    return dump_path;
  }
}
