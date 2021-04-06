import {
	interpolate,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	getInputProps,
} from 'remotion';
import {Title} from './Podcast/Title';
import {AudioWaveform} from './Podcast/AudioWaveform';
import {Transition} from './Podcast/Transition';
import {Logo} from './Podcast/Logo';
import {Intro} from './Podcast/Intro';

const {withoutIntro} = getInputProps();

export const Main: React.FC<{
	textProps: {
		duration: number;
		text: string;
		audioFilePath: string;
	}[];
	date: string;
}> = ({textProps, date}) => {
	const frame = useCurrentFrame();
	const videoConfig = useVideoConfig();
	const finishContentEarlierInFrames = 50;
	const transitionDurationInFrames = 2.9 * videoConfig.fps;

	const opacity = interpolate(
		frame,
		[videoConfig.durationInFrames, videoConfig.durationInFrames + 100],
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
					initialFrame = nextInitialFrame;
					nextInitialFrame =
						initialFrame +
						transitionDurationInFrames +
						videoConfig.fps * prop.duration;

					if (index === 0 && !withoutIntro) {
						return (
							<>
								<Sequence
									from={initialFrame}
									durationInFrames={
										videoConfig.fps * prop.duration
									}
								>
									<Intro
										date={date}
										audioFilePath={prop.audioFilePath}
									/>
								</Sequence>
								<Sequence
									from={initialFrame}
									durationInFrames={
										videoConfig.fps * prop.duration
									}
								>
									<Logo />
								</Sequence>
								{index < textProps.length - 1 ? (
									<Sequence
										from={
											initialFrame +
											prop.duration * videoConfig.fps
										}
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
								from={initialFrame}
								durationInFrames={
									videoConfig.fps * prop.duration
								}
							>
								<Title
									titleText={prop.text}
									finishContentEarlierInFrames={
										finishContentEarlierInFrames
									}
								/>
							</Sequence>
							<Sequence
								from={initialFrame}
								durationInFrames={
									videoConfig.fps * prop.duration
								}
							>
								<AudioWaveform
									audioFilePath={prop.audioFilePath}
								/>
							</Sequence>
							<Sequence
								from={initialFrame}
								durationInFrames={
									videoConfig.fps * prop.duration
								}
							>
								<Logo />
							</Sequence>
							{index < textProps.length - 1 ? (
								<Sequence
									from={
										initialFrame +
										prop.duration * videoConfig.fps
									}
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
