import GenerateMailHtml from "../../GenerateMailHtml";
import Postmark from "./Drivers/Postmark";
import Smtp from "./Drivers/Smtp";
import config from "../Config/Config";
import ErrorNotify from "../ErrorNotify";

export default class SendMail {
  public async send(subject: string, message: string, err: any = null) {
    const html_content = new GenerateMailHtml().run(message, err);

    if (config.MAIL_DRIVER == "smtp") {
      return await new Smtp(subject, html_content).send();
    }

    if (config.MAIL_DRIVER == "postmark") {
      return await new Postmark(subject, html_content).send();
    }

    await new ErrorNotify().run(
      `Unsupported mail driver (${config.MAIL_DRIVER})`,
      true
    );
  }
}
