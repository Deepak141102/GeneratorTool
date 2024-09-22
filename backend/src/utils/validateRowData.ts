// import { RowData } from '../src/interfaces.js';

// Define a function to validate the row data
export function validateRowForSOS(row, rowNumber) {
    // Validate each field
    const requiredFields = [
        'Receipt No',
        'Date of Donation',
        'Donor Name',
        'Donor Email',
        'Amount of Donation',
        'Mode of Payment',
        'Email Subject',
        'Email - Name',
        'Email - Body',
        'Email - Sign',
        'Towards'
    ];

    for (const field of requiredFields) {
        if (row[field] == '') {
            throw new Error(
                `Error processing Row ${rowNumber}: The "${field}" field is empty. Please ensure all required fields are filled in.`
            );
        }
    }
}

export function validateRowForRaksha(row, rowNumber) {
    // Validate each field
    if (
        !row['Receipt No'] ||
        !row['Today’s Date'] ||
        !row['Name'] ||
        !row['Address'] ||
        !row['PAN'] ||
        !row['Email'] ||
        !row['Amount Received'] ||
        !row['Mode of Payment'] ||
        !row['Check/CC/Reference Number'] ||
        !row['This donation has gone towards']
    ) {
        throw new Error(
            'Server Stopped sending mail from Row No :- ' + rowNumber + '\n Reason :- Some fields are empty in Row No :- ' + rowNumber
        );
    }
}