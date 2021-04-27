import {
	continueRender,
	delayRender,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import avatar from '../../../assets/Avatar.png';

export const Logo: React.FC = () => {
	const videoConfig = useVideoConfig();
	const frame = useCurrentFrame();

	const orientation =
		videoConfig.width > videoConfig.height ? 'landscape' : 'portrait';

	const logoEntry = spring({
		fps: videoConfig.fps,
		from: -150,
		to: orientation === 'landscape' ? 30 : 50,
		frame,
		config: {
			mass: 0.8,
			damping: 10,
		},
	});

	return (
		<div
			style={{
				marginTop: logoEntry,
				marginLeft: orientation === 'landscape' ? 30 : 100,
				display: 'flex',
				width: 'fit-content',
				height: 'fit-content',
				alignItems: 'center',
				backgroundColor: '#3F6182',
				padding: '20px 30px',
				borderRadius: 10,
			}}
		>
			<img
				src={avatar}
				width={videoConfig.width / 20}
				height={videoConfig.width / 20}
				style={{
					borderRadius: 50,
					boxShadow: '0px 0px 30px -10px rgba(0,0,0,0.75)',
					marginRight: 15,
				}}
			/>
			<h1
				style={{
					fontFamily: 'Nunito',
					color: '#fff',
					fontSize: 40,
				}}
			>
				CodeStack
			</h1>
		</div>
	);
};
