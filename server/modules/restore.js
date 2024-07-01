const { exec } = require('child_process');

const describeBackup = (backupName) => {
  return new Promise((resolve, reject) => {
    const command = `velero backup describe ${backupName}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(stderr);
      }
      try {
        const backupDetails = stdout;
        resolve(backupDetails);
      } catch (parseError) {
        console.error(`parse error: ${parseError}`);
        reject(parseError);
      }
    });
  });
};

const restoreBackup = (backupName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const command = `velero restore create --from-backup ${backupName}`;
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject(stderr);
        }
        resolve(stdout);
      });
    } catch (error) {
      reject(error);
    }
  });
};


const deleteRestore = (restoreName) => {
  return new Promise((resolve, reject) => {
    const command = `velero restore delete ${restoreName} --confirm`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(stderr);
      }
      resolve(stdout);
    });
  });
};

module.exports = {
  restoreBackup,
  deleteRestore
};