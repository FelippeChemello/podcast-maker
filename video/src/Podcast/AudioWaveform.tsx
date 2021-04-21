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
	const {width, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();

	const MAX_BAR_HEIGHT = 100;
	const QUANTITY_OF_SAMPLES = 750;

	const [audioSrc, setAudioSrc] = useState<string | null>(`null`);
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

			const smoothWaveforms = blocks
				.map(
					(block) =>
						block.reduce(
							(accumulator, value) => accumulator + value,
							0
						) / block.length
				)
				.map((value, index, array) => {
					const weightOfMean = 5;
					const toSmooth = [
						array[index - 1],
						value * 3,
						array[index + 1],
					];

					const sanitizedToSmooth = toSmooth
						.filter((value) => !!value)
						.map((value) => Math.abs(value));

					return (
						(sanitizedToSmooth.reduce(
							(acc, value) => acc + value,
							0
						) /
							weightOfMean) *
						100
					);
				});

			setWaveforms(smoothWaveforms);
		});
	}, [audioFilePath]);

	if (!waveforms || !audioSrc) {
		return null;
	}

	const position = interpolate(frame, [0, durationInFrames], [100, -200]);

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
								width: (width * 3) / waveforms.length - 2,
								backgroundColor: '#fff' || '#282B4B',
								marginLeft: 2,
								borderRadius: 2,
							}}
						/>
					);
				})}
			</div>
		</div>
	);
};
