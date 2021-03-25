import fs from 'fs';
import path from 'path';
import os from 'os';
import execa from 'execa';
import { bundle } from '@remotion/bundler';
import {
    getCompositions,
    renderFrames,
    stitchFramesToVideo,
} from '@remotion/renderer';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import ffmpeg from 'fluent-ffmpeg';
import mp3Duration from 'mp3-duration';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

class RenderVideoService {
    constructor() {}

    public async execute(texts: string[], audioPaths: string[]): Promise<void> {
        const compositionId = 'Main';

        console.log('Montando o bundle');
        const bundled = await bundle(
            require.resolve('../../../../video/src/index'),
        );

        console.log(bundled);

        console.log('Pegando comps');
        const compositions = await getCompositions(bundled);

        console.log(compositions);

        console.log('Buscando video');
        const video = compositions.find(c => c.id === compositionId);
        if (!video) {
            console.log('Video não encontrado');
            return;
        }

        console.log('Criando tempdir');
        const framesDir = await fs.promises.mkdtemp(
            path.join(os.tmpdir(), 'remotion-'),
        );

        const textProps: { duration: number; text: string }[] = [
            {
                duration: Math.round(15.408),
                text:
                    'Turma, desejamos a vocês uma excelente terça-feira! Após as notícias de hoje, a gente apresenta um trabalho remoto ganhando em dólar e um curso de inglês específico para programadores para você não perder mais oportunidades em empresas estrangeiras:',
            },
            {
                duration: Math.round(27.984),
                text:
                    'Elon Musk se autodeclara "Tecnorei" da Tesla: a informação foi oficializada em documentos encaminhados à SEC, a comissão de valores mobiliários dos EUA. Musk, entretanto, ainda manterá o cargo de CEO. O CFO da companhia também passará a se intitular "Mestre da Moeda", expressão retirada da série "Game of Thrones" para designar o chefe do tesouro e das finanças do reino fictício. As informações são da Ars Technica.',
            },
            {
                duration: Math.round(22.68),
                text:
                    'Empresa transforma gás carbônico retirado da atmosfera em diamantes: segundo a Aether, cada quilate de um diamante remove 20 toneladas de CO2 da atmosfera, o equivalente ao gás produzido por uma pessoa em um ano. Os diamantes são sintetizados utilizando apenas energia solar, eólica ou hidráulica. As informações são da revista Scientific American.',
            },
            {
                duration: Math.round(38.712),
                text:
                    'Nova IA explica como funcionam algumas ilusões de óptica: os pesquisadores reproduziram certos movimentos que confundem seres humanos e descobriram que a inteligência artificial cometia os mesmos erros de percepção. A MotionNet, criada por pesquisadores da Universidade de Cambridge, foi projetada para corresponder às estruturas de processamento visual humano que não podem ser medidas diretamente no cérebro. A vantagem em utilizar a inteligência artificial é que os cientistas agora podem explorar de perto essa rede neural para entender o motivo de isso acontecer. As informações são da página de imprensa da Universidade de Cambridge.',
            },
            {
                duration: Math.round(28.344),
                text:
                    'Rússia afunda observatório de neutrinos no lago mais profundo do mundo para estudar a história do universo: o Baikal-GVD foi submerso a uma profundidade de até 1,3 km no lago Baical na Sibéria, Rússia. O observatório, que mede meio quilômetro cúbico, é projetado para observar neutrinos, as menores partículas atualmente conhecidas e muito difíceis de detectar, e a água é um meio eficaz para isso. As informações são do site Engadget.',
            },
            {
                duration: Math.round(33.264),
                text:
                    'Netflix deve perder domínio global de streaming em 2024: segundo o relatório da empresa Ampere Analysis, em 2024 a Disney+ vai contar com 295 milhões de usuários, ultrapassando os 279 milhões da Netflix. O serviço de streaming da Walt Disney registrou um crescimento explosivo, atingindo 100 milhões de usuários desde o seu lançamento em 2019, marco que a empresa estimava alcançar apenas após 2024. As informações são do jornal The Guardian.',
            },
            {
                duration: Math.round(32.256),
                text:
                    'Stripe torna-se segunda startup mais valiosa do mundo: a empresa de pagamentos online recebeu uma nova rodada de investimentos avaliando a companhia em 95 bilhões de dólares, ficando apenas atrás da ByteDance, dona do TikTok, que tem valor estimado em 140 bilhões de dólares. Em terceiro lugar está a SpaceX de Elon Musk, avaliada em 74 bilhões de dólares. O Nubank fica na décima posição, avaliado em 25 bilhões de dólares. As informações são do portal G1 da Globo.',
            },
            {
                duration: Math.round(35.256),
                text:
                    'Inventor da Internet, Tim Berners-Lee afirma que precisamos de redes sociais onde "coisas ruins acontecem menos": Berners-Lee acredita que é preciso construir curadorias de comunidades, assim como a Wikipedia, sistemas que levem as pessoas a serem mais construtivas e mais propensas a entender como é estar do outro lado de uma divisão cultural. O cientista da computação também acredita que as redes sociais precisam incentivar usuários a sinalizar informações incorretas e indicar novos amigos que possam melhorar a compreensão de um mundo mais amplo. As informações são do jornal The Guardian.',
            },
            {
                duration: Math.round(28.344),
                text:
                    'Google lança hub que monitora sono usando IA e radar: o Nest Hub utiliza um sensor de radar em miniatura para detectar desde pequenos movimentos dos dedos até o corpo inteiro. O sistema vai utilizar um algoritmo de machine learning para avaliar se a pessoa está alerta, dormindo ou até mesmo roncando. Para treinar o modelo, foram registradas mais de um milhão de horas de dados de radar de milhares de pessoas. As informações são do blog Google AI.',
            },
            {
                duration: Math.round(32.352),
                text:
                    'Sites de phishing agora detectam máquinas virtuais para evitarem identificação: as páginas criadas por criminosos para roubar dados de pessoas estão usando JavaScript para detectar se visitantes estão navegando a partir de uma máquina virtual para evitar o modelo de identificação comumente utilizado por empresas de segurança. Os criminosos obtêm a largura e altura da tela do visitante e usam a API WebGL para verificar o mecanismo de renderização do navegador. As informações são do site Bleeping Computer.',
            },
            {
                duration: Math.round(25.728),
                text:
                    'Rockstar vai aplicar atualização criada por jogador de GTA Online: o patch reduz em 70% o tempo de carregamento do jogo. A solução foi postada por "tostercx" em seu repositório no GitHub e resolve um gargalo em um processo de single thread da CPU na versão para PC do jogo. A Rockstar também vai pagar um bounty de 10 mil dólares pela solução do problema. As informações são do site PC Gamer.',
            },
            {
                duration: Math.round(16.968),
                text:
                    'Amazon AWS faz aniversário de 15 anos: o S3 já armazena mais de 100 trilhões de objetos, com picos de dezenas de milhões de solicitações por segundo. Segundo o post no blog do serviço, são quase 13 mil objetos para cada pessoa no mundo.',
            },
            {
                duration: Math.round(23.184),
                text:
                    '"Não tem como explicar a X-Team de um jeito que não soe absurdo": comentário de Juliano Silva, desenvolvedor brasileiro que trabalha na empresa, no vídeo que o Filipe fez da X-Team. Junte-se a outros brasileiros e trabalhe remotamente em projetos de longo prazo em empresas como Riot Games, FOX e Coinbase e ainda ganhe em dólar! Confira o vídeo no YouTube: Link Patrocinado',
            },
            {
                duration: Math.round(19.752),
                text:
                    'Curso de Inglês Específico para Programadores: aprenda inglês do zero até o uso na vida profissional. Essa oportunidade incrível é válida apenas até amanhã, com risco zero e garantia incondicional de 7 dias! Pare de perder oportunidades de trabalho internacionais ganhando em dólar: Link Afiliado\n',
            },
        ];

        // for (let i = 0; i < texts.length; i++) {
        //     const duration = await this.getDurationOfMp3(audioPaths[i]);
        //     const text = texts[i];

        //     textProps.push({ duration, text });
        // }

        // console.log(textProps);

        console.log('Iniciando render');
        await renderFrames({
            config: video,
            webpackBundle: bundled,
            onStart: () => console.log('Rendering frames...'),
            onFrameUpdate: f => {
                if (f % 10 === 0) {
                    console.log(`Rendered frame ${f}`);
                }
            },
            parallelism: null,
            outputDir: framesDir,
            userProps: {
                duration: 300,
            },
            compositionId,
            imageFormat: 'jpeg',
        });

        console.log('Unindo frames');
        const outputDir = path.join(__dirname, '..', '..', '..', '..', 'tmp');
        await stitchFramesToVideo({
            dir: framesDir,
            force: true,
            fps: video.fps,
            height: video.height,
            width: video.width,
            imageFormat: 'jpeg',
            outputLocation: path.join(
                __dirname,
                '..',
                '..',
                '..',
                '..',
                'tmp',
                'out.mp4',
            ),
            pixelFormat: 'yuv420p',
            onProgress: frame => void 0,
        });

        console.log(path.join(outputDir, 'out.mp4'));

        console.log('Unindo audio');
        ffmpeg(path.join(outputDir, 'out.mp4'))
            .addInput(path.join(outputDir, 'output-final.mp3'))
            .saveToFile(path.join(outputDir, 'final.mp4'));

        try {
            await Promise.all([
                fs.promises.rmdir(framesDir, {
                    recursive: true,
                }),
                fs.promises.rmdir(bundled, {
                    recursive: true,
                }),
            ]);
        } catch (err) {
            console.error('Could not clean up directory.');
            console.error(err);
            console.log('Do you have minimum required Node.js version?');
            process.exit(1);
        }
    }

    public async getDurationOfMp3(filePath: string): Promise<number> {
        return new Promise((resolve, reject) =>
            mp3Duration(filePath, (err, duration) => {
                if (err) {
                    console.log('Erro ao buscar dados de duração do clipe');
                    reject(99);
                }

                resolve(duration);
            }),
        );
    }
}

export default RenderVideoService;
