import Segments from 'models/Segments';
import { AbsoluteFill, getInputProps, useVideoConfig } from 'remotion';

import avatar from '../../assets/Avatar.png';
import measureParagraph from './utils/measureParagraph';
import InterfaceJsonContent from '../../src/models/InterfaceJsonContent';

const { 
    content, 
 } = getInputProps() as { 
    content: InterfaceJsonContent,
 }

export const Thumbnail: React.FC = () => {
    const title = content.thumbnail_text ?? content.title
    const date = content.date
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
            }
        }

        if (!hasFitText) {
            titleFontSize -= 10;
        }
    } while (!hasFitText);

    const hasImage = content.thumbnail_image_src !== undefined

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
                {hasImage ? (
                    <div style={{ position: 'relative', display: 'flex', width: videoConfig.width, height: videoConfig.height }}>
                        <div 
                            style={{ 
                                width: '100%',
                                zIndex: 10, 
                                background: 'linear-gradient(90deg, #0C2D48 0%, rgba(12,45,72,0) 100%)', 
                            }} 
                        />
                        <div
                            style={{
                                position: 'absolute',
                                zIndex: 5,
                                right: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: `url(${content.thumbnail_image_src})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                width: '50%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'start'
                            }}
                        >
                            <h1
                                style={{
                                    fontSize: 160,
                                    lineHeight: 0.9,
                                    fontFamily: 'ProductSans',
                                    color: '#fff',
                                    fontWeight: 400,
                                    margin: 0,
                                    padding: 20,
                                    zIndex: 10,
                                    textShadow: '4px 4px 8px rgba(0, 0, 0, 0.9), 2px 2px 6px rgba(0, 0, 0, 0.7)'
                                }}
                                dangerouslySetInnerHTML={{ __html: content.thumbnail_text! }}
                            />   
                        </div>
                    </div>
                ) : (
                    <>
                        <div
                            style={{
                                height: titleDivHeight,
                                width: titleDivWidth,
                                marginLeft: 100,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                    zIndex: 10,
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
                    </>
                )}
            </AbsoluteFill>
        </div>
    );
};
