import { createTransport } from "nodemailer";
// import { RowData } from "./interfaces.js";
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
import { PDFDocument, StandardFonts } from "pdf-lib";
import { ToWords } from 'to-words';
import { logger } from "../index.js";

dotenv.config(); // Load environment variables from .env file

const toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
        currencyOptions: {
            // can be used to override defaults for the selected locale
            name: 'Rupee',
            plural: 'Rupees',
            symbol: '₹',
            fractionalUnit: {
                name: 'Paisa',
                plural: 'Paise',
                symbol: '',
            },
        },
    },
});

export const sendMailForRaksha = async (rowData, email, ccEmail, password) => {

    try {
        if (rowData.Address.length > 70) {
            rowData.RemainingAddress = rowData.Address.substring(70);
            rowData.Address = rowData.Address.substring(0, 70);
        }

        rowData['Amount Received'] = 'INR ' + parseInt(rowData["Amount Received"]).toLocaleString('en-IN') + '/- (' + toWords.convert(parseInt(rowData["Amount Received"])) + ')';

        if (rowData['Amount Received'].length > 70) {
            rowData['Remaining Amount Received'] = rowData['Amount Received'].substring(70);
            rowData['Amount Received'] = rowData['Amount Received'].substring(0, 70);
        }
        await helper(rowData);
        password = password.replace(/\s+/g, '');
        // Now, you can send an email after navigating to the endpoint and intercepting the request
        // Create a transporter using Gmail service
        const transporter = createTransport({
            service: 'gmail',
            auth: {
                user: email, // Use environment variables instead of hardcoding
                pass: password, // Use environment variables instead of hardcoding
            },
        });
        let from = `Raksha Foundation ${email}`
        const mailOptions = {
            from: from,
            to: rowData.Email,
            cc: ccEmail,
            subject: rowData["Email Subject"],
            html: `
                ${rowData["Email - Name"]}
                <p>${rowData["Email - Body"]}</p>
                <p>${rowData["Email - Sign"]}</p>
            `,
            attachments: [
                {
                    filename: `${rowData['Receipt No']} ${rowData['Name']} ${rowData['Amount Received']}`,
                    path: path.join(__dirname, process.env.OUTPUT_PDF_PATH_FOR_RAKSHA),
                    contentType: 'application/pdf'
                }
            ]
        };

        // Send email with PDF attachment
        await transporter.sendMail(mailOptions);
    } catch (error) {
        logger.error(error);
        throw new Error('Error while sending mail. Please connect to your developers.');
    }
};

async function appendTextToPDF(pdfDoc, contents) {
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    contents.forEach((content) => {
        if (content) {
            pdfDoc.getPages()[content.pageNo]?.drawText(content.text, {
                x: content.x,
                y: content.y,
                size: content.size,
                font: content.bold ? boldFont : regularFont,
                color: content.color,
            });
        }
    });
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}

const helper = async (data) => {
    try {
        const existingPdfBytes = fs.readFileSync(path.join(__dirname, process.env.INPUT_PDF_PATH_FOR_RAKSHA));
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        let addOn = 0;
        const updatedPdfBytes = await appendTextToPDF(pdfDoc, [
            {
                text: data["Receipt No"].toString(),
                pageNo: 0,
                x: 428,
                y: 560,
                size: 12,
            },
            {
                text: data["Today’s Date"],
                pageNo: 0,
                x: 395,
                y: 539,
                size: 12,
            },
            {
                text: "Name:",
                pageNo: 0,
                x: 75,
                y: 500,
                bold: true,
                size: 12,
            },
            {
                text: data["Name"],
                pageNo: 0,
                x: 118,
                y: 500,
                size: 12,
            },
            {
                text: "Address:",
                pageNo: 0,
                x: 75,
                y: 482,
                bold: true,
                size: 12,
            },

            {
                text: data["Address"],
                pageNo: 0,
                x: 130,
                y: 482,
                size: 12,
            },
            (
                data['RemainingAddress'] && {
                    text: data["RemainingAddress"],
                    pageNo: 0,
                    x: 130,
                    y: 482 + (addOn -= 18),
                    size: 12
                }
            ),
            {
                text: "PAN:",
                pageNo: 0,
                x: 75,
                y: 464 + addOn,
                bold: true,
                size: 12,
            },
            {
                text: data["PAN"],
                pageNo: 0,
                x: 108,
                y: 464 + addOn,
                size: 12,
            },
            {
                text: "Amount Received:",
                pageNo: 0,
                x: 75,
                y: 446 + addOn,
                bold: true,
                size: 12,
            },
            {
                text: data['Amount Received'],
                pageNo: 0,
                x: 183,
                y: 446 + addOn,
                size: 12,
            },
            (
                data['Remaining Amount Received'] && {
                    text: data["Remaining Amount Received"],
                    pageNo: 0,
                    x: 183,
                    y: 446 + (addOn -= 18),
                    size: 12
                }
            ),
            {
                text: "Mode of Payment:",
                pageNo: 0,
                x: 75,
                y: 428 + addOn,
                bold: true,
                size: 12,
            },
            {
                text: data["Mode of Payment"],
                pageNo: 0,
                x: 182,
                y: 428 + addOn,
                size: 12,
            },
            {
                text: "Cheque/CC/Reference Number:",
                pageNo: 0,
                x: 75,
                y: 410 + addOn,
                bold: true,
                size: 12,
            },
            {
                text: data["Check/CC/Reference Number"],
                pageNo: 0,
                x: 260,
                y: 410 + addOn,
                size: 12,
            },
            {
                text: "This donation has gone towards:",
                pageNo: 0,
                x: 75,
                y: 392 + addOn,
                bold: true,
                size: 12,
            },
            {
                text: data["This donation has gone towards"],
                pageNo: 0,
                x: 270,
                y: 392 + addOn,
                size: 12,
            }
        ]);

        // Write the updated PDF bytes to a new file
        fs.writeFileSync(path.join(__dirname, process.env.OUTPUT_PDF_PATH_FOR_RAKSHA), updatedPdfBytes);
    } catch (error) {
        logger.error(error);
        throw new Error('Internval Server Error!');
    }
}
