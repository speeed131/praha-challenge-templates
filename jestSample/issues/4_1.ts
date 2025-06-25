/**
 * 割引後価格を計算する
 * マイナス価格にならないよう 0 を下限に丸める
 * @param price 元の価格
 * @param discountRate 割引率 (0–1)
 * @returns 割引後の価格
 */
export const calculateDiscountPrice = (
  price: number,
  discountRate: number // 0–1
): number => {
  // 割引率が 0–1 の範囲に収まるように制限
  const rate = Math.min(1, Math.max(0, discountRate));
  const discountedPrice = price * (1 - rate);
  return Math.max(0, Math.round(discountedPrice));
};

/**
 *  * 指定タイムゾーンで営業時間内か判定する
 *    9:00–18:00,
 * *    デフォルトは Asia/Tokyo
 * @param at 判定する日時
 * @param timeZone タイムゾーン名 (例: "Asia/Tokyo")
 * @returns 営業時間内なら true, それ以外は false
 */
export function isBusinessHours(
  at: Date,
  timeZone: string = "Asia/Tokyo"
): boolean {
  const zoned = new Date(at.toLocaleString("en-US", { timeZone }));
  const hour = zoned.getHours();
  return hour >= 9 && hour < 18;
}

type GetGithubResponse = { stargazers_count: number };
/**
 * GitHub リポジトリのスター数を取得する
 * @param owner リポジトリのオーナー名
 * @param repository リポジトリ名
 * @param fetch 関数
 * @returns スター数
 */
export async function getGitHubStars(
  owner: string,
  repository: string,
  fetchFn: typeof fetch = fetch
): Promise<number | null> {
  const res = await fetchFn(
    `https://api.github.com/repos/${owner}/${repository}`,
    { headers: { Accept: "application/vnd.github+json" } }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

  const data: GetGithubResponse = await res.json();
  return data.stargazers_count;
}
