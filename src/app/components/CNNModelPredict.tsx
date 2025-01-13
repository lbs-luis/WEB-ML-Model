'use client'
import { useState, useEffect, FC } from 'react'
import { Link as LinkIcon, LoaderCircle } from 'lucide-react'
import { CNNModel } from '@/libs/CNNModel'
import Image from 'next/image'
import { ModelPrediction } from './ModelPrediction'
import Link from 'next/link'

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
      <Link href={"https://www.tensorflow.org/js/models?hl=pt-br"} className='flex gap-2 items-center group' target='_blank'>
        <h1 className="text-2xl font-semibold">
          Modelo CNN (MobileNet)
        </h1>
        <LinkIcon className='size-4 cursor-pointer group-hover:text-blue-400' />
      </Link>
      <p className='text-sm text-white/70 my-2'>As redes neurais convolucionais (Convolutional neural network ou CNNs) são um subconjunto do aprendizado de máquina utilizadas com mais frequência para tarefas de classificação de imagens e visão computacional, como reconhecimento de objetos.</p>
      {
        isModelLoading ? (
          <div className="flex items-center gap-4 text-base text-gray-400">
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
        )
      }
    </div >
  )
}
