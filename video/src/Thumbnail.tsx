import {AbsoluteFill, useVideoConfig} from 'remotion';

import avatar from '../../assets/Avatar.png';

export const Thumbnail: React.FC<{
	title: string;
	date: string;
}> = ({title, date}) => {
	const videoConfig = useVideoConfig();

	const orientation =
		videoConfig.width > videoConfig.height ? 'landscape' : 'portrait';

	return (
		<div
			style={{
				flex: 1,
				background: '#0C2D48',
			}}
		>
			<AbsoluteFill
				style={{
					justifyContent: orientation === 'landscape' ? '' : 'center',
				}}
			>
				<div
					style={{
						height: orientation === 'landscape' ? 900 : 1150,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: 100,
					}}
				>
					{title.split('/').map((t) => (
						<h1
							style={{
								fontSize: 100,
								lineHeight: '85px',
								fontFamily: 'ProductSans',
								color: '#fff',
								textAlign: 'center',
								fontWeight: 300,
								margin: 0,
							}}
						>
							{t}
						</h1>
					))}
				</div>
				<div
					style={{
						position: 'absolute',
						right: orientation === 'landscape' ? 100 : '50%',
						transform:
							orientation === 'landscape'
								? ''
								: 'translateX(50%)',
						bottom: orientation === 'landscape' ? 50 : 1700,
						display: 'flex',
						alignItems: 'center',
						backgroundColor: '#3F6182',
						padding: 20,
						borderRadius: 10,
					}}
				>
					<img
						src={avatar}
						width={videoConfig.width / 20}
						height={videoConfig.width / 20}
						style={{
							borderRadius: 50,
							boxShadow: '0px 0px 30px -10px rgba(0,0,0,0.75)',
							marginRight: 15,
						}}
					/>
					<h1
						style={{
							fontFamily: 'Nunito',
							color: '#fff',
							fontSize: 40,
						}}
					>
						CodeStack
					</h1>
				</div>
				<h2
					style={{
						position: 'absolute',
						bottom: 50,
						left: orientation === 'landscape' ? 100 : '50%',
						transform:
							orientation === 'landscape'
								? ''
								: 'translateX(-50%)',
						fontSize: 70,
						fontFamily: 'ProductSans',
						color: '#fff',
						textAlign: 'center',
						fontWeight: 'lighter',
						marginBottom: 30,
					}}
				>
					{date}
				</h2>
			</AbsoluteFill>
		</div>
	);
};
