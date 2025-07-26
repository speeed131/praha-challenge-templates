import {
    calculateDiscountPrice,
    isBusinessHours,
    getGitHubStars
} from "../issues/4_1"

describe("calculateDiscountPrice", () => {
  describe("正常系", () => {
    test("割引率が0のとき、元の価格を返す", () => {
      expect(calculateDiscountPrice(100, 0)).toBe(100);
    });

    test("割引率が0.5のとき、半額を返す", () => {
      expect(calculateDiscountPrice(100, 0.5)).toBe(50);
    });

    test("割引率が1のとき、0を返す", () => {
      expect(calculateDiscountPrice(100, 1)).toBe(0);
    });

    test("割引率がマイナスのとき、割引率を0とみなして元の価格を返す", () => {
      expect(calculateDiscountPrice(100, -0.1)).toBe(100);
    });

    test("割引率が1より大きいとき、割引率を1とみなして0を返す", () => {
      expect(calculateDiscountPrice(100, 1.1)).toBe(0);
    });

    test("金額が0のとき、割引率によらず0を返す", () => {
      expect(calculateDiscountPrice(0, 0.5)).toBe(0);
    });
  });

  describe("異常系", () => {
    test("価格がNaNの時、NaNを返す", () => {
    expect(calculateDiscountPrice(NaN, 0)).toBe(NaN);
    });

    test("割引率がNaNの時、NaNを返す", () => {
    expect(calculateDiscountPrice(100, NaN)).toBe(NaN);
    });
  });
});

describe("isBusinessHours", () => {
  describe("正常系", () => {
    test("JST09:00の場合、営業時間内としてtrueを返す", () => {
      const date = new Date("2025-07-01T09:00:00+09:00");
      expect(isBusinessHours(date)).toBe(true);
    });

    test("JST17:59の場合、営業時間内としてtrueを返す", () => {
      const date = new Date("2025-07-01T17:59:00+09:00");
      expect(isBusinessHours(date)).toBe(true);
    });

    test("JST18:00の場合、営業時間外としてfalseを返す", () => {
      const date = new Date("2025-07-01T18:00:00+09:00");
      expect(isBusinessHours(date)).toBe(false);
    });

    test("平日以外の場合も営業時間は設定されている", () => {
      const date = new Date("2025-07-06T09:00:00+09:00"); // 日曜日
      expect(isBusinessHours(date)).toBe(true);
    });

    test("JST18:00の場合、UTCでは営業時間内としてtrueを返す", () => {
      const date = new Date("2025-07-01T18:00:00+09:00");
      expect(isBusinessHours(date, "UTC")).toBe(true);
    });
  });

  describe("異常系", () => {
    test("不正なタイムゾーン名の場合、例外が発生する", () => {
      const date = new Date("2025-07-01T09:00:00+09:00");
      expect(() => isBusinessHours(date, "invalidTimeZone")).toThrow(RangeError);
    });
  });
});

describe("GetGithubResponse", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    (fetch as jest.Mock).mockReset();
  });

  describe("正常系", () => {
    test("リポジトリのスター数が取得できる", async () => {
      // Arrange
      const mockResponse = {
        stargazers_count: 100
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      const owner = "taro";
      const repository = "superapp";

      // Act
      const starCount = await getGitHubStars(owner, repository);

      // Assert
      expect(starCount).toBe(100);
      expect(fetch).toHaveBeenCalledWith(
        "https://api.github.com/repos/taro/superapp",
        { headers: { Accept: "application/vnd.github+json" } }
      );
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("異常系", () => {
    test("リポジトリが公開されていない", async () => {
      // Arrange
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404
      });

      const owner = "taro";
      const repository = "superapp";

      // Act
      const starCount = await getGitHubStars(owner, repository);

      // Assert
      expect(starCount).toBeNull;
      expect(fetch).toHaveBeenCalledWith(
        "https://api.github.com/repos/taro/superapp",
        { headers: { Accept: "application/vnd.github+json" } }
      );
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    test("リポジトリが公開されていない以外のHTTPリクエストエラー", async () => {
      // Arrange
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "internal server error"
      });

      const owner = "taro";
      const repository = "superapp";

      // Act, Assert
      await expect(getGitHubStars(owner, repository)).rejects.toThrow(
        "HTTP 500 internal server error"
      );

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        "https://api.github.com/repos/taro/superapp",
        { headers: { Accept: "application/vnd.github+json" } }
      );
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });
});