import React, {useEffect, useState} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig, Audio, staticFile} from 'remotion';
import {getAudioData, useAudioData, visualizeAudio} from '@remotion/media-utils';

export const AudioWaveform: React.FC<{
	audioFilePath: string;
}> = ({audioFilePath}) => {
	const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

	const audioSrc = staticFile(audioFilePath.substring(audioFilePath.lastIndexOf('/') + 1))
    const audioData = useAudioData(audioSrc);

    if (!audioData) {
        return null;
    }

    const allVisualizationValues = visualizeAudio({
        fps,
        frame,
        audioData,
        numberOfSamples: 256,
    });

    const visualization = allVisualizationValues.slice(12, 150);

    const mirrored = [...visualization.slice(1).reverse(), ...visualization];

    return (
        <>
            <Audio src={audioSrc} />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    height: '10vh',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    gap: '1px',
                    position: 'fixed',
                    bottom: 0,
                    padding: '0px 8px',
                    zIndex: 75,
                }}
            >
                {mirrored.map((v, index) => {
                    const height = Math.abs(500 * Math.sqrt(v));

                    return (
                        <div
                            key={`AudioVisualization-${index}`}
                            style={{
                                height: `${height > 1 ? height : 0}%`,
                                maxHeight: '64px',
                                width: '6px',
                                background: '#D7DADC',
                                borderRadius: '4px',
                            }}
                        />
                    );
                })}
            </div>
        </>
    );
};
