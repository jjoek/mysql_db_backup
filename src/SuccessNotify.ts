import config from "./Config/Config";
import SendMail from "./Mail/SendMail";

export default class SuccessNotify {
  public async run(download_path: string) {
    const message = `
        <div>We've successfully backed up the database instance as stated above:</div>

        <p><a href="${download_path}">Download Backup</a></p>
    `;

    await new SendMail().send(
      `${config.DB_NAME}: Successfully backed up`,
      message
    );
  }
}
