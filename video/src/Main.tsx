import {
    interpolate,
    Sequence,
    useCurrentFrame,
    useVideoConfig,
    getInputProps,
    random,
} from 'remotion';
import { Title } from './Podcast/Title';
import { AudioWaveform } from './Podcast/AudioWaveform';
import { Transition } from './Podcast/Transition';
import { Logo } from './Podcast/Logo';
import { Intro } from './Podcast/Intro';
import { Wrapper } from './Wrappers/index';
import InterfaceJsonContent from '../../src/models/InterfaceJsonContent';

const { withoutIntro } = getInputProps();

export const Main: React.FC<{
    content: InterfaceJsonContent
}> = ({ content: { renderData, date, title, youtube } }) => {
    if (!renderData) {
        throw new Error('Missing renderData');
    }

    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();
    const transitionDurationInFrames = 2.9 * fps;
    const showWrapperOnIndex =
        renderData.length > 2
            ? Math.floor(random(title) * (renderData.length - 2 - 2) + 2) //Valor randomico entre 2 e (quantidade de noticias - final - ultima noticia)
            : -1; //If have less then 2 news will not show wrapper

    const opacity = interpolate(
        frame,
        [durationInFrames - 30, durationInFrames - 10],
        [1, 0],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        },
    );

    let initialFrame = 10;
    let nextInitialFrame = initialFrame;

    return (
        <div
            style={{
                flex: 1,
                background: '#0C2D48',
            }}
        >
            <div style={{ opacity }}>
                {renderData.map((prop, index) => {
                    const textDuration = Math.round(prop.duration * fps);

                    initialFrame = nextInitialFrame;
                    nextInitialFrame =
                        initialFrame +
                        transitionDurationInFrames +
                        textDuration;

                    if (index === 0 && !withoutIntro) {
                        return (
                            <>
                                <Sequence
                                    key={`${initialFrame}-Intro`}
                                    from={initialFrame}
                                    durationInFrames={textDuration}
                                >
                                    <Intro
                                        date={date}
                                        audioFilePath={prop.audioFilePath}
                                        title={title}
                                        details={{subscribers: youtube?.subscriberCount }}
                                    />
                                    <Logo />
                                </Sequence>
                                {index < renderData.length - 1 ? (
                                    <Sequence
                                        key={`${initialFrame}-Transition`}
                                        from={initialFrame + textDuration}
                                        durationInFrames={
                                            transitionDurationInFrames
                                        }
                                    >
                                        <Transition />
                                    </Sequence>
                                ) : null}
                            </>
                        );
                    }

                    return (
                        <>
                            <Sequence
                                key={`${initialFrame}-Title`}
                                from={initialFrame}
                                durationInFrames={textDuration}
                            >
                                <Wrapper
                                    title={title}
                                    show={index === showWrapperOnIndex}
                                >
                                    <Logo />

                                    <Title segments={prop.segments} />
                                    <AudioWaveform
                                        audioFilePath={prop.audioFilePath}
                                    />
                                </Wrapper>
                            </Sequence>
                            {index < renderData.length - 1 ? (
                                <Sequence
                                    key={`${initialFrame}-Transition`}
                                    from={initialFrame + textDuration}
                                    durationInFrames={
                                        transitionDurationInFrames
                                    }
                                >
                                    <Transition />
                                </Sequence>
                            ) : null}
                        </>
                    );
                })}
            </div>
        </div>
    );
};
