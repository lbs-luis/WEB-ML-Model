'use client'
import { useState, useEffect, FC } from 'react'
import { LoaderCircle } from 'lucide-react'
import { CNNModel } from '@/libs/CNNModel'
import Image from 'next/image'
import { ModelPrediction } from './ModelPrediction'

export const CNNModelPredict: FC = () => {
  const [isModelLoading, setIsModelLoading] = useState<boolean>(true)
  const [predictions, setPredictions] = useState<Array<{ className: string; probability: number }> | null>(null)
  const [model, setModel] = useState<CNNModel | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Carregar o modelo encapsulado no CNNModel
  useEffect(() => {
    const loadModel = async () => {
      try {
        const cnnModel = new CNNModel()
        await cnnModel.loadModel()
        setModel(cnnModel)
        setIsModelLoading(false)
      } catch (error) {
        console.error('Erro ao carregar o modelo:', error)
        setIsModelLoading(false)
      }
    }
    loadModel()
  }, [])

  // Processar a imagem carregada e classificá-la
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return

    const file = event.target.files[0]
    const imageUrl = URL.createObjectURL(file)
    setSelectedImage(imageUrl) // Exibe a imagem carregada

    if (model) {
      try {
        // Cria um elemento <img> para processar a imagem
        const imgElement = document.createElement('img')
        imgElement.src = imageUrl
        imgElement.onload = async () => {
          const predictions = await model.classifyImage(imgElement) // Classifica a imagem carregada
          setPredictions(predictions) // Salva as predições no estado
        }
      } catch (error) {
        console.error('Erro ao classificar a imagem:', error)
      }
    }
  }

  return (
    <div className="flex flex-col max-w-[400px] w-full mt-12">
      <h1 className="text-3xl font-semibold mb-4">
        Classificação com MobileNet
      </h1>
      {isModelLoading ? (
        <div className="flex items-center gap-2 text-base text-gray-400">
          <span className="font-light text-2xl">Carregando modelo...</span>
          <LoaderCircle className="h-5 w-5 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 mb-4 items-center">
            <p className="font-light text-2xl w-full text-left">Carregue uma imagem</p>
            {/* Input para carregar a imagem */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-4"
            />
            {/* Exibir a imagem carregada */}
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Imagem carregada"
                className="rounded-md"
                width={400}
                height={400}
              />
            )}
          </div>
          {/* Exibição das predições */}
          <ModelPrediction predictions={predictions} />
        </>
      )}
    </div>
  )
}
