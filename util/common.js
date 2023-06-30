/**
 * Get array of objects with certain keys only
 */
const extractKeys = (
  argObject,
  desiredKeysArr = ["id", "_id"],
  { shortKeys = true, removeAssociatedColumns = true }
) => {
  return desiredKeysArr.reduce((accum, k) => {
    if (!argObject.hasOwnProperty(k)) return accum;
    if (!desiredKeysArr.includes(k)) return accum;
    if (removeAssociatedColumns && k.includes(".")) return accum;

    const key = shortKeys ? k.split(".").at(-1) : k;
    accum[key] = argObject[k];

    return accum;
  }, {});
};

const dateToTimeStampString = (dateString, haveAt = true) => {
  if (dateString) {
    const date = new Date(dateString);
    const options = {
      year: "2-digit",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
    };

    let dateList = new Intl.DateTimeFormat("en-IN", options)
      .format(date)
      .split("-");

    dateList = dateList.map((val) => {
      if (val.includes("am") || val.includes("pm")) return val.toUpperCase();
      return val;
    });

    if (haveAt) {
      return dateList.join(" ").split(",").join(" at");
    }
    return dateList.join(" ");
  }
  return "";
};

const crypto = require("crypto");
const SERVER_SALT_DEFAULT = "serverSaltXYZ_default_2elh21yxer2lbr6734r";

const generateHash = (email, password, salt = SERVER_SALT_DEFAULT) => {
  const hash = crypto
    .createHash("sha256")
    .update(`${email}:${password}:${salt}`)
    .digest("hex");
  return hash;
};

const checkIfHashCreatedByServer = (
  hashToTest,
  email,
  password,
  salt = SERVER_SALT_DEFAULT
) => {
  const hashCreatedByServer = crypto
    .createHash("sha256")
    .update(`${email}:${password}:${salt}`)
    .digest("hex");

  return hashCreatedByServer === hashToTest;
};

module.exports = {
  extractKeys,
  dateToTimeStampString,
  generateHash,
  checkIfHashCreatedByServer,
};
