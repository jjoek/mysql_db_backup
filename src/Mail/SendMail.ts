import * as dotenv from "dotenv";
import GenerateMailHtml from "../../GenerateMailHtml";
import Postmark from "./Drivers/Postmark";
import Smtp from "./Drivers/Smtp";

export default class SendMail {
  protected driver: any;

  protected date_time: string;

  protected download_path: string;

  constructor(date_time: string, download_path: string) {
    dotenv.config();
    this.driver = process.env.MAIL_DRIVER;
    this.date_time = date_time;
    this.download_path = download_path;
  }

  public async successDump() {
    console.log("Successfully dumped");
    this.send(
      `${process.env.DB_NAME}: Successfully backed up`,
      `We've successfully backed up the database instance as stated below: `
    );
  }

  public async failDump(error_msg: any) {
    console.log("Successfully failed with error message", error_msg);
    this.send(
      `${process.env.DB_NAME}: Failed to backed up`,
      `Database dump failed`,
      error_msg
    );
  }

  private async send(
    subject: string,
    message: string,
    error: Error | string | null = null
  ) {
    const html_content = new GenerateMailHtml().run(
      message,
      this.date_time,
      this.download_path
    );

    if (this.driver == "smtp") {
      return await new Smtp(subject, html_content, error).send();
    }

    if (this.driver == "postmark") {
      return await new Postmark(subject, html_content, error).send();
    }

    throw new Error(`Unsupported driver (${this.driver})`);
  }
}
