import React, { useEffect, useMemo, useState } from "react";

const categories = [
  { value: "cafe", label: "카페", icon: "☕" },
  { value: "food", label: "식사/배달", icon: "🍽️" },
  { value: "store", label: "편의점", icon: "🏪" },
  { value: "shopping", label: "쇼핑", icon: "🛍️" },
];

const situations = [
  { value: "tired", label: "피곤함" },
  { value: "reward", label: "보상" },
  { value: "stress", label: "스트레스" },
  { value: "bored", label: "심심함" },
  { value: "habit", label: "그냥" },
];

const lines = {
  cafe: [
    "커피를 마신 게 아니라,\n잠깐 앉아 있고 싶었다.",
    "오늘은 메뉴보다\n자리가 더 필요했다.",
    "공부하려고 간 건데,\n그냥 쉬다 나온 느낌이다.",
  ],
  food: [
    "배고파서라기보다,\n오늘이 그냥 그런 날이었다.",
    "먹으면 괜찮아질 줄 알았는데,\n크게 달라지진 않았다.",
    "오늘의 식사는\n만족보다 처리에 가까웠다.",
  ],
  store: [
    "별거 아닌데,\n오늘은 그게 필요했다.",
    "필요해서 산 건 아닌데,\n손이 갔다.",
    "작은 소비였는데,\n기분은 꽤 잘 드러났다.",
  ],
  shopping: [
    "필요하진 않았는데,\n갖고 싶긴 했다.",
    "굳이였는데,\n그때는 맞았다.",
    "사는 순간엔 괜찮았는데,\n지금은 조금 애매하다.",
  ],
};

function getCategory(value) {
  return categories.find((item) => item.value === value) || categories[0];
}

function getSituation(value) {
  return situations.find((item) => item.value === value) || situations[0];
}

function pickLine(category, amount, useCount) {
  const pool = lines[category] || lines.cafe;
  const seed = Number(amount || 0) + useCount + category.length;
  return pool[Math.abs(seed) % pool.length];
}

function todayText() {
  return new Date().toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });
}

function App() {
  const [step, setStep] = useState("input");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("cafe");
  const [situation, setSituation] = useState("habit");
  const [poster, setPoster] = useState(null);
  const [records, setRecords] = useState([]);
  const [useCount, setUseCount] = useState(0);
  const [reaction, setReaction] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const savedRecords = localStorage.getItem("spendStoryRecords");
    const savedUseCount = localStorage.getItem("spendStoryUseCount");

    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords));
      } catch {
        setRecords([]);
      }
    }

    if (savedUseCount) setUseCount(Number(savedUseCount));
  }, []);

  useEffect(() => {
    localStorage.setItem("spendStoryRecords", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem("spendStoryUseCount", String(useCount));
  }, [useCount]);

  const selectedCategory = useMemo(() => getCategory(category), [category]);
  const selectedSituation = useMemo(() => getSituation(situation), [situation]);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 1500);
  }

  function createPoster() {
    const nextUseCount = useCount + 1;

    const newPoster = {
      id: Date.now(),
      amount,
      category,
      situation,
      sentence: pickLine(category, amount, nextUseCount),
      date: todayText(),
    };

    setUseCount(nextUseCount);
    setPoster(newPoster);
    setReaction(null);
    setStep("result");
  }

  function savePoster() {
    if (!poster) return;
    setRecords((prev) => [{ ...poster, reaction }, ...prev]);
    showToast("오늘의 소비 조각을 저장했어요.");
  }

  async function sharePoster() {
    if (!poster) return;

    const amountText = poster.amount
      ? `${Number(poster.amount).toLocaleString("ko-KR")}원`
      : "";

    const text = `오늘의 소비 조각\n\n"${poster.sentence.replace(
      "\n",
      " "
    )}"\n\n${getCategory(poster.category).label}${
      amountText ? ` · ${amountText}` : ""
    } · ${getSituation(poster.situation).label}\n\nSpend Story`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "Spend Story", text });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        showToast("공유 문구가 복사됐어요.");
      }
    } catch {
      showToast("공유가 취소됐어요.");
    }
  }

  function resetInput() {
    setStep("input");
    setPoster(null);
    setReaction(null);
  }

  return (
    <main className="min-h-screen bg-[#f4ede3] px-5 py-6 text-[#2c2118]">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <header className="flex items-center justify-between">
          <button type="button" onClick={resetInput} className="text-left">
            <p className="text-xs font-bold tracking-[0.25em] text-[#b47743]">
              SPEND STORY
            </p>
            <h1 className="mt-1 text-lg font-black">오늘의 소비 조각</h1>
          </button>

          <button
            type="button"
            onClick={() => setStep("records")}
            className="rounded-full bg-white/70 px-4 py-2 text-xs font-bold text-[#6f5742] shadow-sm"
          >
            저장 {records.length}
          </button>
        </header>

        {step === "input" && (
          <>
            <section className="rounded-[36px] bg-[#fffaf3] p-6 shadow-sm">
              <p className="text-sm font-bold text-[#b47743]">30초 기록</p>

              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight">
                오늘 쓴 돈을
                <br />
                작은 장면으로 남겨봐.
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#806852]">
                금액, 종류, 그때 상태만 고르면 오늘의 소비가 감성적인
                포스터처럼 정리됩니다.
              </p>

              <div className="mt-7 flex flex-col gap-5">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-bold">금액</span>
                  <input
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    inputMode="numeric"
                    placeholder="예: 5500"
                    className="h-14 rounded-2xl border border-[#ead8c4] bg-white/70 px-4 text-lg font-black outline-none focus:border-[#b47743]"
                  />
                </label>

                <div>
                  <p className="mb-2 text-sm font-bold">무엇에 썼어?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setCategory(item.value)}
                        className={`rounded-2xl border px-4 py-3 text-left transition ${
                          category === item.value
                            ? "border-[#2c2118] bg-[#2c2118] text-white"
                            : "border-[#ead8c4] bg-white/70 text-[#4d3b2c]"
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        <span className="font-black">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-bold">그때 상태는?</p>
                  <div className="flex flex-wrap gap-2">
                    {situations.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setSituation(item.value)}
                        className={`rounded-full border px-4 py-2 text-sm font-black transition ${
                          situation === item.value
                            ? "border-[#b47743] bg-[#b47743] text-white"
                            : "border-[#ead8c4] bg-white/70 text-[#4d3b2c]"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={createPoster}
                  className="h-14 rounded-2xl bg-[#2c2118] text-base font-black text-white shadow-lg"
                >
                  오늘의 소비 조각 만들기
                </button>
              </div>
            </section>

            <section className="rounded-[30px] bg-white/60 p-5">
              <p className="text-sm font-black">가계부처럼 평가하지 않아요.</p>
              <p className="mt-2 text-sm leading-6 text-[#806852]">
                오늘 쓴 돈을 숫자가 아니라, 나중에 다시 볼 수 있는 작은
                장면으로 남깁니다.
              </p>
            </section>
          </>
        )}

        {step === "result" && poster && (
          <>
            <section className="rounded-[40px] bg-[#d8b894] p-4 shadow-xl">
              <div className="min-h-[540px] rounded-[32px] bg-[#fffaf3] px-7 py-8 shadow-inner">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-[0.25em] text-[#b47743]">
                    TODAY'S PIECE
                  </p>
                  <p className="text-xs font-bold text-[#a58a70]">
                    {poster.date}
                  </p>
                </div>

                <div className="mt-20">
                  <p className="text-sm font-bold text-[#b47743]">
                    {selectedCategory.icon} {selectedCategory.label}
                  </p>

                  <h2 className="mt-5 whitespace-pre-line text-[34px] font-black leading-[1.25] tracking-tight text-[#2c2118]">
                    “{poster.sentence}”
                  </h2>
                </div>

                <div className="mt-16 h-px w-full bg-[#ead8c4]" />

                <div className="mt-6 flex flex-wrap gap-2 text-sm font-bold text-[#806852]">
                  {poster.amount && (
                    <span className="rounded-full bg-[#f1e2d0] px-3 py-2">
                      {Number(poster.amount).toLocaleString("ko-KR")}원
                    </span>
                  )}
                  <span className="rounded-full bg-[#f1e2d0] px-3 py-2">
                    {selectedSituation.label}
                  </span>
                  <span className="rounded-full bg-[#f1e2d0] px-3 py-2">
                    {selectedCategory.label}
                  </span>
                </div>

                <p className="mt-12 text-xs font-bold tracking-[0.18em] text-[#c2a282]">
                  SPEND STORY
                </p>
              </div>
            </section>

            <section className="rounded-[28px] bg-white/70 p-5 shadow-sm">
              <p className="font-black">이 조각, 남기고 싶어?</p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setReaction("saveable")}
                  className={`h-12 rounded-2xl border font-black ${
                    reaction === "saveable"
                      ? "border-[#2c2118] bg-[#2c2118] text-white"
                      : "border-[#ead8c4] bg-white text-[#4d3b2c]"
                  }`}
                >
                  남기고 싶음
                </button>

                <button
                  type="button"
                  onClick={() => setReaction("notyet")}
                  className={`h-12 rounded-2xl border font-black ${
                    reaction === "notyet"
                      ? "border-[#2c2118] bg-[#2c2118] text-white"
                      : "border-[#ead8c4] bg-white text-[#4d3b2c]"
                  }`}
                >
                  아직 애매함
                </button>
              </div>
            </section>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={resetInput}
                className="h-12 rounded-2xl bg-white/80 font-black text-[#4d3b2c] shadow-sm"
              >
                다시
              </button>

              <button
                type="button"
                onClick={savePoster}
                className="h-12 rounded-2xl bg-[#2c2118] font-black text-white shadow-sm"
              >
                저장
              </button>

              <button
                type="button"
                onClick={sharePoster}
                className="h-12 rounded-2xl bg-[#b47743] font-black text-white shadow-sm"
              >
                공유
              </button>
            </div>
          </>
        )}

        {step === "records" && (
          <section className="rounded-[36px] bg-[#fffaf3] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.22em] text-[#b47743]">
                  ARCHIVE
                </p>
                <h2 className="mt-1 text-2xl font-black">저장한 조각</h2>
              </div>

              <button
                type="button"
                onClick={resetInput}
                className="rounded-full bg-[#f1e2d0] px-4 py-2 text-sm font-black text-[#4d3b2c]"
              >
                돌아가기
              </button>
            </div>

            {records.length === 0 ? (
              <p className="mt-6 text-sm text-[#806852]">
                아직 저장한 조각이 없습니다.
              </p>
            ) : (
              <div className="mt-6 flex flex-col gap-3">
                {records.map((item) => {
                  const itemCategory = getCategory(item.category);
                  const itemSituation = getSituation(item.situation);

                  return (
                    <article
                      key={item.id}
                      className="rounded-3xl bg-white/70 p-4"
                    >
                      <p className="text-xs font-bold text-[#b47743]">
                        {item.date}
                      </p>
                      <p className="mt-3 whitespace-pre-line text-xl font-black leading-7">
                        “{item.sentence}”
                      </p>
                      <p className="mt-4 text-xs font-bold text-[#806852]">
                        {itemCategory.icon} {itemCategory.label}
                        {item.amount &&
                          ` · ${Number(item.amount).toLocaleString(
                            "ko-KR"
                          )}원`}
                        {` · ${itemSituation.label}`}
                      </p>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-[#2c2118] px-5 py-3 text-sm font-black text-white shadow-lg">
            {toast}
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
