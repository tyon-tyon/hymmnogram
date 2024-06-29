import _dialects from "~/assets/datas/dialects.json";
import type { TDialectData } from "~/types";

export default function () {
  const dialects = _dialects as TDialectData[];

  const getDialectTextClass = (dialect: string | null) => {
    const textColor = {
      slate: "text-slate-700",
      gray: "text-gray-700",
      zinc: "text-zinc-700",
      neutral: "text-neutral-700",
      stone: "text-stone-700",
      red: "text-red-700",
      orange: "text-orange-700",
      amber: "text-amber-700",
      yellow: "text-yellow-700",
      lime: "text-lime-700",
      green: "text-green-700",
      emerald: "text-emerald-700",
      teal: "text-teal-700",
      cyan: "text-cyan-700",
      sky: "text-sky-700",
      blue: "text-blue-700",
      indigo: "text-indigo-700",
      violet: "text-violet-700",
      purple: "text-purple-700",
      fuchsia: "text-fuchsia-700",
      pink: "text-pink-700",
      rose: "text-rose-700",
    };
    const textColorLocal = {
      slate: "text-slate-400",
      gray: "text-gray-400",
      zinc: "text-zinc-400",
      neutral: "text-neutral-400",
      stone: "text-stone-400",
      red: "text-red-400",
      orange: "text-orange-400",
      amber: "text-amber-400",
      yellow: "text-yellow-400",
      lime: "text-lime-400",
      green: "text-green-400",
      emerald: "text-emerald-400",
      teal: "text-teal-400",
      cyan: "text-cyan-400",
      sky: "text-sky-400",
      blue: "text-blue-400",
      indigo: "text-indigo-400",
      violet: "text-violet-400",
      purple: "text-purple-400",
      fuchsia: "text-fuchsia-400",
      pink: "text-pink-400",
      rose: "text-rose-400",
    };
    const dialectData = dialects.value.find(d => d.name === dialect);
    // 登録済みの流派の場合
    if (dialectData && _dialects.find((d: TDialectData) => d.name === dialect)) return textColor[dialectData.color as keyof typeof textColor];
    // オリジナルの流派の場合
    if (dialectData) return textColorLocal[dialectData.color as keyof typeof textColorLocal];
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

  const updateDialects = (originalDialects: TDialectData[]) => {
    dialects.value = [..._dialects, ...originalDialects];
  };

  return { getDialectTextClass, getDiarectJapanese, getDialectBgClass, dialects, updateDialects };
}

