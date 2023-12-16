/**
 * 1. Validate all required env variables are setup
 * 2. Validate the configured backup mode is also setup if mysqldump verify mysql dump exists same for percona
 *       can add a bash script to help the user install them if they are missing
 * 3. check the rest
 *
 */
import chalk from "chalk";
import config from "./Config/Config";
import ValidatePrerequisites from "./ValidatePrerequisites";
import Backup from "./Backup";

const log = (str: string) => {
  console.log(str);
};

export const initiateBackup = async () => {
  log(`\n\nMysql DB Backup version: ${chalk.green("v1.0.0")}`);

  await new ValidatePrerequisites().run();
  log("1. All pre-requisites look okay 👍🏽");

  const backup_option = config.BACKUP_SOLN_TYPE;
  log(
    `2. Starting the backup process using: ${chalk.green(
      backup_option
    )} as the configured backup option`
  );

  await new Backup().run();
  log(chalk.green("Done!!"));
};

await initiateBackup();
