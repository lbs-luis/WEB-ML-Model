import * as tf from '@tensorflow/tfjs';

export class LinearModel {
  private model!: tf.Sequential;
  public prediction: number | null = null;

  async train() {
    // Define o modelo
    this.model = tf.sequential();
    this.model.add(tf.layers.dense({
      units: 1,
      inputShape: [1],
      activation: 'linear' // Definir a ativação como linear, se necessário
    }));

    // Compila o modelo
    this.model.compile({
      optimizer: tf.train.sgd(0.01), // Define a taxa de aprendizado
      loss: 'meanSquaredError'
    });

    // Aqui você pode adicionar a lógica de treinamento com dados reais
    // Exemplo de treinamento com dados fictícios:
    const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]); // Dados de entrada
    const ys = tf.tensor2d([1, 2, 3, 4], [4, 1]); // Dados de saída correspondentes

    await this.model.fit(xs, ys, {
      epochs: 100, // Número de épocas de treinamento
      verbose: 1 // Mostra o progresso do treinamento
    });
  }

  async predict(value: number) {
    if (!this.model) {
      throw new Error('O modelo não está treinado ou carregado.');
    }

    const tensor = tf.tensor2d([value], [1, 1]);
    const result = this.model.predict(tensor) as tf.Tensor;
    this.prediction = (await result.data())[0];
  }
}
