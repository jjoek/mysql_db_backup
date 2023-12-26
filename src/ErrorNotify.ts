import config from "./Config/Config";
import SendMail from "./Mail/SendMail";

export default class ErrorNotify {
  public async run(err_msg: string, throws = false, err: any = null) {
    const message = `
        <div>
            <h1>Error occurred</h1>
            <div>${err_msg}</div>
        </div>
    `;

    await new SendMail().send(
      `${config.DB_NAME}: Error backing up db:`,
      message,
      err
    );

    if (throws) {
      console.log(err);
      throw new Error(err_msg);
    }
  }
}
