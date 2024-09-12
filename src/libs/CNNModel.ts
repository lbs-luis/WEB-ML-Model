import * as tf from '@tensorflow/tfjs';

export class CNNModel {
  private model!: tf.LayersModel;
  public prediction: any;

  async loadModel() {
    this.model = await tf.loadLayersModel('/models/model.json');
  }

  async predict(imageData: ImageData) {
    await tf.tidy(() => {

      // Convert the canvas pixels to 
      let img = tf.browser.fromPixels(imageData, 1);
      img = img.reshape([1, 28, 28, 1]);
      img = tf.cast(img, 'float32');

      // Make and format the predications
      const output = this.model.predict(img) as any;

      // Save predictions on the component
      this.prediction = Array.from(output.dataSync());
    });
  }
}
