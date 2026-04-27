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

const lineLibrary = {
  cafe: [
    {
      type: "관찰형",
      title: "커피를 마신 게 아니라, 잠깐 앉아 있었다.",
      subtitle: "오늘의 소비는 음료보다 멈춰 있는 시간에 가까웠다.",
    },
    {
      type: "반전형",
      title: "집중하려고 들어갔는데, 거의 쉬다 나왔다.",
      subtitle: "계획은 공부였지만 몸은 이미 휴식 쪽으로 기울어 있었다.",
    },
    {
      type: "건조형",
      title: "카페에 갔다. 생각보다 오래 있었다.",
      subtitle: "별일 아닌 선택이 하루의 빈칸을 채운 날이다.",
    },
    {
      type: "공감형",
      title: "그냥 나가고 싶어서 나갔고, 커피는 핑계였다.",
      subtitle: "가끔은 메뉴보다 장소가 더 필요한 순간이 있다.",
    },
  ],
  food: [
    {
      type: "관찰형",
      title: "배고파서라기보다, 그냥 시켰다.",
      subtitle: "먹고 싶은 마음보다 빨리 끝내고 싶은 마음이 더 컸다.",
    },
    {
      type: "반전형",
      title: "먹으면 나아질 줄 알았는데, 별 차이는 없었다.",
      subtitle: "배는 채워졌지만 기분까지 같이 정리되진 않았다.",
    },
    {
      type: "건조형",
      title: "시켰다. 먹었다. 끝.",
      subtitle: "오늘의 식사는 만족보다 처리에 가까웠다.",
    },
    {
      type: "공감형",
      title: "별생각 없이 시켰는데, 오늘은 그게 필요했다.",
      subtitle: "대단한 이유는 없어도 그 순간엔 충분히 자연스러웠다.",
    },
  ],
  store: [
    {
      type: "관찰형",
      title: "필요해서 산 건 아닌데, 손이 갔다.",
      subtitle: "작은 소비일수록 이유보다 기분이 먼저 움직일 때가 있다.",
    },
    {
      type: "반전형",
      title: "이 정도는 괜찮겠지 싶었는데, 또 샀다.",
      subtitle: "가벼운 지출은 늘 스스로를 설득하기 쉽다.",
    },
    {
      type: "건조형",
      title: "그냥 집었다. 굳이였다.",
      subtitle: "금액은 작아도 오늘의 상태는 꽤 잘 드러난다.",
    },
    {
      type: "공감형",
      title: "별거 아닌데, 오늘은 그게 필요했다.",
      subtitle: "편의점 소비는 가끔 작은 기분 전환처럼 작동한다.",
    },
  ],
  shopping: [
    {
      type: "관찰형",
      title: "필요하진 않은데, 갖고 싶긴 했다.",
      subtitle: "필요와 욕구가 다를 때 사람은 종종 욕구 쪽으로 기운다.",
    },
    {
      type: "반전형",
      title: "사는 순간엔 괜찮았는데, 지금은 조금 애매하다.",
      subtitle: "구매의 확신은 결제 직후부터 흐려질 때가 있다.",
    },
    {
      type: "건조형",
      title: "샀다. 아직 이유는 모른다.",
      subtitle: "가끔 소비는 설명보다 먼저 일어난다.",
    },
    {
      type: "공감형",
      title: "안 사도 됐는데, 그때는 맞았다.",
      subtitle: "그 순간의 나에게는 꽤 그럴듯한 선택이었을지도 모른다.",
    },
  ],
  common: [
    {
      type: "관찰형",
      title: "별생각 없이 쓴 돈인데, 말로 보니 좀 다르다.",
      subtitle: "소비는 지나가지만 문장으로 남기면 그날의 기분이 보인다.",
    },
    {
      type: "반전형",
      title: "괜찮아질 줄 알았는데, 그냥 소비만 남았다.",
      subtitle: "기분 전환이 항상 기분 회복까지 데려오진 않는다.",
    },
    {
      type: "건조형",
      title: "오늘도 썼다. 그런 날이다.",
      subtitle: "별일 없는 하루에도 소비는 꽤 선명하게 남는다.",
    },
    {
      type: "공감형",
      title: "그냥 넘길 수도 있었는데, 이상하게 기억난다.",
      subtitle: "작은 소비에도 그날의 마음이 묻어 있을 때가 있다.",
    },
  ],
};

function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-[28px] border border-zinc-100 bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}

function getCategory(value) {
  return categories.find((item) => item.value === value) ?? categories[0];
}

function getSituation(value) {
  return situations.find((item) => item.value === value) ?? situations[0];
}

function selectLine(category, situation, amount, useCount) {
  const basePool = [...(lineLibrary[category] ?? []), ...lineLibrary.common];

  const seed =
    String(category).length * 7 +
    String(situation).length * 11 +
    Number(amount || 0) +
    useCount;

  return basePool[Math.abs(seed) % basePool.length];
}

function App() {
  const [step, setStep] = useState("input");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("cafe");
  const [situation, setSituation] = useState("habit");
  const [result, setResult] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [records, setRecords] = useState([]);
  const [useCount, setUseCount] = useState(0);
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
    window.setTimeout(() => setToast(""), 1500);
  }

  function handleCreateStory() {
    const nextUseCount = useCount + 1;
    const nextResult = selectLine(category, situation, amount, nextUseCount);

    setUseCount(nextUseCount);
    setResult(nextResult);
    setReaction(null);
    setStep("result");
  }

  function handleSave() {
    if (!result) return;

    const newRecord = {
      id: Date.now(),
      amount,
      category,
      situation,
      result,
      reaction,
      createdAt: new Date().toISOString(),
    };

    setRecords((prev) => [newRecord, ...prev]);
    showToast("저장됐어요.");
  }

  async function handleShare() {
    if (!result) return;

    const amountText = amount
      ? `${Number(amount).toLocaleString("ko-KR")}원`
      : "금액 미입력";

    const text = `Spend Story\n\n${result.title}\n${result.subtitle}\n\n${selectedCategory.label} · ${selectedSituation.label} · ${amountText}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Spend Story",
          text,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        showToast("문장이 복사됐어요.");
      } else {
        showToast("공유가 지원되지 않는 환경이에요.");
      }
    } catch {
      showToast("공유가 취소됐어요.");
    }
  }

  function resetInput() {
    setStep("input");
    setResult(null);
    setReaction(null);
  }

  function clearRecords() {
    const ok = window.confirm("저장한 문장을 모두 지울까요?");
    if (!ok) return;

    setRecords([]);
    showToast("저장 기록을 지웠어요.");
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] px-5 py-6 text-zinc-950">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <header className="flex items-center justify-between">
          <button type="button" onClick={resetInput} className="text-left">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-500">
              Spend Story
            </p>
            <h1 className="mt-1 text-lg font-black">소비가 남긴 한 문장</h1>
          </button>

          <button
            type="button"
            onClick={() => setStep("records")}
            className="rounded-full bg-white px-4 py-2 text-xs font-bold text-zinc-600 shadow-sm"
          >
            저장 {records.length}
          </button>
        </header>

        {step === "input" && (
          <>
            <Card className="p-6">
              <p className="text-sm font-bold text-orange-500">30초 기록</p>

              <h2 className="mt-2 text-3xl font-black leading-tight tracking-tight">
                오늘 쓴 돈,
                <br />
                말로 보면 좀 다름.
              </h2>

              <p className="mt-4 text-sm leading-6 text-zinc-500">
                그냥 넘긴 소비를 한 문장으로 바꿔볼게요. 금액, 종류,
                그때 상태만 고르면 됩니다.
              </p>

              <div className="mt-6 flex flex-col gap-5">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-bold text-zinc-700">금액</span>
                  <input
                    value={amount}
                    onChange={(event) =>
                      setAmount(event.target.value.replace(/[^0-9]/g, ""))
                    }
                    inputMode="numeric"
                    placeholder="예: 5500"
                    className="h-14 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-lg font-bold outline-none transition focus:border-zinc-950 focus:bg-white"
                  />
                </label>

                <div>
                  <p className="mb-2 text-sm font-bold text-zinc-700">
                    무엇을 썼어?
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setCategory(item.value)}
                        className={`rounded-2xl border px-4 py-3 text-left transition ${
                          category === item.value
                            ? "border-zinc-950 bg-zinc-950 text-white"
                            : "border-zinc-200 bg-white text-zinc-700"
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        <span className="font-bold">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-bold text-zinc-700">
                    그때 상태는?
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {situations.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setSituation(item.value)}
                        className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
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
                  onClick={handleCreateStory}
                  className="h-14 rounded-2xl bg-zinc-950 text-base font-black text-white shadow-lg transition active:scale-[0.99]"
                >
                  내 소비 문장 보기
                </button>
              </div>
            </Card>

            <Card>
              <p className="text-sm font-black text-zinc-800">
                이 앱은 소비를 평가하지 않아요.
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                절약 점수나 분석표 대신, 오늘 쓴 돈을 보고 “이거 내 얘기
                같은데?” 싶은 문장 하나를 남깁니다.
              </p>
            </Card>

            {records.length > 0 && (
              <Card>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-zinc-800">
                    최근 저장한 문장
                  </p>

                  <button
                    type="button"
                    onClick={() => setStep("records")}
                    className="text-sm font-bold text-orange-500"
                  >
                    보기
                  </button>
                </div>

                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {records[0].result.title}
                </p>
              </Card>
            )}
          </>
        )}

        {step === "result" && result && (
          <>
            <Card className="overflow-hidden p-0">
              <div className="bg-zinc-950 px-6 py-5 text-white">
                <p className="text-sm font-bold text-zinc-300">
                  오늘의 소비 문장
                </p>

                <div className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-sm font-bold">
                  {selectedCategory.icon} {selectedCategory.label} ·{" "}
                  {selectedSituation.label}
                </div>
              </div>

              <div className="p-6">
                <p className="text-xs font-black text-orange-500">
                  {result.type}
                </p>

                <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight">
                  {result.title}
                </h2>

                <p className="mt-4 text-base leading-7 text-zinc-600">
                  {result.subtitle}
                </p>

                <div className="mt-6 rounded-2xl bg-orange-50 p-4">
                  <p className="text-xs font-black text-orange-500">
                    입력한 소비
                  </p>

                  <p className="mt-1 text-sm font-bold text-zinc-700">
                    {selectedCategory.label} ·{" "}
                    {amount
                      ? `${Number(amount).toLocaleString("ko-KR")}원`
                      : "금액 미입력"}{" "}
                    · {selectedSituation.label}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <p className="font-black">이 문장, 너 같았어?</p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setReaction("good")}
                  className={`h-12 rounded-2xl border font-black transition ${
                    reaction === "good"
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-200 bg-white text-zinc-800"
                  }`}
                >
                  공감됨
                </button>

                <button
                  type="button"
                  onClick={() => setReaction("bad")}
                  className={`h-12 rounded-2xl border font-black transition ${
                    reaction === "bad"
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-200 bg-white text-zinc-800"
                  }`}
                >
                  별로임
                </button>
              </div>
            </Card>

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
                onClick={handleSave}
                className="h-12 rounded-2xl bg-zinc-950 font-black text-white shadow-sm"
              >
                저장
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="h-12 rounded-2xl bg-orange-500 font-black text-white shadow-sm"
              >
                공유
              </button>
            </div>
          </>
        )}

        {step === "records" && (
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
                  Archive
                </p>

                <h2 className="mt-1 text-2xl font-black">저장한 문장</h2>
              </div>

              <button
                type="button"
                onClick={() => setStep("input")}
                className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-black text-zinc-700"
              >
                돌아가기
              </button>
            </div>

            {records.length === 0 ? (
              <p className="mt-5 text-sm leading-6 text-zinc-500">
                아직 저장한 문장이 없습니다.
              </p>
            ) : (
              <div className="mt-5 flex flex-col gap-3">
                {records.map((item) => {
                  const recordCategory = getCategory(item.category);
                  const recordSituation = getSituation(item.situation);

                  return (
                    <article
                      key={item.id}
                      className="rounded-2xl bg-zinc-50 p-4"
                    >
                      <p className="text-xs font-black text-orange-500">
                        {item.result.type}
                      </p>

                      <p className="mt-2 font-black leading-6">
                        {item.result.title}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-zinc-500">
                        {item.result.subtitle}
                      </p>

                      <p className="mt-3 text-xs font-bold text-zinc-400">
                        {recordCategory.label} · {recordSituation.label}
                        {item.amount
                          ? ` · ${Number(item.amount).toLocaleString(
                              "ko-KR"
                            )}원`
                          : ""}
                      </p>
                    </article>
                  );
                })}
              </div>
            )}

            {records.length > 0 && (
              <button
                type="button"
                onClick={clearRecords}
                className="mt-5 h-11 w-full rounded-2xl bg-zinc-100 text-sm font-black text-zinc-500"
              >
                저장 기록 초기화
              </button>
            )}
          </Card>
        )}

        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-bold text-white shadow-lg">
            {toast}
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
