import { container } from 'tsyringe';

import ImapMailProvider from './implementations/ImapProvider';

container.registerInstance<typeof ImapMailProvider>(
  'ImapMailProvider',
  ImapMailProvider,
);
