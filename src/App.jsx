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
    "커피를 마신 게 아니라, 잠깐 앉아 있고 싶었다.",
    "오늘은 메뉴보다 자리가 더 필요했다.",
    "공부하러 간 건데, 그냥 쉬다 온 느낌이다.",
  ],
  food: [
    "배고파서라기보다, 오늘이 그냥 그런 날이었다.",
    "먹으면 괜찮아질 줄 알았는데, 크게 달라지진 않았다.",
    "오늘의 식사는 만족보다 처리에 가까웠다.",
  ],
  store: [
    "별거 아닌데, 오늘은 그게 필요했다.",
    "필요해서 산 건 아닌데, 손이 갔다.",
    "작은 소비였는데, 기분은 꽤 잘 드러났다.",
  ],
  shopping: [
    "필요하진 않았는데, 갖고 싶긴 했다.",
    "굳이였는데, 그때는 맞았다.",
    "사는 순간엔 괜찮았는데, 지금은 조금 애매하다.",
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
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function App() {
  const [step, setStep] = useState("input");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("cafe");
  const [situation, setSituation] = useState("habit");
  const [card, setCard] = useState(null);
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

    if (savedUseCount) {
      setUseCount(Number(savedUseCount));
    }
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

  function createCard() {
    const nextUseCount = useCount + 1;
    const newCard = {
      id: Date.now(),
      amount,
      category,
      situation,
      sentence: pickLine(category, amount, nextUseCount),
      date: todayText(),
    };

    setUseCount(nextUseCount);
    setCard(newCard);
    setReaction(null);
    setStep("result");
  }

  function saveCard() {
    if (!card) return;
    setRecords((prev) => [{ ...card, reaction }, ...prev]);
    showToast("소비 카드가 저장됐어요.");
  }

  async function shareCard() {
    if (!card) return;

    const amountText = card.amount
      ? `${Number(card.amount).toLocaleString("ko-KR")}원`
      : "금액 없음";

    const text = `Spend Story\n\n${getCategory(card.category).label} · ${getSituation(card.situation).label} · ${amountText}\n\n"${card.sentence}"\n\n${card.date}`;

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
    setCard(null);
    setReaction(null);
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea] px-5 py-6 text-zinc-950">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <header className="flex items-center justify-between">
          <button type="button" onClick={resetInput} className="text-left">
            <p className="text-xs font-black tracking-[0.22em] text-orange-500">
              SPEND STORY
            </p>
            <h1 className="mt-1 text-lg font-black">소비 카드 만들기</h1>
          </button>

          <button
            type="button"
            onClick={() => setStep("records")}
            className="rounded-full bg-white px-4 py-2 text-xs font-black text-zinc-600 shadow-sm"
          >
            저장 {records.length}
          </button>
        </header>

        {step === "input" && (
          <>
            <section className="rounded-[32px] bg-white p-6 shadow-sm">
              <p className="text-sm font-black text-orange-500">30초 기록</p>

              <h2 className="mt-2 text-3xl font-black leading-tight tracking-tight">
                오늘 쓴 돈을
                <br />
                하나의 카드로 남겨봐.
              </h2>

              <p className="mt-4 text-sm leading-6 text-zinc-500">
                금액, 종류, 그때 상태를 고르면 오늘의 소비가 공유 가능한
                소비 카드로 바뀝니다.
              </p>

              <div className="mt-6 flex flex-col gap-5">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-black text-zinc-700">금액</span>
                  <input
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    inputMode="numeric"
                    placeholder="예: 5500"
                    className="h-14 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-lg font-black outline-none focus:border-zinc-950 focus:bg-white"
                  />
                </label>

                <div>
                  <p className="mb-2 text-sm font-black text-zinc-700">
                    무엇에 썼어?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setCategory(item.value)}
                        className={`rounded-2xl border px-4 py-3 text-left ${
                          category === item.value
                            ? "border-zinc-950 bg-zinc-950 text-white"
                            : "border-zinc-200 bg-white text-zinc-700"
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        <span className="font-black">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-black text-zinc-700">
                    그때 상태는?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {situations.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setSituation(item.value)}
                        className={`rounded-full border px-4 py-2 text-sm font-black ${
                          situation === item.value
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-zinc-200 bg-white text-zinc-700"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={createCard}
                  className="h-14 rounded-2xl bg-zinc-950 text-base font-black text-white shadow-lg"
                >
                  소비 카드 만들기
                </button>
              </div>
            </section>

            <section className="rounded-[28px] bg-white p-5 shadow-sm">
              <p className="text-sm font-black">이 앱은 가계부가 아니에요.</p>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                절약 점수나 분석표 대신, 오늘의 소비를 나중에 다시 볼 수
                있는 하나의 기록물로 바꿉니다.
              </p>
            </section>
          </>
        )}

        {step === "result" && card && (
          <>
            <section className="rounded-[36px] bg-zinc-950 p-5 text-white shadow-xl">
              <div className="rounded-[28px] bg-white p-6 text-zinc-950">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black tracking-[0.2em] text-orange-500">
                    SPEND CARD
                  </p>
                  <p className="text-xs font-bold text-zinc-400">
                    {card.date}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-3xl">
                    {selectedCategory.icon}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-zinc-400">
                      {selectedCategory.label} · {selectedSituation.label}
                    </p>
                    <p className="text-2xl font-black">
                      {card.amount
                        ? `${Number(card.amount).toLocaleString("ko-KR")}원`
                        : "금액 없이 남긴 소비"}
                    </p>
                  </div>
                </div>

                <div className="mt-8 border-t border-zinc-100 pt-8">
                  <p className="text-3xl font-black leading-tight tracking-tight">
                    “{card.sentence}”
                  </p>
                </div>

                <div className="mt-8 rounded-2xl bg-[#f6f1ea] p-4">
                  <p className="text-xs font-black text-zinc-400">
                    오늘의 소비 기록
                  </p>
                  <p className="mt-1 text-sm font-bold text-zinc-600">
                    {selectedCategory.label}
                    {card.amount &&
                      ` · ${Number(card.amount).toLocaleString("ko-KR")}원`}
                    {` · ${selectedSituation.label}`}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-center text-xs font-bold text-zinc-400">
                저장하거나 공유해서 오늘의 소비를 남겨보세요.
              </p>
            </section>

            <section className="rounded-[28px] bg-white p-5 shadow-sm">
              <p className="font-black">이 카드, 남기고 싶어?</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setReaction("saveable")}
                  className={`h-12 rounded-2xl border font-black ${
                    reaction === "saveable"
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-200 bg-white text-zinc-700"
                  }`}
                >
                  남기고 싶음
                </button>

                <button
                  type="button"
                  onClick={() => setReaction("notyet")}
                  className={`h-12 rounded-2xl border font-black ${
                    reaction === "notyet"
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-200 bg-white text-zinc-700"
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
                className="h-12 rounded-2xl bg-white font-black text-zinc-700 shadow-sm"
              >
                다시
              </button>

              <button
                type="button"
                onClick={saveCard}
                className="h-12 rounded-2xl bg-zinc-950 font-black text-white shadow-sm"
              >
                저장
              </button>

              <button
                type="button"
                onClick={shareCard}
                className="h-12 rounded-2xl bg-orange-500 font-black text-white shadow-sm"
              >
                공유
              </button>
            </div>
          </>
        )}

        {step === "records" && (
          <section className="rounded-[32px] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black tracking-[0.2em] text-orange-500">
                  ARCHIVE
                </p>
                <h2 className="mt-1 text-2xl font-black">저장한 카드</h2>
              </div>

              <button
                type="button"
                onClick={resetInput}
                className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-black text-zinc-700"
              >
                돌아가기
              </button>
            </div>

            {records.length === 0 ? (
              <p className="mt-6 text-sm text-zinc-500">
                아직 저장한 카드가 없습니다.
              </p>
            ) : (
              <div className="mt-6 flex flex-col gap-3">
                {records.map((item) => {
                  const itemCategory = getCategory(item.category);
                  const itemSituation = getSituation(item.situation);

                  return (
                    <article
                      key={item.id}
                      className="rounded-2xl bg-zinc-50 p-4"
                    >
                      <p className="text-xs font-black text-orange-500">
                        {item.date}
                      </p>
                      <p className="mt-2 text-lg font-black leading-6">
                        “{item.sentence}”
                      </p>
                      <p className="mt-3 text-xs font-bold text-zinc-400">
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
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-black text-white shadow-lg">
            {toast}
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
