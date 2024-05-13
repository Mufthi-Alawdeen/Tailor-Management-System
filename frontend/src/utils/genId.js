// utils.js
export const generateOrderID = () => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2); // Get last 2 digits of the year
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Get month in 2-digit format
  const day = date.getDate().toString().padStart(2, "0"); // Get day in 2-digit format
  const randomNumber = Math.floor(100 + Math.random() * 900); // Generate a random 3-digit number
  return `${year}${month}${day}MO${randomNumber}`;
};

// utils.js
export const generateUserID = () => {
  const today = new Date();
  const year = today.getFullYear().toString().substr(-2); // Get the last two digits of the year
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
  const userID = `US${randomDigits}`;

  return userID;
};

export const generateRentID = () => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2); // Get last 2 digits of the year
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Get month in 2-digit format
  const day = date.getDate().toString().padStart(2, "0"); // Get day in 2-digit format
  const randomNumber = Math.floor(100 + Math.random() * 900); // Generate a random 3-digit number
  return `${year}${month}${day}MR${randomNumber}`;
};

export const generateTransactionID = () => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
  return `MT${randomNumber}`;
};
