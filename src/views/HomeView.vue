<script setup lang="ts">
import { useWalletStore } from '@/stores/wallet'
import Web3WalletDisplay from '@/components/Web3AccountDisplay.vue'
import { useContract } from '@/composables/useContract'
import abi from '@/abi/oSnipe'
import { showTxToast } from '@/utils/ToastComponents.jsx'

const CONTRACT_CONSTANTS = {
  sniperPriceETH: '0.5',
  observerPriceETH: '0.03',
  purveyorPriceETH: '3',
  sniperID: 0,
  purveyorID: 1,
  observerID: 2,
  committedSniperID: 10,
  committedPurveyorID: 11,
  maxSnipersSupply: 488,
  maxObserversPerCommitted: 10
}

const wallet = useWalletStore()

const { write, batchRead, onContractInit, txPending } = useContract(
  '0xAA8E256202067ec9c9c3C9eBA1E5ce6dd273c15C',
  abi
)

onContractInit(() => {
  test()
})

async function test() {
  const results = await batchRead([
    { name: 'alreadyMinted', args: [wallet.address] },
    {
      name: 'balanceOf',
      returnAs: 'hasPurveyorPass',
      castTo: 'boolean',
      args: [wallet.address, CONTRACT_CONSTANTS.purveyorID]
    },
    {
      name: 'balanceOf',
      returnAs: 'hasSniperPass',
      castTo: 'boolean',
      args: [wallet.address, CONTRACT_CONSTANTS.sniperID]
    },
    {
      name: 'balanceOf',
      returnAs: 'hasCommittedSniperPass',
      castTo: 'boolean',
      args: [wallet.address, CONTRACT_CONSTANTS.committedSniperID]
    },
    {
      name: 'balanceOf',
      returnAs: 'hasCommittedPurveyorPass',
      castTo: 'boolean',
      args: [wallet.address, CONTRACT_CONSTANTS.committedPurveyorID]
    },
    {
      name: 'balanceOf',
      returnAs: 'observerBalance',
      castTo: 'number',
      args: [wallet.address, CONTRACT_CONSTANTS.observerID]
    }
  ])
}

async function click() {
  try {
    const receipt = await write({ name: 'mintObservers', args: [1] }, { value: 5 })
    console.log(receipt)

    showTxToast(receipt)
  } catch (error: any) {
    const e = {
      error,
      message: 'There was a problem minting. Maybe you already have the maximum?'
    }
    showTxToast(error)
  }
}
</script>

<template>
  <Web3WalletDisplay :showConnectBtn="true" />
  <button :disabled="txPending" @click="() => click()">click</button>
</template>
