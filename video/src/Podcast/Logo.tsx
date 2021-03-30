import {
	continueRender,
	delayRender,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import avatar from '../../../assets/Avatar.png';

import './fonts.css';

export const Logo: React.FC = () => {
	const videoConfig = useVideoConfig();
	const frame = useCurrentFrame();

	const logoEntry = spring({fps: videoConfig.fps, from: -30, to: 30, frame});

	return (
		<div
			style={{
				marginTop: logoEntry,
				marginLeft: 30,
				height: videoConfig.width / 15 + 20,
				display: 'flex',
				alignItems: 'center',
				backgroundColor: '#3F6182',
				padding: 20,
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
