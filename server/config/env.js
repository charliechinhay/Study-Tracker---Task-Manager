// Variables required for the application to run correctly
const REQUIRED = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLIENT_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "RESEND_API_KEY",
];

const REQUIRED_IN_PRODUCTION = ["GOOGLE_CALLBACK_URL"];

const MIN_JWT_SECRET_LENGTH = 32;

// return names of missing environment variables and warnings
export const checkEnv = (env = process.env) => {
  const isProduction = env.NODE_ENV === "production";
  const names = isProduction ? [...REQUIRED, ...REQUIRED_IN_PRODUCTION] : REQUIRED;

  const missing = names.filter((name) => !env[name]?.trim());

  const warnings = [];
  if (isProduction && env.JWT_SECRET && env.JWT_SECRET.length < MIN_JWT_SECRET_LENGTH) {
    warnings.push(`JWT_SECRET should be at least ${MIN_JWT_SECRET_LENGTH} characters long`);
  }

  return { missing, warnings };
};

// check and validate environment variables at startup
export const validateEnv = () => {
  const { missing, warnings } = checkEnv();

  warnings.forEach((warning) => console.warn(`[env] ${warning}`));

  if (missing.length > 0) {
    console.error(`[env] Missing environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
};