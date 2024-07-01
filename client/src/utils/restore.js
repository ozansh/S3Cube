import axios from "axios";

export const Restore = async (backupName) => {
  setRestoreStatus("waiting");
  try {
    const response = await axios.post(`/restore`, {
      backupName: backupName,
    });

    if (response.data.error) {
      console.error(response.data.error);
      setRestoreStatus("error");
      return;
    }

    setRestoreStatus("success");
  } catch (error) {
    setRestoreStatus("error");
    console.error(error);
  }
};
