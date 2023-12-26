export default abstract class BaseStorageDriver {
  public abstract upload(): void;

  public abstract prune(): void;
}
