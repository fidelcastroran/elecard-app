export const getDateFromTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

export const getFileConversion = (fileSize) => {
  var i = fileSize === 0 ? 0 : Math.floor(Math.log(fileSize) / Math.log(1024));
  return (
    (fileSize / Math.pow(1024, i)).toFixed(2) * 1 +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  );
};
