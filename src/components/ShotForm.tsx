"use client";
import { useState } from "react";

export default function ShotForm() {
  const [type, setType] = useState<'throw' | 'bounce'>('throw');
  const [result, setResult] = useState<'make' | 'miss'>('make');

  // Log state on change for testability
  const handleType = (val: 'throw' | 'bounce') => {
    setType(val);
    console.log("Shot type:", val);
  };
  const handleResult = (val: 'make' | 'miss') => {
    setResult(val);
    console.log("Shot result:", val);
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${type === 'throw' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => handleType('throw')}
        >
          Throw
        </button>
        <button
          className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${type === 'bounce' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => handleType('bounce')}
        >
          Bounce
        </button>
      </div>
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${result === 'make' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => handleResult('make')}
        >
          Make
        </button>
        <button
          className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${result === 'miss' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => handleResult('miss')}
        >
          Miss
        </button>
      </div>
    </div>
  );
} 