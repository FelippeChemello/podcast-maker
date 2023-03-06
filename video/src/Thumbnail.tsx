import Segments from 'models/Segments';
import { AbsoluteFill, useVideoConfig } from 'remotion';

import avatar from '../../assets/Avatar.png';
import measureParagraph from './utils/measureParagraph';

export const Thumbnail: React.FC<{
    title: string;
    date: string;
}> = ({ title, date }) => {
    const videoConfig = useVideoConfig();

    const orientation =
        videoConfig.width > videoConfig.height ? 'landscape' : 'portrait';

    let titleFontSize = 500;
    let spaceBetweenLines = 20;
    const titleDivWidth =
        orientation === 'landscape'
            ? videoConfig.width - (videoConfig.width / 7 + 20) - 200 // Width - (Avatar width + margin) - safe margin
            : videoConfig.width - 200; // Width - safe margin
    const titleDivHeight = videoConfig.height - 200; // Height - 100px margin

    const titles = title.split('/');
    let hasFitText = false;
    let finalTitle: string[] = [];

    do {
        for (let titleIndex = 0; titleIndex < titles.length; titleIndex++) {
            if (hasFitText) {
                break;
            }

            const titleToMeasure = titles[0];

            const { height, width, lines } = measureParagraph(
                titleToMeasure,
                'ProductSans',
                titleFontSize,
                400,
                { height: titleDivHeight, width: titleDivWidth },
            );

            if (height < titleDivHeight && width < titleDivWidth) {
                hasFitText = true;
                finalTitle = lines.map(line => line.words.join(' '));

                console.log(titleFontSize);
                console.log(
                    height,
                    titleDivHeight,
                    width,
                    titleDivWidth,
                    titleToMeasure,
                );
                console.log(lines);
            } else {
                console.log(
                    height,
                    titleDivHeight,
                    width,
                    titleDivWidth,
                    titleToMeasure,
                );
            }
        }

        if (!hasFitText) {
            titleFontSize -= 10;
        }
    } while (!hasFitText);

    return (
        <div
            style={{
                flex: 1,
                backgroundImage: `radial-gradient(${
                    orientation === 'landscape' ? 'at 40%' : 'circle'
                }, #0052cc, #0C2D48)`,
            }}
        >
            <AbsoluteFill
                style={{
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        height: titleDivHeight,
                        width: titleDivWidth,
                        marginLeft: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <h1
                        style={{
                            fontSize: `${titleFontSize}px`,
                            lineHeight: `${
                                titleFontSize + spaceBetweenLines
                            }px`,
                            fontFamily: 'ProductSans',
                            color: '#fff',
                            textAlign: 'center',
                            fontWeight: 400,
                            margin: 0,
                        }}
                        dangerouslySetInnerHTML={{
                            __html: finalTitle.join('<br />'),
                        }}
                    ></h1>
                </div>
                <div
                    style={{
                        position: 'absolute',
                        right: 20,
                        top: 20,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <img
                        src={avatar}
                        width={
                            orientation === 'landscape'
                                ? videoConfig.width / 7
                                : videoConfig.width / 3
                        }
                        height={
                            orientation === 'landscape'
                                ? videoConfig.width / 7
                                : videoConfig.width / 3
                        }
                        style={{
                            borderRadius: 50,
                            boxShadow: '0px 0px 30px -10px rgba(0,0,0,0.75)',
                        }}
                    />
                </div>
                <h2
                    style={{
                        position: 'absolute',
                        bottom:
                            orientation === 'landscape'
                                ? 200
                                : videoConfig.height - 350,
                        margin: 0,
                        right: orientation === 'landscape' ? 0 : 350,
                        transform: 'translateX(-20%)',
                        // @ts-ignore
                        writingMode: `${
                            orientation === 'landscape'
                                ? 'vertical-rl'
                                : 'horizontal-tb'
                        }`,
                        fontSize: orientation === 'landscape' ? 180 : 250,
                        fontFamily: 'ProductSans',
                        color: '#fff',
                        textAlign: 'center',
                        fontWeight: 'lighter',
                    }}
                >
                    {date.split('/').slice(0, 2).join('/')}
                </h2>
            </AbsoluteFill>
        </div>
    );
};
