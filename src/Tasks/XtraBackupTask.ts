import chalk from "chalk";
import config from "../Config/Config";
import Helpers from "../Helpers";
import ErrorNotify from "../ErrorNotify";

const log = (str: string) => {
  console.log(`\t${str}`);
};

export default class XtraBackupTask {
  public async run(date: Date) {
    const dump_path = `tmp_backups/xtrabackups/backup-${
      config.DB_NAME
    }-${Helpers.dateFormatForFilename(date)}`;

    try {
      const backupCmd = `sudo xtrabackup --backup --databases='${config.DB_NAME}' --target-dir='${dump_path}'  --host=${config.DB_HOST} --user=${config.DB_USER} --password=${config.DB_PASSWORD} --compress`;

      //   this.backupDB(backupCmd, date, dump_path);
    } catch (e: any) {
      const err_msg = `Backup download failed backup errored: ${e?.message}`;
      log(chalk.red(err_msg));
      await new ErrorNotify().run(err_msg);
    }
  }
}
