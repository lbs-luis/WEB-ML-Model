import React from 'react'

interface ModelPredictionProps {
  data: Array<number>
}

export const ModelPrediction: React.FC<ModelPredictionProps> = ({ data }) => {
  // Encontre o valor máximo para normalizar as barras
  const maxValue = Math.max(...data)

  return (
    <div className="flex flex-col gap-2 w-full items-center mt-4">
      {data.map((value, index) => (
        <span
          className={`text-center p-4 font-semibold text-3xl bg-cyan-600 text-white outline-none rounded-md ${
            value > 0 ? 'flex' : 'hidden'
          }`}
        >
          {index}
        </span>
      ))}
    </div>
  )
}
