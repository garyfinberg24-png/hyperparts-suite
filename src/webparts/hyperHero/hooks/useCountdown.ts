import { useState, useEffect, useRef } from "react";

export interface ICountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

const ZERO_COUNTDOWN: ICountdownValues = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isComplete: true,
};

/**
 * Hook that counts down to a target ISO date string.
 * Returns the remaining days/hours/minutes/seconds and a completion flag.
 * Updates every second while the component is mounted.
 */
export function useCountdown(targetDate: string | undefined): ICountdownValues {
  const [values, setValues] = useState<ICountdownValues>(() => calculate(targetDate));
  const intervalRef = useRef<number>(0);

  useEffect(() => {
    if (!targetDate) {
      setValues(ZERO_COUNTDOWN);
      return;
    }

    // Recalculate immediately
    setValues(calculate(targetDate));

    intervalRef.current = window.setInterval(() => {
      const next = calculate(targetDate);
      setValues(next);

      // Stop ticking once complete
      if (next.isComplete && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [targetDate]);

  return values;
}

function calculate(targetDate: string | undefined): ICountdownValues {
  if (!targetDate) return ZERO_COUNTDOWN;

  const target = new Date(targetDate).getTime();
  if (isNaN(target)) return ZERO_COUNTDOWN;

  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) return ZERO_COUNTDOWN;

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, isComplete: false };
}
