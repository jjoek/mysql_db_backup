import chalk from "chalk";
import config from "./Config/Config";
import { BackupType } from "./Config/Env";
import MysqlDumpBackupTask from "./Tasks/MysqlDumpBackupTask";
import XtraBackupTask from "./Tasks/XtraBackupTask";

export default class Backup {
  public async run() {
    const backup_option = config.BACKUP_SOLN_TYPE;
    console.log(
      `2. Starting the backup process using: ${chalk.green(
        backup_option
      )} as the configured backup option`
    );

    const backup_type = config.BACKUP_SOLN_TYPE;
    const date = new Date();

    if (backup_type === BackupType.MYSQLDUMP) {
      await new MysqlDumpBackupTask().run(date);
    }

    if (backup_type === BackupType.XTRABACKUP) {
      await new XtraBackupTask().run(date);
    }
  }
}
