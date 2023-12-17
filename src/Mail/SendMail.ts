import GenerateMailHtml from "../../GenerateMailHtml";
import Postmark from "./Drivers/Postmark";
import Smtp from "./Drivers/Smtp";
import config from "../Config/Config";
import ErrorNotify from "../ErrorNotify";

export default class SendMail {
  public async send(subject: string, message: string) {
    const html_content = new GenerateMailHtml().run(message);

    if (config.MAIL_DRIVER == "smtp") {
      return await new Smtp(subject, html_content).send();
    }

    if (config.MAIL_DRIVER == "postmark") {
      return await new Postmark(subject, html_content).send();
    }

    new ErrorNotify().run(
      `Unsupported mail driver (${config.MAIL_DRIVER})`,
      true
    );
  }
}
