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
      'x.com',
      'xcancel.com',
      'twitter.com',
      'instagram.com',
      'tiktok.com',
      'bsky.app',
      'youtube.com',
      'youtu.be',
      'twitch.tv',
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

    keepMsg ||= msg.attachments.size > 0 && msg.content === '';
    keepMsg ||=
      messageHelper.isUrl(msg) && messageHelper.isValidImageFormat(msg.content);
    keepMsg ||=
      messageHelper.isUrl(msg) &&
      messageHelper.isWhitelistedHostname(msg.content, this.authorizedWebsites);

    // vocal message
    if (msg.attachments.some(({ name }) => name === 'voice-message.ogg')) {
      keepMsg = false;
    }

    if (!keepMsg) {
      msg.delete();
    }
    return true;
  }
}

export default MemeCheckerHandler;
