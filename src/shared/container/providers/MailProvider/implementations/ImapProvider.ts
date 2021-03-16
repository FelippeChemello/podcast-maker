import InterfaceMailProvider from '@shared/container/providers/MailProvider/models/InterfaceImapProvider';

export default class ImapMailProvider implements InterfaceMailProvider {
  private getMailBox() {
    return;
  }

  public async getEmail(): Promise<string> {
    const mailBox = await this.getMailBox();

    console.log(mailBox);

    return '';
  }
}
