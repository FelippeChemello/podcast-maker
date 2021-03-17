import { Request, Response } from 'express';

import GetTextService from '@modules/make/services/GetTextService';
import BreakTextInParagraphsService from '@modules/make/services/BreakTextInParagraphsService';
import BreakParagraphIntoSentencesService from '@modules/make/services/BreakParagraphIntoSentencesService';
import GetTagsFromSentencesService from '@modules/make/services/GetTagsFromSentencesService';
import TextToSpeechService from '@modules/make/services/TextToSpeechService';
import RenderVideoService from '@modules/make/services/RenderVideoService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    // const text = new GetTextService().execute('text.txt');

    // const paragraphs = new BreakTextInParagraphsService().execute(text);

    // const paragraphsInPhrasesPromises = paragraphs.map(paragraph =>
    //   new BreakParagraphIntoSentencesService().execute(paragraph),
    // );
    // const paragraphsInPhrases = await Promise.all(paragraphsInPhrasesPromises);

    // const sentencesTagsPromises = paragraphsInPhrases.map(sentences =>
    //   new GetTagsFromSentencesService().execute(sentences),
    // );
    // const SentencesTags = await Promise.all(sentencesTagsPromises);

    // const ttsPromises = paragraphs.map((paragraph, index) =>
    //   new TextToSpeechService().execute(paragraph, index.toString()),
    // );
    // await Promise.all(ttsPromises);

    await new RenderVideoService().execute('', '');

    return response.json({ ok: 'ok' });
  }
}
