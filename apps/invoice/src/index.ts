import easyinvoice, { type InvoiceData } from "easyinvoice";
import fs from "node:fs";

const forYogi = true;
const month = "1";
const year = "2024";

const lastInvoiceNumber = 1;
const amountPerAccount = 33.87;
const accounts = ["1", "2", "3"];

const data: InvoiceData = {
  apiKey: "PntktbOaJHXsR5272jJImlN5KW6RbXp0KL646ojBoM2SS5Set5Yh45pPPJ3DrON9",
  mode: "production",
  images: { logo: "https://hey-assets.b-cdn.net/images/app-icon/0.png" },
  sender: {
    company: forYogi ? "Yoginth" : "Sagar",
    address: `HD-${forYogi ? "322" : "323"}, WeWork Latitude, 10th floor, RMZ Latitude Commercial, Bellary Road, Hebbal, Near Godrej Apt`,
    zip: "560024",
    city: "Bangalore, Karnataka",
    country: "India"
  },
  translate: { number: "Invoice Number" },
  products: [
    { description: "Hey Account", price: amountPerAccount, quantity: "1" }
  ],
  bottomNotice: `GSTIN: ${forYogi ? "29AYKPY4219R1Z8" : "29JZXPS2474H1Z6"}`,
  settings: {
    currency: "INR",
    taxNotation: "GST",
    marginTop: 25,
    marginRight: 25,
    marginLeft: 25,
    marginBottom: 25
  }
};

const generateInvoice = () => {
  let invoiceNumber = lastInvoiceNumber;
  for (const account of accounts) {
    const dueDate = `${month}/${Math.floor(Math.random() * 30) + 1}/${year}`;

    const injectedData: InvoiceData = {
      ...data,
      client: { company: account },
      information: { number: invoiceNumber.toString(), dueDate }
    };

    easyinvoice.createInvoice(injectedData, (result) => {
      fs.writeFileSync(`${account}.pdf`, result.pdf);
    });

    invoiceNumber++;
  }
};

generateInvoice();
