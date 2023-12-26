/**
 * 1. Validate all required env variables are setup
 * 2. Validate the configured backup mode is also setup if mysqldump verify mysql dump exists same for percona
 *       can add a bash script to help the user install them if they are missing
 * 3. check the rest
 *
 */
import chalk from "chalk";
import ValidatePrerequisites from "./ValidatePrerequisites";
import Backup from "./Backup";
import PruneOldBackups from "./PruneOldBackups";

const log = (str: string) => {
  console.log(str);
};

export const initiateBackup = async () => {
  log(`\n\nMysql DB Backup version: ${chalk.green("v1.0.0")}`);

  // Env validate and any other prerequisites to run backup
  await new ValidatePrerequisites().run();

  // Start the backup process
  await new Backup().run();
  log(chalk.green("Done!!"));

  // Prune Older backups
  log("3. Prunning old backups");
  await new PruneOldBackups().run();
};

await initiateBackup();
