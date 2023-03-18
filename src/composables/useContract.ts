import { ref } from 'vue'
import { ethers } from 'ethers'
import type { InterfaceAbi, Contract, Overrides, TransactionReceipt } from 'ethers/types'
import camelCase from 'camelcase'

import { useWeb3ProviderStore } from '@/stores/web3Provider'
import { useWatchBoolean } from './useWatchBoolean'
import { useTxURL } from './useTxURL'

interface ContractMethod {
  name: string
  args: Array<any>
}

interface ReadMethod extends ContractMethod {
  returnAs?: string
  castTo?: 'boolean' | 'number' | string | null
}

interface WriteMethod extends ContractMethod {
  value: number | string
}

export function useContract(address: string, abi: InterfaceAbi) {
  const { getProviders, onProviderConnected } = useWeb3ProviderStore()
  const txPending = ref(false)

  const { onTrue: onContractInit, toggle: toggleInitContract } = useWatchBoolean(false)
  let readContract: Contract, writeContract: Contract

  onProviderConnected(async () => {
    const { alchemyProvider, browserProvider } = getProviders()
    const signer = await browserProvider?.getSigner()

    readContract = new ethers.Contract(address, abi, alchemyProvider)
    writeContract = new ethers.Contract(address, abi, signer)

    toggleInitContract()
  })

  const read = async (read: ReadMethod) => {
    return readContract[read.name](...read.args)
  }

  const batchRead = async (readMethods: ReadMethod[]) => {
    const results: { fulfilled: { [key: string]: any }; rejected: any[] } = {
      fulfilled: {},
      rejected: []
    }

    const promises = readMethods.map(read)

    const completedPromises = await Promise.allSettled(promises)

    completedPromises.forEach((result, i) => {
      const readMethod = readMethods[i]
      const methodName = readMethod?.returnAs || readMethod.name
      const castTo = readMethod?.castTo || null
      const { fulfilled } = results

      if (result.status === 'fulfilled') {
        if (!castTo) {
          fulfilled[camelCase(methodName)] = result.value
        } else if (castTo == 'boolean') {
          fulfilled[camelCase(methodName)] = Boolean(parseInt(result.value))
        } else if (castTo == 'string') {
          fulfilled[camelCase(methodName)] = result['toString']()
        } else if (castTo == 'number') {
          fulfilled[camelCase(methodName)] = parseInt(result.value)
        }
      } else if (result.status === 'rejected') {
        results.rejected.push(result.reason)
      }
    })

    return results
  }

  async function write({ name, args }: WriteMethod, overrides: Overrides = {}) {
    txPending.value = true

    try {
      const tx = await writeContract[name](...args, overrides)
      const receipt: TransactionReceipt = await tx.wait()
      txPending.value = false

      return {
        ...receipt,
        txURL: useTxURL(receipt.hash)
      }
    } catch (error: any) {
      if (error.code === 'ACTION_REJECTED') {
        const start = error.message.indexOf('info') + 5
        const end = error.message.indexOf('code=') - 2
        const e = JSON.parse(error.message.substring(start, end))
        throw { error: { ...e.error } }
      } else {
        const errObj = {
          ...error,
          message: 'Transaction Failed!'
        }

        if (error.receipt) {
          errObj.receipt = {
            ...error.receipt,
            txURL: useTxURL(error.receipt.hash)
          }
        }
        txPending.value = false
        return errObj
      }
    }
  }

  return { read, write, onContractInit, batchRead, txPending }
}
