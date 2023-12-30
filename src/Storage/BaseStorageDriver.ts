import config from "../Config/Config";

export default abstract class BaseStorageDriver {
  protected base_upload_path: string;

  constructor() {
    this.base_upload_path = `db_backups/${config.APP_NAME}`;
  }

  public abstract upload(file_name: string): void;

  public abstract prune(): void;
}
