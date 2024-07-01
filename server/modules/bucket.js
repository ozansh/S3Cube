const { exec } = require('child_process');
const bodyParser = require('body-parser');

const createBucket = ({ provider, bucketName, credentials }) => {
  return new Promise((resolve, reject) => {
    console.log('Provider:', provider); 
    console.log('Bucket Name:', bucketName);
    console.log('Credentials:', credentials); 

    let secretName = `${provider}-credentials-${bucketName}`;
    let secretCommand = '';
    let config = '';

    switch (provider) {
      case 'aws':
        secretCommand = `kubectl create secret generic ${secretName} --from-literal=aws_access_key_id=${credentials.aws_access_key_id} --from-literal=aws_secret_access_key=${credentials.aws_secret_access_key} -n velero`;
        config = `region=${credentials.region}`;
        break;

      case 'azure':
        const azureSecretContent = `
AZURE_SUBSCRIPTION_ID=${credentials.azure_subscription_id}
AZURE_TENANT_ID=${credentials.azure_tenant_id}
AZURE_CLIENT_ID=${credentials.azure_client_id}
AZURE_CLIENT_SECRET=${credentials.azure_client_secret}
AZURE_RESOURCE_GROUP=${credentials.azure_resourceGroup}
AZURE_CLOUD_NAME=AzurePublicCloud`;
        secretCommand = `echo "${azureSecretContent}" | kubectl create secret generic ${secretName} --from-file=cloud=/dev/stdin -n velero`;
        config = `resourceGroup=${credentials.azure_resourceGroup},storageAccount=${credentials.azure_storageAccount}`;
        break;

      case 'gcp':
        const gcpSecretContent = `
{
  "type": "service_account",
  "project_id": "${credentials.gcp_project}",
  "private_key_id": "some-private-key-id",
  "private_key": "${credentials.gcp_private_key.replace(/\\n/g, '\n')}",
  "client_email": "${credentials.gcp_client_email}",
  "client_id": "some-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/${credentials.gcp_client_email}"
}`;
        secretCommand = `echo '${gcpSecretContent}' | kubectl create secret generic ${secretName} --from-file=cloud=/dev/stdin -n velero`;
        config = `project=${credentials.gcp_project}`;
        break;

      default:
        return reject(new Error('Unsupported provider'));
    }

    console.log('Secret Command:', secretCommand);  
    console.log('Config:', config);  

    exec(secretCommand, (secretError, secretStdout, secretStderr) => {
      if (secretError) {
        console.error(`Secret creation error: ${secretError}`);
        return reject(secretStderr);
      }

      console.log('Secret creation success:', secretStdout);  

      const backupCommand = `velero backup-location create ${bucketName} --provider ${provider} --bucket ${bucketName} --config ${config} --credential ${secretName}=cloud`;
      console.log('Backup Command:', backupCommand);  

      exec(backupCommand, (backupError, backupStdout, backupStderr) => {
        if (backupError) {
          console.error(`Backup location creation error: ${backupError}`);
          return reject(backupStderr);
        }
        console.log('Backup location creation success:', backupStdout);  
        resolve(backupStdout);
      });
    });
  });
};
const listBuckets = () => {
  return new Promise((resolve, reject) => {
    exec('velero get backup-locations -o json', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return reject(stderr);
      }
      try {
        const output = JSON.parse(stdout);

        const items = output.items ? output.items : (Array.isArray(output) ? output : [output]);

        const backupLocations = items.map(location => ({
          name: location.metadata.name,
          cloudName: location.spec.objectStorage ? location.spec.objectStorage.bucket : 'N/A',
          provider: location.spec.provider,
          region: location.spec.config ? location.spec.config.region : 'N/A'
        }));

        resolve(backupLocations);
      } catch (parseError) {
        console.error(`parse error: ${parseError}`);
        return reject(parseError);
      }
    });
  });
};



const listBackupsInBucket = (bucketName) => {
  return new Promise((resolve, reject) => {
    exec('velero get backups -o json', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return reject(stderr);
      }
      try {
        const output = JSON.parse(stdout);
        const backups = output.items ? output.items : (Array.isArray(output) ? output : [output]);

        const filteredBackups = backups.filter(backup => backup.spec.storageLocation === bucketName)
          .map(backup => ({
            name: backup.metadata.name,
            namespace: backup.metadata.namespace,
            created: backup.metadata.creationTimestamp,
            storageLocation: backup.spec.storageLocation,
            phase: backup.status.phase
          }));

        resolve(filteredBackups);
      } catch (parseError) {
        console.error(`parse error: ${parseError}`);
        return reject(parseError);
      }
    });
  });
};
const deleteBucket = (bucketName) => {
  return new Promise((resolve, reject) => {
    const command = `velero backup-location delete ${bucketName} --confirm`;
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
  createBucket,
  listBuckets,
  listBackupsInBucket,
  deleteBucket
};
