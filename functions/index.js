const functions = require('firebase-functions')
const admin = require('firebase-admin')
const { recoverPersonalSignature } = require('@metamask/eth-sig-util')

admin.initializeApp()

const toHex = (stringToConvert) =>
  stringToConvert
    .split('')
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')

exports.retrieveNonce = functions.https.onCall(async ({ address }) => {
  if (!address) {
    return {
      error: 'No address specified.'
    }
  }

  const userDoc = await admin.firestore().collection('users').doc(address).get()

  if (userDoc.exists) {
    const existingNonce = userDoc.data()?.nonce

    return { nonce: existingNonce }
  } else {
    const generatedNonce = Math.floor(Math.random() * 1000000).toString()

    const createdUser = await admin.auth().createUser({
      uid: address
    })

    await admin.firestore().collection('users').doc(createdUser.uid).set({
      nonce: generatedNonce
    })

    return { nonce: generatedNonce }
  }
})

exports.verifySignedMessage = functions.https.onCall(async ({ address, signature }) => {
  // Get the nonce for this address
  const userDocRef = admin.firestore().collection('users').doc(address)
  const userDoc = await userDocRef.get()

  if (userDoc.exists) {
    const existingNonce = userDoc.data()?.nonce

    const recoveredAddress = recoverPersonalSignature({
      data: `0x${toHex(existingNonce)}`,
      signature
    })

    if (recoveredAddress === address) {
      // The signature was verified - update the nonce to prevent replay attacks
      // update nonce
      await userDocRef.update({
        nonce: Math.floor(Math.random() * 1000000).toString()
      })

      // Create a custom token for the specified address
      const firebaseToken = await admin.auth().createCustomToken(address)

      // Return the token
      return { token: firebaseToken }
    } else {
      // The signature could not be verified
      return { error: 'Signature Not Verified.' }
    }
  } else {
    return {
      error: 'User does not exist.'
    }
  }
})
