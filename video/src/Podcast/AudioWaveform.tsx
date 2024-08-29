import React, {useEffect, useState} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig, Audio, staticFile} from 'remotion';
import {getAudioData} from '@remotion/media-utils';

export const AudioWaveform: React.FC<{
	audioFilePath: string;
}> = ({audioFilePath}) => {
	const {width: videoWidth, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();

	const BAR_WIDTH = 7;
	const BAR_MARGIN_BETWEEN = 2;
	const MAX_BAR_HEIGHT = 100;
	const QUANTITY_OF_SAMPLES = durationInFrames / 1.5;

	const audioSrc = staticFile(audioFilePath.substring(audioFilePath.lastIndexOf('/') + 1))
	const [waveforms, setWaveforms] = useState<number[] | null>(null);

	useEffect(() => {
        getAudioData(audioSrc).then((audioData) => {

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

                    return smootherValue * multiplier;
                }
            );

            setWaveforms(smoothWaveforms);
        })
	}, [audioFilePath]);

	if (!waveforms || !audioSrc) {
		return null;
	}

	const position = interpolate(frame, [10, durationInFrames - 20], [0, 100]);

	return (
		<>
			<Audio src={audioSrc} />
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					height: MAX_BAR_HEIGHT + 50,
					width: waveforms.length * (BAR_WIDTH + BAR_MARGIN_BETWEEN),
					transform: `translateX(calc(${videoWidth}px - ${position}%))`,
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
								backgroundColor: '#3997db',
								marginLeft: BAR_MARGIN_BETWEEN,
								borderRadius: 10,
							}}
						/>
					);
				})}
			</div>
		</>
	);
};
