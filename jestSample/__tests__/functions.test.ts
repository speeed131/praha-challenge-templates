import {
  asyncSumOfArray,
  asyncSumOfArraySometimesZero,
  getFirstNameThrowIfLong,
  sumOfArray,
} from "../functions";
import { NameApiService } from "../nameApiService";

describe("sumOfArray", () => {
  describe("正常系", () => {
    it("配列の合計を返す", () => {
      expect(sumOfArray([1, 2, 3, 4])).toBe(10);
    });

    it("負の数や0を含んでも合計できる", () => {
      expect(sumOfArray([-1, 0, 1, 2])).toBe(2);
    });

    it("空配列の場合は０を返却する", () => {
      expect(sumOfArray([])).toBe(0);
    });
  });
});

describe("asyncSumOfArray", () => {
  describe("正常系", () => {
    it("配列の合計を返す", async () => {
      await expect(asyncSumOfArray([1, 2, 3, 4])).resolves.toBe(10);
    });

    it("負の数や0を含んでも合計できる", async () => {
      await expect(asyncSumOfArray([-1, 0, 1, 2])).resolves.toBe(2);
    });
    it("空配列の場合は０を返却する", async () => {
      await expect(asyncSumOfArray([])).resolves.toBe(0);
    });
  });
});

describe("asyncSumOfArraySometimesZero", () => {
  describe("正常系", () => {
    it("database.save の成功時に合計を返す", async () => {
      const saveMock = jest.fn();
      const fakeDb = { save: saveMock };
      const result = await asyncSumOfArraySometimesZero([1, 2, 3], fakeDb);

      expect(saveMock).toHaveBeenCalledWith([1, 2, 3]);
      expect(result).toBe(6);
    });
  });

  describe("異常系", () => {
    it("database.save の失敗時に0を返す", async () => {
      const saveMock = jest.fn(() => {
        throw new Error();
      });
      const fakeDb = { save: saveMock };

      const result = await asyncSumOfArraySometimesZero([4, 5, 6], fakeDb);

      expect(saveMock).toHaveBeenCalledWith([4, 5, 6]);
      expect(result).toBe(0);
    });
  });
});

describe("getFirstNameThrowIfLong", () => {
  describe("正常系", () => {
    it("名前が第1引数より短い場合、そのまま返す", async () => {
      const apiMock: NameApiService = {
        getFirstName: jest.fn().mockResolvedValue("Dai"),
      };

      await expect(getFirstNameThrowIfLong(5, apiMock)).resolves.toBe("Dai");

      expect(apiMock.getFirstName).toHaveBeenCalledWith();
      expect(apiMock.getFirstName).toHaveBeenCalledTimes(1);
    });
  });

  describe("異常系", () => {
    it("名前が第1引数より長い場合、例外を投げる", async () => {
      const apiMock = {
        getFirstName: jest.fn().mockResolvedValue("Christopher"),
      };

      await expect(getFirstNameThrowIfLong(5, apiMock)).rejects.toThrow(
        "first_name too long"
      );

      expect(apiMock.getFirstName).toHaveBeenCalledWith();
      expect(apiMock.getFirstName).toHaveBeenCalledTimes(1);
    });
  });
});
