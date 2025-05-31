import { asyncSumOfArray, sumOfArray } from "../functions";

describe("sumOfArray", () => {
  it("配列の合計を返す", () => {
    expect(sumOfArray([1, 2, 3, 4])).toBe(10);
  });

  it("負の数を含んでも合計できる", () => {
    expect(sumOfArray([-5, 10, -3])).toBe(2);
  });

  it("空配列の場合は例外を投げる", () => {
    expect(() => sumOfArray([])).toThrow(TypeError);
  });
});


describe("asyncSumOfArray", () => {
  it("配列の合計を返す", async () => {
    await expect(asyncSumOfArray([2, 4, 6])).resolves.toBe(12);
  });

  it("負の数を含んでも合計できる", async () => {
    await expect(asyncSumOfArray([-2, 2, 3])).resolves.toBe(3);
  });

  it("空配列の場合は reject される", async () => {
    await expect(asyncSumOfArray([])).rejects.toBeInstanceOf(TypeError);
  });
});