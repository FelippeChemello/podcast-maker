import {useCurrentFrame, useVideoConfig} from 'remotion';
import styled from 'styled-components';

import './fonts.css';

const H1 = styled.h1`
	font-family: 'Nunito';
	font-weight: 300;
	text-align: center;
	align-self: center;
	padding: 50px;
`;

export const Title: React.FC<{
	titleText: string;
}> = ({titleText}) => {
	const videoConfig = useVideoConfig();
	const frame = useCurrentFrame();
	const text = titleText.split(' ').map((t) => ` ${t} `);

	const indexOfEndOfTitle = text.findIndex((word) => word.match(/.*:.*/));

	return (
		<H1>
			{text.map((t, i) => {
				const wordShouldAppear =
					frame -
						i *
							((videoConfig.durationInFrames - 50) /
								text.length) >
					0;

				if (i <= indexOfEndOfTitle) {
					return (
						<>
							<span
								key={t}
								style={{
									color: `${
										wordShouldAppear ? '#fff' : '#497399'
									}`,
									display: 'inline-block',
									fontSize: 72,
									fontWeight: 700,
								}}
							>
								{t}
							</span>
							{i === indexOfEndOfTitle ? <br /> : <> </>}
						</>
					);
				}

				return (
					<span
						key={t}
						style={{
							marginLeft: 5,
							marginRight: 5,
							color: `${wordShouldAppear ? '#fff' : '#497399'}`,
							display: 'inline-block',
							fontWeight: 300,
							fontSize: 48,
						}}
					>
						{t}
					</span>
				);
			})}
		</H1>
	);
};
