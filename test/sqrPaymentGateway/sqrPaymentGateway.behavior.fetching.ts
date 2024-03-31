import { expect } from 'chai';
import { contractConfig, seedData } from '~seeds';
import { getERC20TokenBalance } from './utils';

export function shouldBehaveCorrectFetching(): void {
  describe('fetching', () => {
    it('should be correct init values', async function () {
      expect(await this.ownerSQRPaymentGateway.owner()).eq(this.owner2Address);
      expect(await this.ownerSQRPaymentGateway.erc20Token()).eq(this.erc20TokenAddress);
      expect(await this.ownerSQRPaymentGateway.coldWallet()).eq(this.coldWalletAddress);
      expect(await this.ownerSQRPaymentGateway.balanceLimit()).eq(contractConfig.balanceLimit);
    });

    it('should be correct balances', async function () {
      expect(await getERC20TokenBalance(this, this.owner2Address)).eq(seedData.totalAccountBalance);
      expect(await this.ownerSQRPaymentGateway.getBalance()).eq(seedData.zero);
      expect(await this.ownerSQRPaymentGateway.totalDeposited()).eq(seedData.zero);
      expect(await this.ownerSQRPaymentGateway.totalWithdrew()).eq(seedData.zero);
    });
  });
}
