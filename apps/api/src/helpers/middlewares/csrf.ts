import helmet from "helmet";

const csrfProtection = helmet.csrf();

export default csrfProtection;
