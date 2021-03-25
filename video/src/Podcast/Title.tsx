import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

import './fonts.css';

export const Title: React.FC<{
	titleText: string;
}> = ({titleText}) => {
	const videoConfig = useVideoConfig();
	const frame = useCurrentFrame();
	const text = titleText.split(' ').map((t) => ` ${t} `);

	const indexOfEndOfTitle = text.findIndex((word) => word.match(/.*:.*/));

	const opacity = spring({
		fps: videoConfig.fps,
		from: 0,
		to: 1,
		frame,
		config: {mass: 1, damping: 1000},
	});

	return (
		<h1
			style={{
				fontFamily: 'Nunito',
				alignSelf: 'center',
				padding: 50,
				opacity,
			}}
		>
			{text.map((t, i) => {
				const wordShouldAppear =
					frame - i * (videoConfig.durationInFrames / text.length) >
					0;

				if (i <= indexOfEndOfTitle) {
					return (
						<>
							<span
								key={t}
								style={{
									color: `${
										wordShouldAppear ? '#fff' : '#497399'
									}`,
									display: 'inline-block',
									fontSize: 65,
									fontWeight: 700,
								}}
							>
								{t}
							</span>
							{i === indexOfEndOfTitle ? <br /> : <> </>}
						</>
					);
				}

				return (
					<span
						key={t}
						style={{
							marginLeft: 5,
							marginRight: 5,
							color: `${wordShouldAppear ? '#fff' : '#497399'}`,
							display: 'inline-block',
							fontWeight: 300,
							fontSize: 45,
						}}
					>
						{t}
					</span>
				);
			})}
		</h1>
	);
};
