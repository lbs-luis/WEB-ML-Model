import * as tf from '@tensorflow/tfjs';

export class LinearModel {
  private model!: tf.Sequential;

  async loadAndProcessImage(imagePath: string): Promise<{ X: number[][]; y: number[] }> {
    const image = new Image();
    image.src = imagePath;

    return new Promise((resolve) => {
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context not available.');

        const cellSize = 28; // Cada número tem 28x28 pixels
        const rows = 10; // 10 linhas (0-9)
        const cols = 28; // 28 colunas
        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);

        const subimages: number[][] = [];
        const labels: number[] = [];

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const x = col * cellSize;
            const y = row * cellSize;

            // Extrair subimagem
            const imageData = ctx.getImageData(x, y, cellSize, cellSize);
            const pixels = Array.from(imageData.data)
              .filter((_, index) => index % 4 === 0) // Apenas o canal de luminosidade (grayscale)
              .map((pixel) => pixel / 255); // Normalizar para [0, 1]

            subimages.push(pixels);
            labels.push(row); // O rótulo é a linha (número correspondente)
          }
        }

        resolve({ X: subimages, y: labels });
      };
    });
  }

  async train(X: number[][], y: number[]): Promise<void> {
    this.model = tf.sequential();
    this.model.add(
      tf.layers.dense({
        units: 10, // 10 unidades para prever números de 0 a 9
        inputShape: [X[0].length], // Tamanho de cada vetor achatado (784)
        activation: 'softmax', // Softmax para probabilidade
      })
    );

    this.model.compile({
      optimizer: tf.train.sgd(0.01),
      loss: 'categoricalCrossentropy',
    });

    const xs = tf.tensor2d(X);
    const ys = tf.oneHot(y, 10); // One-hot encoding para os rótulos

    await this.model.fit(xs, ys, {
      epochs: 100,
      verbose: 1,
    });
  }

  async predict(imageArray: number[]): Promise<Array<{ number: number; probability: number }>> {
    if (!this.model) {
      throw new Error('O modelo não está treinado ou carregado.');
    }

    const tensor = tf.tensor2d([imageArray]);
    const resultTensor = this.model.predict(tensor) as tf.Tensor;
    const probabilities = await resultTensor.data(); // Extrai as probabilidades do tensor

    // Encontra os índices dos 3 números com maior probabilidade
    const top3 = Array.from(probabilities)
      .map((probability, index) => ({ number: index, probability }))
      .sort((a, b) => b.probability - a.probability) // Ordena por probabilidade decrescente
      .slice(0, 3); // Retorna os 3 primeiros

    return top3;
  }
}
