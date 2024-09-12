import {
  useRef,
  useState,
  useEffect,
  MouseEvent,
  forwardRef,
  useImperativeHandle,
} from 'react'

interface DrawableCanvasProps {
  onNewImage: (imageData: ImageData) => void
}

export const DrawableCanvas = forwardRef(
  ({ onNewImage }: DrawableCanvasProps, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
    const [isDrawing, setIsDrawing] = useState<boolean>(false)

    useEffect(() => {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          canvas.width = 300
          canvas.height = 300
        }
      }
    }, [])

    const getMousePosition = (e: MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (canvas) {
        const rect = canvas.getBoundingClientRect()
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        }
      }
      return { x: 0, y: 0 }
    }

    const setPosition = (e: MouseEvent<HTMLCanvasElement>) => {
      const { x, y } = getMousePosition(e)
      setPos({ x, y })
    }

    const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !canvasRef.current) return

      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.beginPath()
        ctx.lineWidth = 10
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#ffffff'
        ctx.moveTo(pos.x, pos.y)
        setPosition(e)
        ctx.lineTo(pos.x, pos.y)
        ctx.stroke()
      }
    }

    const getImgData = (): ImageData => {
      const canvas = canvasRef.current
      if (!canvas) {
        throw new Error('Canvas is not available.')
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Canvas context is not available.')
      }

      const scaledCanvas = document.createElement('canvas')
      const scaledCtx = scaledCanvas.getContext('2d')
      if (!scaledCtx) {
        throw new Error('Scaled canvas context is not available.')
      }

      scaledCanvas.width = 28
      scaledCanvas.height = 28
      scaledCtx.drawImage(canvas, 0, 0, 28, 28)

      return scaledCtx.getImageData(0, 0, 28, 28)
    }

    const handleMouseUp = () => {
      setIsDrawing(false)
      const imgData = getImgData()
      onNewImage(imgData)
    }

    const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
      setIsDrawing(true)
      setPosition(e)
    }

    const clearCanvas = () => {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
      }
    }

    useImperativeHandle(ref, () => ({
      clearCanvas,
    }))

    return (
      <div className="flex flex-col items-center">
        <canvas
          className="border border-white"
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseEnter={setPosition}
          style={{ width: '300px', height: '300px' }}
        ></canvas>
      </div>
    )
  }
)
