import { Client, Message } from 'discord.js';

import messageHelper from '../../helpers/messageHelper';
import { Handler } from '../Handler';

class MemeCheckerHandler extends Handler {
  authorizedWebsites: string[];

  constructor() {
    super();
    this.authorizedWebsites = [
      'tenor.com',
      'imgur.com',
      'giphy.com',
      'twitter.com',
      'instagram.com',
      'tiktok.com',
    ];
  }

  async validate(client: Client, msg: Message): Promise<boolean> {
    const isValid =
      (await super.validate(client, msg)) &&
      (await messageHelper.isMemeChannel(msg));

    return isValid;
  }

  async process(client: Client, msg: Message): Promise<boolean> {
    let keepMsg = false;

    keepMsg = keepMsg || (msg.attachments.size > 0 && msg.content === '');
    keepMsg =
      keepMsg ||
      (messageHelper.isUrl(msg) &&
        messageHelper.isValidImageFormat(msg.content));
    keepMsg =
      keepMsg ||
      (messageHelper.isUrl(msg) &&
        messageHelper.isWhitelistedHostname(
          msg.content,
          this.authorizedWebsites
        ));

    if (!keepMsg) {
      msg.delete();
    }
    return true;
  }
}

export default MemeCheckerHandler;
