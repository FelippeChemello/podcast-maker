import {useEffect, useState} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import styled from 'styled-components';
import {AiOutlineSearch, AiOutlineMenu} from 'react-icons/ai';
import {
	IoMdMic,
	IoMdThumbsUp,
	IoMdThumbsDown,
	IoIosShareAlt,
} from 'react-icons/io';
import {RiPlayListAddLine} from 'react-icons/ri';
import {BsThreeDots} from 'react-icons/bs';
import {format} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import RssParser from 'rss-parser';

import ytLogo from '../../../assets/YT-Logo.svg';
import avatar from '../../../assets/Avatar.png';

type WrapperProps = {
	title: string;
};

type VideoWrapperProps = {
	videoWidth: number;
	videoHeight: number;
};

type FooterProps = {videoWidth: number};

type Feed = {
	id: number;
	title: string;
	publishedAt: string;
	thumbnail: string;
}[];

const VideoWrapper = styled.div<VideoWrapperProps>`
	background: #0c2d48;
	display: flex;
	flex-direction: column;
	width: ${(props) => props.videoWidth}px;
	height: ${(props) => props.videoHeight}px;
	justify-content: space-between;
	transform: scale(0.63) translate(-25%, -25%);
	overflow: hidden;
`;

const Footer = styled.footer<FooterProps>`
	transform: translateY(-370px);
	margin: 0 3.5rem;
	max-width: ${(props) => props.videoWidth * 0.63}px;
	font-family: ProductSans;
	position: relative;
	margin-bottom: 1rem;

	h1 {
		font-weight: 400;
		color: #fff;
		margin: 1rem 0 0.3rem;
	}

	> div:nth-child(2) {
		padding-bottom: 7px;
		border-bottom: 1px solid #323232;
	}

	div {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
		color: #999;

		span {
			font-weight: 400;
			font-size: 1.5rem;
			color: #999;

			+ span {
				margin-left: 1rem;
				padding-left: 1rem;
				position: relative;

				&::before {
					content: '';
					width: 4px;
					height: 4px;
					border-radius: 2px;
					background-color: #999;
					position: absolute;
					top: 50%;
					left: 0;
					transform: translate(-50%, -50%);
				}
			}
		}

		section {
			margin-bottom: -0.875rem;
			border-bottom: 3px solid #fff;
			padding-bottom: 0.5rem;
			display: flex;
			align-items: center;
			gap: 2rem;
			color: #999;
		}

		text {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			font-size: 1.7rem;
			text-transform: uppercase;
		}
	}

	hr {
		margin-top: 0.35rem;
		background-color: #32323210;
	}
`;

const Aside = styled.aside`
	transform: translateX(-590px);
	padding: 2rem 0;
	width: 35rem;
	display: flex;
	flex-direction: column;
	gap: 2rem;

	div {
		display: flex;

		main {
			width: 14rem;
			height: 7.88rem;
			background: #121212;
			margin-right: 1rem;
		}

		p {
			display: flex;
			flex-direction: column;
			margin: 0;
			gap: 1rem;

			strong {
				height: 2.3rem;
				width: 17rem;
				background: #121212;
			}

			span {
				height: 1.7rem;
				width: 12rem;
				background: #121212;
			}
		}
	}
`;

export const Wrapper: React.FC<WrapperProps> = ({children, title}) => {
	const {width: videoWidth, height: videoHeight} = useVideoConfig();
	const frame = useCurrentFrame();

	const moveY = interpolate(frame, [0, 10, 50, 60], [0, 1, 1, 0]);
	console.log(moveY);

	return (
		<div
			style={{
				// transform: 'scale(1.5)'
				background: '#212121',
			}}
		>
			<header
				style={{
					background: '#202020',
					padding: '1rem',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: videoWidth,
				}}
			>
				<div
					style={{display: 'flex', alignItems: 'center', gap: '2rem'}}
				>
					<AiOutlineMenu size="3rem" color="#fff" />
					<img src={ytLogo} />
				</div>

				<div style={{display: 'flex', alignItems: 'center', gap: '0'}}>
					<div
						style={{
							height: '3rem',
							width: 700,
							background: '#121212',
							border: '1px solid #323232',
							borderRadius: '3px 0 0 3px',
						}}
					></div>
					<div
						style={{
							height: '3rem',
							width: 130,
							background: '#323232',
							border: '1px solid #323232',
							borderRadius: '0 3px 3px 0',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<AiOutlineSearch color="#999" size="1.8rem" />
					</div>
					<IoMdMic
						style={{marginLeft: '1rem'}}
						size="2rem"
						color="#fff"
					/>
				</div>

				<div
					style={{display: 'flex', alignItems: 'center', gap: '2rem'}}
				>
					<img
						src={avatar}
						style={{
							width: '2.75rem',
							height: '2.75rem',
							borderRadius: '2rem',
							marginRight: '2rem',
						}}
					/>
				</div>
			</header>
			<div style={{display: 'flex', flexDirection: 'row'}}>
				<main>
					<VideoWrapper
						videoWidth={videoWidth}
						videoHeight={videoHeight}
					>
						{children}
					</VideoWrapper>
					<Footer videoWidth={videoWidth}>
						<h1>[CodeStack News] {title}</h1>
						<div>
							<p>
								<span>
									{Math.round(frame / 3)} Visualizações
								</span>
								<span>
									{format(
										new Date(),
										"dd 'de' MMM. 'de' yyyy",
										{
											locale: ptBR,
										}
									)}
								</span>
							</p>
							<div>
								<section>
									<text>
										<IoMdThumbsUp size="3rem" /> 2
									</text>
									<text>
										<IoMdThumbsDown size="3rem" /> 0
									</text>
								</section>
								<text>
									<IoIosShareAlt size="3rem" />
									Compartilhar
								</text>
								<text>
									<RiPlayListAddLine size="2rem" />
									Salvar
								</text>
								<BsThreeDots size="3rem" />
							</div>
						</div>
						<div style={{margin: '0.5rem 0'}}>
							<div>
								<img
									src={avatar}
									style={{
										width: '4.5rem',
										height: '4.5rem',
										borderRadius: '2.5rem',
										marginRight: '0rem',
									}}
								/>
								<p
									style={{
										display: 'flex',
										flexDirection: 'column',
									}}
								>
									<strong
										style={{
											fontSize: '1.5rem',
											color: '#fff',
										}}
									>
										CodeStack
									</strong>
									<span>
										{Math.round(frame / 10)} inscritos
									</span>
								</p>
							</div>
							<p
								style={{
									background: '#CC0000' || '#303030',
									color: '#fff',
									fontSize: '1.7rem',
									textTransform: 'uppercase',
									padding: '1rem 2rem',
									margin: 0,
									borderRadius: 5,
								}}
							>
								Inscreva-se
							</p>
						</div>
						<img />
					</Footer>
				</main>
				<Aside>
					{new Array(7).fill(0).map((_, i) => {
						return (
							<div key={i}>
								<main></main>
								<p>
									<strong></strong>
									<span></span>
								</p>
							</div>
						);
					})}
				</Aside>
			</div>
		</div>
	);
};
