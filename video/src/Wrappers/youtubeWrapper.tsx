import {
	interpolate,
	interpolateColors,
	useCurrentFrame,
	useVideoConfig,
	Audio,
	Sequence,
} from 'remotion';
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

import ytLogo from '../../../assets/YT-Logo.svg';
import avatar from '../../../assets/Avatar.png';
import clickSound from '../../../assets/click.mp3';

type WrapperProps = {
	title: string;
};

type VideoWrapperProps = {
	videoWidth: number;
	videoHeight: number;
};

type FooterProps = {videoWidth: number};

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

export const YoutubeWrapper: React.FC<WrapperProps> = ({children, title}) => {
	const {
		width: videoWidth,
		height: videoHeight,
		durationInFrames,
	} = useVideoConfig();
	const frame = useCurrentFrame();

	const startScaleAnimationAtFrame = 30;
	const startClickAnimationAtFrame = 50 + startScaleAnimationAtFrame;

	//Mouse movement
	const moveY = interpolate(
		frame,
		[0, 50, 57, 73, 90, 110, 115, 125, 150].map(
			(value) => value + startClickAnimationAtFrame
		),
		[-50, 95, 93, 97, 20, 10, 15, 12, -50]
	);
	const moveX = interpolate(
		frame,
		[0, 50, 57, 73, 90, 110, 115, 125, 150].map(
			(value) => value + startClickAnimationAtFrame
		),
		[370, 650, 657, 655, 40, 50, 45, 48, 150]
	);
	const colorsClick = interpolateColors(
		frame,
		[0, 50, 57, 73, 90, 110, 115, 125, 150].map(
			(value) => value + startClickAnimationAtFrame
		),
		['#fff', '#fff', '#aaa', '#fff', '#fff', '#fff', '#aaa', '#fff', '#fff']
	);

	//Scale change
	const scale = interpolate(
		frame,
		[
			0,
			0 + startScaleAnimationAtFrame,
			startClickAnimationAtFrame,
			200 + startScaleAnimationAtFrame,
			250 + startScaleAnimationAtFrame,
			durationInFrames,
		],
		[1.57, 1.57, 1, 1, 1.57, 1.57]
	);
	const translateX = interpolate(
		frame,
		[
			0,
			0 + startScaleAnimationAtFrame,
			startClickAnimationAtFrame,
			200 + startScaleAnimationAtFrame,
			250 + startScaleAnimationAtFrame,
			durationInFrames,
		],
		[16.3, 16.3, 0, 0, 16.3, 16.3]
	);
	const translateY = interpolate(
		frame,
		[
			0,
			0 + startScaleAnimationAtFrame,
			startClickAnimationAtFrame,
			200 + startScaleAnimationAtFrame,
			250 + startScaleAnimationAtFrame,
			durationInFrames,
		],
		[7.3, 7.3, 0, 0, 7.3, 7.3]
	);

	return (
		<div
			style={{
				transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
				background: '#212121',
			}}
		>
			<Sequence
				from={47 + startClickAnimationAtFrame}
				durationInFrames={Infinity}
			>
				<Audio src={clickSound} startFrom={30} />
			</Sequence>
			<Sequence
				from={105 + startClickAnimationAtFrame}
				durationInFrames={Infinity}
			>
				<Audio src={clickSound} startFrom={30} />
			</Sequence>
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
								<section
									style={{
										borderBottom: `3px solid ${
											frame >=
											57 + startClickAnimationAtFrame
												? '#3EA6FF'
												: ''
										}`,
									}}
								>
									<text
										style={{
											color:
												frame >=
												57 + startClickAnimationAtFrame
													? '#3EA6FF'
													: '',
										}}
									>
										<IoMdThumbsUp size="3rem" />
										{Math.round(frame / 10)}
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
										{Math.round(frame / 15)} inscritos
									</span>
								</p>
							</div>
							<p
								style={{
									background:
										frame >=
										115 + startClickAnimationAtFrame
											? '#303030'
											: '#CC0000',
									color: '#fff',
									fontSize: '1.7rem',
									textTransform: 'uppercase',
									padding: '1rem 2rem',
									margin: 0,
									borderRadius: 5,
								}}
							>
								{frame >= 115 + startClickAnimationAtFrame
									? 'Inscrito'
									: 'Inscreva-se'}
							</p>
						</div>
						<div
							style={{
								position: 'absolute',
								bottom: moveY, //-50 -> 95 -> 10 -> -50
								right: moveX, //370 -> 670 -> 50 -> 150
							}}
						>
							<svg
								width="3rem"
								height="3rem"
								viewBox="0 0 23 25"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g clipPath="url(#prefix__clip0)">
									<path
										d="M22.326 11.773v4.5c0 .145-.018.29-.053.43l-1.571 6.375c-.209.847-1 1.445-1.912 1.445H8.576c-.31 0-.616-.07-.892-.204a1.944 1.944 0 01-.697-.568l-6.285-8.25c-.639-.837-.445-2.01.433-2.619.877-.609 2.106-.424 2.744.414l1.554 2.04V2.398c0-1.035.88-1.875 1.964-1.875 1.085 0 1.964.84 1.964 1.875v9.375h.393V9.898c0-1.035.88-1.875 1.965-1.875 1.084 0 1.964.84 1.964 1.875v1.875h.393v-1.125c0-1.035.88-1.875 1.964-1.875 1.085 0 1.964.84 1.964 1.875v1.125h.393c0-1.035.88-1.875 1.964-1.875 1.085 0 1.965.84 1.965 1.875zm-12.572 3.75h-.393v4.5h.393v-4.5zm4.322 0h-.393v4.5h.393v-4.5zm4.321 0h-.393v4.5h.393v-4.5z"
										fill={colorsClick}
									/>
								</g>
							</svg>
						</div>
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
