# Backup Script

- This is an independent backup script in nodejs.
- Supports multiple storage drivers:
  - Google cloud storage
  - Digital Ocean spaces
- We also email out script progress which also supports multiple mail drivers:
  - SMTP,
  - Postmark
  - Sendgrid

## Installation & Configurations

Configure the different storage or mail drivers

### Storage:

We support several storage drivers listed below:

> Google cloud storage

Begin by installing the GCS npm sdk with:

```
npm i @google-cloud/storage
```

Then on the environment variables add the following:

```
STORAGE_DRIVER=googleCloud
GOOGLE_SERVICES_KEY_NAME=
GOOGLE_BUCKET_NAME=
```

> Digital Ocean spaces

Begin by installing the aws s3 sdk

```
npm i @aws-sdk/client-s3
```

Setup env to have the following values pre-specified:

```
STORAGE_DRIVER=spaces
DO_SPACES_KEY=
DO_SPACES_SECRET=
DO_SPACES_ENDPOINT=
DO_SPACES_REGION=
DO_SPACES_BUCKET=
```

### Mail

General configurations, setup in the env the following values:

```
MAIL_FROM=
MAIL_RECIPIENTS=
```

We also support several mail drivers shown below:

> SMTP

Begin by installing the nodemailer dependancy with:

```
npm i nodemailer
npm i @types/nodemailer --save-dev
```

Add the following env variables

```
MAIL_DRIVER=smtp
MAIL_HOST=
MAIL_USER=
MAIL_PORT=
MAIL_PASSWORD=
```

> Postmark

Begin by installing the postmark dependencies with

```
npm i postmark
```

Then on your .env setup the postmark server api token key with:

```
MAIL_DRIVER=postmark
POSTMARK_SERVER_API_TOKEN
```

### Server setup

When you finish the above scripts and have installed all the relevant npm dependencies.

Next up install `pm2` with:

```
npm install pm2 -g
```

Start the backup script with pm2. We are using pm2 to make sure this handles script failures and restart automatically. This is similar to supervisor in php ecosystem

```
cd <directory where you have this backup project> && pm2 start pm2.config.js
```
