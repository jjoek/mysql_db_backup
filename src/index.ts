/**
 * 1. Validate all required env variables are setup
 * 2. Validate the configured backup mode is also setup if mysqldump verify mysql dump exists same for percona
 *       can add a bash script to help the user install them if they are missing
 * 3. check the rest
 *
 */
import ValidatePrerequisites from "./ValidatePrerequisites";

export const initiateBackup = async () => {
  await new ValidatePrerequisites().run();
};

await initiateBackup();

// import * as mysql from "mysql2";
// import { exec } from "child_process";
// import * as dotenv from "dotenv";
// import SendMail from "./Mail/SendMail";
// import SaveDumpFile from "./Storage/SaveDumpFile";

// dotenv.config();

// const exportDB = () => {
//   const dbConfig: mysql.ConnectionOptions = {
//     host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT || "3306", 10),
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//   };

//   const backup_soln_type = process.env.BACKUP_SOLN_TYPE;

//   const date_time = getDate();

//   if (backup_soln_type === "xtrabackup") {
//     useXtrabackup(dbConfig, date_time);
//   } else {
//     useMysqlDump(dbConfig, date_time);
//   }
// };

// const getDate = (): string => {
//   const d = new Date();
//   const date_time: string = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}T${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}`;

//   return date_time;
// };

// const useXtrabackup = async (dbConfig: any, date_time: string) => {
//   const dump_path = `tmp_backups/xtrabackups/backup-${dbConfig.database}-${date_time}`;

//   try {
//     const backupCmd = `sudo xtrabackup --backup --databases='${dbConfig.database}' --target-dir='${dump_path}'  --host=${dbConfig.host} --user=${dbConfig.user} --password=${dbConfig.password} --compress`;

//     backupDB(backupCmd, date_time, dump_path);
//   } catch (e: any) {
//     console.log(`2. Backup download failed backup errored: ${e?.message}`);
//     await new SendMail(date_time, "").failDump(e?.message);
//   }
// };

// const useMysqlDump = (dbConfig: any, date_time: string) => {
//   const dump_path = `tmp_backups/mysqldumps/backup-${date_time}.sql.gz`;
//   let connection: any = null;

//   const dumpCommand = `mysqldump --host=${dbConfig.host} --user=${dbConfig.user} --password=${dbConfig.password} ${dbConfig.database} | gzip > ${dump_path}`;

//   connection = mysql.createConnection(dbConfig);

//   connection.connect((err: any) => {
//     if (err) {
//       console.error("Error connecting to MySQL:", err);
//       return;
//     }

//     backupDB(dumpCommand, date_time, dump_path, connection);

//     try {
//       connection.end;
//     } catch (e: any) {
//       console.log("connection was already terminated");
//     }
//   });
// };

// const backupDB = (
//   dumpCommand: string,
//   date_time: string,
//   dump_path: string,
//   connection: any = null
// ) => {
//   console.log("1. Dumping backup");
//   exec(dumpCommand, async (dumpError, stdout, stderr) => {
//     let download_path = "";

//     if (dumpError) {
//       console.log(`2. Emailing backup errored: ${stderr}`);
//       await new SendMail(date_time, download_path).failDump(stderr);
//     } else {
//       try {
//         console.log("3. Uploading dump");
//         download_path = await new SaveDumpFile(dump_path).upload();
//       } catch (e: any) {
//         let err_msg = "";
//         if (typeof e === "string") {
//           err_msg = e;
//         } else {
//           err_msg = e.message;
//         }

//         const upload_err = `Failed to upload dump file ${err_msg}`;
//         console.log("4. Emailing error dump: ", upload_err);
//         await new SendMail(date_time, download_path).failDump(upload_err);
//       }

//       console.log("6. Emailing success backup");
//       await new SendMail(date_time, download_path).successDump();
//     }

//     console.log("7. Removing the dump locally");
//     exec(`rm -rf ${dump_path}`);

//     if (connection) {
//       connection.end();
//     }
//   });
// };

// initiate script
// exportDB();
