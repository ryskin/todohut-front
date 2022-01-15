import { useState } from "react";

export const TimeInput = ({ onChange }: { onChange: (secs: number) => void }) => {
  const [value, setValue] = useState("0:00");

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValue(value);
  };

  const isNumber = (value: string) => {
    return /^\d+$/.test(value);
  };

  const minutesToHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const minutesLeft = minutes % 60;
    return `${hours}:${minutesLeft < 10 ? "00" : ""}${minutesLeft}`;
  };

  const deleteSpaces = (value: string) => {
    return value.replace(/\s/g, "");
  };

  const isValid = (value: string) => {
    const split = value.split(":");
    if (split.length !== 2) return false;
    return split.every((element: string) => isNumber(element));
  };

  const onComplete = () => {
    if (isValid(value)) return;
    const cleanedValue = deleteSpaces(value);
    const hours = cleanedValue.match(/[0-9]+(?=h)/g);
    const minutes = isNumber(cleanedValue)
      ? Number(cleanedValue)
      : cleanedValue.match(/[0-9]+(?=m)/g);
    if (Number(minutes) > 59) {
      setValue(minutesToHours(Number(minutes)));
      return;
    }
    onChange(Number(hours) * 3600 + Number(minutes)*60);
    setValue(`${hours || "00"}:${minutes || "00"}`);
  }

  const onBlur = () => {
    onComplete();
  };

  const handleKeyDown = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col items-center content-center">
      <input
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        value={value}
        className="border rounded-md text-lg p-2 w-32 text-center"
      />
      <p className="text-xs mt-1">Example: 1h 20m or 01:20</p>
    </div>

  );
};
