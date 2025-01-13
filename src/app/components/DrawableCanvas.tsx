import {
  useRef,
  useState,
  useEffect,
  MouseEvent,
  forwardRef,
  useImperativeHandle,
} from 'react'

interface DrawableCanvasProps {

}

export const DrawableCanvas = forwardRef(
  ({ }: DrawableCanvasProps, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
    const [isDrawing, setIsDrawing] = useState<boolean>(false)

    useEffect(() => {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          canvas.width = 400
          canvas.height = 400
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
        ctx.lineWidth = 6
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#ffffff'
        ctx.moveTo(pos.x, pos.y)
        setPosition(e)
        ctx.lineTo(pos.x, pos.y)
        ctx.stroke()
      }
    }

    const handleMouseUp = () => {
      setIsDrawing(false)
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
      getCanvas: () => canvasRef.current!,
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
          style={{ width: '400px', height: '400px' }}
        ></canvas>
      </div>
    )
  }
)

DrawableCanvas.displayName = "DrawableCanvas"
