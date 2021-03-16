import fs from 'fs';
import path from 'path';

class GetTextService {
  constructor() {}

  public execute(filename: string): string {
    const text = fs.readFileSync(
      path.resolve(__dirname, '..', '..', '..', '..', 'tmp', filename),
      { encoding: 'utf-8' },
    );

    return text;
  }
}

export default GetTextService;
