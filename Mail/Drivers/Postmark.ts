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
      process.env.POSTMARK_SERVER_API_TOKEN!
    );

    process.env.MAIL_RECIPIENTS!.split(",").forEach((email) => {
      client.sendEmail({
        From: process.env.MAIL_FROM!,
        To: email.trim(),
        Subject: this.subject,
        HtmlBody: this.html_content,
      });
    });
  }
}
