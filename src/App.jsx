import React, { useEffect, useMemo, useState } from "react";

const categories = [
  { value: "cafe", label: "카페", icon: "☕" },
  { value: "food", label: "식사/배달", icon: "🍜" },
  { value: "store", label: "편의점", icon: "🏪" },
  { value: "shopping", label: "쇼핑", icon: "🛍" },
];

const situations = ["혼자", "친구와", "스트레스", "심심함", "보상 심리"];

const lineLibrary = {
  "cafe|혼자": [
    { title: "커피를 마신 게 아니라, 잠깐 앉아 있고 싶었다", subtitle: "혼자 있는 시간이 필요했던 날은 메뉴보다 자리가 더 중요하다." },
    { title: "집에 가기 애매해서 들어왔는데, 생각보다 오래 있었다", subtitle: "잠깐 들른 소비가 오늘의 쉼표가 된 날이다." },
    { title: "집중하려고 간 건데, 사실은 쉬고 싶었던 것 같다", subtitle: "할 일보다 먼저 정리할 마음이 있었던 하루였다." },
    { title: "공부하러 왔다기보다, 그냥 가만히 있고 싶었다", subtitle: "오늘은 생산성보다 멈춰 있는 쪽이 더 편했다." },
  ],
  "food|스트레스": [
    { title: "배고파서라기보다, 그냥 시켰다", subtitle: "오늘의 소비는 허기보다 감정이 먼저 움직인 쪽에 가까웠다." },
    { title: "먹고 싶은 건 아니었는데, 그냥 먹었다", subtitle: "선택의 이유가 흐릴수록 피로가 앞서 있었을 가능성이 크다." },
    { title: "기분이 나빠서 시켰는데, 딱히 나아지진 않았다", subtitle: "배달은 빨리 왔지만 마음은 그렇게 빨리 정리되지 않았다." },
    { title: "오늘은 음식이 아니라 핑계를 시킨 느낌이다", subtitle: "잠깐 멈추기 위한 이유가 필요했던 하루였다." },
  ],
  "store|심심함": [
    { title: "필요 없는데도 손이 갔다", subtitle: "작은 금액일수록 이유보다 기분이 먼저 움직이는 순간이 있다." },
    { title: "심심해서 나왔는데, 뭔가를 사긴 했다", subtitle: "목적 없는 외출은 생각보다 자주 지출로 이어진다." },
    { title: "딱히 사고 싶은 건 없었는데, 그냥 하나 집었다", subtitle: "선택의 크기는 작아도 그날의 마음은 꽤 정확하게 드러난다." },
    { title: "이 정도는 괜찮겠지, 라고 생각했다", subtitle: "가벼운 지출일수록 스스로를 설득하는 속도도 빨라진다." },
  ],
  "shopping|보상 심리": [
    { title: "굳이 안 사도 됐는데, 오늘은 조금 필요했다", subtitle: "소비라기보다 스스로에게 건넨 작은 허용 같은 선택이었다." },
    { title: "참으려고 했는데, 오늘은 그냥 샀다", subtitle: "버틴 하루 끝에 생기는 허용의 순간은 생각보다 단단하다." },
    { title: "필요한 건 아니었는데, 갖고 싶긴 했다", subtitle: "욕구와 필요가 어긋날 때 사람은 욕구 쪽으로 조금 더 기운다." },
    { title: "돈을 썼다기보다, 나를 달랬다", subtitle: "오늘의 선택은 효율보다 감정 회복에 가까운 방향이었다." },
  ],
  cafe: [
    { title: "오늘은 커피보다 잠깐 멈추는 시간이 더 필요했다", subtitle: "카페에 간 이유는 늘 메뉴 때문만은 아니다." },
    { title: "카페에 들어간 건데, 결국 정리한 건 기분 쪽이었다", subtitle: "오늘은 음료보다 마음 정리가 더 큰 목적이었다." },
  ],
  food: [
    { title: "오늘은 뭘 먹을지보다 그냥 빨리 끝내고 싶었다", subtitle: "식사가 중요한 날도 있지만, 아닌 날도 분명하다." },
    { title: "배는 채웠는데 마음까지 정리되진 않았다", subtitle: "먹는 일과 괜찮아지는 일은 항상 같지 않다." },
  ],
  store: [
    { title: "작은 소비였지만 이유까지 작았던 건 아니다", subtitle: "금액이 가볍다고 해서 마음도 가벼운 건 아니다." },
    { title: "별거 아닌 걸 샀는데, 오늘엔 그게 꽤 자연스러웠다", subtitle: "하루의 상태는 작은 소비에서 더 잘 드러날 때가 있다." },
  ],
  shopping: [
    { title: "오늘의 소비는 필요보다 기분에 더 가까웠다", subtitle: "쇼핑은 종종 이유보다 상태를 먼저 보여준다." },
    { title: "사는 순간엔 분명했는데, 지나고 나니 조금 흐려졌다", subtitle: "구매의 확신은 오래가지 않을 때도 많다." },
  ],
  fallback: [
    { title: "별일 없는 줄 알았는데, 마음이 먼저 움직인 하루였다", subtitle: "소비를 돌아보면 오늘의 감정선이 생각보다 또렷하게 남는다." },
    { title: "그냥 지나간 하루인 줄 알았는데, 소비는 남았다", subtitle: "기록이 남는 순간 평범한 하루도 조금 더 구체적으로 보인다." },
    { title: "지금 보면 별거 아닌데, 그땐 필요했다", subtitle: "그 순간 자연스러웠던 선택은 나중에 보면 꽤 솔직한 힌트가 된다." },
    { title: "굳이 안 해도 될 선택이었는데, 그냥 했다", subtitle: "아주 작은 소비에도 그날의 기분은 의외로 정확하게 스며든다." },
  ],
};

function CardBox({ children, className = "" }) {
  return (
    <div className={`rounded-[28px] border border-white/40 bg-white/85 shadow-lg backdrop-blur ${className}`}>
      {children}
    </div>
  );
}

function pickCategoryLabel(value) {
  const found = categories.find((c) => c.value === value);
  return found ? found.label : value;
}

function pickCategoryIcon(value) {
  const found = categories.find((c) => c.value === value);
  return found ? found.icon : "✨";
}

function getLinePool(category, situation) {
  const exactKey = `${category}|${situation}`;
  if (lineLibrary[exactKey]) return lineLibrary[exactKey];
  if (lineLibrary[category]) return lineLibrary[category];
  return lineLibrary.fallback;
}

function buildResult(category, situation, amount) {
  const key = `${category}|${situation}`;
  const pool = getLinePool(category, situation);
  const numeric = Number(amount || 0);
  const index = Math.abs((numeric || 1) + key.length) % pool.length;
  return pool[index];
}

function App() {
  const [step, setStep] = useState("hero");
  const [amount, setAmount] = useState("5500");
  const [category, setCategory] = useState("cafe");
  const [situation, setSituation] = useState("혼자");
  const [reacted, setReacted] = useState(null);
  const [toast, setToast] = useState("");
  const [useCount, setUseCount] = useState(0);
  const [savedRecords, setSavedRecords] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("spendStoryRecords");
    const count = localStorage.getItem("spendStoryUseCount");

    if (saved) {
      try {
        setSavedRecords(JSON.parse(saved));
      } catch {
        setSavedRecords([]);
      }
    }

    if (count) setUseCount(Number(count));
  }, []);

  useEffect(() => {
    localStorage.setItem("spendStoryRecords", JSON.stringify(savedRecords));
  }, [savedRecords]);

  useEffect(() => {
    localStorage.setItem("spendStoryUseCount", String(useCount));
  }, [useCount]);

  const result = useMemo(
    () => buildResult(category, situation, amount),
    [category, situation, amount]
  );

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 1600);
  }

  function handleShowResult() {
    setUseCount((prev) => prev + 1);
    setReacted(null);
    setStep("result");
  }

  function handleSave() {
    const newItem = {
      id: Date.now(),
      amount,
      category,
      situation,
      title: result.title,
      subtitle: result.subtitle,
      date: new Date().toISOString(),
    };

    setSavedRecords((prev) => [newItem, ...prev]);
    setReacted(null);
    showToast("저장됐어요.");
    setStep("input");
  }

  function handleBackToInput() {
    setReacted(null);
    setStep("input");
  }

  async function handleShare() {
    const text = `Spend Story\n\n${result.title}\n${result.subtitle}\n\n${pickCategoryLabel(category)} · ${Number(amount || 0).toLocaleString("ko-KR")}원 · ${situation}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "Spend Story", text });
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

  function clearRecords() {
    const ok = window.confirm("저장된 기록을 모두 지울까요?");
    if (!ok) return;
    setSavedRecords([]);
    showToast("기록을 지웠어요.");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffe9f2,_#fff7fb_38%,_#f6f3ff_76%,_#f5f5f7_100%)] px-4 py-6 text-zinc-900 md:py-10">
      <div className="mx-auto max-w-md space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs text-zinc-700 shadow-sm">배포 테스트용 MVP</span>
          <div className="text-xs text-zinc-500">사용 {useCount}회</div>
        </div>

        {step === "hero" && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#111113_0%,#1d1b28_45%,#3d234f_100%)] text-white shadow-[0_24px_80px_rgba(46,18,76,0.35)]">
              <div className="relative p-7">
                <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-fuchsia-400/20 blur-3xl" />
                <div className="absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-amber-300/10 blur-3xl" />

                <div className="relative flex items-center justify-between text-sm text-white/65">
                  <span>오늘의 소비를 한 문장으로</span>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs backdrop-blur">Spend Story</span>
                </div>

                <div className="relative mt-10 space-y-5">
                  <div className="inline-flex rounded-full border border-white/10 bg-white/10 p-3 backdrop-blur">
                    <span className="text-sm">☕</span>
                  </div>

                  <h1 className="text-3xl font-semibold leading-tight tracking-tight">
                    소비를 기록하면,<br />하루를 한 문장으로 남겨줍니다
                  </h1>

                  <p className="max-w-sm text-sm leading-6 text-white/70">
                    오늘의 소비를 입력하면, 당신의 하루를 공감되는 한 문장으로 정리해줍니다.
                  </p>
                </div>

                <div className="relative mt-8 rounded-3xl border border-white/10 bg-white/10 p-4 text-sm text-white/85 backdrop-blur-sm">
                  설명보다 먼저, “나 같네” 싶은 순간을 만드는 소비 문장 카드
                </div>
              </div>
            </div>

            <button onClick={() => setStep("input")} className="flex h-12 w-full items-center justify-center rounded-2xl bg-zinc-950 text-base font-medium text-white shadow-lg transition hover:opacity-95" type="button">
              오늘 소비 기록하기
            </button>
          </div>
        )}

        {step === "input" && (
          <CardBox>
            <div className="p-6">
              <div className="mb-5 space-y-1">
                <div className="text-lg font-semibold">오늘의 소비를 입력해봐</div>
                <p className="text-sm text-zinc-500">짧게 입력할수록 결과가 더 직관적으로 보입니다.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="mb-2 text-sm font-medium">금액</div>
                  <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" placeholder="예: 5500" className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base outline-none transition focus:border-zinc-400" />
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium">카테고리</div>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base outline-none transition focus:border-zinc-400">
                    {categories.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium">상황</div>
                  <select value={situation} onChange={(e) => setSituation(e.target.value)} className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base outline-none transition focus:border-zinc-400">
                    {situations.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button onClick={() => setStep("hero")} className="h-12 rounded-2xl bg-zinc-100 text-zinc-800 transition hover:bg-zinc-200" type="button">이전</button>
                <button onClick={handleShowResult} className="h-12 rounded-2xl bg-zinc-950 text-white transition hover:opacity-95" type="button">결과 보기</button>
              </div>
            </div>
          </CardBox>
        )}

        {step === "result" && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(145deg,#d946ef_0%,#f43f5e_46%,#fb923c_100%)] text-white shadow-[0_28px_90px_rgba(244,63,94,0.28)]">
              <div className="relative p-7">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-yellow-200/20 blur-3xl" />

                <div className="relative flex items-center justify-between text-sm text-white/75">
                  <span>오늘의 카드</span>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 backdrop-blur">
                    <span>{pickCategoryIcon(category)}</span>{pickCategoryLabel(category)}
                  </div>
                </div>

                <div className="relative mt-10 space-y-5">
                  <h2 className="text-[30px] font-semibold leading-tight tracking-tight">{result.title}</h2>
                  <p className="text-sm leading-6 text-white/90">{result.subtitle}</p>
                </div>

                <div className="relative mt-8 rounded-3xl border border-white/20 bg-white/15 p-4 backdrop-blur-sm">
                  <div className="text-xs text-white/70">오늘 입력한 소비</div>
                  <div className="mt-2 text-sm font-medium text-white/95">
                    {pickCategoryLabel(category)} · {Number(amount || 0).toLocaleString("ko-KR")}원 · {situation}
                  </div>
                </div>

                <div className="relative mt-8 flex items-center justify-between text-xs text-white/75">
                  <span>shareable card preview</span>
                  <span>✦</span>
                </div>
              </div>
            </div>

            <CardBox>
              <div className="p-5">
                <div className="text-sm font-medium">이 결과, 어땠어?</div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button onClick={() => setReacted("up")} className={`h-12 rounded-2xl border transition ${reacted === "up" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white text-zinc-900"}`} type="button">공감됨 👍</button>
                  <button onClick={() => setReacted("down")} className={`h-12 rounded-2xl border transition ${reacted === "down" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white text-zinc-900"}`} type="button">별로임 👎</button>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <button onClick={handleBackToInput} className="h-12 rounded-2xl bg-zinc-100 text-sm text-zinc-900 transition hover:bg-zinc-200" type="button">다시 입력</button>
                  <button onClick={handleSave} className="h-12 rounded-2xl bg-zinc-100 text-sm text-zinc-900 transition hover:bg-zinc-200" type="button">저장</button>
                  <button onClick={handleShare} className="h-12 rounded-2xl bg-zinc-950 text-sm text-white transition hover:opacity-95" type="button">공유</button>
                </div>
              </div>
            </CardBox>

            <CardBox>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-zinc-500">최근 저장한 결과</div>
                    <div className="mt-1 text-sm font-semibold">결과 보관함</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-500">저장 수</div>
                    <div className="mt-1 text-sm font-semibold">{savedRecords.length}개</div>
                  </div>
                </div>

                {savedRecords.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-sm text-zinc-500">아직 저장한 문장이 없습니다.</div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {savedRecords.slice(0, 5).map((item) => (
                      <div key={item.id} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                        <div className="text-sm font-medium leading-6 text-zinc-900">{item.title}</div>
                        <div className="mt-1 text-xs leading-5 text-zinc-500">{item.subtitle}</div>
                        <div className="mt-2 text-[11px] text-zinc-400">
                          {pickCategoryLabel(item.category)} · {Number(item.amount || 0).toLocaleString("ko-KR")}원 · {item.situation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {savedRecords.length > 0 && (
                  <button onClick={clearRecords} className="mt-4 h-10 w-full rounded-2xl bg-zinc-100 text-sm text-zinc-500 transition hover:bg-zinc-200" type="button">
                    저장 기록 초기화
                  </button>
                )}
              </div>
            </CardBox>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-zinc-950 px-4 py-2 text-sm text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
