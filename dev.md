## <u>Working with partial backups (Just want to backup a single database)</u>

You can backup specific tables but in this case we'll only work with databases and assume we only want to backup one database

```
sudo xtrabackup --backup --databases='portfolio' --target-dir=portfolio_backup  -u username --password=sd324ssdff --compress
```

How to restore a partial backup

1. decompress:

   ```
   sudo xtrabackup --decompress --target-dir=portfolio_backup
   ```

2. Prepare backup
   ```
   sudo xtrabackup --prepare --target-dir=portfolio_backup
   ```
3. Stop mysql service if it is running:

   ```
   sudo service mysql stop
   ```

4. Since we are again sure that the copy of the database backup we have is what we want to keep to restore, we'll first of need to remove any that exists within mysql data files specifically for this database `portfolio`

   ```
   sudo rm -rf /var/lib/mysql/portfolio
   ```

   Then we copy this directory there to the mysql data files with:

   ```
   sudo cp -r portfolio_backup/portfolio /var/lib/mysql/
   ```

   Finally update and adjust file permissions for the directory you copied to, so as to give mysql permissions.

   ```
   sudo chown -R mysql:mysql /var/lib/mysql/
   ```

   After copying we'll now start up our mysql server with:

   ```
   sudo service mysql start
   ```

## <u>Full backup</u>

Full backup - All databases

```
sudo xtrabackup --backup --target-dir=full_backup -u dbuser --password=dbpassword --compress
```

To restore, you will need to:

1. decompress:

   ```
   sudo xtrabackup --decompress --target-dir=full_backup
   ```

2. Prepare backup
   ```
   sudo xtrabackup --prepare --target-dir=full_backup
   ```
3. Stop mysql service if it is running:

   ```
   sudo service mysql stop
   ```

4. Since this is a full backup restore and are sure this is the only good copy. (If this is not the case please backup your `/var/lib/mysql` directory).
   We'll go ahead and delete /var/lib/mysql directory to avoid file exists issues if any and run the following:
   ```
   sudo rm -rf /var/lib/mysql &&
   sudo xtrabackup --copy-back --target-dir=full_backup --datadir=/var/lib/mysql --force-non-empty-directories
   ```
5. Finally update and adjust file permissions for the directory you copied to, so as to give mysql permissions.

```
sudo chown -R mysql:mysql /var/lib/mysql/
```

6. Finally restart mysql server and you should be back up.

```
sudo service mysql start
```
