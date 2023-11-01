import { useEffect, useRef, useState } from 'react'
import { useFloating, arrow, FloatingArrow, offset as offsetMiddleware, Placement } from '@floating-ui/react'
import Button from './Button'

interface Props extends React.ComponentProps<typeof Button> {
  initialTooltip: {
    content: string
    placement?: Placement
    localStorageKey?: string | null
    offset?: number
  }
}

const ARROW_HEIGHT = 7
const GAP = 0

export default ({ initialTooltip, ...args }: Props) => {
  const { localStorageKey = 'firstTimeTooltip', offset = 0 } = initialTooltip
  const [showTooltips, setShowTooltips] = useState(localStorageKey ? localStorage[localStorageKey] !== 'false' : true)

  useEffect(() => {
    let timeout
    function hide () {
      if (!localStorageKey) return
      localStorage[localStorageKey] = 'false'
      setShowTooltips(false)
    }
    if (showTooltips && localStorageKey) {
      // todo wait for user interaction mouseoe
      timeout = setTimeout(() => {
        hide()
      }, 10_000)
    }

    return () => {
      // unmounted, probably switched view
      if (timeout) clearTimeout(timeout)
      hide()
    }
  }, [])

  const arrowRef = useRef<any>(null)
  const { refs, floatingStyles, context } = useFloating({
    middleware: [
      arrow({
        element: arrowRef
      }),
      offsetMiddleware(ARROW_HEIGHT + GAP + offset),
    ],
    placement: initialTooltip.placement,
  })

  return <>
    <Button {...args} ref={refs.setReference} />
    <div ref={refs.setFloating} style={{
      ...floatingStyles,
      background: 'rgba(0, 0, 0, 0.7)',
      fontSize: 8,
      pointerEvents: 'none',
      userSelect: 'text',
      padding: '2px 4px',
      opacity: showTooltips ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out',
      zIndex: 11
    }}>
      {initialTooltip.content}
      <FloatingArrow ref={arrowRef} context={context}></FloatingArrow>
    </div>
  </>
}
