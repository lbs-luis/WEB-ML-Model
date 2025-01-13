'use client'
import { useState, useEffect, FC, useRef } from 'react'
import { LinearModel } from '@/libs/LinearModel'
import { LoaderCircle } from 'lucide-react'
import { DrawableCanvas } from './DrawableCanvas'
import Image from 'next/image'

export function LinearModelPredict() {
  const [isModelTraining, setIsModelTraining] = useState<boolean>(true)
  const [predictions, setPredictions] = useState<Array<{ number: number; probability: number }> | null>(null)
  const [model, setModel] = useState<LinearModel | null>(null)
  const canvasRef = useRef<{ getCanvas: () => HTMLCanvasElement; clearCanvas: () => void }>(null)

  useEffect(() => {
    const trainModel = async () => {
      try {
        const linearModel = new LinearModel();
        const { X, y } = await linearModel.loadAndProcessImage('/images/numeros-desenhados.png');
        await linearModel.train(X, y);

        setModel(linearModel);
        setIsModelTraining(false);
      } catch (error) {
        console.error('Erro ao treinar o modelo:', error);
      }
    };

    trainModel();
  }, []);

  const handleClassify = async () => {
    if (model && canvasRef.current) {
      try {
        const canvas = canvasRef.current.getCanvas();
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Contexto do canvas não disponível.');

        // Redimensiona a imagem para 28x28 pixels e obtém os dados normalizados
        const scaledCanvas = document.createElement('canvas');
        scaledCanvas.width = 28;
        scaledCanvas.height = 28;
        const scaledCtx = scaledCanvas.getContext('2d');
        if (!scaledCtx) throw new Error('Contexto do canvas escalado não disponível.');

        scaledCtx.drawImage(canvas, 0, 0, 28, 28);
        const imageData = scaledCtx.getImageData(0, 0, 28, 28);
        const pixels = Array.from(imageData.data)
          .filter((_, index) => index % 4 === 0) // Apenas o canal de luminosidade (grayscale)
          .map((pixel) => pixel / 255); // Normalizar para [0,1]

        // Faz a predição usando o modelo linear
        const result = await model.predict(pixels);
        setPredictions(result); // Salva as predições no estado
      } catch (error) {
        console.error('Erro ao classificar o desenho:', error);
      }
    }
  };

  const handleClearCanvas = () => {
    canvasRef.current?.clearCanvas();
    setPredictions(null);
  };

  return (
    <div className="flex flex-col max-w-[400px] w-full">
      <h1 className="text-3xl font-semibold">Modelo Linear</h1>
      <p className='text-sm text-white/70 my-2'>Modelo já treinado mas especializado dentro deste projeto usando a imagem a baixo.</p>
      <Image width={400} height={250} src={"/images/numeros-desenhados.png"} alt='Imagens com desenhos manuais de numeros de 0 a 9.' />
      {isModelTraining ? (
        <div className="flex flex-row text-base text-gray-400 items-center gap-4 pointer-events-none select-none mt-4">
          <span className="font-light text-2xl">Treinando modelo...</span>
          <LoaderCircle className="h-5 w-5 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 mt-4 items-center">
            <p className="font-light text-2xl w-full text-left">Desenhe um número</p>
            {/* Canvas para desenhar */}
            <DrawableCanvas ref={canvasRef} />
            <div className="flex flex-row w-full justify-between gap-4 mt-4">
              {/* Botão para enviar o desenho */}
              <button
                onClick={handleClassify}
                className="px-4 py-2 bg-blue-500 text-white rounded max-w-[180px] w-full"
              >
                Classificar
              </button>
              {/* Botão para limpar o canvas */}
              <button
                onClick={handleClearCanvas}
                className="px-4 py-2 bg-red-500 text-white rounded max-w-[180px] w-full"
              >
                Limpar
              </button>
            </div>
          </div>
          {/* Exibição das predições */}
          {predictions && (
            <div className="flex flex-col gap-2 mt-4">
              <p className="font-light text-2xl">Resultado:</p>
              {predictions.map((prediction, index) => (
                <span key={index} className="w-full text-center px-2 py-1 bg-cyan-600 text-white outline-none rounded-md">
                  {`${prediction.number}: ${(prediction.probability * 100).toFixed(2)}%`}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
