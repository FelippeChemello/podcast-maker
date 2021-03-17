import {interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {Title} from './HelloWorld/Title';

export const Main: React.FC<{
	text: string;
}> = ({text}) => {
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

	return (
		<div
			style={{
				flex: 1,
				background:
					'linear-gradient(135deg, #7AABD0 -1%, rgba(76, 109, 173, 0.796875) 30.99%, rgba(27, 47, 88, 0) 96.05%), #1B2F58',
			}}
		>
			<div style={{opacity}}>
				<Sequence
					from={10}
					durationInFrames={videoConfig.durationInFrames}
				>
					<Title titleText={text} titleColor={'black'} />
				</Sequence>
			</div>
		</div>
	);
};
