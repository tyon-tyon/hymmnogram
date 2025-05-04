import _dialects from "~/assets/datas/dialects.json";
import type { TDialect } from "~/types";

// 登録済みの流派データ
const pureDialects: TDialect[] = _dialects;
export default function () {
  const { dialects } = useDialect();

  const getDialectTextClass = (dialect: string | null) => {
    const textColor = {
      slate: "text-slate-700 dark:text-slate-300",
      gray: "text-gray-700 dark:text-gray-300",
      zinc: "text-zinc-700 dark:text-zinc-300",
      neutral: "text-neutral-700 dark:text-neutral-300",
      stone: "text-stone-700 dark:text-stone-300",
      red: "text-red-700 dark:text-red-300",
      orange: "text-orange-700 dark:text-orange-300",
      amber: "text-amber-700 dark:text-amber-300",
      yellow: "text-yellow-700 dark:text-yellow-300",
      lime: "text-lime-700 dark:text-lime-300",
      green: "text-green-700 dark:text-green-300",
      emerald: "text-emerald-700 dark:text-emerald-300",
      teal: "text-teal-700 dark:text-teal-300",
      cyan: "text-cyan-700 dark:text-cyan-300",
      sky: "text-sky-700 dark:text-sky-300",
      blue: "text-blue-700 dark:text-blue-300",
      indigo: "text-indigo-700 dark:text-indigo-300",
      violet: "text-violet-700 dark:text-violet-300",
      purple: "text-purple-700 dark:text-purple-300",
      fuchsia: "text-fuchsia-700 dark:text-fuchsia-300",
      pink: "text-pink-700 dark:text-pink-300",
      rose: "text-rose-700 dark:text-rose-300",
    };
    const textColorLocal = {
      slate: "text-slate-400 dark:text-slate-600",
      gray: "text-gray-400 dark:text-gray-600",
      zinc: "text-zinc-400 dark:text-zinc-600",
      neutral: "text-neutral-400 dark:text-neutral-600",
      stone: "text-stone-400 dark:text-stone-600",
      red: "text-red-400 dark:text-red-600",
      orange: "text-orange-400 dark:text-orange-600",
      amber: "text-amber-400 dark:text-amber-600",
      yellow: "text-yellow-400 dark:text-yellow-600",
      lime: "text-lime-400 dark:text-lime-600",
      green: "text-green-400 dark:text-green-600",
      emerald: "text-emerald-400 dark:text-emerald-600",
      teal: "text-teal-400 dark:text-teal-600",
      cyan: "text-cyan-400 dark:text-cyan-600",
      sky: "text-sky-400 dark:text-sky-600",
      blue: "text-blue-400 dark:text-blue-600",
      indigo: "text-indigo-400 dark:text-indigo-600",
      violet: "text-violet-400 dark:text-violet-600",
      purple: "text-purple-400 dark:text-purple-600",
      fuchsia: "text-fuchsia-400 dark:text-fuchsia-600",
      pink: "text-pink-400 dark:text-pink-600",
      rose: "text-rose-400 dark:text-rose-600",
    };
    const dialectData = dialects.value.find(d => d.name === dialect);
    // 登録済みの流派の場合
    if (dialectData && pureDialects.find((d: TDialect) => d.name === dialect)) return textColor[dialectData.color as keyof typeof textColor];
    // オリジナルの流派の場合
    if (dialectData) return textColorLocal[dialectData.color as keyof typeof textColorLocal];
    return "text-cool-700 dark:text-cool-300";
  };

  const getDialectBgClass = (dialect: string | null) => {
    const bgColor = {
      slate: "bg-slate-50 dark:bg-slate-950",
      gray: "bg-gray-50 dark:bg-gray-950",
      zinc: "bg-zinc-50 dark:bg-zinc-950",
      neutral: "bg-neutral-50 dark:bg-neutral-950",
      stone: "bg-stone-50 dark:bg-stone-950",
      red: "bg-red-50 dark:bg-red-950",
      orange: "bg-orange-50 dark:bg-orange-950",
      amber: "bg-amber-50 dark:bg-amber-950",
      yellow: "bg-yellow-50 dark:bg-yellow-950",
      lime: "bg-lime-50 dark:bg-lime-950",
      green: "bg-green-50 dark:bg-green-950",
      emerald: "bg-emerald-50 dark:bg-emerald-950",
      teal: "bg-teal-50 dark:bg-teal-950",
      cyan: "bg-cyan-50 dark:bg-cyan-950",
      sky: "bg-sky-50 dark:bg-sky-950",
      blue: "bg-blue-50 dark:bg-blue-950",
      indigo: "bg-indigo-50 dark:bg-indigo-950",
      violet: "bg-violet-50 dark:bg-violet-950",
      purple: "bg-purple-50 dark:bg-purple-950",
      fuchsia: "bg-fuchsia-50 dark:bg-fuchsia-950",
      pink: "bg-pink-50 dark:bg-pink-950",
      rose: "bg-rose-50 dark:bg-rose-950",
    };
    const dialectData = dialects.value.find(d => d.name === dialect);
    if (dialectData && pureDialects.find((d: TDialect) => d.name === dialect)) return bgColor[dialectData.color as keyof typeof bgColor];
    return "bg-gray-50 dark:bg-gray-900";
  };


  return { getDialectTextClass, getDialectBgClass };
}

