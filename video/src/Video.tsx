import { useEffect, useState } from 'react';
import {
    Composition,
    delayRender,
    continueRender,
    getInputProps,
} from 'remotion';
import { Main } from './Main';
import { Thumbnail } from './Thumbnail';

import '../../assets/fonts.css';
import InterfaceJsonContent from 'models/InterfaceJsonContent';

const { 
    content, 
    durationInFrames
 } = getInputProps() as { 
    content: InterfaceJsonContent,
    durationInFrames: number
 }

export const RemotionVideo: React.FC = () => {
    if (!content || !durationInFrames) {
        throw new Error(`Missing information. Content: ${!!content}, renderData: ${!!content?.renderData}, durationInFrames: ${!!durationInFrames}`);
    }

    return (
        <>
            <Composition
                id="Main"
                component={Main}
                durationInFrames={durationInFrames}
                fps={content.fps}
                width={content.width}
                height={content.height}
                defaultProps={{
                    content
                }}
            />
            <Composition
                id="Thumbnail"
                component={Thumbnail}
                durationInFrames={1}
                fps={content.fps}
                width={content.width}
                height={content.height}
                defaultProps={{
                    title: content.thumbnail_text ?? content.title,
                    date: content.date,
                }}
            />
        </>
    );
};
