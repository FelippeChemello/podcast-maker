import {Composition} from 'remotion';
import {Main} from './Main';

export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Composition
				id="Main"
				component={Main}
				durationInFrames={256 * 30}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					textProps: [
						{
							duration: 15,
							text:
								'Turma, desejamos a vocês uma excelente terça-feira! Após as notícias de hoje, a gente apresenta um trabalho remoto ganhando em dólar e um curso de inglês específico para programadores para você não perder mais oportunidades em empresas estrangeiras:',
						},
						{
							duration: 27,
							text:
								'Elon Musk se autodeclara "Tecnorei" da Tesla: a informação foi oficializada em documentos encaminhados à SEC, a comissão de valores mobiliários dos EUA. Musk, entretanto, ainda manterá o cargo de CEO. O CFO da companhia também passará a se intitular "Mestre da Moeda", expressão retirada da série "Game of Thrones" para designar o chefe do tesouro e das finanças do reino fictício. As informações são da Ars Technica.',
						},
						{
							duration: 22,
							text:
								'Empresa transforma gás carbônico retirado da atmosfera em diamantes: segundo a Aether, cada quilate de um diamante remove 20 toneladas de CO2 da atmosfera, o equivalente ao gás produzido por uma pessoa em um ano. Os diamantes são sintetizados utilizando apenas energia solar, eólica ou hidráulica. As informações são da revista Scientific American.',
						},
						{
							duration: 38,
							text:
								'Nova IA explica como funcionam algumas ilusões de óptica: os pesquisadores reproduziram certos movimentos que confundem seres humanos e descobriram que a inteligência artificial cometia os mesmos erros de percepção. A MotionNet, criada por pesquisadores da Universidade de Cambridge, foi projetada para corresponder às estruturas de processamento visual humano que não podem ser medidas diretamente no cérebro. A vantagem em utilizar a inteligência artificial é que os cientistas agora podem explorar de perto essa rede neural para entender o motivo de isso acontecer. As informações são da página de imprensa da Universidade de Cambridge.',
						},
						{
							duration: 28,
							text:
								'Rússia afunda observatório de neutrinos no lago mais profundo do mundo para estudar a história do universo: o Baikal-GVD foi submerso a uma profundidade de até 1,3 km no lago Baical na Sibéria, Rússia. O observatório, que mede meio quilômetro cúbico, é projetado para observar neutrinos, as menores partículas atualmente conhecidas e muito difíceis de detectar, e a água é um meio eficaz para isso. As informações são do site Engadget.',
						},
						{
							duration: 33,
							text:
								'Netflix deve perder domínio global de streaming em 2024: segundo o relatório da empresa Ampere Analysis, em 2024 a Disney+ vai contar com 295 milhões de usuários, ultrapassando os 279 milhões da Netflix. O serviço de streaming da Walt Disney registrou um crescimento explosivo, atingindo 100 milhões de usuários desde o seu lançamento em 2019, marco que a empresa estimava alcançar apenas após 2024. As informações são do jornal The Guardian.',
						},
						{
							duration: 31,
							text:
								'Stripe torna-se segunda startup mais valiosa do mundo: a empresa de pagamentos online recebeu uma nova rodada de investimentos avaliando a companhia em 95 bilhões de dólares, ficando apenas atrás da ByteDance, dona do TikTok, que tem valor estimado em 140 bilhões de dólares. Em terceiro lugar está a SpaceX de Elon Musk, avaliada em 74 bilhões de dólares. O Nubank fica na décima posição, avaliado em 25 bilhões de dólares. As informações são do portal G1 da Globo.',
						},
						{
							duration: 34,
							text:
								'Inventor da Internet, Tim Berners-Lee afirma que precisamos de redes sociais onde "coisas ruins acontecem menos": Berners-Lee acredita que é preciso construir curadorias de comunidades, assim como a Wikipedia, sistemas que levem as pessoas a serem mais construtivas e mais propensas a entender como é estar do outro lado de uma divisão cultural. O cientista da computação também acredita que as redes sociais precisam incentivar usuários a sinalizar informações incorretas e indicar novos amigos que possam melhorar a compreensão de um mundo mais amplo. As informações são do jornal The Guardian.',
						},
						{
							duration: 28,
							text:
								'Google lança hub que monitora sono usando IA e radar: o Nest Hub utiliza um sensor de radar em miniatura para detectar desde pequenos movimentos dos dedos até o corpo inteiro. O sistema vai utilizar um algoritmo de machine learning para avaliar se a pessoa está alerta, dormindo ou até mesmo roncando. Para treinar o modelo, foram registradas mais de um milhão de horas de dados de radar de milhares de pessoas. As informações são do blog Google AI.',
						},
					],
				}}
			/>
		</>
	);
};
