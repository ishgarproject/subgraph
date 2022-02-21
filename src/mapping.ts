import { BigInt } from '@graphprotocol/graph-ts';
import { DepositNFT, DepositEther } from '../generated/IshgarVault/IshgarVault';
import { MockERC721, Transfer, Approval } from '../generated/MockERC721/MockERC721';
import { NFT, EtherDeposit } from '../generated/schema';

export function handleERC721Transfers(event: Transfer): void {
  let entity = NFT.load(event.params.id.toHex());
  if (!entity) {
    entity = new NFT(event.params.id.toHex());
  }
  const tokenId = event.params.id;
  const contract = MockERC721.bind(event.address);

  entity.owner = event.params.to;
  entity.tokenId = tokenId;
  entity.tokenUri = contract.tokenURI(tokenId);
  entity.deposited = false;
  entity.save();
}

export function handleApprovals(event: Approval): void {
  const entity = NFT.load(event.params.id.toHex());
  if (!entity) {
    return;
  }
  entity.approvedAddress = event.params.spender;
  entity.save();
}

export function handleDepositNFT(event: DepositNFT): void {
  let entity = NFT.load(event.params.tokenId.toHex());
  if (!entity) {
    return;
  }
  entity.owner = event.params.depositor;
  entity.deposited = true;
  entity.save();
}

export function handleEtherDeposit(event: DepositEther): void {
  const entity = new EtherDeposit(event.transaction.from.toHex());
  entity.depositor = event.params.depositor;
  entity.amountInWei = event.params.amount;
  entity.transactionHash = event.transaction.hash;
  entity.save();
}
