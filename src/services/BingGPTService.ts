import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

import { log } from '../utils/log';
import type from 'node-html-parser/dist/nodes/type';
import { Config } from 'remotion';

enum ConversationStyle {
    CREATIVE = "creative",
    BALANCED = "balanced",
    PRECISE = "precise"
}

type Config = {
    style: ConversationStyle;
}

export default class BingGPTService {
    private readonly ws: WebSocket;
    private chat

    private readonly url = "wss://sydney.bing.com/sydney/ChatHub"
    private readonly terminalChar = ""

    constructor({
        style
    }: Config = {
        style: ConversationStyle.BALANCED
    }) {
        this.ws = new WebSocket(this.url, {
            perMessageDeflate: false,
            headers: {
                'accept-language': 'en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7',
                'cache-control': 'no-cache',
                pragma: 'no-cache',
            }
        });

        this.ws.on('open', () => {
            log('Connected to Bing GPT', 'BingGPTService');
        });

        this.ws.on('error', (err) => {
            log(`Error: ${err}`, 'BingGPTService');
        })

        this.ws.on('close', () => {
            log('Disconnected from Bing GPT', 'BingGPTService');
        })

        this.ws.on('message', async (data) => {
            await this.handleMessage(data);
        })
    }

    private async prepareMessage(message: string | any): Promise<string> {
        if (typeof message === 'string') {
            return `${message}${this.terminalChar}`
        }

        return `${JSON.stringify(message)}${this.terminalChar}`
    }

    private async handleMessage(message: string): Promise<any> {
        const data = message.split(this.terminalChar)[0]


    }

    private initialHandshake(): void {
        this.ws.send(this.prepareMessage({
            protocol: 'json',
            version: 1,
        }))

        this.ws.send(this.prepareMessage({
            type: 6
        }))
    }
}

export class BingChat {
    private readonly conversationStylesParams = {
        [ConversationStyle.CREATIVE]: [
            "nlu_direct_response_filter",
            "deepleo",
            "disable_emoji_spoken_text",
            "responsible_ai_policy_235",
            "enablemm",
            "h3imaginative",
            "objopinion",
            "dsblhlthcrd",
            "dv3sugg",
            "autosave",
            "clgalileo",
            "gencontentv3",
        ],
        [ConversationStyle.BALANCED]: [
            "nlu_direct_response_filter",
            "deepleo",
            "disable_emoji_spoken_text",
            "responsible_ai_policy_235",
            "enablemm",
            "galileo",
            "saharagenconv5",
            "objopinion",
            "dsblhlthcrd",
            "dv3sugg",
            "autosave",
        ],
        [ConversationStyle.PRECISE]: [
            "nlu_direct_response_filter",
            "deepleo",
            "disable_emoji_spoken_text",
            "responsible_ai_policy_235",
            "enablemm",
            "h3precise",
            "objopinion",
            "dsblhlthcrd",
            "dv3sugg",
            "autosave",
            "clgalileo",
            "gencontentv3",
        ]
    }

    private readonly id = uuidv4();
    
    private readonly now = Date.now();

}