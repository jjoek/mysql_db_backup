module.exports = {
  apps: [
    {
      name: `${process.env.APP_NAME}-db-backup`,
      script: "./index.ts",
      exec_mode: "ts-node",
      cron: process.env.BACKUP_CRON_SCHEDULE,
    },
  ],
};
