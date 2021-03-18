import {useCurrentFrame, useVideoConfig, random, interpolate} from 'remotion';

import './fonts.css';

export const Bars: React.FC<{}> = () => {
	const frame = useCurrentFrame();
	const videoConfig = useVideoConfig();

	return (
		<div
			style={{
				display: 'flex',
				margin: 20,
				alignItems: 'center',
				height: 100,
			}}
		>
			<div
				style={{
					width: 10,
					height: random(`left-${frame}`) * 100,
					background: '#282B4B',
					transition: 'height 0.3s',
				}}
			></div>
			<div
				style={{
					width: 10,
					height: random(`center-${frame}`) * 100,
					background: '#282B4B',
					transition: 'height 0.3s',
					marginLeft: 5,
				}}
			></div>
			<div
				style={{
					width: 10,
					height: random(`right-${frame}`) * 100,
					background: '#282B4B',
					transition: 'height 0.3s',
					marginLeft: 5,
				}}
			></div>
		</div>
	);
};
