const { exec } = require('child_process');


const createSchedule = (name, schedule, namespaces, deployments, bucket, includeVolumes) => {
  return new Promise((resolve, reject) => {
    const namespaceString = namespaces.join(',');
    const deploymentString = deployments.map(dep => `deployment/${dep}`).join(',');
    const volumeOption = includeVolumes ? '--snapshot-volumes=true' : '--snapshot-volumes=false';
    const resources = includeVolumes ? 'pods,pv,pvc,deployments,services' : 'pods,deployments,services';
    const command = `velero create schedule ${name} --schedule="${schedule}" --include-namespaces ${namespaceString} --include-resources ${resources} ${volumeOption} --storage-location ${bucket}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(stderr);
      }
      resolve(stdout);
    });
  });
};

const listSchedules = () => {
  return new Promise((resolve, reject) => {
    exec('velero get schedules -o json', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return reject(stderr);
      }
      try {
        const output = JSON.parse(stdout);
        console.log(output);
        const items = output.items ? output.items : (Array.isArray(output) ? output : [output]);

        const scheduleList = items.map(schedule => ({
          name: schedule.metadata.name,
          namespace: schedule.metadata.namespace,
          creationTimestamp: schedule.metadata.creationTimestamp,
          schedule: schedule.spec.schedule,
          includedNamespaces: schedule.spec.template.includedNamespaces,
          includedResources: schedule.spec.template.includedResources,
          storageLocation: schedule.spec.template.storageLocation,
          phase: schedule.status.phase,
          lastBackup: schedule.status.lastBackup
        }));
        
        resolve(scheduleList);
      } catch (parseError) {
        console.error(`parse error: ${parseError}`);
        return reject(parseError);
      }
    });
  });
};
const deleteSchedule = (name) => {
  return new Promise((resolve, reject) => {
    console.log(`Executing command: velero delete schedule ${name} -y`); 
    const command = `velero delete schedule ${name} --confirm`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(stderr);
      }
      console.log(`Command output: ${stdout}`); 
      resolve(stdout);
    });
  });
};

const runSchedule = (name) => {
  return new Promise((resolve, reject) => {
    const command = `velero backup create --from-schedule ${name}`;
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
  listSchedules,
  createSchedule,
  deleteSchedule,
  runSchedule
};
