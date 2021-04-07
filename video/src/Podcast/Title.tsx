import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const Title: React.FC<{
	titleText: string;
	finishContentEarlierInFrames: number;
}> = ({titleText, finishContentEarlierInFrames}) => {
	const videoConfig = useVideoConfig();
	const frame = useCurrentFrame();
	const text = titleText.split(' ').map((t) => ` ${t} `);
	const framesPerChar =
		(videoConfig.durationInFrames - finishContentEarlierInFrames) /
		titleText.length;

	const orientation =
		videoConfig.width > videoConfig.height ? 'landscape' : 'portrait';

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
				padding: orientation === 'landscape' ? 50 : 100,
				opacity,
			}}
		>
			{text.map((t, i, arr) => {
				const wordShouldAppear =
					frame -
						(arr
							.slice(0, i)
							.reduce((acc, element) => acc + element.length, 0) -
							i) *
							framesPerChar >
					0;
				// Se o frame atual - frame da palavra (todas as letras e espaços da palavra atual e anteriores * framesPerChar) > 0 -> mostra a palavra

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
