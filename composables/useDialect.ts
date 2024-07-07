import _dialects from "~/assets/datas/dialects.json";
import type { TDialectData } from "~/types";

export default function () {
  const dialects = useState<TDialectData[]>('dialects', () => _dialects);
  const pureDialects = _dialects;

  const getDiarectJapanese = (dialect: string | null) => {
    const dialectData = dialects.value.find(d => d.name === dialect);
    if (dialectData) return dialectData.japanese;
    return dialect;
  };

  const updateDialects = (originalDialects: TDialectData[]) => {
    dialects.value = [..._dialects, ...originalDialects];
  };

  return { dialects, pureDialects, getDiarectJapanese, updateDialects };
}

