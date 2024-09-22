import dotenv from 'dotenv';
import { sendMailForSOS } from './sendMailForSOS.js'; // Import the sendMail function
// import { RowData } from './interfaces.js'; // Import the RowData interface
import { validateRowForRaksha, validateRowForSOS } from './validateRowData.js';
import { sendMailForRaksha } from './sendMailForRaksha.js';

dotenv.config(); // Load environment variables from .env file

// Function to get and process rows from the spreadsheet and send email
export const readDataAndSendMailForSOS = async (
    startingRowNo,
    fileData,
    email,
    ccEmail,
    password) => {
    try {
        // Loop through each row
        for (let index = 0; index < fileData.length; index++) {
            const row = fileData[index];
            if (row) {
                // Extract necessary data from the row
                const data = {
                    "Receipt No": row['Receipt No'], // Assuming 'Receipt No' is a column in the sheet
                    "Date of Donation": row['Date of Donation'],
                    "Donar Name": row['Donar Name'],
                    "Donar Email": row['Donar Email'], // Assuming 'email' is a column in the sheet
                    "Amount of Donation": row['Amount of Donation'],
                    "Mode of Payment": row['Mode of Payment'],
                    "Email Subject": row['Email Subject'],
                    "Email - Name": row['Email - Name'],
                    "Email - Body": row['Email - Body'],
                    "Email - Sign": row['Email - Sign'],
                    "Towards": row['Towards'],
                    "Chq.No.": row['Chq.No.'],
                    "Bank & Branch": row['Bank & Branch'],
                };
                validateRowForSOS(data, startingRowNo + index);
                await sendMailForSOS(data, email, ccEmail, password);
            }
        }
    } catch (error) {
        throw error;
    }
};



export const readDataAndSendMailForRaksha = async (
    startingRowNo,
    fileData,
    email,
    ccEmail,
    password) => {
    try {
        // Loop through each row
        for (let index = 0; index < fileData.length; index++) {
            const row = fileData[index];
            if (row) {
                // Extract necessary data from the row
                const data = {
                    "Receipt No": row['Receipt No'], // Assuming 'Receipt No' is a column in the sheet
                    "Today’s Date": row['Today’s Date'],
                    "Name": row['Name:'],
                    "Address": row['Address'],
                    "PAN": row['PAN'],
                    "Email": row['Email'], // Assuming 'email' is a column in the sheet
                    "Amount Received": row['Amount Received'],
                    "Mode of Payment": row['Mode of Payment'],
                    "Check/CC/Reference Number": row['Check/CC/Reference Number'],
                    "This donation has gone towards": row['This donation has gone towards'],
                    "Email Subject": row['Email Subject'],
                    "Email - Name": row['Email - Name'],
                    "Email - Body": row['Email - Body'],
                    "Email - Sign": row['Email - Sign']
                };
                validateRowForRaksha(data, startingRowNo + index);
                await sendMailForRaksha(data, email, ccEmail, password);
            }
        }
    } catch (error) {
        throw error;
    }
};
