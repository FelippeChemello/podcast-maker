import {useCurrentFrame, useVideoConfig} from 'remotion';
import styled from 'styled-components';

const H1 = styled.h1`
	font-family: 'SF Pro Text, Helvetica, Arial';
	font-weight: 300;
	font-size: 72px;
	text-align: center;
	align-self: center;
	padding: 50px;
`;

export const Title: React.FC<{
	titleText: string;
	titleColor: string;
}> = ({titleText, titleColor}) => {
	const videoConfig = useVideoConfig();
	const frame = useCurrentFrame();
	const text = titleText.split(' ').map((t) => ` ${t} `);
	return (
		<H1>
			{text.map((t, i) => {
				return (
					<span
						key={t}
						style={{
							marginLeft: 10,
							marginRight: 10,
							color: `${
								frame -
									i *
										((videoConfig.durationInFrames - 50) /
											text.length) >
								0
									? '#fff'
									: '#497399'
							}`,
							display: 'inline-block',
						}}
					>
						{t}
					</span>
				);
			})}
		</H1>
	);
};
