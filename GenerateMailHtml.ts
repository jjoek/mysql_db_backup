export default class GenerateMailHtml {
  public run(
    message: string,
    date: string,
    download_path: string,
    error: Error | string | null = ""
  ) {
    let error_msg = error ? error : "";

    return `<!DOCTYPE html>
    <html>
    <head>
        <title>Backup Successful</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                background-color: ${process.env.THEME_COLOR};
                color: white;
            }
            .container {
                margin: 100px auto;
                max-width: 400px;
                padding: 20px;
                background-color: ${process.env.THEME_COLOR};
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
            <h1>${message}</h1>
            
            <div>
                App Name: ${process.env.APP_NAME} <br/>
                Database: ${process.env.DB_NAME} <br/>
                Date: ${date}
            </div>


            <p><a href="${download_path}">Download Backup</a></p>

            <div>${error_msg}</div>
        </div>
    </body>
    </html>
    `;
  }
}
