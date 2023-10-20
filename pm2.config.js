require("dotenv").config();

module.exports = {
  apps: [
    {
      name: `${process.env.APP_NAME}-db-backup`,
      script: "./index.ts",
      interpreter: "./node_modules/.bin/ts-node",
      cron: process.env.BACKUP_CRON_SCHEDULE,
    },
  ],
};
