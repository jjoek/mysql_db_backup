import * as mysql from "mysql2";
import SendMail from "./Mail/SendMail";
import SaveDumpFile from "./Storage/SaveDumpFile";
import config from "./Config/Config";
import { BackupType } from "./Config/Env";
import chalk from "chalk";
import { exec } from "child_process";

const log = (str: string) => {
  console.log(`\t${str}`);
};

export default class Backup {
  public async run() {
    const dbConfig: mysql.ConnectionOptions = {
      host: config.DB_HOST,
      port: parseInt(config.DB_PORT),
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
    };

    const backup_soln_type = config.BACKUP_SOLN_TYPE;
    const date = new Date();

    if (backup_soln_type === BackupType.XTRABACKUP) {
      //   useXtrabackup(date_time);
    }

    if (backup_soln_type === BackupType.MYSQLDUMP) {
      await this.useMysqlDump(dbConfig, date);
    }
  }

  private async useMysqlDump(dbConfig: mysql.ConnectionOptions, date: Date) {
    const dump_path = `tmp_backups/mysqldumps/backup-${
      config.DB_NAME
    }-${this.dateFormatForFilename(date)}.sql.gz`;
    log(`Dumping export to ${chalk.yellow(dump_path)}`);

    let connection: any = null;
    const dumpCommand = `mysqldump --host=${config.DB_HOST} --user=${config.DB_USER} --password=${config.DB_PASSWORD} ${config.DB_NAME} | gzip > ${dump_path}`;

    connection = mysql.createConnection(dbConfig);
    await connection.connect(async (err: any) => {
      if (err) {
        log(chalk.red(`Unable to connect to db: ${err.message}`));
        return;
      }
      log(chalk.green("Connected to db successfully"));
      log(`\n\t------------------------------------`);
      await this.backupDB(dumpCommand, date, dump_path, connection);

      try {
        connection.end();
        log("Connection terminated");
      } catch (e: any) {
        log(
          chalk.red("Unable to terminate connection or was terminated already")
        );
      }

      log(chalk.green(`Horray!! We are done`));
    });
  }

  private async useXtrabackup(date: Date) {
    const date_time = this.dateInYyyyMmDdHhMmSs(date);

    const dump_path = `tmp_backups/xtrabackups/backup-${
      config.DB_NAME
    }-${this.dateFormatForFilename(date)}`;

    try {
      const backupCmd = `sudo xtrabackup --backup --databases='${config.DB_NAME}' --target-dir='${dump_path}'  --host=${config.DB_HOST} --user=${config.DB_USER} --password=${config.DB_PASSWORD} --compress`;

      this.backupDB(backupCmd, date, dump_path);
    } catch (e: any) {
      console.log(`2. Backup download failed backup errored: ${e?.message}`);
      await new SendMail(date_time, "").failDump(e?.message);
    }
  }

  private async backupDB(
    dumpCommand: string,
    date: Date,
    dump_path: string,
    connection: any = null
  ) {
    const date_time = this.dateInYyyyMmDdHhMmSs(date);

    log("Dumping backup");
    await new Promise((resolve, reject) => {
      exec(dumpCommand, async (dumpError: any, stdout: any, stderr: any) => {
        let download_path = "";

        if (dumpError) {
          log(chalk.red(`Emailing backup errored: ${stderr}`));
          await new SendMail(date_time, download_path).failDump(stderr);
          return;
        }

        try {
          log("Uploading dump");
          download_path = await new SaveDumpFile(dump_path).upload();
        } catch (e: any) {
          let err_msg = "";
          if (typeof e === "string") {
            err_msg = e;
          } else {
            err_msg = e.message;
          }

          const upload_err = `Failed to upload dump file ${err_msg}`;
          log("4. Emailing error dump: " + upload_err);
          await new SendMail(date_time, download_path).failDump(upload_err);
        }

        log("6. Emailing success backup");
        await new SendMail(date_time, download_path).successDump();

        log("7. Removing the dump locally");
        exec(`rm -rf ${dump_path}`);

        if (connection) {
          connection.end();
        }
      });
    });
  }

  private padTwoDigits(num: number) {
    return num.toString().padStart(2, "0");
  }

  private dateInYyyyMmDdHhMmSs(date: Date, dateDivider: string = "-") {
    return (
      [
        date.getFullYear(),
        this.padTwoDigits(date.getMonth() + 1),
        this.padTwoDigits(date.getDate()),
      ].join(dateDivider) +
      " " +
      [
        this.padTwoDigits(date.getHours()),
        this.padTwoDigits(date.getMinutes()),
        this.padTwoDigits(date.getSeconds()),
      ].join(":")
    );
  }

  private dateFormatForFilename(date: Date) {
    return [
      `${date.getFullYear()}${this.padTwoDigits(
        date.getMonth() + 1
      )}${this.padTwoDigits(date.getDate())}`,
      `${this.padTwoDigits(date.getHours())}${this.padTwoDigits(
        date.getMinutes()
      )}${this.padTwoDigits(date.getSeconds())}`,
      `${date.getMilliseconds()}`,
    ].join("_");
  }
}
