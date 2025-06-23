import axios from "axios";
import { NameApiServiceImpl } from "../nameApiService";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const API_URL = "https://random-data-api.com/api/name/random_name";

describe("NameApiServiceImpl#getFirstName", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("名前が 4 文字以下ならそのまま返す", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { first_name: "Dai" } });

    const service = new NameApiServiceImpl();

    await expect(service.getFirstName()).resolves.toBe("Dai");
    expect(mockedAxios.get).toHaveBeenCalledWith(API_URL);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it("名前が 5 文字以上なら例外を投げる", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { first_name: "Robert" } });

    const service = new NameApiServiceImpl();
    await expect(service.getFirstName()).rejects.toThrow(
      "firstName is too long!"
    );
    expect(mockedAxios.get).toHaveBeenCalledWith(API_URL);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });
});
