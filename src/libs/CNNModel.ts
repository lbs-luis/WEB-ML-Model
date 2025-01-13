import * as mobilenet from '@tensorflow-models/mobilenet';

export class CNNModel {
  private model!: mobilenet.MobileNet;

  // Carrega o modelo MobileNet
  async loadModel(): Promise<void> {
    try {
      this.model = await mobilenet.load(); // Carrega o modelo MobileNet
      console.log('Modelo MobileNet carregado com sucesso.');
    } catch (error) {
      console.error('Erro ao carregar o modelo MobileNet:', error);
      throw new Error('Não foi possível carregar o modelo.');
    }
  }

  // Classifica uma imagem do canvas usando MobileNet
  async classifyImage(canvas: HTMLImageElement): Promise<Array<{ className: string; probability: number }>> {
    try {
      // Classifica a imagem do canvas
      const predictions = await this.model.classify(canvas);

      console.log('Predições:', predictions);
      return predictions; // Retorna as predições (classe e probabilidade)
    } catch (error) {
      console.error('Erro ao classificar a imagem:', error);
      throw new Error('Não foi possível classificar a imagem.');
    }
  }
}
