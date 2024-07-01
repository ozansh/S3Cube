const { exec } = require('child_process');

const getNamespaces = () => {
  return new Promise((resolve, reject) => {
    exec('kubectl get namespaces -o json', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return reject(stderr);
      }
      try {
        const output = JSON.parse(stdout);
        const namespaces = output.items ? output.items : (Array.isArray(output) ? output : [output]);

        const namespaceList = namespaces.map(ns => ({
          name: ns.metadata.name,
          status: ns.status.phase
        }));

        resolve(namespaceList);
      } catch (parseError) {
        console.error(`parse error: ${parseError}`);
        return reject(parseError);
      }
    });
  });
};


const getPods = () => {
  return new Promise((resolve, reject) => {
    exec('kubectl get pods --all-namespaces -o json', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return reject(stderr);
      }
      try {
        const output = JSON.parse(stdout);
        const pods = output.items ? output.items : (Array.isArray(output) ? output : [output]);

        const podList = pods.map(pod => ({
          name: pod.metadata.name,
          namespace: pod.metadata.namespace,
          nodeName: pod.spec.nodeName,
          status: pod.status.phase,
          startTime: pod.status.startTime
        }));

        resolve(podList);
      } catch (parseError) {
        console.error(`parse error: ${parseError}`);
        return reject(parseError);
      }
    });
  });
};


const getDeployments = () => {
  return new Promise((resolve, reject) => {
    exec('kubectl get deployments --all-namespaces -o json', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return reject(stderr);
      }
      try {
        const output = JSON.parse(stdout);
        const deployments = output.items ? output.items : (Array.isArray(output) ? output : [output]);

        const deploymentList = deployments.map(dep => ({
          name: dep.metadata.name,
          namespace: dep.metadata.namespace,
          replicas: dep.spec.replicas,
          availableReplicas: dep.status.availableReplicas,
          unavailableReplicas: dep.status.unavailableReplicas
        }));

        resolve(deploymentList);
      } catch (parseError) {
        console.error(`parse error: ${parseError}`);
        return reject(parseError);
      }
    });
  });
};



const getServices = () => {
  return new Promise((resolve, reject) => {
    exec('kubectl get services --all-namespaces -o json', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return reject(stderr);
      }
      try {
        const output = JSON.parse(stdout);
        const services = output.items ? output.items : (Array.isArray(output) ? output : [output]);

        const serviceList = services.map(svc => ({
          name: svc.metadata.name,
          namespace: svc.metadata.namespace,
          type: svc.spec.type,
          clusterIP: svc.spec.clusterIP,
          externalIPs: svc.spec.externalIPs
        }));

        resolve(serviceList);
      } catch (parseError) {
        console.error(`parse error: ${parseError}`);
        return reject(parseError);
      }
    });
  });
};


module.exports = {
  getNamespaces,
  getPods,
  getDeployments,
  getServices
};
