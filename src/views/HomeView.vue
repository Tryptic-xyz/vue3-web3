<script setup lang="ts">
import { useWalletStore } from '@/stores/wallet'
import { useWeb3ProviderStore } from '@/stores/web3Provider'
import Web3WalletDisplay from '@/components/Web3AccountDisplay.vue'
import { useContract } from '@/composables/useContract'
import abi from '@/abi/oSnipe'
import { showTxToast } from '@/utils/ToastComponents.jsx'
import { useUserStore } from '@/stores/user'
import { getFunctions, httpsCallable } from 'firebase/functions'
const { user, login, logout } = useUserStore()

const { getProviders } = useWeb3ProviderStore()
const functions = getFunctions()
const getNonce = httpsCallable(functions, 'retrieveNonce')
const verifySignature = httpsCallable(functions, 'verifySignedMessage')

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

async function loginUser() {
  const { browserProvider } = getProviders()
  const res: any = await getNonce({ address: wallet.address })
  const signer = await browserProvider?.getSigner()
  const signature = await signer?.signMessage(res.data.nonce)
  const {
    data: { token }
  } = await verifySignature({ address: wallet.address, signature })
  console.log(token)
  await login(token)
}
</script>

<template>
  <div>
    <RouterLink to="about">ABOUT</RouterLink>
    <Web3WalletDisplay :showConnectBtn="true" />
    <button v-if="!user.id" :disabled="txPending" @click="() => loginUser()">login</button>
    <button v-if="user.id" @click="() => logout()">logout</button>
  </div>
</template>
