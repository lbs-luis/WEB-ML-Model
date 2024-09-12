import { CNNModelPredict } from './components/CNNModelPredict'
import { LinearModelPredict } from './components/LinearModelPredict'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <LinearModelPredict />
      <CNNModelPredict />
    </main>
  )
}
