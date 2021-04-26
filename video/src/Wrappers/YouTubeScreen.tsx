import React, {useEffect, useState} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig, Audio} from 'remotion';

export const YouTubeScreen: React.FC = ({children}) => {
	const {width: videoWidth, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();

	return <div style={{}}>{children}</div>;
};
