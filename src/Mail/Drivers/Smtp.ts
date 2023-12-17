import nodemailer from "nodemailer";
import BaseMailer from "../BaseMailer";
import { promisify } from "util";
import chalk from "chalk";
import config from "../../Config/Config";

export default class Smtp extends BaseMailer {
  constructor(
    subject: string,
    html_content: string,
    error: Error | string | null = null
  ) {
    super(subject, html_content, error);
  }

  public async send() {
    let transporter;

    transporter = nodemailer.createTransport({
      host: config.MAIL_HOST,
      port: config.MAIL_PORT ? parseInt(config.MAIL_PORT) : 2525,
      auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: config.MAIL_FROM,
      to: config.MAIL_RECIPIENTS?.split(",").map((e) => e.trim()),
      cc: config.MAIL_RECIPIENTS,
      subject: this.subject,
      html: this.html_content,
    };

    const sendMailAsync = promisify(transporter.sendMail).bind(transporter);

    // Send the email
    try {
      await sendMailAsync(mailOptions);
      console.log(
        chalk.green(`\tEmail Sent successfully:`) +
          chalk.yellow(` ${this.subject}`)
      );
    } catch (e: any) {
      console.log(
        chalk.green(
          `\t\Unable to send email: ${e.message} Sent successfully` +
            chalk.yellow(` ${this.subject}`)
        )
      );
    }
  }
}
