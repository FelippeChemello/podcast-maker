import {YouTubeScreen} from './YouTubeScreen';

export const Wrapper: React.FC = ({children}) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				justifyContent: 'space-between',
			}}
		>
			{children}
		</div>
	);
};
