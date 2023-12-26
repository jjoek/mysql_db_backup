import BackupStorage from "./Storage/BackupStorage";

export default class PruneOldBackups {
  public async run() {
    await new BackupStorage().prune();
  }
}
