# Mysql DB Backup Script

- This is an independent mysql db backup script built in nodejs.
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

Begin by setting up environment variables:

```
STORAGE_DRIVER=googleCloud
GOOGLE_SERVICES_KEY_NAME=
GOOGLE_BUCKET_NAME=
```

> Digital Ocean spaces

Begin by setting up env to have the following values pre-specified:

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

### Server setup (Ubuntu)

We support two backup approaches:

1. Using the good old `mysqldump`. This one works by creating sql statements to to re-create the backed up database (DEFAULT)
2. Or using the percona `xtrabackup` script. This one works by backing up the actual mysql data files.

Comparison:

| Feature     | mysqldump                       | Percona XtraBackup       |
| ----------- | ------------------------------- | ------------------------ |
| Backup type | Logical                         | Physical                 |
| Good for    | Small to medium-sized databases | Large databases          |
| Hot backups | No                              | Yes                      |
| Speed       | Slow for large databases        | Fast for large databases |

To choose between the two update the env variable backup_soln_type, by default if you don't specify any we use the mysqldump option

```
BACKUP_SOLN_TYPE=mysqldump
```

Mysqldump requires no extra setup but for the percona xtrabackup, you will need to install a few more dependencies on your system as listed below:

<b>Please note when using xtrabackup, you'll need to run this as root to avoid permission issues errors</b>

##### Percona Xtrabackup install (Debian/Ubuntu)

You can also get the following steps from here: [Percona APT installation instructions](https://docs.percona.com/percona-xtrabackup/8.0/apt-repo.html#install-percona-xtrabackup-through-percona-release)

Run the following installation scripts to install xtrabackup version 8;

> Please note this doesn't support mysql versions lower than version 8

Insallations:

1. Download from percona

```
wget https://downloads.percona.com/downloads/Percona-XtraBackup-LATEST/Percona-XtraBackup-8.0.26-18/binary/debian/focal/x86_64/percona-xtrabackup-80_8.0.26-18-1.focal_amd64.deb
```

2. Extract

```
sudo dpkg -i percona-xtrabackup-80_8.0.26-18-1.focal_amd64.deb
```

3. Incase you experience any errors run below

```
sudo apt-get install -f && sudo dpkg -i percona-xtrabackup-80_8.0.26-18-1.focal_amd64.deb
```

4. Finally update system

```
 sudo percona-release enable-only tools release
 sudo apt-get update
 sudo apt install percona-xtrabackup-80
```

5. Setup decompression algorithm

```
sudo apt install lz4
```

#### Node dependencies and Pm2 setup

When you finish the above scripts and have installed all the relevant npm dependencies.

Next up install `pm2` with:

```
npm install pm2 -g
```

Start the backup script with pm2. We are using pm2 to make sure this handles script failures and restart automatically. This is similar to supervisor in php ecosystem

```
cd <directory where you have this backup project> && npm start
```
