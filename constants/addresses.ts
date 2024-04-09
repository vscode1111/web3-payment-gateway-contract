import { DeployNetworks } from '~types';

export const SQR_PAYMENT_GATEWAY_NAME = 'SQRPaymentGateway';
export const ERC20_TOKEN_NAME = 'ERC20Token';

export enum CONTRACT_LIST {
  SQR_PAYMENT_GATEWAY = 'SQR_PAYMENT_GATEWAY',
}

export const TOKENS: Record<CONTRACT_LIST, DeployNetworks> = {
  SQR_PAYMENT_GATEWAY: {
    // bsc: '0xC85AC922880b2eD44a2D9a78739740990B6219f5', //s-Main
    // bsc: '0x7D82090d0f7901Dfe612486E6D5A9A1d1c6e5f62', //Main
    // bsc: '0x82eFbC9ec9546b78aD223dE39eBD1D5F9243E18f', //Main
    bsc: '0x258AF60a788fef0289994997c813D5933AcCd52A', //Main
    // bsc: '', //Prod
  },
};
