import config from "./src/Config/Config";

export default class GenerateMailHtml {
  public run(message: string, err: any = null) {
    let stack_trace = err
      ? `
        <br/>
        <div class="stack-trace">
            <h3>Error Stack trace </h3>

            <code>
                ${err.stack}
            <code>
        </div>
    `
      : ``;

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
            .error-container {
                margin-top: 30px;
            }
            .stack-trace {
                background-color: #2c3e50;
                color: #ecf0f1;
                padding: 15px;
                border-radius: 5px;
                overflow-x: auto;
                text-align: left;
            }
            code {
                display: block;
                white-space: pre-wrap;
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

            <br/>
            
            <div>${message}<div>

            ${stack_trace}
        </div>
    </body>
    </html>
    `;
  }
}
