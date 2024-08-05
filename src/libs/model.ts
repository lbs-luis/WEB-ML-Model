import * as tf from '@tensorflow/tfjs'


export class LinearModel {
  private model!: tf.Sequential;
  public prediction: any;

  async train(): Promise<any> {
    // Definir o modelo sequencial
    this.model = tf.sequential();

    // Adicionar camadas densas com diferentes funções de ativação e regularização L2
    this.model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [1], kernelRegularizer: tf.regularizers.l2({ l2: 0.01 }) }));
    this.model.add(tf.layers.dense({ units: 32, activation: 'relu', kernelRegularizer: tf.regularizers.l2({ l2: 0.01 }) }));
    this.model.add(tf.layers.dense({ units: 1 }));

    // Compilar o modelo com um otimizador e taxa de aprendizado ajustada
    this.model.compile({
      loss: 'meanSquaredError',
      optimizer: tf.train.adam(0.001)  // Usar o otimizador Adam com uma taxa de aprendizado de 0.001
    });

    // Normalizar os dados de entrada e saída
    const xs = tf.tensor1d([3.2, 4.4, 5.5, 6.1, 7.2, 8.3, 9.0, 10.1]);
    const ys = tf.tensor1d([1.6, 2.7, 3.5, 4.1, 5.0, 5.9, 6.5, 7.1]);

    // Treinar o modelo por mais épocas e definir o tamanho do lote
    await this.model.fit(xs, ys, {
      epochs: 500,  // Aumentar o número de épocas para permitir melhor ajuste do modelo
      batchSize: 2,  // Definir o tamanho do lote
      validationSplit: 0.2,  // Separar parte dos dados para validação
      callbacks: tf.callbacks.earlyStopping({ monitor: 'val_loss', patience: 10 })  // Usar early stopping para evitar overfitting
    });
  }
  async predict(val: number) {
    const output = this.model.predict(tf.tensor2d([val], [1, 1])) as any
    this.prediction = Array.from(output.dataSync())[0]
  }
}
