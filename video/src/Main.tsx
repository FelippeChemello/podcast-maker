import {
	interpolate,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	getInputProps,
	random,
} from 'remotion';
import {Title} from './Podcast/Title';
import {AudioWaveform} from './Podcast/AudioWaveform';
import {Transition} from './Podcast/Transition';
import {Logo} from './Podcast/Logo';
import {Intro} from './Podcast/Intro';
import {Wrapper} from './Wrappers/index';

const {withoutIntro} = getInputProps();

export const Main: React.FC<{
	textProps: {
		duration: number;
		text: string;
		audioFilePath: string;
	}[];
	date: string;
	title: string;
}> = ({textProps, date, title}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const finishContentEarlierInFrames = 50;
	const transitionDurationInFrames = 2.9 * fps;
	const showWrapperOnIndex =
		textProps.length > 2
			? Math.floor(random(title) * (textProps.length - 2 - 2) + 2) //Valor randomico entre 2 e (quantidade de noticias - final - ultima noticia)
			: -1; //If have less then 2 news will not show wrapper

	const opacity = interpolate(
		frame,
		[durationInFrames - 30, durationInFrames - 10],
		[1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
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
			<div style={{opacity}}>
				{textProps.map((prop, index) => {
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
									/>
									<Logo />
								</Sequence>
								{index < textProps.length - 1 ? (
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

									<Title
										titleText={prop.text}
										finishContentEarlierInFrames={
											finishContentEarlierInFrames
										}
									/>
									<AudioWaveform
										audioFilePath={prop.audioFilePath}
									/>
								</Wrapper>
							</Sequence>
							{index < textProps.length - 1 ? (
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
