'use client'
import { useState, useEffect, FC, ChangeEvent } from 'react'
import { LinearModel } from '@/libs/model'
import { LoaderCircle } from 'lucide-react'

export const LinearModelPredict: FC = () => {
  const [isModelTraining, setIsModelTraining] = useState<boolean>(true)
  const [inputValue, setInputValue] = useState<number | null>(null)
  const [predictedValue, setPredictedValue] = useState<number | null>(null)
  const [model, setModel] = useState<LinearModel | null>(null)

  useEffect(() => {
    const trainModel = async () => {
      const linearModel = new LinearModel()
      await linearModel.train()
      setModel(linearModel)
      setIsModelTraining(false)
    }
    trainModel()
  }, [])

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value)
    setInputValue(value)

    if (model && !isNaN(value)) {
      await model.predict(value)
      setPredictedValue(model.prediction)
    }
  }

  return (
    <div className="flex flex-col w-fit">
      <h1 className="text-3xl font-semibold">Modelo Linear</h1>
      {isModelTraining ? (
        <div className="flex flex-row text-base text-gray-400 items-center gap-2 pointer-events-none select-none mt-4">
          <span className="font-light text-2xl">Treinando modelo</span>
          <LoaderCircle className="h-5 w-5 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 mt-4">
            <p className="font-light text-2xl">Digite um numero</p>
            <input
              className="w-full text-center px-2 py-1 bg-transparent text-white border border-solid border-white outline-none rounded-md"
              type="number"
              onChange={handleInputChange}
            />
          </div>
          {predictedValue && (
            <div className="flex flex-col gap-2 mt-4">
              <p className="font-light text-2xl">A maquina acha que é:</p>
              <span className="w-full text-center px-2 py-1 bg-cyan-600 text-white outline-none rounded-md">
                {predictedValue.toFixed(2)}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
