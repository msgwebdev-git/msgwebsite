import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Limeplay utilities
export const noop = () => {}

export const on = <T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T["addEventListener"]> | [string, Function | null, ...unknown[]]
): void => {
  if (obj && obj.addEventListener) {
    obj.addEventListener(...(args as Parameters<HTMLElement["addEventListener"]>))
  }
}

export const off = <T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T["removeEventListener"]> | [string, Function | null, ...unknown[]]
): void => {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(...(args as Parameters<HTMLElement["removeEventListener"]>))
  }
}
