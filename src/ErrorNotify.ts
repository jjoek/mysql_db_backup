import config from "./Config/Config";
import SendMail from "./Mail/SendMail";

export default class ErrorNotify {
  public async run(err_msg: string, throws = false) {
    const message = `
        <div>
            <h1>Error occurred</h1>
            <div>${err_msg}</div>
        </div>
    `;

    await new SendMail().send(
      `${config.DB_NAME}: Error backing up db:`,
      message
    );

    if (throws) {
      throw new Error(err_msg);
    }
  }
}
