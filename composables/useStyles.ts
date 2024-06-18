import type { TDialect } from "~/types";

export default function () {
  const getDialectTextClass = (dialect: TDialect | null) => {
    switch (dialect) {
      case "standard":
        return "text-rose-600";
      case "cult_ciel":
        return "text-lime-600";
      case "metafalss":
        return "text-sky-600";
      case "cluster":
        return "text-indigo-600";
      case "pastalie":
        return "text-amber-600";
      case "alpha":
        return "text-purple-600";
      case "unknown":
        return "text-gray-500";
      default:
        return "text-black";
    }
  };

  const getDialectBgClass = (dialect: TDialect | null) => {
    switch (dialect) {
      case "standard":
        return "bg-rose-50";
      case "cult_ciel":
        return "bg-lime-50";
      case "metafalss":
        return "bg-sky-50";
      case "cluster":
        return "bg-indigo-50";
      case "pastalie":
        return "bg-amber-50";
      case "alpha":
        return "bg-purple-50";
      case "unknown":
        return "bg-gray-50";
      default:
        return "bg-white";
    }
  };

  const getDiarectJapanese = (dialect: TDialect | null) => {
    switch (dialect) {
      case "standard":
        return "中央正純律";
      case "cult_ciel":
        return "クルトシエール律";
      case "metafalss":
        return "古メタファルス律";
      case "cluster":
        return "クラスタ律";
      case "pastalie":
        return "新約パスタリエ";
      case "alpha":
        return "アルファ律";
      case "unknown":
        return "ヒュムノサーバー未登録";
      default:
        return "不明";
    }
  };

  return { getDialectTextClass, getDiarectJapanese, getDialectBgClass };
}

