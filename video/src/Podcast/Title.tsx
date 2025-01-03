import React from 'react';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { continueRender, delayRender, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import Segment from '../../../src/models/Segments';

export const Title: React.FC<{
    segments: Segment[];
}> = ({ segments }) => {
    const videoConfig = useVideoConfig();
    const frame = useCurrentFrame();

    const orientation = videoConfig.width > videoConfig.height ? 'landscape' : 'portrait';
    const indexOfEndOfTitle = segments.findIndex((segment) => segment.word.includes(':'));

    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const [fontSize, setFontSize] = useState(100);
    const [delayedRender] = useState(() => delayRender('Title-Font-Adjustment'));

    useEffect(() => {
        const adjustFontSize = () => {
            if (containerRef.current && textRef.current) {
                const containerHeight = containerRef.current.offsetHeight;
                let currentFontSize = fontSize;
                textRef.current.style.fontSize = `${currentFontSize}px`;

                while (
                    textRef.current.scrollHeight > containerHeight &&
                    currentFontSize > 10
                ) {
                    currentFontSize -= 1;
                    textRef.current.style.fontSize = `${currentFontSize}px`;
                }

                if (currentFontSize !== fontSize) {
                    setFontSize(currentFontSize);
                }

                continueRender(delayedRender);
            }
        };

        adjustFontSize();
    }, [segments]);

    const buildSegments = segments.map(({ word, start, end }, index) => {
        const startInFrames = start / (1000 / videoConfig.fps);
        const endInFrames = end / (1000 / videoConfig.fps);
        const wordShouldAppear = frame >= startInFrames && frame <= endInFrames;
        const isTitle = index <= indexOfEndOfTitle;

        let animation = 0;
        if (wordShouldAppear) {
            const duration = endInFrames - startInFrames;
            let animationInFrames = 1;
            while (duration < animationInFrames * 2) {
                animationInFrames -= 0.1;
            }

            const secondStep = startInFrames + animationInFrames;
            const thirdStep = endInFrames - animationInFrames + 0.001;

            animation = interpolate(
                frame,
                [startInFrames, secondStep, thirdStep, endInFrames],
                [0, 1, 1, 0],
                {
                    easing: Easing.bezier(0, 0.3, 1, 0.7),
                }
            );
        }

        return (
            <React.Fragment key={word + index}>
                <span
                    style={{
                        display: 'inline-block',
                        fontSize: isTitle ? '1em' : `${45 / 65}em`,
                        lineHeight: 1.2,
                        fontWeight: isTitle ? 700 : 300,
                        background: `rgba(250, 250, 250, ${animation})`,
                        color: wordShouldAppear ? '#2b2b2b' : '#fafafa',
                        borderRadius: 16,
                        padding: `0px 4px`,
                    }}
                >
                    {word}
                </span>
                {isTitle && index === indexOfEndOfTitle ? <br /> : <> </>}
            </React.Fragment>
        );
    });

    return (
        <div
            ref={containerRef}
            style={{
                maxHeight: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: orientation === 'landscape' ? 50 : 100,
                overflow: 'hidden',
            }}
        >
            <h1
                ref={textRef}
                style={{
                    fontFamily: 'Nunito',
                    alignSelf: 'center',
                    opacity: 1,
                    margin: 0,
                    fontSize: `${fontSize}px`,
                    lineHeight: 1,
                }}
            >
                {buildSegments}
            </h1>
        </div>
    );
};
