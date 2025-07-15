import {calculateDiscountPrice, isBusinessHours, getGitHubStars} from "../issues/4_1";

describe('calculateDiscountPrice', () => {
  it('discountRateが0.1の場合900を返す', () => {
    expect(calculateDiscountPrice(1000, 0.1)).toBe(900);
  });

  it('discountRateが1以上の場合は0を返す', () => {
    expect(calculateDiscountPrice(1000, 20)).toBe(0);
  });

  it('discountRateが0の場合は元の値を返す', () => {
    expect(calculateDiscountPrice(1000, 0)).toBe(1000)
  });
});

describe('isBusinessHours', () => {
  it('9時は営業時間内', () => {
    // UTCの時間で定義
    const date = new Date(Date.UTC(2025, 7, 8, 0, 0, 0));
    const mockDate = isBusinessHours(date);
    expect(mockDate).toBe(true);
  });

  it('18時は営業時間外', () => {
    // UTCの時間で定義
    const date = new Date(Date.UTC(2025, 7, 8, 9, 0, 0));
    const mockDate = isBusinessHours(date);
    expect(mockDate).toBe(false);
  });

  it('8時59分は営業時間外', () => {
    const date = new Date(Date.UTC(2025, 7, 8, 23, 59, 0));
    const mockDate = isBusinessHours(date);
    expect(mockDate).toBe(false);
  });

  it('17時59分は営業時間内', () => {
    const date = new Date(Date.UTC(2025, 7, 8, 8, 59, 0));
    const mockDate = isBusinessHours(date);
    expect(mockDate).toBe(true);
  });
});


// https://docs.github.com/ja/rest/repos/repos?apiVersion=2022-11-28#get-a-repository

describe('getGitHubStars', () => {
  beforeEach(() => {
    global.fetch = jest.fn(); // fetch をモック化
  });

  afterEach(() => {
    jest.resetAllMocks(); // モックリセット
  });

  const owner = 'testJest';
  const repository = 'repositoryJest';

  const API_URL = `https://api.github.com/repos/${owner}/${repository}`;

  it('正常系', async () => {
    const mockJson = { stargazers_count: 100 };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockJson),
    });

    await expect(getGitHubStars(owner, repository)).resolves.toBe(100);

    expect(fetch).toHaveBeenCalledWith(
      API_URL,
      { headers: { Accept: 'application/vnd.github+json' } }
    );
  });

  it('404を返す', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(getGitHubStars(owner, repository)).resolves.toBe(null);
  });

  it('レスポンスエラー', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 504,
      statusText: 'Gateway Timeout',
    });

    await expect(getGitHubStars(owner, repository)).rejects.toThrow(
      `HTTP 504 Gateway Timeout`
    );
  });
});