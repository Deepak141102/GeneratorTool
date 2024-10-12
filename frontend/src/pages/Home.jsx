import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../barabari_logo.png";
import styles from "./Home.module.scss";
import Input from "../components/Input/Input";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { LuListStart } from "react-icons/lu";
import { LuListEnd } from "react-icons/lu";
import Lottie from "react-lottie-player";
import loaderAnimation from "../assets/lottie/loaderAnimation.json";
import classNames from "classnames";
import MultiEmailInput from "../components/MultiEmailInput/MultiEmailInput";
import encryptData from "../utils/encryptData";
// import linkedIn from "./assets/linkedIn.png";
// import instagram from "./assets/instagram.png"

// type InputState = {
//     starting: number | "";
//     ending: number | "";
//     email: string;
//     password: string;
//     ccEmails: string[];
//     file: File | null;
//     fileName: string;
// };

// type ErrorState = {
//     emailError: string;
//     passwordError: string;
//     startingError: string;
//     endingError: string;
// };

// type InputAction =
//     | {
//         type: "SET_FIELD";
//         field: keyof Omit<InputState, "ccEmails">;
//         value: string | number | File | null;
//     }
//     | { type: "SET_CC_EMAILS"; value: string[] }
//     | { type: "SET_FILE"; value: File | null; fileName: string }
//     | { type: "CLEAR_INPUTS" };

// type ErrorAction =
//     | { type: "SET_ERROR"; field: keyof ErrorState; value: string }
//     | { type: "CLEAR_ERRORS" };

const initialInputState = {
    starting: "",
    ending: "",
    email: "",
    password: "",
    ccEmails: [],
    file: null,
    fileName: "",
};

const initialErrorState = {
    emailError: "",
    passwordError: "",
    startingError: "",
    endingError: "",
};

const inputReducer = (state, action) => {
    switch (action.type) {
        case "SET_FIELD":
            return {
                ...state,
                [action.field]: action.value,
            };
        case "SET_CC_EMAILS":
            return {
                ...state,
                ccEmails: action.value,
            };
        case "SET_FILE":
            return {
                ...state,
                file: action.value,
                fileName: action.fileName,
            };
        case "CLEAR_INPUTS":
            return initialInputState;
        default:
            return state;
    }
};

const errorReducer = (state, action) => {
    switch (action.type) {
        case "SET_ERROR":
            return {
                ...state,
                [action.field]: action.value,
            };
        case "CLEAR_ERRORS":
            return initialErrorState;
        default:
            return state;
    }
};

const Home = () => {

    const [inputState, dispatchInput] = useReducer(
        inputReducer,
        initialInputState
    );

    const [errorState, dispatchError] = useReducer(
        errorReducer,
        initialErrorState
    );

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const awakeServer = async () => {
            try {
                await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/health`, {
                    withCredentials: true,
                });
            } catch (error) {
                toast.error("Internal Server Error | please contact to developers");
            }
        };
        awakeServer();
    }, []);

    const handleInputBlur = (fieldName) => {
        validateInput(fieldName);
    };

    const validateInput = (fieldName) => {
        dispatchError({ type: "CLEAR_ERRORS" });
        const value = inputState[fieldName];
        let errorMessage = "";

        // Define variables outside the switch statement
        let starting, ending;

        switch (fieldName) {
            case "email":
                errorMessage =
                    value && !/^\S+@\S+\.\S+$/.test(value)
                        ? "Please provide a valid email address"
                        : "";
                break;
            case "password":
                errorMessage = !value ? "Please provide a valid password" : "";
                break;
            case "starting":
                starting = parseInt(value, 10);
                errorMessage =
                    !value || starting < 1
                        ? "Please provide a valid starting row number"
                        : "";
                break;
            case "ending":
                ending = parseInt(value, 10);
                errorMessage =
                    !value || ending < 1 || ending < parseInt(inputState.starting, 10)
                        ? "Please provide a valid ending row number"
                        : "";
                break;
            default:
                break;
        }

        dispatchError({
            type: "SET_ERROR",
            field: `${fieldName}Error`,
            value: errorMessage,
        });
    };

    const handleFileChange = (event) => {
        console.log('we are going to handle file');
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            dispatchInput({ type: "SET_FILE", value: file, fileName: file.name });
        } else {
            console.log('we are here');
        }
    };

    const handleEmailsChange = (emails) => {
        dispatchInput({ type: "SET_CC_EMAILS", value: emails });
    };

    const handleSubmit = async () => {
        if (isLoading) return;
        dispatchError({ type: "CLEAR_ERRORS" });

        const isEmailValid = /^\S+@\S+\.\S+$/.test(inputState.email);
        const starting = parseInt(inputState.starting, 10);
        const ending = parseInt(inputState.ending, 10);

        if (!inputState.email || !isEmailValid) {
            dispatchError({
                type: "SET_ERROR",
                field: "emailError",
                value: "Please provide a valid email address",
            });
            return;
        }
        if (!inputState.password) {
            dispatchError({
                type: "SET_ERROR",
                field: "passwordError",
                value: "Please provide a valid password",
            });
            return;
        }
        if (!starting || starting < 1) {
            dispatchError({
                type: "SET_ERROR",
                field: "startingError",
                value: "Please provide a valid starting row number",
            });
            return;
        }
        if (!ending || ending < 1) {
            dispatchError({
                type: "SET_ERROR",
                field: "endingError",
                value: "Please provide a valid ending row number",
            });
            return;
        }
        if (starting > ending) {
            dispatchError({
                type: "SET_ERROR",
                field: "startingError",
                value: "Starting row should be less than the ending row",
            });
            return;
        }
        if (!inputState.file) {
            toast.error("Please select a file");
            return;
        }
        try {
            setIsLoading(true);

            // Read the Excel file
            const data = await inputState.file.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet
                // ,
                //    {
                //   raw: false,  // This ensures dates are parsed to JS date objects
                //   dateNF: 'mm-dd-yyyy',  // Define date format
                // }
            );
            const ExcelDateToJSDate = (date) => {

                let convertedDate = new Date(Math.round((date - 25569) * 864e5));
                const dateString = convertedDate.toDateString().slice(4, 15);  // Extract the date portion
                const dateParts = dateString.split(" ");

                const day = dateParts[1];
                let month = dateParts[0];
                const year = dateParts[2];
                console.log(date);
                console.log(day, month, year);
                // Convert month name to number
                const monthNumber = ("JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3 + 1).toString();
                const paddedMonth = monthNumber.length === 1 ? '0' + monthNumber : monthNumber;

                return `${day}/${paddedMonth}/${year.slice(2, 4)}`;
            };
            const starting = Number(inputState.starting);
            const ending = Number(inputState.ending);
            const selectedRows = jsonData.slice(starting - 2, ending - 1);
            console.log(selectedRows.length);
            console.log(ending - starting + 1);
            if (selectedRows.length == 0 || selectedRows.length != ((ending - starting) + 1)) {
                toast.error('Please Select a valid starting and ending row');
                return;
            }
            jsonData.map((data) => data['Date of Donation'] = ExcelDateToJSDate(data['Date of Donation']));

            const encryptedObj = encryptData({
                startingRowNo: starting,
                endingRowNo: ending,
                email: inputState.email,
                ccEmails: inputState.ccEmails,
                password: inputState.password,
                fileData: selectedRows // Include the Excel data in the payload
            });

            // Making the Axios call

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}`,
                { encryptedData: encryptedObj }, {
                withCredentials: true,
            });

            // // Handle success
            if (response.status === 200) {
                toast.success('Congratulations! The recipes have been sent successfully.');
            }
            else {
                toast.error('Encounter Error in sending mail please connect to the developer'); // error
            }
            dispatchInput({ type: "CLEAR_INPUTS" });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Specific handling for Axios errors
                if (error.response && error.response.data) {
                    toast.error(error.response.data);
                } else {
                    toast.error("Internal Server Error");
                }
            } else {
                console.log(error);
                // General error handling
                toast.error("An unexpected error occurred");
            }
            // console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.appContainer}>
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-600 opacity-90 animate-background" />
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 320">
                    <polygon fill="rgba(255, 255, 255, 0.1)" points="0,320 1440,320 1440,0 0,0" />
                    <polygon fill="rgba(255, 255, 255, 0.15)" points="200,320 1240,160 1440,0 0,160" />
                </svg>
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-purple-700 to-transparent opacity-70 animate-wave" />
            </div>

            <div className={`${styles.formContainer} relative z-10 bg-gray-800 p-10 rounded-xl shadow-xl max-w-lg w-full backdrop-blur-md bg-opacity-60  flex flex-col justify-center items-center space-y-4 mt-[4rem]`}>
                <div className={styles.formBox}>
                    <Input
                        placeholder="Email Id"
                        type="email"
                        name="email"
                        className="input-sec"

                        value={inputState.email}
                        onChange={(e) =>
                            dispatchInput({
                                type: "SET_FIELD",
                                field: "email",
                                value: e.target.value,
                            })
                        }
                        onBlur={() => handleInputBlur("email")}
                        errorMessage={errorState.emailError}
                        icon={<MdEmail />}
                    />
                    <Input
                        placeholder="Password"
                        type="password"
                        name="password"
                        className="input-sec"

                        value={inputState.password}
                        onChange={(e) =>
                            dispatchInput({
                                type: "SET_FIELD",
                                field: "password",
                                value: e.target.value,
                            })
                        }
                        onBlur={() => handleInputBlur("password")}
                        errorMessage={errorState.passwordError}
                        icon={<RiLockPasswordFill />}
                    />
                    <MultiEmailInput
                        ccEmails={inputState.ccEmails}
                        onEmailsChange={handleEmailsChange}
                    />
                    <Input
                        placeholder="Starting Row"
                        type="number"
                        name="starting"
                        className="input-sec"

                        value={inputState.starting}
                        onChange={(e) =>
                            dispatchInput({
                                type: "SET_FIELD",
                                field: "starting",
                                value: parseInt(e.target.value),
                            })
                        }
                        onBlur={() => handleInputBlur("starting")}
                        errorMessage={errorState.startingError}
                        icon={<LuListStart />}
                    />
                    <Input
                        placeholder="Ending Row"
                        className="input-sec"
                        type="number"
                        name="ending"
                        value={inputState.ending}
                        onChange={(e) =>
                            dispatchInput({
                                type: "SET_FIELD",
                                field: "ending",
                                value: parseInt(e.target.value),
                            })
                        }
                        onBlur={() => handleInputBlur("ending")}
                        errorMessage={errorState.endingError}
                        icon={<LuListEnd />}
                    />

                    <div className={styles.fileInputContainer}>
                        {inputState.fileName && (
                            <div className={`${styles.fileName}`}>{inputState.fileName}</div>
                        )}
                        <label htmlFor="file" className="file-label">Upload File</label>
                        <input
                            id="file"
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="file:mr-4 file:py-2 hidden file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 futuristic-file-input"
                        />
                    </div>
                    <button
                        className={classNames(
                            styles.submitButton,
                            isLoading && styles.loading
                        )}
                        onClick={handleSubmit}
                    >
                        {isLoading ? (
                            <Lottie
                                animationData={loaderAnimation}
                                style={{ width: 40, height: 20 }}
                                loop
                                play
                            />
                        ) : (
                            "Submit"
                        )}
                    </button>
                </div>
                <style>{`
            @keyframes background {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
    
            @keyframes wave {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
    
            .animate-background {
                background: linear-gradient(270deg, #3b007f, #0c0e32);
                background-size: 400% 400%;
                animation: background 20s ease infinite;
            }
    
            .animate-wave {
                animation: wave 10s linear infinite;
            }
    
            .input-sec {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                backdrop-filter: blur(15px);
                color: white;
                // padding: 8px;
                border-radius: 12px;
                margin-bottom: 11px;
                box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
                transition: all 0.3s ease;
            }
    
            .input-sec:focus {
                outline: none;
                border-color: #6a00f4;
                box-shadow: 0 0 20px rgba(106, 0, 244, 0.8);
            }
    
            .futuristic-file-text {
                color: rgba(255, 255, 255, 0.8);
            }
    
            .futuristic-file-label {
                color: rgba(255, 255, 255, 0.5);
                transition: color 0.3s ease;
            }
    
            .futuristic-file-label:hover {
                color: rgba(255, 255, 255, 0.9);
            }
    
            .futuristic-button {
                box-shadow: 0 4px 15px rgba(106, 0, 244, 0.4);
            }
    
            .futuristic-button:hover {
                box-shadow: 0 6px 25px rgba(106, 0, 244, 0.6);
            }
    
            .glow-text {
                text-shadow: 0 0 20px rgba(106, 0, 244, 0.7), 0 0 30px rgba(106, 0, 244, 0.5);
            }
        `}</style>
            </div>

            <ToastContainer
                autoClose={7000}
                newestOnTop={true}
                draggable
                theme="light"
            />
        </div>
    );
};

export default Home;
