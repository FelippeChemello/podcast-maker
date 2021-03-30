import {
	interpolate,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	Audio,
} from 'remotion';
import {Title} from './Podcast/Title';
import {AudioWaveform} from './Podcast/AudioWaveform';
import {Transition} from './Podcast/Transition';
import {Logo} from './Podcast/Logo';
import {Intro} from './Podcast/Intro';

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

	const opacity = interpolate(
		frame,
		[videoConfig.durationInFrames - 25, videoConfig.durationInFrames - 15],
		[1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	let initialFrame = 10;

	return (
		<div
			style={{
				flex: 1,
				background: '#0C2D48',
			}}
		>
			<div style={{opacity}}>
				{textProps.map((prop, index) => {
					initialFrame =
						videoConfig.fps * prop.duration + initialFrame;

					if (index === 0) {
						return (
							<>
								<Sequence
									from={
										initialFrame -
										videoConfig.fps * prop.duration
									}
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
									from={
										initialFrame -
										videoConfig.fps * prop.duration
									}
									durationInFrames={
										videoConfig.fps * prop.duration
									}
								>
									<Logo />
								</Sequence>
								{index < textProps.length - 1 ? (
									<Sequence
										from={initialFrame}
										durationInFrames={87}
									>
										<Transition />
									</Sequence>
								) : (
									<> </>
								)}
								<p style={{display: 'none'}}>
									{(initialFrame += 87)}
								</p>
							</>
						);
					}

					return (
						<>
							<Sequence
								from={
									initialFrame -
									videoConfig.fps * prop.duration
								}
								durationInFrames={
									videoConfig.fps * prop.duration
								}
							>
								<Title titleText={prop.text} />
							</Sequence>
							<Sequence
								from={
									initialFrame -
									videoConfig.fps * prop.duration
								}
								durationInFrames={
									videoConfig.fps * prop.duration
								}
							>
								<AudioWaveform
									audioFilePath={prop.audioFilePath}
								/>
							</Sequence>
							<Sequence
								from={
									initialFrame -
									videoConfig.fps * prop.duration
								}
								durationInFrames={
									videoConfig.fps * prop.duration
								}
							>
								<Logo />
							</Sequence>
							{index < textProps.length - 1 ? (
								<Sequence
									from={initialFrame}
									durationInFrames={87}
								>
									<Transition />
								</Sequence>
							) : (
								<> </>
							)}
							<p style={{display: 'none'}}>
								{(initialFrame += 87)}
							</p>
						</>
					);
				})}
			</div>
		</div>
	);
};
