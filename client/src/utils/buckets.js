import axios from "axios";

export const GetAllBuckets = async () => {
  try {
    const response = await axios.get("/buckets");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const CreateBucket = async (
  name,
  bucketName,
  access_key,
  secret_key
) => {
  try {
    const response = await axios.post("/bucket", {
      name: name,
      bucketName: bucketName,
      credentials: {
        access_key: access_key,
        secret_key: secret_key,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};

export const DeleteBucket = async (id) => {
  try {
    const response = await axios.delete(`/bucket/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};

export const GetBackupsFromSpesificBucekt = async (bucket) => {
  try {
    const response = await axios.get(`/backups?bucket=${bucket}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
