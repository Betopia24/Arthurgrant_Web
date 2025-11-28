"use client"

import { useState, useRef, useEffect, type ReactNode, type KeyboardEvent } from "react"

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

interface Tab {
  label: string
  content: ReactNode
  icon?: ReactNode
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  defaultIndex?: number
  variant?: "underline" | "filled" | "pill"
  fullWidth?: boolean
  className?: string
  onChange?: (index: number) => void
}

export function Tabs({
  tabs,
  defaultIndex = 0,
  variant = "underline",
  fullWidth = false,
  className,
  onChange,
}: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const tabListRef = useRef<HTMLDivElement>(null)

  // Update indicator position for underline variant
  useEffect(() => {
    if (variant === "underline" && tabRefs.current[activeIndex]) {
      const tab = tabRefs.current[activeIndex]
      if (tab) {
        setIndicatorStyle({
          left: tab.offsetLeft,
          width: tab.offsetWidth,
        })
      }
    }
  }, [activeIndex, variant])

  const handleTabClick = (index: number) => {
    if (tabs[index].disabled) return
    setActiveIndex(index)
    onChange?.(index)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const enabledIndices = tabs.map((tab, i) => (!tab.disabled ? i : -1)).filter((i) => i !== -1)

    const currentEnabledIndex = enabledIndices.indexOf(activeIndex)

    let newIndex = activeIndex

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault()
        newIndex = enabledIndices[(currentEnabledIndex - 1 + enabledIndices.length) % enabledIndices.length]
        break
      case "ArrowRight":
        e.preventDefault()
        newIndex = enabledIndices[(currentEnabledIndex + 1) % enabledIndices.length]
        break
      case "Home":
        e.preventDefault()
        newIndex = enabledIndices[0]
        break
      case "End":
        e.preventDefault()
        newIndex = enabledIndices[enabledIndices.length - 1]
        break
      default:
        return
    }

    setActiveIndex(newIndex)
    onChange?.(newIndex)
    tabRefs.current[newIndex]?.focus()
  }

  const getTabStyles = (index: number) => {
    const isActive = activeIndex === index
    const isDisabled = tabs[index].disabled

    const base = cn(
      "relative px-4 py-2.5 text-sm font-medium transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      isDisabled && "opacity-50 cursor-not-allowed",
      !isDisabled && "cursor-pointer",
    )

    if (variant === "underline") {
      return cn(base, "rounded-sm", isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")
    }

    if (variant === "filled") {
      return cn(
        base,
        "rounded-md",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
      )
    }

    if (variant === "pill") {
      return cn(
        base,
        "rounded-full",
        isActive
          ? "bg-primary text-primary-foreground shadow-md"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      )
    }

    return base
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Tab List */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className={cn(
          "relative flex gap-1 mb-4",
          fullWidth && "w-full",
          variant === "underline" && "border-b border-border",
        )}
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            ref={(el) => {
              tabRefs.current[index] = el
            }}
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={`tabpanel-${index}`}
            aria-disabled={tab.disabled}
            tabIndex={activeIndex === index ? 0 : -1}
            id={`tab-${index}`}
            onClick={() => handleTabClick(index)}
            disabled={tab.disabled}
            className={cn(getTabStyles(index), fullWidth && "flex-1")}
          >
            <span className="flex items-center justify-center gap-2">
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              {tab.label}
            </span>
          </button>
        ))}

        {/* Animated underline indicator */}
        {variant === "underline" && (
          <span
            className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-out"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
          />
        )}
      </div>

      {/* Tab Panels */}
      {tabs.map((tab, index) => (
        <div
          key={index}
          role="tabpanel"
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
          hidden={activeIndex !== index}
          tabIndex={0}
          className={cn(
            "rounded-lg bg-card text-card-foreground p-4 min-h-[100px]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "animate-in fade-in-0 duration-200",
            activeIndex !== index && "hidden",
          )}
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}

export default Tabs
