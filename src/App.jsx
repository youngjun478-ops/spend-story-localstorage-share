import React, { useEffect, useMemo, useState } from "react";

const categories = [
  { value: "cafe", label: "카페", icon: "☕" },
  { value: "food", label: "식사/배달", icon: "🍽️" },
  { value: "store", label: "편의점", icon: "🏪" },
  { value: "shopping", label: "쇼핑", icon: "🛍️" },
];

const situations = ["혼자", "친구와", "스트레스", "심심함", "보상 심리"];

const lineLibrary = {
  fallback: [
    { title: "별일 없는 줄 알았는데, 마음이 먼저 움직인 하루였다", subtitle: "소비를 돌아보면 오늘의 감정선이 생각보다 또렷하게 남는다." },
    { title: "그냥 지나간 하루인 줄 알았는데, 소비는 남았다", subtitle: "기록이 남는 순간 평범한 하루도 조금 더 구체적으로 보인다." },
  ],
};

function buildResult() {
  const pool = lineLibrary.fallback;
  return pool[Math.floor(Math.random() * pool.length)];
}

function App() {
  const [step, setStep] = useState("input");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("cafe");
  const [situation, setSituation] = useState("혼자");
  const [result, setResult] = useState(null);

  function handleShowResult() {
    setResult(buildResult());
    setStep("result");
  }

  return (
    <main className="min-h-screen bg-white px-5 py-6">
      <div className="max-w-md mx-auto flex flex-col gap-5">

        {step === "input" && (
          <>
            <h1 className="text-3xl font-bold">오늘 뭐 샀어?</h1>

            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="금액 입력"
              className="border p-3 rounded"
            />

            <button
              onClick={handleShowResult}
              className="bg-black text-white p-4 rounded"
            >
              문장 보기
            </button>
          </>
        )}

        {step === "result" && result && (
          <>
            <h2 className="text-2xl font-bold">{result.title}</h2>
            <p className="text-gray-500">{result.subtitle}</p>

            <button
              onClick={() => setStep("input")}
              className="mt-5 bg-gray-200 p-3 rounded"
            >
              다시 하기
            </button>
          </>
        )}

      </div>
    </main>
  );
}

export default App;
