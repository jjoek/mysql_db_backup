import * as mysql from "mysql2";
import { exec } from "child_process";
import * as dotenv from "dotenv";
import SendMail from "./Mail/SendMail";
import SaveDumpFile from "./Storage/SaveDumpFile";

dotenv.config();

const exportDB = () => {
  const dbConfig: mysql.ConnectionOptions = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };

  const date_time = getDate();
  const dump_path = `tmp_backups/backup-${date_time}.sql.gz`;
  let connection: any = null;

  connection = mysql.createConnection(dbConfig);

  connection.connect((err: any) => {
    if (err) {
      console.error("Error connecting to MySQL:", err);
      return;
    }

    const dumpCommand = `mysqldump --host=${dbConfig.host} --user=${dbConfig.user} --password=${dbConfig.password} ${dbConfig.database} | gzip > ${dump_path}`;

    console.log("1. Dumping backup");
    exec(dumpCommand, async (dumpError, stdout, stderr) => {
      let download_path = "";

      if (dumpError) {
        console.log(`2. Emailing backup errored: ${stderr}`);
        await new SendMail(date_time, download_path).failDump(stderr);
      } else {
        try {
          console.log("3. Uploading dump");
          download_path = await new SaveDumpFile(dump_path).upload();
        } catch (e: any) {
          let err_msg = "";
          if (typeof e === "string") {
            err_msg = e;
          } else {
            err_msg = e.message;
          }

          const upload_err = `Failed to upload dump file ${err_msg}`;
          console.log("4. Emailing error dump: ", upload_err);
          await new SendMail(date_time, download_path).failDump(upload_err);
        }

        console.log("6. Emailing success backup");
        await new SendMail(date_time, download_path).successDump();
      }

      console.log("7. Removing the dump locally");
      exec(`rm -rf ${dump_path}`);

      connection.end();
    });
  });
};

const getDate = (): string => {
  const d = new Date();
  const date_time: string = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}T${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}`;

  return date_time;
};

// initiate script
exportDB();
