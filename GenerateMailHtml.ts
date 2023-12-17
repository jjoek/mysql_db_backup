import config from "./src/Config/Config";

export default class GenerateMailHtml {
  public run(message: string) {
    return `<!DOCTYPE html>
    <html>
    <head>
        <title>Backup Successful</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                background-color: ${config.THEME_COLOR};
                color: white;
            }
            .container {
                margin: 100px auto;
                max-width: 400px;
                padding: 20px;
                background-color: ${config.THEME_COLOR};
                border-radius: 5px;
            }
            h1 {
                font-size: 24px;
            }
            p {
                font-size: 18px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div>
                App Name: ${config.APP_NAME} <br/>
                Database: ${config.DB_NAME} <br/>
                Date: ${
                  new Date().getFullYear() +
                  "/0" +
                  (new Date().getMonth() + 1) +
                  "/" +
                  new Date().getDate() +
                  " " +
                  new Date().getHours() +
                  ":" +
                  new Date().getMinutes() +
                  ":" +
                  new Date().getSeconds()
                }
            </div>


            <div>${message}<div>
        </div>
    </body>
    </html>
    `;
  }
}
