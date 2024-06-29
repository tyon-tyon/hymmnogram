import _dialects from "~/assets/datas/dialects.json";
import type { TDialectData } from "~/types";

export default function () {
  // クライアントではない時は空の配列を返す
  if (process.client === false) return { getDialectTextClass: () => "", getDiarectJapanese: () => "", getDialectBgClass: () => "", addOriginalDialects: () => { }, dialects: { value: [] } };

  const originalDialectsStr = localStorage.getItem('originalDialects');
  const originalDialects = originalDialectsStr ? JSON.parse(originalDialectsStr) : [];
  const dialects = useState<TDialectData[]>('dialects', () => [..._dialects, ...originalDialects] as TDialectData[]);

  const getDialectTextClass = (dialect: string | null) => {
    const textColor = {
      slate: "text-slate-600",
      gray: "text-gray-600",
      zinc: "text-zinc-600",
      neutral: "text-neutral-600",
      stone: "text-stone-600",
      red: "text-red-600",
      orange: "text-orange-600",
      amber: "text-amber-600",
      yellow: "text-yellow-600",
      lime: "text-lime-600",
      green: "text-green-600",
      emerald: "text-emerald-600",
      teal: "text-teal-600",
      cyan: "text-cyan-600",
      sky: "text-sky-600",
      blue: "text-blue-600",
      indigo: "text-indigo-600",
      violet: "text-violet-600",
      purple: "text-purple-600",
      fuchsia: "text-fuchsia-600",
      pink: "text-pink-600",
      rose: "text-rose-600",
    };
    const dialectData = dialects.value.find(d => d.name === dialect);
    if (dialectData) return textColor[dialectData.color as keyof typeof textColor];
    return "text-black";
  };

  const getDialectBgClass = (dialect: string | null) => {
    const bgColor = {
      slate: "bg-slate-50",
      gray: "bg-gray-50",
      zinc: "bg-zinc-50",
      neutral: "bg-neutral-50",
      stone: "bg-stone-50",
      red: "bg-red-50",
      orange: "bg-orange-50",
      amber: "bg-amber-50",
      yellow: "bg-yellow-50",
      lime: "bg-lime-50",
      green: "bg-green-50",
      emerald: "bg-emerald-50",
      teal: "bg-teal-50",
      cyan: "bg-cyan-50",
      sky: "bg-sky-50",
      blue: "bg-blue-50",
      indigo: "bg-indigo-50",
      violet: "bg-violet-50",
      purple: "bg-purple-50",
      fuchsia: "bg-fuchsia-50",
      pink: "bg-pink-50",
      rose: "bg-rose-50",
    };
    const dialectData = dialects.value.find(d => d.name === dialect);
    if (dialectData && _dialects.find((d: TDialectData) => d.name === dialect)) return bgColor[dialectData.color as keyof typeof bgColor];
    return "bg-white";
  };

  const getDiarectJapanese = (dialect: string | null) => {
    const dialectData = dialects.value.find(d => d.name === dialect);
    if (dialectData) return dialectData.japanese;
    return dialect;
  };

  const addOriginalDialects = (newOriginalDialects: TDialectData[]) => {
    // ローカルストレージに保存
    localStorage.setItem('originalDialects', JSON.stringify(newOriginalDialects));
    dialects.value = [...dialects.value, ...newOriginalDialects];
    // 重複を削除(nameが同じものを削除)
    dialects.value = dialects.value.filter((d, i, self) => self.findIndex(s => s.name === d.name) === i);
  };

  return { getDialectTextClass, getDiarectJapanese, getDialectBgClass, addOriginalDialects, dialects };
}

