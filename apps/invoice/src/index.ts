import fs from "node:fs";

import easyinvoice, { type InvoiceData } from "easyinvoice";

// Only Update these values
const forYogi = false;
const month = "11";
const year = "2024";

const amountPerAccount = 190;
const accounts = [""];
const numberOfAccountsPerDay = accounts.length / 30;
// Only Update these values
const data: InvoiceData = {
  apiKey: "PntktbOaJHXsR5272jJImlN5KW6RbXp0KL646ojBoM2SS5Set5Yh45pPPJ3DrON9",
  mode: "production",
  images: {
    logo: forYogi
      ? "https://i.ibb.co/Jzbx6Kn/image.png"
      : "https://i.ibb.co/6Z7krrd/image.png"
  },
  sender: {
    company: forYogi ? "Yoginth" : "Sagar",
    address: `HD-${forYogi ? "322" : "323"}, WeWork Latitude, 10th floor, RMZ Latitude Commercial, Bellary Road, Hebbal, Near Godrej Apt`,
    zip: "560024",
    city: "Bangalore, Karnataka",
    country: "India"
  },
  client: {
    company: `GSTIN: ${forYogi ? "29AYKPY4219R1Z8" : "29JZXPS2474H1Z6"}`,
    address: "Consolidated Invoice for All Users",
    zip: "Worldwide"
  },
  translate: { number: "Invoice Number" },
  settings: {
    currency: "INR",
    taxNotation: "GST",
    marginTop: 25,
    marginRight: 25,
    marginLeft: 25,
    marginBottom: 25
  }
};

const generateInvoice = async () => {
  for (const invoiceNumber of Array.from({ length: 30 }, (_, i) => i + 1)) {
    const accountsForThisInvoice = accounts.slice(
      invoiceNumber * numberOfAccountsPerDay,
      (invoiceNumber + 1) * numberOfAccountsPerDay
    );

    const injectedData = {
      ...data,
      products: accountsForThisInvoice.map((account) => ({
        description: `Hey Account for ${account}`,
        price: amountPerAccount,
        quantity: "1"
      })),
      information: {
        number: `${month}${year}${invoiceNumber.toString()}`,
        dueDate: `${invoiceNumber}/${month}/${year}`
      }
    };

    const currentInvoiceNumber = invoiceNumber;

    try {
      const result = await easyinvoice.createInvoice(injectedData);
      const pdfBuffer = Buffer.from(result.pdf, "base64");
      fs.writeFileSync(`generated/${currentInvoiceNumber}.pdf`, pdfBuffer);
      console.log(`Generated invoice ${currentInvoiceNumber}`);
    } catch (error) {
      console.error(`Error generating invoice ${currentInvoiceNumber}:`, error);
    }
  }
};

generateInvoice();
