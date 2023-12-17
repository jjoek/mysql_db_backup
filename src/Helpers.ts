export default class Helpers {
  public static padTwoDigits(num: number) {
    return num.toString().padStart(2, "0");
  }

  public static dateInYyyyMmDdHhMmSs(date: Date, dateDivider: string = "-") {
    return (
      [
        date.getFullYear(),
        this.padTwoDigits(date.getMonth() + 1),
        this.padTwoDigits(date.getDate()),
      ].join(dateDivider) +
      " " +
      [
        this.padTwoDigits(date.getHours()),
        this.padTwoDigits(date.getMinutes()),
        this.padTwoDigits(date.getSeconds()),
      ].join(":")
    );
  }

  public static dateFormatForFilename(date: Date) {
    return [
      `${date.getFullYear()}${this.padTwoDigits(
        date.getMonth() + 1
      )}${this.padTwoDigits(date.getDate())}`,
      `${this.padTwoDigits(date.getHours())}${this.padTwoDigits(
        date.getMinutes()
      )}${this.padTwoDigits(date.getSeconds())}`,
      `${date.getMilliseconds()}`,
    ].join("_");
  }
}
