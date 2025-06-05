import { asyncSumOfArray, sumOfArray } from "../functions";

describe("sumOfArray", () => {
  it("配列の合計を返す", () => {
    expect(sumOfArray([1, 2, 3, 4])).toBe(10);
  });

  it("負の数や0を含んでも合計できる", () => {
    expect(sumOfArray([-1, 0, 1, 2])).toBe(2);
  });

  it("空配列の場合は例外を投げる", () => {
    expect(() => sumOfArray([])).toThrow(TypeError);
  });
});

describe("asyncSumOfArray", () => {
  it("配列の合計を返す", async () => {
    await expect(asyncSumOfArray([1, 2, 3, 4])).resolves.toBe(10);
  });

  it("負の数や0を含んでも合計できる", async () => {
    await expect(asyncSumOfArray([-1, 0, 1, 2])).resolves.toBe(2);
  });

  it("空配列の場合は例外を投げる", async () => {
    await expect(asyncSumOfArray([])).rejects.toBeInstanceOf(TypeError);
  });
});
