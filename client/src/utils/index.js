import axios from "axios";

export const HumanReadableDate = (dateString) => {
  const date = new Date(dateString);
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  // IF NaN return empty string
  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    isNaN(day) ||
    isNaN(month) ||
    isNaN(year)
  ) {
    return "-";
  }
  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

export const GetNamespaces = async () => {
  try {
    const response = await axios.get("/state/namespaces");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const GetDeployments = async () => {
  try {
    const response = await axios.get("/state/deployments");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const GetServices = async () => {
  try {
    const response = await axios.get("/state/services");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const GetPods = async () => {
  try {
    const response = await axios.get("/state/pods");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
