import CryptoJS from 'crypto-js';

const encryptData = (dataObj: any) => {
    const secretKey = import.meta.env.VITE_CRYPTO_SECRET_KEY;
    const objStr = JSON.stringify({ ...dataObj });
    const encryptedObj = CryptoJS.AES.encrypt(objStr, secretKey).toString();
    return encryptedObj;
};

export default encryptData;