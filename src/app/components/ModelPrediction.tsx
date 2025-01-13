interface ModelPredictionProps {
  predictions: {
    className: string;
    probability: number;
  }[] | null;
}

export function ModelPrediction({ predictions }: ModelPredictionProps) {
  return (
    <>
      {predictions && (
        <div className="flex flex-col w-full gap-4 mt-4">
          <h3 className="font-light text-xl">Resultados:</h3>
          {predictions.map((prediction, index) => (
            <div key={index} className={`text-center p-2 rounded-md ${index === 0 ? "bg-emerald-500" : "bg-blue-500"}`}>
              {`${prediction.className}: ${(prediction.probability * 100).toFixed(2)}%`}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
