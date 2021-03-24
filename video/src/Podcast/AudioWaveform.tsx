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
} from 'remotion';

const filterData = (audioBuffer: AudioBuffer, samples: number = 200) => {
	const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
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

async function loadAudio(audioFileName: string) {
	return await require(`/home/felippe/Projects/podcast-maker/tmp/${audioFileName}`);
}

const handle = delayRender();

// TODO: Show metadata such as stereo, duration, bitrate
export const AudioWaveform: React.FC<{
	audioFileName: string;
}> = ({audioFileName}) => {
	const videoConfig = useVideoConfig();
	const frame = useCurrentFrame();

	const BAR_WIDTH = 8; //Found from wave.length/div.width
	const MAX_BAR_HEIGHT = 100;

	const [waveform, setWaveform] = useState<number[] | null>(null);

	useEffect(() => {
		const audioContext = new AudioContext();

		loadAudio(audioFileName)
			.then((audio) => fetch(audio))
			.then((response) => response.arrayBuffer())
			.then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
			.then((audioBuffer) =>
				filterData(audioBuffer, videoConfig.durationInFrames)
			)
			.then((filtered) => normalizeData(filtered))
			.then((wave) => {
				setWaveform(wave);
				continueRender(handle);
			})

			.catch((err) => {
				console.log(err);
			});
	}, [audioFileName]);

	if (!waveform) {
		return null;
	}

	const position = interpolate(
		frame,
		[0, videoConfig.durationInFrames],
		[100, -200]
	);

	console.log(`POS: ${position}`, `FRAMES: ${videoConfig.durationInFrames}`);

	return (
		<>
			<hr />
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					position: 'absolute',
					height: 150,
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
								backgroundColor: 'red',
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
