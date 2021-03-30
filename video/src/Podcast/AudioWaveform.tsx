import React, {
	useEffect,
	useState,
	useLayoutEffect,
	useRef,
	useContext,
} from 'react';
import {
	continueRender,
	delayRender,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
	Audio,
} from 'remotion';

const filterData = (audioBuffer: AudioBuffer) => {
	const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
	const samples = 750; //Quantas barras serão exibidas por audio. Implica na largura de cada barra
	const blockSize = Math.floor(rawData.length / Math.ceil(samples)); // the number of samples in each subdivision
	const filteredData = [];
	for (let i = 0; i < samples; i++) {
		const blockStart = blockSize * i; // the location of the first sample in the block
		let sum = 0;
		for (let j = 0; j < blockSize; j++) {
			sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
		}
		filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
	}
	return filteredData;
};

const normalizeData = (filteredData: number[]) => {
	const multiplier = Math.pow(Math.max(...filteredData), -1);
	return filteredData.map((n) => n * multiplier);
};

async function loadAudio(audioFilePath: string) {
	const pathArray = audioFilePath.split('/');
	const audioFileName = pathArray[pathArray.length - 1];

	return await require(`../../../tmp/${audioFileName}`);
}

// const handle = delayRender();

export const AudioWaveform: React.FC<{
	audioFilePath: string;
}> = ({audioFilePath}) => {
	const videoConfig = useVideoConfig();
	const frame = useCurrentFrame();

	const MAX_BAR_HEIGHT = 100;

	const [waveform, setWaveform] = useState<number[] | null>(null);
	const [audioSrc, setAudioSrc] = useState<any>(null);

	useEffect(() => {
		const audioContext = new AudioContext();

		loadAudio(audioFilePath)
			.then((audio) => {
				setAudioSrc(audio);
				return fetch(audio);
			})
			.then((response) => response.arrayBuffer())
			.then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
			.then((audioBuffer) => filterData(audioBuffer))
			.then((filtered) => normalizeData(filtered))
			.then((wave) => {
				setWaveform(wave);
				// continueRender(handle);
			})

			.catch((err) => {
				console.log(err);
			});
	}, [audioFilePath]);

	if (!waveform) {
		return null;
	}

	const position = interpolate(
		frame,
		[0, videoConfig.durationInFrames],
		[100, -200]
	);

	return (
		<>
			<Audio src={audioSrc} />
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					position: 'absolute',
					height: 150,
					bottom: 0,
					left: `${position}%`,
				}}
			>
				{waveform.map((w, i) => {
					const height = MAX_BAR_HEIGHT * w;

					return (
						<div
							// eslint-disable-next-line react/no-array-index-key
							key={i}
							style={{
								height,
								width:
									(videoConfig.width * 3) / waveform.length -
									2,
								backgroundColor: '#fff' || '#282B4B',
								marginLeft: 2,
								borderRadius: 2,
							}}
						/>
					);
				})}
			</div>
		</>
	);
};
