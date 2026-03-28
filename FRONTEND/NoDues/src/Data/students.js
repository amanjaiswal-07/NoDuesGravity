// import amanId from "../assets/aman_id.jpeg";
// import parthId from "../assets/parth_id.jpeg";
// import sujalId from "../assets/sujal_id.png";
// import btpReport from "../assets/Presentation_D2D.pdf"; // NEW
// import declarationForm from "../assets/Declaration Form.pdf";
// import offerLetter from "../assets/Offer Letter.pdf";
// export const initialPendingStudents = [
//   {
//     id: 1,
//     name: "Aman Jaiswal",
//     roll: "23UEC513",
//     department: "ece",
//     email: "23UEC513@lnmiit.ac.in",
//     phone: "7366973726",
//     idCard: amanId,
//     hostel: "BH3",

//     // NEW (library fields)
//     rfidStatus: "verified",     // dummy: "verified" | "pending"
//     btpReportUrl: btpReport,    // same file for all

//     placementStatus: "PLACED",
//     offerLetterUrl: offerLetter,
//     declarationUrl: null,
//     admissionLetterUrl: null,
//     examScorecardUrl: null,
//     emailSentDate: "2026-02-14",
//   },
//   {
//     id: 2,
//     name: "Parth Nalwaya",
//     roll: "23UEC587",
//     department: "ece",
//     email: "23UEC587@lnmiit.ac.in",
//     phone: "9462474094",
//     idCard: parthId,
//     hostel: "BH1",

//     rfidStatus: "verified",
//     btpReportUrl: btpReport,

//     placementStatus: "PREPARATION_BREAK",
//     offerLetterUrl: null,
//     declarationUrl: declarationForm,
//     admissionLetterUrl: null,
//     examScorecardUrl: null,
//     emailSentDate: "2026-02-10",
//   },
//   {
//     id: 3,
//     name: "Sujal Jain",
//     roll: "23UCS719",
//     department: "cse",
//     email: "23UCS719@lnmiit.ac.in",
//     phone: "8233844269",
//     idCard: sujalId,
//     hostel: "GH",

//     rfidStatus: "pending",
//     btpReportUrl: btpReport,
    
//     placementStatus: "HIGHER_STUDIES_ABROAD",
//     offerLetterUrl: null,
//     declarationUrl: null,
//     admissionLetterUrl: declarationForm, // dummy
//     examScorecardUrl: declarationForm,   // dummy
//     emailSentDate: "2026-02-12",
//   },
// ];
import amanId from "../assets/aman_id.jpeg";
import parthId from "../assets/parth_id.jpeg";
import sujalId from "../assets/sujal_id.png";
import btpReport from "../assets/Presentation_D2D.pdf";
import declarationForm from "../assets/Declaration Form.pdf";
import offerLetter from "../assets/Offer Letter.pdf";

export const initialPendingStudents = [
  {
    id: 1,
    name: "Aman Jaiswal",
    roll: "23UEC513",
    department: "ece",
    email: "23UEC513@lnmiit.ac.in",
    phone: "7366973726",
    idCard: amanId,
    hostel: "BH3",

    rfidStatus: "verified",
    btpReportUrl: btpReport,

    placementStatus: "PLACED",
    offerLetterUrl: offerLetter,
    declarationUrl: null,
    admissionLetterUrl: null,
    examScorecardUrl: null,
    emailSentDate: "2026-02-14",

    clearanceStatus: {
      medical: true,
      sports: true,
      store: false,
      administration: true,
      nad: false,
      accounts: false,
      warden: true,
      placement: true,
      lucs: true,
      library: true,
      labs: true,
      hod: false,
      kundan: true,
    },
  },
  {
    id: 2,
    name: "Parth Nalwaya",
    roll: "23UEC587",
    department: "ece",
    email: "23UEC587@lnmiit.ac.in",
    phone: "9462474094",
    idCard: parthId,
    hostel: "BH1",

    rfidStatus: "verified",
    btpReportUrl: btpReport,

    placementStatus: "PREPARATION_BREAK",
    offerLetterUrl: null,
    declarationUrl: declarationForm,
    admissionLetterUrl: null,
    examScorecardUrl: null,
    emailSentDate: "2026-02-10",

    clearanceStatus: {
      medical: true,
      sports: false,
      store: false,
      administration: true,
      nad: false,
      accounts: false,
      warden: true,
      placement: true,
      lucs: true,
      library: false,
      labs: true,
      hod: false,
      kundan: false,
    },
  },
  {
    id: 3,
    name: "Sujal Jain",
    roll: "23UCS719",
    department: "cse",
    email: "23UCS719@lnmiit.ac.in",
    phone: "8233844269",
    idCard: sujalId,
    hostel: "GH",

    rfidStatus: "pending",
    btpReportUrl: btpReport,

    placementStatus: "HIGHER_STUDIES_ABROAD",
    offerLetterUrl: null,
    declarationUrl: null,
    admissionLetterUrl: declarationForm,
    examScorecardUrl: declarationForm,
    emailSentDate: "2026-02-12",

    clearanceStatus: {
      medical: true,
      sports: true,
      store: true,
      administration: false,
      nad: false,
      accounts: false,
      warden: true,
      placement: true,
      lucs: false,
      library: true,
      labs: false,
      hod: false,
      kundan: false,
    },
  },
];