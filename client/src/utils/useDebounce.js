/**
 * useDebounce Hook
 * Delays a value update until the user stops changing it for a specified period
 */

import { useState, useEffect } from 'react'

/**
 * Debounce hook
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {*} - Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up the timeout if value changes or component unmounts
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * useDebounceCallback Hook
 * Debounces a callback function
 * @param {Function} callback - Callback function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced callback
 */
export const useDebounceCallback = (callback, delay = 500) => {
  const [timeoutId, setTimeoutId] = useState(null)

  const debouncedCallback = (...args) => {
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Set new timeout
    const newTimeoutId = setTimeout(() => {
      callback(...args)
    }, delay)

    setTimeoutId(newTimeoutId)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  return debouncedCallback
}

/**
 * useThrottle Hook
 * Throttles a value update to occur at most once per specified period
 * @param {*} value - Value to throttle
 * @param {number} interval - Throttle interval in milliseconds
 * @returns {*} - Throttled value
 */
export const useThrottle = (value, interval = 500) => {
  const [throttledValue, setThrottledValue] = useState(value)
  const [lastUpdated, setLastUpdated] = useState(Date.now())

  useEffect(() => {
    const now = Date.now()

    if (now >= lastUpdated + interval) {
      setLastUpdated(now)
      setThrottledValue(value)
    } else {
      // Set timeout for next update
      const handler = setTimeout(() => {
        setLastUpdated(Date.now())
        setThrottledValue(value)
      }, interval - (now - lastUpdated))

      return () => clearTimeout(handler)
    }
  }, [value, interval, lastUpdated])

  return throttledValue
}

export default {
  useDebounce,
  useDebounceCallback,
  useThrottle
}
