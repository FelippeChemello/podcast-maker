import {useEffect, useState} from 'react';
import {
	Composition,
	delayRender,
	continueRender,
	getInputProps,
} from 'remotion';
import {Main} from './Main';
import {Thumbnail} from './Thumbnail';

import './fonts.css';

const handle = delayRender();

const {filename} = getInputProps();

async function loadData() {
	return await require(`../../tmp/${filename}.json`);
}

export const RemotionVideo: React.FC = () => {
	const [data, setData] = useState<{
		width: number;
		height: number;
		fullDuration: number;
		date: string;
		title: string;
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
				width={data.width}
				height={data.height}
				defaultProps={{
					textProps: data.renderData,
					date: data.date,
				}}
			/>
			<Composition
				id="Thumbnail"
				component={Thumbnail}
				durationInFrames={1}
				fps={30}
				width={data.width}
				height={data.height}
				defaultProps={{
					title: data.title,
					date: data.date,
				}}
			/>
		</>
	);
};
