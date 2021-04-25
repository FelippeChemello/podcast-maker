import React, {useEffect, useState} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig, Audio} from 'remotion';
import {getAudioData} from '@remotion/media-utils';

async function loadAudio(audioFilePath: string) {
	const pathArray = audioFilePath.split('/');
	const audioFileName = pathArray[pathArray.length - 1];

	return await require(`../../../tmp/${audioFileName}`);
}

export const AudioWaveform: React.FC<{
	audioFilePath: string;
}> = ({audioFilePath}) => {
	const {width: videoWidth, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();

	const BAR_WIDTH = 7;
	const BAR_MARGIN_BETWEEN = 2;
	const MAX_BAR_HEIGHT = 500;
	const QUANTITY_OF_SAMPLES = durationInFrames;

	console.log(QUANTITY_OF_SAMPLES);

	const [audioSrc, setAudioSrc] = useState<string | null>(null);
	const [waveforms, setWaveforms] = useState<number[] | null>(null);

	useEffect(() => {
		loadAudio(audioFilePath).then(async (audio) => {
			setAudioSrc(audio);
			const audioData = await getAudioData(audio);

			const fullWaveforms = Array.from(audioData.channelWaveforms[0]);

			const blockSize = Math.floor(
				fullWaveforms.length / QUANTITY_OF_SAMPLES
			);

			const blocks = new Array(
				Math.floor(fullWaveforms.length / blockSize)
			)
				.fill(0)
				.map((_) => fullWaveforms.splice(0, blockSize));

			const waveformValues = blocks
				.map(
					(block) =>
						block.reduce(
							(accumulator, value) =>
								accumulator + Math.abs(value),
							0
						) / block.length
				)
				.filter((value) => !!value);

			const multiplier = Math.pow(Math.max(...waveformValues), -1);

			const smoothWaveforms = waveformValues.map(
				(value, index, array) => {
					const weightOfMean = 5;
					const toSmooth = [
						array[index - 1],
						value * 3,
						array[index + 1],
					];

					const smootherValue =
						toSmooth.reduce((acc, value) => acc + value, 0) /
						weightOfMean;

					return smootherValue;
				}
			);

			setWaveforms(smoothWaveforms);
		});
	}, [audioFilePath]);

	if (!waveforms || !audioSrc) {
		return null;
	}

	const rateWaveformSpeed =
		(waveforms.length * BAR_WIDTH +
			waveforms.length * BAR_MARGIN_BETWEEN -
			videoWidth) /
		videoWidth;

	console.warn(rateWaveformSpeed);

	const position = interpolate(
		frame,
		[10, durationInFrames - 20],
		[100, -100 * rateWaveformSpeed]
	);

	return (
		<div>
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
				{waveforms.map((v, i) => {
					const height = MAX_BAR_HEIGHT * v;

					return (
						<div
							key={i}
							style={{
								height,
								width: BAR_WIDTH,
								backgroundColor: '#fff' || '#282B4B',
								marginLeft: BAR_MARGIN_BETWEEN,
								borderRadius: 10,
							}}
						/>
					);
				})}
			</div>
		</div>
	);
};
