import dotenv from "dotenv";
import { AppConfig, BackupType, StorageDriver, MailDriver } from "./Env";
import ErrorNotify from "../ErrorNotify";
import chalk from "chalk";

// Load environment variables from .env file
dotenv.config();

const config: AppConfig = {
  // App configs
  APP_NAME: process.env.APP_NAME || missingEnvError("Please setup app name"),
  THEME_COLOR: process.env.THEME_COLOR || "#B56308",
  BACKUP_CRON_SCHEDULE:
    process.env.BACKUP_CRON_SCHEDULE || "0 0,4,8,12,16,20 * * *",
  BACKUP_SOLN_TYPE: inType(
    BackupType,
    process.env.BACKUP_SOLN_TYPE,
    "BackupType"
  )
    ? process.env.BACKUP_SOLN_TYPE!
    : BackupType.MYSQLDUMP,

  // DB configs
  DB_HOST: process.env.DB_HOST || missingEnvError("Please specify the db host"),
  DB_USER: process.env.DB_USER || missingEnvError("Please specify the db user"),
  DB_PASSWORD:
    process.env.DB_PASSWORD ||
    missingEnvError("Please specify the db password"),
  DB_NAME: process.env.DB_NAME || missingEnvError("Please specify the db name"),
  DB_PORT: process.env.DB_PORT || "3306",

  // Mail configs
  MAIL_DRIVER: inType(MailDriver, process.env.MAIL_DRIVER, "MailDriver")
    ? process.env.MAIL_DRIVER!
    : MailDriver.SMTP,
  MAIL_FROM:
    process.env.MAIL_FROM ||
    missingEnvError("Please the mail source: MAIL_FROM"),
  MAIL_RECIPIENTS:
    process.env.MAIL_RECIPIENTS ||
    missingEnvError(
      "Please the mail recipients if many, have it as a comma separated list: MAIL_RECIPIENTS"
    ),

  // postmark
  POSTMARK_SERVER_API_TOKEN:
    process.env.MAIL_DRIVER &&
    process.env.MAIL_DRIVER === MailDriver.POSTMARK &&
    !process.env.POSTMARK_SERVER_API_TOKEN
      ? missingEnvError(
          "If the mail driver is set to postmark, we also require the POSTMARK_SERVER_API_TOKEN set"
        )
      : process.env.POSTMARK_SERVER_API_TOKEN,

  // smtp
  MAIL_HOST:
    process.env.MAIL_DRIVER &&
    process.env.MAIL_DRIVER in [MailDriver.SENDGRID, MailDriver.SMTP] &&
    !process.env.MAIL_HOST
      ? missingEnvError(
          "If mail driver is set to either smtp or sendgrid, the MAIL_HOST is required"
        )
      : process.env.MAIL_HOST,
  MAIL_USER:
    process.env.MAIL_DRIVER &&
    process.env.MAIL_DRIVER in [MailDriver.SENDGRID, MailDriver.SMTP] &&
    !process.env.MAIL_USER
      ? missingEnvError(
          "If mail driver is set to either smtp or sendgrid, the MAIL_USER is required"
        )
      : process.env.MAIL_USER,
  MAIL_PORT:
    process.env.MAIL_DRIVER &&
    process.env.MAIL_DRIVER in [MailDriver.SENDGRID, MailDriver.SMTP] &&
    !process.env.MAIL_PORT
      ? missingEnvError(
          "If mail driver is set to either smtp or sendgrid, the MAIL_PORT is required"
        )
      : process.env.MAIL_PORT,
  MAIL_PASSWORD:
    process.env.MAIL_DRIVER &&
    process.env.MAIL_DRIVER in [MailDriver.SENDGRID, MailDriver.SMTP] &&
    !process.env.MAIL_PASSWORD
      ? missingEnvError(
          "If mail driver is set to either smtp or sendgrid, the MAIL_PASSWORD is required"
        )
      : process.env.MAIL_PASSWORD,

  // Storage configs
  STORAGE_DRIVER: inType(
    StorageDriver,
    process.env.STORAGE_DRIVER,
    "StorageDriver"
  )
    ? process.env.STORAGE_DRIVER!
    : StorageDriver.SPACES,

  // GCP Bucket
  GOOGLE_SERVICES_KEY_NAME:
    process.env.STORAGE_DRIVER &&
    process.env.STORAGE_DRIVER === StorageDriver.GCP_BUCKET &&
    !process.env.GOOGLE_SERVICES_KEY_NAME
      ? missingEnvError(
          "If the storage driver is set to gcp bucket, we also require the GOOGLE_SERVICES_KEY_NAME"
        )
      : process.env.GOOGLE_SERVICES_KEY_NAME,
  GOOGLE_BUCKET_NAME:
    process.env.STORAGE_DRIVER &&
    process.env.STORAGE_DRIVER === StorageDriver.GCP_BUCKET &&
    !process.env.GOOGLE_BUCKET_NAME
      ? missingEnvError(
          "If the storage driver is set to gcp bucket, we also require the GOOGLE_BUCKET_NAME"
        )
      : process.env.GOOGLE_BUCKET_NAME,

  // Digital ocean spaces
  DO_SPACES_KEY:
    process.env.STORAGE_DRIVER &&
    process.env.STORAGE_DRIVER === StorageDriver.SPACES &&
    !process.env.DO_SPACES_KEY
      ? missingEnvError(
          "If the storage driver is set to spaces, we also require the DO_SPACES_KEY"
        )
      : process.env.DO_SPACES_KEY,
  DO_SPACES_SECRET:
    process.env.STORAGE_DRIVER &&
    process.env.STORAGE_DRIVER === StorageDriver.SPACES &&
    !process.env.DO_SPACES_SECRET
      ? missingEnvError(
          "If the storage driver is set to spaces, we also require the DO_SPACES_SECRET"
        )
      : process.env.DO_SPACES_SECRET,
  DO_SPACES_ENDPOINT:
    process.env.STORAGE_DRIVER &&
    process.env.STORAGE_DRIVER === StorageDriver.SPACES &&
    !process.env.DO_SPACES_ENDPOINT
      ? missingEnvError(
          "If the storage driver is set to spaces, we also require the DO_SPACES_ENDPOINT"
        )
      : process.env.DO_SPACES_ENDPOINT,
  DO_SPACES_REGION:
    process.env.STORAGE_DRIVER &&
    process.env.STORAGE_DRIVER === StorageDriver.SPACES &&
    !process.env.DO_SPACES_REGION
      ? missingEnvError(
          "If the storage driver is set to spaces, we also require the DO_SPACES_REGION"
        )
      : process.env.DO_SPACES_REGION,
  DO_SPACES_BUCKET:
    process.env.STORAGE_DRIVER &&
    process.env.STORAGE_DRIVER === StorageDriver.SPACES &&
    !process.env.DO_SPACES_BUCKET
      ? missingEnvError(
          "If the storage driver is set to spaces, we also require the DO_SPACES_BUCKET"
        )
      : process.env.DO_SPACES_BUCKET,

  // AWS S3
  AWS_S3_KEY:
    process.env.STORAGE_DRIVER &&
    process.env.STORAGE_DRIVER === StorageDriver.SPACES &&
    !process.env.AWS_S3_KEY
      ? missingEnvError(
          "If the storage driver is set to spaces, we also require the AWS_S3_KEY"
        )
      : process.env.AWS_S3_KEY,
  AWS_S3_SECRET:
    process.env.STORAGE_DRIVER &&
    process.env.STORAGE_DRIVER === StorageDriver.SPACES &&
    !process.env.AWS_S3_SECRET
      ? missingEnvError(
          "If the storage driver is set to spaces, we also require the AWS_S3_SECRET"
        )
      : process.env.AWS_S3_SECRET,
  AWS_S3_ENDPOINT:
    process.env.STORAGE_DRIVER &&
    process.env.STORAGE_DRIVER === StorageDriver.SPACES &&
    !process.env.AWS_S3_ENDPOINT
      ? missingEnvError(
          "If the storage driver is set to spaces, we also require the AWS_S3_ENDPOINT"
        )
      : process.env.AWS_S3_ENDPOINT,
  AWS_S3_REGION:
    process.env.STORAGE_DRIVER &&
    process.env.STORAGE_DRIVER === StorageDriver.SPACES &&
    !process.env.AWS_S3_REGION
      ? missingEnvError(
          "If the storage driver is set to spaces, we also require the AWS_S3_REGION"
        )
      : process.env.AWS_S3_REGION,
  AWS_S3_BUCKET:
    process.env.STORAGE_DRIVER &&
    process.env.STORAGE_DRIVER === StorageDriver.SPACES &&
    !process.env.AWS_S3_BUCKET
      ? missingEnvError(
          "If the storage driver is set to spaces, we also require the AWS_S3_BUCKET"
        )
      : process.env.AWS_S3_BUCKET,
};

function inType(type: any, value: string | undefined, type_name: string) {
  if (!value || !Object.values(type).includes(value)) {
    const err_msg = `Invalid or missing ${type_name}`;
    console.log(chalk.red(err_msg));
    new ErrorNotify().run(err_msg, true);
  }
  return true;
}

function missingEnvError(err_msg: string): never {
  throw new Error(`Env: ${err_msg}`);
}

export default config;
