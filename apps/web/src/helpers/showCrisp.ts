import { MISCELLANEOUS } from '@hey/data/tracking';
import { Crisp } from 'crisp-sdk-web';

import { Leafwatch } from './leafwatch';

const showCrisp = () => {
  Crisp.chat.show();
  Crisp.message.show('picker', {
    choices: [
      { label: 'Ask for help', selected: false, value: 'help' },
      { label: 'Report a bug', selected: false, value: 'bug' },
      {
        label: 'Suggest a feature',
        selected: false,
        value: 'feature'
      },
      {
        label: 'Provide some feedback',
        selected: false,
        value: 'feedback'
      }
    ],
    id: 'support-request',
    text: 'Hi, what brings you here today?'
  });

  Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_SUPPORT);
};

export default showCrisp;
