const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * Math.floor(max));
};

export interface Database {
  save(numbers: number[]): void;
}

export class DatabaseMock implements Database {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public save(_: number[]): void {
    // memo: 課題のために、あえて時々saveが失敗するようにしている
    if (getRandomInt(10) < 2) {
      throw new Error("fail!");
    }
  }
}
