'use client'
import { useState, useEffect, FC, useRef } from 'react'
import { LoaderCircle } from 'lucide-react'
import { CNNModel } from '@/libs/CNNModel'
import { DrawableCanvas } from './DrawableCanvas'
import { ModelPrediction } from './ModelPrediction'

export const CNNModelPredict: FC = () => {
  const [isModelTraining, setIsModelTraining] = useState<boolean>(true)
  const [inputValue, setInputValue] = useState<ImageData | null>(null)
  const [predictedValue, setPredictedValue] = useState<Array<number>>([])
  const [model, setModel] = useState<CNNModel | null>(null)
  const canvasRef = useRef<{ clearCanvas: () => void }>(null)

  useEffect(() => {
    const trainModel = async () => {
      try {
        const cnnModel = new CNNModel()
        await cnnModel.loadModel()
        setModel(cnnModel)
      } catch (error) {
        console.error('Erro ao carregar o modelo:', error)
      } finally {
        setIsModelTraining(false)
      }
    }
    trainModel()
  }, [])

  const handleInputChange = async () => {
    if (model && inputValue) {
      try {
        await model.predict(inputValue)
        const prediction = model.prediction || []
        console.log(prediction)
        setPredictedValue(prediction)
      } catch (error) {
        console.error('Erro ao fazer a predição:', error)
      }
    }
  }

  const handleClearCanvas = () => {
    canvasRef.current?.clearCanvas()
  }

  return (
    <div className="flex flex-col max-w-[400px] w-full mt-12">
      <h1 className="text-3xl font-semibold mb-4">
        Convolutional Neural Network (CNN)
      </h1>
      {isModelTraining ? (
        <div className="flex items-center gap-2 text-base text-gray-400">
          <span className="font-light text-2xl">Treinando modelo</span>
          <LoaderCircle className="h-5 w-5 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 mb-4">
            <p className="font-light text-2xl">Digite um número</p>
            <DrawableCanvas onNewImage={setInputValue} ref={canvasRef} />
            <div className="flex flex-row w-full justify-between gap-4">
              <button
                onClick={handleInputChange}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded max-w-[180px] w-full"
              >
                Enviar
              </button>
              <button
                onClick={handleClearCanvas}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded max-w-[180px] w-full"
              >
                Limpar
              </button>
            </div>
          </div>
          {predictedValue.length > 0 && (
            <div className="flex flex-col gap-2 mt-4">
              <p className="font-light text-2xl">A máquina acha que é:</p>
              <ModelPrediction data={predictedValue} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
