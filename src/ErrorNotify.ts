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

    const db_name = config ? config.DB_NAME : "";
    await new SendMail().send(`${db_name}: Error backing up db:`, message, err);

    if (throws) {
      console.log(err);
      throw new Error(err_msg);
    }
  }
}
