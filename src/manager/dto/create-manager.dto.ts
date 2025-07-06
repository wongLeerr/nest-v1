export class CreateManagerDto {
  name: string;
  money: number;
}

export class TransferMoneyDto {
  fromId: number;
  toId: number;
  money: number;
}
