import * as config from "./Config/Config";
import { BackupType } from "./Config/Env";
import { exec } from "child_process";

export default class ValidatePrerequisites {
  public async run() {
    // below will do the config validations
    console.log(`Running backups for ${config.default.APP_NAME}`);

    // backup type checks
    await this.checkBackupTypeSetup();
  }

  private async checkBackupTypeSetup() {
    const backup_driver = config.default.BACKUP_SOLN_TYPE;

    if (backup_driver === BackupType.MYSQLDUMP) {
      exec("mysqldump --version", (error, stdout, stderr) => {
        if (error) {
          throw new Error(
            `Mysqldump is not installed on the host machine, please setup it up first before continuing`
          );
        }
      });
    }

    if (backup_driver === BackupType.XTRABACKUP) {
      exec("xtrabackup --version", (error, stdout, stderr) => {
        if (error) {
          throw new Error(
            `Percona xtrabackup is not installed on the host machine, please setup it up first before continuing`
          );
        }
      });
    }
  }
}
