import {
	spring,
	useCurrentFrame,
	useVideoConfig,
	AbsoluteFill,
	Audio,
    staticFile,
} from 'remotion';
import styled from 'styled-components';


const TitleDiv = styled.div`
	position: relative;
	overflow: hidden;
	top: -120px;
	height: 1150px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;

	h1 {
		font-size: 100px;
		line-height: 85px;
		font-family: 'ProductSans';
		color: #fff;
		text-align: center;
		font-weight: 300;
		margin: 0;
		padding: 0 100px;
	}
`;

export const Intro: React.FC<{
	date: string;
	audioFilePath: string;
	title: string;
    details?: {
        subscribers?: string | number;
    }
}> = ({ date, audioFilePath, title, details }) => {
	const videoConfig = useVideoConfig();
	const frame = useCurrentFrame();

    console.log(details)

    const text = `Booting up... ${details?.subscribers ? `\nSubscribers: ${details.subscribers}` : ''}\n${date}`

	const orientation =
		videoConfig.width > videoConfig.height ? 'landscape' : 'portrait';

	const audioSrc = staticFile(audioFilePath.substring(audioFilePath.lastIndexOf('/') + 1))

	const lampEntry = spring({
		fps: videoConfig.fps,
		from: orientation === 'landscape' ? -2000 : 2000,
		to: 0,
		frame,
		config: {
			damping: 100,
			mass: 10,
		},
        durationInFrames: 30
	});
	const tableEntry = spring({
		fps: videoConfig.fps,
		from: 70,
		to: 0,
		frame,
		config: {
			damping: 100,
			mass: 10,
		},
        durationInFrames: 30
	});
	const coffeeEntry = spring({
		fps: videoConfig.fps,
		from: orientation === 'landscape' ? -1700 : 1700,
		to: 0,
		frame,
		config: {
			damping: 100,
			mass: 5,
		},
        durationInFrames: 30
	});
	const computerEntry = spring({
		fps: videoConfig.fps,
		from: orientation === 'landscape' ? -1000 : 1000,
		to: 0,
		frame,
		config: {
			damping: 100,
			mass: 10,
		},
        durationInFrames: 30
	});
	const keyboardEntry = spring({
		fps: videoConfig.fps,
		from: orientation === 'landscape' ? -1300 : 1300,
		to: 0,
		frame,
		config: {
			damping: 100,
			mass: 10,
		},
        durationInFrames: 30
	});
	const mouseEntry = spring({
		fps: videoConfig.fps,
		from: orientation === 'landscape' ? -1500 : 1500,
		to: 0,
		frame,
		config: {
			damping: 100,
			mass: 10,
		},
        durationInFrames: 30
	});

	const startTypingAtFrame = 30;
	const typingDuration = videoConfig.durationInFrames - 90;
	const cycleWaitingTypeDuration = 5;
    const lineDelayDefault = 10;
    const typingDelayPerChar = typingDuration / text.length
	const endOfTypingAnimation = startTypingAtFrame + typingDuration + lineDelayDefault * text.split('\n').length;
	const waitingTypeCicles = Math.ceil(
		(videoConfig.durationInFrames - endOfTypingAnimation) /
			cycleWaitingTypeDuration
	);
	const arrayWithFramesThatWaitingTypeShouldAppears = new Array(
		waitingTypeCicles
	)
		.fill(undefined)
		.map((_, i) =>
			new Array(cycleWaitingTypeDuration)
				.fill(undefined)
				.map(
					(_, index) =>
						index +
						i * (cycleWaitingTypeDuration * 2) +
						endOfTypingAnimation
				)
		)
		.reduce((acc, val) => acc.concat(val), []);
    console.log(videoConfig.durationInFrames - endOfTypingAnimation, cycleWaitingTypeDuration, waitingTypeCicles)

    let lineDelay = 0;
    const textElements = text.split('\n').map((sentence, lineIndex, lines) => {
        if (lineIndex > 0) {
            lineDelay += lines[lineIndex - 1].length * typingDelayPerChar + lineDelayDefault
        }

        return (
            <>
                <text
                    x={430}
                    y={320 + 39 * lineIndex}
                    style={{
                        fontFamily: 'Courier Prime',
                        fontSize: 32,
                        display:
                            frame - startTypingAtFrame - lineDelay >= 0 // show character after delay
                            ? 'block'
                            : 'none',
                    }}
                >
                    {'>'}
                </text>
                {sentence.split('').map((letter, index) => {
                    const delay = index * typingDelayPerChar; // calculate delay based on index
                    const letterDelay = frame - startTypingAtFrame - delay - lineDelay
                    return (
                        <>
                        <text
                            x={455 + 18 * index}
                            y={320 + 39 * lineIndex}
                            style={{
                                fontFamily: 'Courier Prime',
                                fontSize: 32,
                                display:
                                    letterDelay > 0 // show character after delay
                                    ? 'block'
                                    : 'none',
                                // textDecoration: letterDelay > 0 && letterDelay < 2 ? 'underline' : ''
                            }}
                        >
                            {letter}
                        </text>
                        <text
                            x={455 + 18 * index + 18}
                            y={320 + 39 * lineIndex}
                            style={{
                                fontFamily: 'Courier Prime',
                                fontSize: 32,
                                display:
                                    letterDelay > 0 && letterDelay < 1 // show character after delay
                                    ? 'block'
                                    : 'none',
                            }}
                        >
                            _
                        </text>
                        </>
                    );
                })}
            </>
        )
    })

	if (!audioSrc) {
		return null;
	}

	return (
		<>
			<Audio src={audioSrc} />
			<AbsoluteFill
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'row',
					fontSize: 100,
					fontFamily: 'nunito',
				}}
			>
				{orientation === 'portrait' ? (
					<TitleDiv>
						{title.split('/').map((t) => (
							<h1>{t}</h1>
						))}
					</TitleDiv>
				) : null}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 1186.4 662.8"
					style={{position: 'absolute', bottom: 0}}
				>
					<defs>
						<path id="prefix__a" d="M-9.7 0h1197.1v662.8H-9.7z" />
					</defs>
					<clipPath id="prefix__b">
						<use xlinkHref="#prefix__a" overflow="visible" />
					</clipPath>
					{/* Pé da mesa */}
					<path
						style={{transform: `translateY(${tableEntry}px)`}}
						clipPath="url(#prefix__b)"
						fill="#edcf94"
						stroke="#0b0b0b"
						strokeMiterlimit={10}
						d="M47.2 626.1h34v56.4h-34zM850.5 626.6h281.4v49.9H850.5z"
					/>
					{/* Tampo da mesa */}
					<path
						style={{transform: `translateY(${tableEntry}px)`}}
						d="M1172 626.1H18.4c-2.7 0-5-1.1-5-2.5v-14.3c0-1.4 2.2-2.5 5-2.5H1172c2.7 0 5 1.1 5 2.5v14.3c0 1.4-2.2 2.5-5 2.5z"
						fill="#edcf94"
						stroke="#0b0b0b"
						strokeMiterlimit={10}
					/>
					{/* Sombra da mesa */}
					<path
						style={{transform: `translateY(${tableEntry}px)`}}
						fill="#d7b476"
						d="M851 627.2h280.4v10.5H851zM47.7 626.7h33v6.6h-33z"
					/>
					{/* Computador */}
					<g style={{transform: `translateY(${computerEntry}px)`}}>
						<path
							fill="#888889"
							stroke="#050606"
							strokeMiterlimit={10}
							d="M548.7 548.3l-4.3 26.8h98.7l-5.3-26.8z"
						/>
						<path
							fill="#767677"
							d="M548.4 555.7l-.8 6h91.9l-1.1-7h-89.5"
						/>
						<path
							d="M768.1 556.4H419.5c-6.8 0-12.3-5.3-12.3-11.8V285.1c0-6.5 5.5-11.8 12.3-11.8H768c6.8 0 12.3 5.3 12.3 11.8v259.4c.1 6.6-5.4 11.9-12.2 11.9z"
							fill="#e5e9ed"
							stroke="#050606"
							strokeMiterlimit={10}
						/>
						<path
							d="M770.8 510.3H413c-3.2 0-5.8-2.6-5.8-5.8V284.2c0-6.1 4.9-11 11-11h350.6c6.4 0 11.7 5.2 11.7 11.7v215.8c-.1 5.3-4.4 9.6-9.7 9.6z"
							fill="#202021"
							stroke="#050606"
							strokeMiterlimit={10}
						/>
						<path
							fill="#434445"
							stroke="#070808"
							strokeMiterlimit={10}
							d="M423.3 286.1h341v211.3h-341z"
						/>
						<path
							d="M518.9 596.3l1 5.6c.2 1.3 1.3 2.2 2.6 2.2h138.2c2.9 0 5.4-2.1 5.9-4.9v-.1c.2-1-.6-1.8-1.5-1.8l-146.2-1z"
							fill="#c7c6c6"
							stroke="#070808"
							strokeWidth={2}
							strokeMiterlimit={10}
						/>
						<path
							d="M544.1 575.1l-25.4 20.3c-1.3 1.1-.6 3.3 1.2 3.3l145.5-.4c1.1 0 1.6-1.3.8-2l-23.8-21.2h-98.3z"
							fill="#a3a3a2"
							stroke="#070808"
							strokeMiterlimit={10}
						/>
						<path
							d="M545.5 574l-.6 1.3c-1 1-1.4 1.3-2 1.9l-4.7 3.7 109.2.4-3-3.1c-.4-.4-.9-.8-1.2-1.2-.7-.8-.7-.6-1.1-1.7V574h-96.6zM521.8 601.8c.3.6 1.2 1.8 2 1.8h135.7c.5 0 1.1-.1 1.6-.2.5-.2 1.2-1.2 1.8-1.6H521.8z"
							fill="#a3a3a2"
						/>
						<circle cx={593.8} cy={280.6} r={1.3} fill="#5fbb46" />
						<path
							d="M589.7 275.5L423.6 278s-9.7.9-10.9 10.3c-1.2 9.4-1.9 118.4-3.4 138.9s0-138.9 0-138.9-1.9-13.4 14.2-13.1l166.2.3zM597.2 275.5l166.1 2.5s9.7.9 10.9 10.3c1.2 9.4 1.9 118.4 3.4 138.9s0-138.9 0-138.9 1.9-13.4-14.2-13.1l-166.2.3z"
							fill="#2d2d2d"
						/>
						<path
							d="M763.9 555.4H422.6c-10.5 1-14.1-5.4-14.2-8.6 1.4.4 2.9.6 4.4.6l358.8 1.6c2.5 0 4.9-.4 7.2-1.3-1.1 3.4-3.6 8.7-14.9 7.7z"
							fill="#ced1d3"
						/>
						<path
							d="M593.3 525.8c.6 0 1.4.1 2.2.4.9.3 1.5.4 1.7.4.4 0 1-.1 1.8-.4.8-.3 1.6-.4 2.2-.4 1 0 1.9.3 2.7.8.4.3.9.7 1.3 1.3-.7.6-1.1 1.1-1.4 1.5-.5.8-.8 1.7-.8 2.6 0 1 .3 2 .9 2.8.6.8 1.2 1.4 2 1.6-.3 1-.8 2.1-1.5 3.2-1.1 1.6-2.2 2.5-3.2 2.5-.4 0-1-.1-1.8-.4-.7-.3-1.4-.4-1.9-.4s-1.1.1-1.8.4c-.7.3-1.2.4-1.7.4-1.3 0-2.5-1.1-3.8-3.3-1.2-2.2-1.9-4.3-1.9-6.3 0-1.9.5-3.5 1.4-4.7.9-1.4 2.1-2 3.6-2z"
							fillRule="evenodd"
							clipRule="evenodd"
							fill="#434445"
						/>
						<path
							d="M601 521c0 .1.1.2.1.3v.2c0 .5-.1 1.1-.4 1.7-.2.6-.6 1.2-1.2 1.7-.5.5-.9.8-1.4.9-.3.1-.7.2-1.3.2 0-1.2.3-2.3 1-3.2.7-.9 1.8-1.5 3.2-1.8z"
							fillRule="evenodd"
							clipRule="evenodd"
							fill="#434445"
						/>
                        {textElements}
						{arrayWithFramesThatWaitingTypeShouldAppears.includes(
							frame
						) ? (
							<text 
                                x="635" 
                                y="398" 
                                style={{
                                    fontFamily: 'Courier Prime',
                                    fontSize: 32,
                                    display: 'block'
                                }}>_</text>
						) : null}
					</g>
					{/* Teclado */}
					<g style={{transform: `translateY(${keyboardEntry}px)`}}>
						<path
							d="M692.9 606.8H363.5V602c0-4 3.2-7.2 7.2-7.2h315c4 0 7.3 3.3 7.3 7.3v4.7z"
							fill="#e5e9ed"
							stroke="#0d0d0d"
							strokeMiterlimit={10}
						/>
						<path
							fill="#d2d6d8"
							d="M692 605.9H364.3l.1-3.3h327.7z"
						/>
						<path d="M376.7 593h21.4v1.9h-21.4zM469.8 593h21.4v1.9h-21.4zM492.8 592.9h95.4v1.9h-95.4zM399.6 593H421v1.9h-21.4zM422.8 593h21.4v1.9h-21.4zM445.9 593h21.4v1.9h-21.4zM590.3 592.9h21.4v1.9h-21.4zM613.2 592.9h21.4v1.9h-21.4zM636.3 592.9h21.4v1.9h-21.4zM659.5 592.9h21.4v1.9h-21.4z" />
						<path
							d="M397.1 593.9h-19.3v-2.1c0-.6 1-1.2 2.3-1.2h14.6c1.3 0 2.4.5 2.4 1.2v2.1zM419.9 593.9h-19.3v-2.1c0-.6 1-1.2 2.3-1.2h14.6c1.3 0 2.4.5 2.4 1.2v2.1zM443.1 593.9h-19.3v-2.1c0-.6 1-1.2 2.3-1.2h14.6c1.3 0 2.4.5 2.4 1.2v2.1zM466.3 593.9H447v-2.1c0-.6 1-1.2 2.3-1.2h14.6c1.3 0 2.4.5 2.4 1.2v2.1zM610.7 593.9h-19.3v-2.1c0-.6 1-1.2 2.3-1.2h14.6c1.3 0 2.4.5 2.4 1.2v2.1zM633.5 593.9h-19.3v-2.1c0-.6 1-1.2 2.3-1.2h14.6c1.3 0 2.4.5 2.4 1.2v2.1zM656.7 593.9h-19.3v-2.1c0-.6 1-1.2 2.3-1.2h14.6c1.3 0 2.4.5 2.4 1.2v2.1zM679.9 593.9h-19.3v-2.1c0-.6 1-1.2 2.3-1.2h14.6c1.3 0 2.4.5 2.4 1.2v2.1zM490.1 593.9h-19.3v-2.1c0-.6 1-1.2 2.3-1.2h14.6c1.3 0 2.4.5 2.4 1.2v2.1zM587.1 594h-93.6v-2.1c0-.7 5-1.2 11.2-1.2h70.9c6.3 0 11.5.5 11.5 1.2v2.1z"
							fill="#fff"
							stroke="#0d0d0d"
							strokeMiterlimit={10}
						/>
					</g>
					{/* Lamp */}
					<g style={{transform: `translateY(${lampEntry}px)`}}>
						<g stroke="#0b0b0b" strokeMiterlimit={10}>
							<g fill="#228370">
								<path d="M187.9 333.9l6.9 3.8-123.9 79.4-5.7-5.5 122.7-77.7M198.6 342.1l6.9 4.8-121.4 78.3-5.1-5.5 119.6-77.6" />
							</g>
							<ellipse
								cx={193.8}
								cy={347.5}
								rx={18.5}
								ry={19.3}
								fill="#228370"
							/>
							<path
								d="M225.9 393.2s13 10.9 26.6 2.5c2.4-1.5 4.4-3.9 5.7-6.6 3.3-6.8 7.6-20.6-5-31.8l-27.3 35.9z"
								fill="#e8df9a"
							/>
							<path
								d="M270.5 319.1c-20.6-7.9-47.5-7.3-64.6 4.4-11.4 7.8-20 19-24.3 33.7-8.6 29.1 1.8 61 22.5 79.4 1.3 1.2 3.3 1 4.3-.5L285.7 330c.7-.9.5-2.3-.4-2.9-4.5-3.3-9.4-6-14.8-8z"
								fill="#3fbda4"
							/>
							<g fill="#228370">
								<path d="M69.7 432.6l4.9-6.3 51.2 141.5-6.3 4.8-49.8-140M81.6 429.1l5.9-6.2 50.7 138.9-6.2 4.2-50.4-136.9" />
							</g>
							<ellipse
								cx={80.2}
								cy={422.9}
								rx={19.7}
								ry={20.5}
								fill="#3fbda4"
							/>
						</g>
						<path
							className="prefix__lamp-leg"
							d="M193.8 606.2H66.2v-11.6c0-1.6 2.1-2.9 4.7-2.9h121.2c1 0 1.7.5 1.7 1.1v13.4z"
							fill="#228370"
							stroke="#0b0b0b"
							strokeMiterlimit={10}
						/>
						<g stroke="#0b0b0b" strokeMiterlimit={10}>
							<path
								d="M81.6 591.6s10.6-32.8 48.4-31.4c0 0 39 2.3 48.7 31.4H81.6z"
								fill="#3fbda4"
							/>
							<path
								d="M147.9 564s8.8 4.6 17-.4c.5-.3 1 .1 1 .8v9.2s-13.8-8.3-18-9.6z"
								fill="#70baaf"
							/>
						</g>
						<path
							d="M182.3 357.8c-8.4 28.4 1.9 61.2 23.2 78.5 1.2-.5-1.2.5 0 0l-3.4-108.7c-9.2 7.5-16.1 17.6-19.8 30.2zM61.3 422.9c0 10.7 8.4 19.6 18.2 19.6h.6L74 404.3c-7.2 2.5-12.7 9.9-12.7 18.6zM83 590.7h39l-8.3-27.8C90.4 569.8 83 590.7 83 590.7z"
							fill="#2faf97"
						/>
						<path
							d="M220.9 321.6c-.4-.1 26.1-7 46 3.5M271.7 328.3l3.1 1.7M88.5 409.4s9.3 7.1 6.2 16.8M125.8 564.4s17 1 28.6 9.2M160.2 577.1l3.1 2.4"
							fill="none"
							stroke="#bfe4e2"
							strokeLinecap="round"
							strokeMiterlimit={10}
						/>
					</g>
					{/* Mouse */}
					<g style={{transform: `translateY(${mouseEntry}px)`}}>
						<path
							d="M724.1 606.7s0-8.6 12.9-14.3c8.7-3.9 18.7-4 27.5-.6 6.8 2.6 13.7 7.2 13.7 15l-54.1-.1z"
							fill="#e5e9ed"
							stroke="#0b0b0b"
							strokeMiterlimit={10}
						/>
						<path
							d="M764.5 592.5c-3.9-1.4-9-2.6-13.3-2.4v15.7l26.1.1c-.1-4.3-4.3-10.3-12.8-13.4z"
							fill="#d1d4d6"
						/>
					</g>
					{/* Coffee */}
					<g style={{transform: `translateY(${coffeeEntry}px)`}}>
						<path
							fill="#f9efe5"
							stroke="#0d0d0d"
							strokeMiterlimit={10}
							d="M849.8 516.5l15.3 90.3H908l14.4-90.3h-68.7"
						/>
						<path
							fill="#f3e5d4"
							d="M921.2 519.5l-35.1-3-.4 89.4h21.7z"
						/>
						<path
							fill="#be5532"
							stroke="#0d0d0d"
							strokeMiterlimit={10}
							d="M853.3 546.7l6.4 35h53.1l6.1-35z"
						/>
						<path
							fill="#ad4025"
							d="M917.8 547.7h-31.6l-.1 33.2h26.1z"
						/>
						<path
							fill="none"
							stroke="#9b3021"
							strokeLinecap="round"
							strokeMiterlimit={10}
							d="M858.3 551.2h56.4M860.1 557.9h53.6M861.1 565.8h50.5M862.1 573.1h48.4M862 578.7h47.5"
						/>
						<path
							fill="#be5532"
							stroke="#0b0b0b"
							strokeMiterlimit={10}
							d="M845.3 524.5h80.9v-8h-80.9z"
						/>
						<path
							fill="#be5532"
							stroke="#070808"
							strokeMiterlimit={10}
							d="M851.8 505.9l-2 10.6h71.4l-2.3-10.6z"
						/>
						<path
							fill="#ad4025"
							d="M925.2 517.5h-38.5v6.1l38.5.2zM920 515.7l-1.8-9-31.4.1v8.9z"
						/>
						<path fill="#9b3021" d="M850.9 515.7l.3-2h68.4l.4 2z" />
					</g>
				</svg>
			</AbsoluteFill>
		</>
	);
};
