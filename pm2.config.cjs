require("dotenv").config();
require("path");

module.exports = {
  apps: [
    {
      name: `${process.env.APP_NAME}-db-backup`,
      script: "./src/index.ts",
      interpreter: "./node_modules/.bin/ts-node",
      cron_restart: process.env.BACKUP_CRON_SCHEDULE,
      watch: true,
    },
  ],
};
