export default abstract class BaseMailer {
  protected subject: string;

  protected error: Error | string | null;

  protected html_content: string;

  constructor(
    subject: string,
    html_content: string,
    error: Error | string | null = null
  ) {
    this.subject = subject;

    this.html_content = html_content;

    this.error = error;
  }

  public abstract send(): void;
}
