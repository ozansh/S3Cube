const { exec } = require('child_process');

const createBackup = (name, namespaces, deployments, bucket, includeSnapshots) => {
  return new Promise((resolve, reject) => {
    const namespaceString = namespaces.join(',');
    const deploymentString = deployments.map(dep => `deployment/${dep}`).join(',');
    const volumeOption = includeSnapshots ? '--snapshot-volumes=true' : '--snapshot-volumes=false';
    const resources = includeSnapshots ? 'pods,pv,pvc,deployments,services' : 'pods,deployments,services';
    const command = `velero backup create ${name} --include-namespaces ${namespaceString} --include-resources ${resources} ${volumeOption} --storage-location ${bucket}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(stderr);
      }
      resolve(stdout);
    });
  });
};


const listBackups = () => {
  return new Promise((resolve, reject) => {
    exec('velero backup get -o json', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return reject(stderr);
      }
      try {
        const output = JSON.parse(stdout);

        // items alanı olmadığında boş bir dizi döndür
        const items = output.items ? output.items : (Array.isArray(output) ? output : [output]);

        const backups = items.map(backup => ({
          name: backup.metadata.name,
          bucket: backup.spec.storageLocation,
          created_at: backup.metadata.creationTimestamp,
          hasPersistentVolumes: backup.spec.snapshotVolumes === true
        }));

        resolve(backups);
      } catch (parseError) {
        console.error(`parse error: ${parseError}`);
        return reject(parseError);
      }
    });
  });
};



const deleteBackup = (name) => {
  return new Promise((resolve, reject) => {
    const deleteBackupCommand = `kubectl delete backup ${name} -n velero --force --grace-period=0`;
    const deleteRestoresCommand = `kubectl delete restore -l velero.io/backup-name=${name} -n velero --force --grace-period=0`;

    console.log(`Executing command: ${deleteBackupCommand}`);
    console.log(`Executing command: ${deleteRestoresCommand}`);

    exec(deleteBackupCommand, (backupError, backupStdout, backupStderr) => {
      if (backupError) {
        console.error(`exec error: ${backupError}`);
        return reject(backupStderr);
      }
      console.log(`Backup delete command output: ${backupStdout}`);

      exec(deleteRestoresCommand, (restoreError, restoreStdout, restoreStderr) => {
        if (restoreError) {
          console.error(`exec error: ${restoreError}`);
          return reject(restoreStderr);
        }
        console.log(`Restores delete command output: ${restoreStdout}`);
        resolve({ message: `Backup ${name} and associated restores deleted successfully.` });
      });
    });
  });
};

function stripAnsi(str) {
  const ansiRegex = /\u001b\[.*?m/g;
  return str.replace(ansiRegex, '');
}

function describeBackup(name) {
  return new Promise((resolve, reject) => {
    exec(`velero backup describe ${name}`, (error, stdout, stderr) => {
      if (error) {
        return reject(`exec error: ${error}`);
      }

      const output = stdout.split('\n');
      const backupDetails = {
        backupName: '',
        includedNamespaces: '',
        includedResources: '',
        storageLocation: '',
        hasPersistentVolumes: ''
      };

      output.forEach(line => {
        const cleanLine = stripAnsi(line);
        if (cleanLine.startsWith('Name:')) {
          backupDetails.backupName = cleanLine.split(':')[1].trim();
        }
        if (cleanLine.startsWith('  Included:') && output[output.indexOf(line) - 1].startsWith('Namespaces:')) {
          backupDetails.includedNamespaces = cleanLine.split(':')[1].trim();
        }
        if (cleanLine.startsWith('  Included:') && output[output.indexOf(line) - 1].startsWith('Resources:')) {
          backupDetails.includedResources = cleanLine.split(':')[1].trim();
        }
        if (cleanLine.startsWith('Storage Location:')) {
          backupDetails.storageLocation = cleanLine.split(':')[1].trim();
        }
        if (cleanLine.startsWith('Velero-Native Snapshot PVs:')) {
          backupDetails.hasPersistentVolumes = cleanLine.split(':')[1].trim() === 'true';
        }
      });

      resolve(backupDetails);
    });
  });
}
module.exports = {
  createBackup,
  listBackups,
  deleteBackup,
  describeBackup
};
