import {getInputProps, useVideoConfig} from 'remotion';
import styled from 'styled-components';
import {YoutubeWrapper} from './youtubeWrapper';

type WrapperProps = {
	title: string;
	show: boolean;
};

type VideoWrapperProps = {
	videoWidth: number;
	videoHeight: number;
};

const VideoWrapper = styled.div<VideoWrapperProps>`
	background: #0c2d48;
	display: flex;
	flex-direction: column;
	width: ${(props) => props.videoWidth}px;
	height: ${(props) => props.videoHeight}px;
	justify-content: space-between;
	overflow: hidden;
`;

const {destination} = getInputProps();

export const Wrapper: React.FC<WrapperProps> = ({children, title, show}) => {
	const {
		width: videoWidth,
		height: videoHeight,
		durationInFrames,
	} = useVideoConfig();

	if (destination === 'youtube' && show) {
		return <YoutubeWrapper title={title}>{children}</YoutubeWrapper>;
	}

	return (
		<VideoWrapper videoHeight={videoHeight} videoWidth={videoWidth}>
			{children}
		</VideoWrapper>
	);
};
