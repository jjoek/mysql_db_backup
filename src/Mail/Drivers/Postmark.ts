import config from "../../Config/Config";
import BaseMailer from "../BaseMailer";
import * as PostmarkDriver from "postmark";

export default class Postmark extends BaseMailer {
  constructor(
    subject: string,
    html_content: string,
    error: Error | string | null = null
  ) {
    super(subject, html_content, error);
  }

  public async send() {
    const client = new PostmarkDriver.ServerClient(
      config.POSTMARK_SERVER_API_TOKEN!
    );

    config.MAIL_RECIPIENTS!.split(",").forEach((email) => {
      client.sendEmail({
        From: config.MAIL_FROM!,
        To: email.trim(),
        Subject: this.subject,
        HtmlBody: this.html_content,
      });
    });
  }
}
