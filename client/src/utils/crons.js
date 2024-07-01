import axios from "axios";

export const CreateCronBackup = async (
  name,
  namespaces,
  deployments,
  bucket,
  includeVolumes,
  schedule
) => {
  try {
    const response = await axios.post("/cron", {
      name,
      namespaces,
      deployments,
      bucket,
      includeVolumes,
      schedule,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};

export const TriggerCronBackup = async (name) => {
  try {
    const response = await axios.post(`/schedule/run`, {
      name,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};

export const GetAllCronBackups = async () => {
  try {
    const response = await axios.get("/schedules");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const DeleteCronBackup = async (name) => {
  try {
    const response = await axios.delete(`/schedule/${name}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};
