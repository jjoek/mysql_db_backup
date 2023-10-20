import nodemailer from "nodemailer";
import BaseMailer from "../BaseMailer";

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
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : 2525,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_RECIPIENTS?.split(",").map((e) => e.trim()),
      cc: process.env.MAIL_RECIPIENTS,
      subject: this.subject,
      html: this.html_content,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error: Error | null, info: any) => {
      if (error) {
        console.error("Email send error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  }
}
