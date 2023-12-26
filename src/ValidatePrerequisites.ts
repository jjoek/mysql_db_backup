import chalk from "chalk";
import config from "./Config/Config";
import { BackupType } from "./Config/Env";
import { exec } from "node:child_process";
import { promisify } from "util";
import ErrorNotify from "./ErrorNotify";

const execAsync = promisify(exec);

export default class ValidatePrerequisites {
  public async run() {
    // Validate all env values
    console.log(
      `Running backups for: ${chalk.green(
        config.APP_NAME
      )} for the ${chalk.green(config.DB_NAME)} database \n\n`
    );

    // backup type checks and relevant pre-requisites
    await this.checkBackupTypeSetup();
    console.log("1. All pre-requisites look okay 👍🏽");
  }

  private async checkBackupTypeSetup() {
    const backup_driver = config.BACKUP_SOLN_TYPE;

    if (backup_driver === BackupType.MYSQLDUMP) {
      try {
        await execAsync("mysqldump --version");
      } catch (err: any) {
        await new ErrorNotify().run(
          `Mysqldump is not installed on the host machine, please setup it up first before continuing: ${err.message}`,
          true,
          err
        );
      }

      try {
        await execAsync("gzip --version");
      } catch (e: any) {
        await new ErrorNotify().run(
          `Gzip is not installed on the host machine, please setup it up first before continuing: ${e.message}`,
          true,
          e
        );
      }
    }

    if (backup_driver === BackupType.XTRABACKUP) {
      try {
        await execAsync("xtrabackup --version");
      } catch (err: any) {
        await new ErrorNotify().run(
          `Percona xtrabackup is not installed on the host machine, please setup it up first before continuing: ${err.message}`,
          true,
          err
        );
      }
    }
  }
}
