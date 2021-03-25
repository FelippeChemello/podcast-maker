import { Request, Response } from 'express';

import GetTextService from '@modules/make/services/GetTextService';
import BreakTextInParagraphsService from '@modules/make/services/BreakTextInParagraphsService';
import BreakParagraphIntoSentencesService from '@modules/make/services/BreakParagraphIntoSentencesService';
import GetTagsFromSentencesService from '@modules/make/services/GetTagsFromSentencesService';
import TextToSpeechService from '@modules/make/services/TextToSpeechService';
import CreateSingleAudioFileWithTransitionsService from '@modules/make/services/CreateSingleAudioFileWithTransitionsService';
import RenderVideoService from '@modules/make/services/RenderVideoService';

export default class AppointmentsController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        console.log('Buscando texto');
        const text = new GetTextService().execute('.text.txt');

        console.log('Separando em paragrafos');
        const paragraphs = new BreakTextInParagraphsService().execute(text);

        // console.log('Separando em frases');
        // const paragraphsInPhrasesPromises = paragraphs.map(paragraph =>
        //   new BreakParagraphIntoSentencesService().execute(paragraph),
        // );
        // const paragraphsInPhrases = await Promise.all(paragraphsInPhrasesPromises);

        // const sentencesTagsPromises = paragraphsInPhrases.map(sentences =>
        //   new GetTagsFromSentencesService().execute(sentences),
        // );
        // const SentencesTags = await Promise.all(sentencesTagsPromises);

        const tts: string[] = [];
        // for (let i = 0; i < paragraphs.length; i++) {
        //   const path = await new TextToSpeechService().execute(
        //     paragraphs[i],
        //     i.toString(),
        //   );
        //   tts.push(path);
        // }

        // console.log('Unindo audios');
        // await new CreateSingleAudioFileWithTransitionsService().execute(tts);

        console.log('Iniciando Render');
        await new RenderVideoService().execute(paragraphs || [], tts || []);

        return response.json({ ok: 'ok' });
    }
}
