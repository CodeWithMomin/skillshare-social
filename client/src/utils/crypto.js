import nacl from 'tweetnacl';
import { decodeUTF8, encodeUTF8, encodeBase64, decodeBase64 } from 'tweetnacl-util';

// Generate a new Diffie-Hellman keypair (using Curve25519)
export const generateKeyPair = () => {
    const keyPair = nacl.box.keyPair();
    return {
        publicKey: encodeBase64(keyPair.publicKey),
        secretKey: encodeBase64(keyPair.secretKey)
    };
};

// Encrypt a string message using the sender's secret key and the receiver's public key
// Returns a base64 string combining nonce and encrypted payload
export const encryptMessage = (message, senderSecretKeyBase64, receiverPublicKeyBase64) => {
    if (!message || !receiverPublicKeyBase64) return message;

    try {
        const senderSecretKey = decodeBase64(senderSecretKeyBase64);
        const receiverPublicKey = decodeBase64(receiverPublicKeyBase64);

        // Create random one-time nonce
        const nonce = nacl.randomBytes(nacl.box.nonceLength);
        const messageUint8 = decodeUTF8(message);

        // Authenticated encryption
        const encrypted = nacl.box(
            messageUint8,
            nonce,
            receiverPublicKey,
            senderSecretKey
        );

        // Combine nonce and encrypted data
        const fullMessage = new Uint8Array(nonce.length + encrypted.length);
        fullMessage.set(nonce);
        fullMessage.set(encrypted, nonce.length);

        return encodeBase64(fullMessage);
    } catch (error) {
        console.error("Encryption failed:", error);
        return message; // Fallback to plaintext if error
    }
};

// Decrypt a base64 message using the receiver's secret key and the sender's public key
export const decryptMessage = (encodedMessageWithNonce, receiverSecretKeyBase64, senderPublicKeyBase64) => {
    if (!encodedMessageWithNonce || !senderPublicKeyBase64) return encodedMessageWithNonce;

    try {
        const fullMessage = decodeBase64(encodedMessageWithNonce);
        const receiverSecretKey = decodeBase64(receiverSecretKeyBase64);
        const senderPublicKey = decodeBase64(senderPublicKeyBase64);

        const nonce = fullMessage.slice(0, nacl.box.nonceLength);
        const encryptedMessage = fullMessage.slice(nacl.box.nonceLength);

        const decrypted = nacl.box.open(
            encryptedMessage,
            nonce,
            senderPublicKey,
            receiverSecretKey
        );

        if (!decrypted) {
            throw new Error("Could not decrypt message");
        }

        return encodeUTF8(decrypted);
    } catch (error) {
        console.error("Decryption failed:", error);
        return encodedMessageWithNonce; // Return encrypted or fallback
    }
};
