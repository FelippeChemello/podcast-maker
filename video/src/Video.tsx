import {useEffect, useState} from 'react';
import {Composition, delayRender, continueRender} from 'remotion';
import {Main} from './Main';

const handle = delayRender();

export const RemotionVideo: React.FC<{duration: number}> = ({duration}) => {
	const [textProps, setData] = useState<
		{duration: number; text: string; audioFileName: string}[]
	>([]);

	const fetchData = async () => {
		const response = await fetch('http://localhost:3333/make');
		const json = await response.json();
		setData(json);

		continueRender(handle);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
			<Composition
				id="Main"
				component={Main}
				durationInFrames={duration || 15000}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					textProps,
				}}
			/>
		</>
	);
};
