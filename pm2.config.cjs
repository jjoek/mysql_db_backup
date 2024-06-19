require("dotenv").config();
require("path");

module.exports = {
  apps: [
    {
      name: `${process.env.APP_NAME}-db-backup`,
      script: "./src/index.ts",
      interpreter: "./node_modules/.bin/tsx",
      cron_restart: process.env.BACKUP_CRON_SCHEDULE,
      autorestart: false,
    },
  ],
};
