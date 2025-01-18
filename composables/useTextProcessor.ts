export default function () {
  const splitForeluna = (text: string): string[][] => {
    return text.split("\n").map((line) => line.split(/[\s,."']/));
  };

  return {
    splitForeluna,
  };
}
