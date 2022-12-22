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

const handle = delayRender();

const { filename } = getInputProps();

import loadFromTmp from './utils/loadFromTmp';

async function loadData() {
    if (filename) {
        return await loadFromTmp(filename);
    }
}

export const RemotionVideo: React.FC = () => {
    const [data, setData] = useState<{
        width: number;
        height: number;
        fullDuration: number;
        date: string;
        title: string;
        fps: number;
        renderData: { duration: number; text: string; audioFilePath: string }[];
    }>();

    const fetchData = async () => {
        const json = await loadData();
        setData(json);

        continueRender(handle);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (!data) {
        return null;
    }

    return (
        <>
            <Composition
                id="Main"
                component={Main}
                durationInFrames={Math.floor(data.fullDuration * data.fps)}
                fps={data.fps}
                width={data.width}
                height={data.height}
                defaultProps={{
                    textProps: data.renderData,
                    title: data.title,
                    date: data.date,
                }}
            />
            <Composition
                id="Thumbnail"
                component={Thumbnail}
                durationInFrames={1}
                fps={data.fps}
                width={data.width}
                height={data.height}
                defaultProps={{
                    title: data.title,
                    date: data.date,
                }}
            />
        </>
    );
};
