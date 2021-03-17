import {Composition} from 'remotion';
import {Main} from './Main';

export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Composition
				id="Main"
				component={Main}
				durationInFrames={450}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					text:
						'Turma, desejamos a vocês uma excelente terça-feira! Após as notícias de hoje, a gente apresenta um trabalho remoto ganhando em dólar e um curso de inglês específico para programadores para você não perder mais oportunidades em empresas estrangeiras:',
				}}
			/>
            
		</>
	);
};
