import { Request, Response, NextFunction, Router } from "express";
import decryptData from "../utils/decryptData.js";
import { readDataAndSendMailForRaksha, readDataAndSendMailForSOS } from "../utils/readDataAndSendMail.js";

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    if( !req.user ){
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const encryptedData = req.body.encryptedData;
    const {
        startingRowNo,
        fileData,
        ccEmails,
        password } = decryptData(encryptedData);
    const email = req.user.emails[0].value
    try {
        if (email == process.env.SOS_EMAIL) {
            await readDataAndSendMailForSOS(startingRowNo, fileData, email, ccEmails, password);
        } else if (email == process.env.RAKSHA_EMAIL) {
            await readDataAndSendMailForRaksha(startingRowNo, fileData, email, ccEmails, password);
        } else {
            return res.status(400).json({ message: 'Invalid email address' });
        }
        return res.status(200).json({ message: 'Mails sended successfully!' });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
});

export default router;