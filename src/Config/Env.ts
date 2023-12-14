export enum BackupType {
  MYSQLDUMP = "mysqldump",
  XTRABACKUP = "xtrabackup",
}

export enum MailDriver {
  SMTP = "smtp",
  POSTMARK = "postmark",
  SENDGRID = "sendgrid",
}

export enum StorageDriver {
  SPACES = "spaces",
  GCP_BUCKET = "gcp_bucket",
}

export interface AppConfig {
  // App Config
  APP_NAME: string;
  THEME_COLOR: string | null;
  BACKUP_CRON_SCHEDULE: string;
  BACKUP_SOLN_TYPE: string;

  // DB config
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_PORT: string;

  // Mail Config
  MAIL_DRIVER: string;
  MAIL_FROM: string;
  MAIL_RECIPIENTS: string;

  // postmark
  POSTMARK_SERVER_API_TOKEN: string | undefined;

  // smtp / Sendgrid
  MAIL_HOST: string | undefined;
  MAIL_USER: string | undefined;
  MAIL_PORT: string | undefined;
  MAIL_PASSWORD: string | undefined;

  // Storage
  STORAGE_DRIVER: string;

  // GCP bucket
  GOOGLE_SERVICES_KEY_NAME: string | undefined;
  GOOGLE_BUCKET_NAME: string | undefined;

  // spaces
  DO_SPACES_KEY: string | undefined;
  DO_SPACES_SECRET: string | undefined;
  DO_SPACES_ENDPOINT: string | undefined;
  DO_SPACES_REGION: string | undefined;
  DO_SPACES_BUCKET: string | undefined;
}
