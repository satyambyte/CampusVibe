const ACCOUNTS_KEY = "campusvibe_accounts";
const SESSION_KEY = "campusvibe_session";
const PASSWORD_ITERATIONS = 150_000;

function readAccounts() {
  try {
    const saved = localStorage.getItem(ACCOUNTS_KEY);
    if (!saved) return [];

    const accounts = JSON.parse(saved);
    if (!Array.isArray(accounts)) {
      return [];
    }
    return accounts;
  } catch {
    return [];
  }
}

function toHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function fromHex(value) {
  if (!value || typeof value !== "string") return new Uint8Array();
  return Uint8Array.from(value.match(/.{1,2}/g) || [], (byte) =>
    Number.parseInt(byte, 16)
  );
}

async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Secure password hashing is unavailable in this browser context.");
  }

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PASSWORD_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  return toHex(new Uint8Array(hash));
}

function createProfile(account) {
  return {
    name: account.name,
    email: account.email,
    createdAt: account.createdAt || new Date().toISOString(),
  };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  return Boolean(email && EMAIL_REGEX.test(email.trim()));
}

export function getCurrentLocalUser() {
  try {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) return null;

    const account = readAccounts().find((item) => item.email === email);
    if (!account) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return createProfile(account);
  } catch {
    return null;
  }
}

export function checkEmailExists(email) {
  if (!email) return false;
  const normalizedEmail = email.trim().toLowerCase();
  return readAccounts().some((account) => account.email === normalizedEmail);
}

export async function createLocalAccount({ name, email, password }) {
  if (!name || !name.trim()) {
    throw new Error("Enter your full name to create an account.");
  }

  const normalizedEmail = (email || "").trim().toLowerCase();
  if (!validateEmail(normalizedEmail)) {
    throw new Error("Please enter a valid email address (e.g. name@example.com).");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  const accounts = readAccounts();

  if (accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error("An account with this email already exists. Sign in instead.");
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordHash = await hashPassword(password, salt);
  const account = {
    name: name.trim(),
    email: normalizedEmail,
    salt: toHex(salt),
    passwordHash,
    iterations: PASSWORD_ITERATIONS,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]));
  localStorage.setItem(SESSION_KEY, normalizedEmail);
  return createProfile(account);
}

export async function signInLocalAccount({ email, password }) {
  const normalizedEmail = (email || "").trim().toLowerCase();
  if (!normalizedEmail) {
    throw new Error("Please enter your email address.");
  }
  if (!password) {
    throw new Error("Please enter your password.");
  }

  const accounts = readAccounts();
  const account = accounts.find((item) => item.email === normalizedEmail);

  if (!account) {
    throw new Error("No account found for this email. Create an account first.");
  }

  const salt = fromHex(account.salt);
  const passwordHash = await hashPassword(password, salt);
  if (passwordHash !== account.passwordHash) {
    throw new Error("Incorrect email or password. Please try again.");
  }

  localStorage.setItem(SESSION_KEY, normalizedEmail);
  return createProfile(account);
}

export async function resetLocalPassword({ email, newPassword }) {
  const normalizedEmail = (email || "").trim().toLowerCase();
  if (!validateEmail(normalizedEmail)) {
    throw new Error("Please enter a valid email address.");
  }

  if (!newPassword || newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters long.");
  }

  const accounts = readAccounts();
  const accountIndex = accounts.findIndex((item) => item.email === normalizedEmail);

  if (accountIndex === -1) {
    throw new Error("No account found with this email. Please create an account first.");
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordHash = await hashPassword(newPassword, salt);

  accounts[accountIndex] = {
    ...accounts[accountIndex],
    salt: toHex(salt),
    passwordHash,
    iterations: PASSWORD_ITERATIONS,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  localStorage.setItem(SESSION_KEY, normalizedEmail);
  return createProfile(accounts[accountIndex]);
}

export function signOutLocalAccount() {
  localStorage.removeItem(SESSION_KEY);
}
