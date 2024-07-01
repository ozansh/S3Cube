import axios from "axios";

export const CreateBackup = async (
  name,
  namespaces,
  deployments,
  bucket,
  includeVolumes
) => {
  try {
    const response = await axios.post("/backup", {
      name,
      namespaces,
      deployments,
      bucket,
      includeVolumes,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};

export const GetAllBackups = async () => {
  try {
    const response = await axios.get("/backups?bucket=all");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const DeleteBackup = async (name) => {
  try {
    const response = await axios.delete(`/backup/${name}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};

export const ListAllBackupsInBucket = async (bucketID) => {
  try {
    const response = await axios.get(`/buckets/${bucketID}/backups`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
