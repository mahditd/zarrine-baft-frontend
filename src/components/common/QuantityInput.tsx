import { useState } from "react";

type QuantityInputProps = {
  value: number;
  min?: number;
  max?: number;
  onCommit: (value: number) => void;
  className?: string;
};

// Text-backed numeric input: lets the user clear/retype, clamps 1-999 on commit.
export function QuantityInput({
  value,
  min = 1,
  max = 999,
  onCommit,
  className = "w-20 rounded-md border px-2 py-1 text-center font-bold",
}: QuantityInputProps) {
  const [text, setText] = useState(String(value));
  const [prevValue, setPrevValue] = useState(value);

  // Sync when parent changes quantity via +/- buttons (render-adjust pattern).
  if (prevValue !== value) {
    setPrevValue(value);
    setText(String(value));
  }

  return (
    <input
      type="number"
      min={min}
      max={max}
      value={text}
      onChange={(e) => {
        const raw = e.target.value;
        setText(raw);
        if (raw === "") return;
        const next = Number(raw);
        if (!Number.isFinite(next)) return;
        onCommit(Math.min(max, Math.max(min, Math.floor(next))));
      }}
      onBlur={() => setText(String(value))}
      className={className}
    />
  );
}
