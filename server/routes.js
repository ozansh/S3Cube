const express = require("express");
const bucketModule = require("./modules/bucket");
const backupModule = require("./modules/backup");
const restoreModule = require("./modules/restore");
const scheduleModule = require("./modules/schedule");
const stateModule = require("./modules/state");

const { createBucket, listBuckets, listBackupsInBucket, deleteBucket } = require('./modules/bucket');

const router = express.Router();

// Bucket routes
router.post('/buckets', (req, res) => {
  const bucketConfig = req.body;
  console.log('Received Request:', JSON.stringify(bucketConfig, null, 2));  

  const { provider, bucketName, credentials } = bucketConfig;
  console.log('Provider:', provider);  
  console.log('Bucket Name:', bucketName);  
  console.log('Credentials:', credentials);  

  if (!provider || !bucketName || !credentials) {
    return res.status(400).send({ error: 'Missing required fields: provider, bucketName, credentials' });
  }

  createBucket(bucketConfig)
    .then(result => {
      console.log('Bucket creation result:', result);  
      res.status(200).send(result);
    })
    .catch(error => {
      console.error('Bucket creation error:', error);  
      res.status(500).send({ error: error.message });
    });
});


router.get("/buckets", async (req, res) => {
  try {
    const result = await bucketModule.listBuckets();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

router.delete("/buckets/:bucketId", async (req, res) => {
  const { bucketId } = req.params;
  console.log(`Received DELETE request for bucket: ${bucketId}`); // Gelen isteği loglayın
  try {
    const result = await bucketModule.deleteBucket(bucketId);
    res.json({ message: "Bucket deleted successfully", result });
  } catch (error) {
    console.error(`Error deleting bucket: ${error}`); // Hata loglama
    res.status(500).json({ error: error.toString() });
  }
});

router.post("/backup", async (req, res) => {
  const { name, namespaces, deployments, bucket, includeVolumes } = req.body;
  try {
    const result = await backupModule.createBackup(
      name,
      namespaces,
      deployments,
      bucket,
      includeVolumes
    );
    res.json({ message: "Backup created successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

router.get('/backups', async (req, res) => {
  const bucket = req.query.bucket ? req.query.bucket.toLowerCase() : null;

  if (!bucket) {
    return res.status(400).json({ error: 'Bucket is required' });
  }

  try {
    let backups = [];
    if (bucket === 'all') {
      backups = await backupModule.listBackups();
    } else {
      backups = await bucketModule.listBackupsInBucket(bucket);
    }

    res.json(backups);
  } catch (error) {
    console.error(`Error in /backups route: ${error}`); // Hata loglama
    res.status(500).json({ error: error.toString() });
  }
});


router.delete("/backup/:name", async (req, res) => {
  const { name } = req.params;
  console.log(`Received DELETE request for backup: ${name}`); // Gelen isteği loglayın
  try {
    const result = await backupModule.deleteBackup(name);
    res.json({ message: "Backup deleted successfully", result });
  } catch (error) {
    console.error(`Error deleting backup: ${error}`); // Hata loglama
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/backup/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const details = await backupModule.describeBackup(name);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Restore routes
router.post("/restore", async (req, res) => {
  const { backupName } = req.body;
  try {
    const result = await restoreModule.restoreBackup(backupName);
    res.json({ message: "Restore started successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});
router.delete('/restore/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const result = await restoreModule.deleteRestore(name);
    res.json({ message: 'Restore deleted successfully', result });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Schedule routes
router.post("/schedule", async (req, res) => {
  const { name, schedule, namespaces, deployments, bucket, includeVolumes } =
    req.body;
  try {
    const result = await scheduleModule.createSchedule(
      name,
      schedule,
      namespaces,
      deployments,
      bucket,
      includeVolumes
    );
    res.json({ message: "Schedule created successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/schedules", async (req, res) => {
  try {
    const schedules = await scheduleModule.listSchedules();
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

router.delete("/schedule/:name", async (req, res) => {
  const { name } = req.params;
  console.log(`Received DELETE request for schedule: ${name}`); // Gelen isteği loglayın
  try {
    const result = await scheduleModule.deleteSchedule(name);
    res.json({ message: "Schedule deleted successfully", result });
  } catch (error) {
    console.error(`Error deleting schedule: ${error}`); // Hata loglama
    res.status(500).json({ error: error.toString() });
  }
});
router.post("/schedule/run", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await scheduleModule.runSchedule(name);
    res.json({ message: "Schedule run successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// State routes
router.get("/state/namespaces", async (req, res) => {
  try {
    const namespaces = await stateModule.getNamespaces();
    res.json(namespaces);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/state/pods", async (req, res) => {
  try {
    const pods = await stateModule.getPods();
    res.json(pods);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// state routes
router.get("/state/deployments", async (req, res) => {
  try {
    const deployments = await stateModule.getDeployments();
    res.json(deployments);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});
router.get("/state/services", async (req, res) => {
  try {
    const services = await stateModule.getServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});
module.exports = router;
