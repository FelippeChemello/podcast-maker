import {useEffect, useState} from 'react';
import {Composition, delayRender, continueRender} from 'remotion';
import {Main} from './Main';

const handle = delayRender();

async function loadData() {
	return await require(`/home/felippe/Projects/podcast-maker/tmp/1616956600.json`);
}

export const RemotionVideo: React.FC = () => {
	const [data, setData] = useState<{
		width: number;
		height: number;
		fullDuration: number;
		date: string;
		renderData: {duration: number; text: string; audioFilePath: string}[];
	}>();

	const fetchData = async () => {
		const json = await loadData();
		setData(json);

		continueRender(handle);
	};

	useEffect(() => {
		fetchData();
	}, []);

	if (!data) {
		return null;
	}

	return (
		<>
			<Composition
				id="Main"
				component={Main}
				durationInFrames={Math.floor(data.fullDuration * 30)}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					textProps: data.renderData,
					date: data.date,
				}}
			/>
		</>
	);
};
