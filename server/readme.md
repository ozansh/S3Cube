# Kurulum

Server dizini içerisindeki **install.sh** dosyasını çalıştırarak sisteminize kurabilirsiniz.
- Başlatmak için: **sudo systemctl start scube**
- Durdurmak için: **sudo systemctl stop scube**
- Durumunu kontrol etmek için: **sudo systemctl status scube**


# API Dokümantasyonu

## Genel Bakış
Bu dokümantasyon, Kubernetes kümesinde yedeklemeleri, geri yüklemeleri,  bucketları,  scheduleları ve durum bilgilerini yönetmek için kullanılan Velero API uç noktalarının bir özetini sunar.

## API Uç Noktaları

### 1. Yedekleme Yönetimi

#### İsim Alanlarını Listele
- **Yöntem**: GET
- **Uç Nokta**: `http://127.0.0.1:3001/api/namespaces`
- **Açıklama**: Kümedeki mevcut isim alanlarını listeler.
- **Geri Dönüşü**:
 ```json
        [
            "default",
            "my-namespace",
            "oracle"
        ]
  ```

#### Yedekleme Oluştur
- **Yöntem**: POST
- **Uç Nokta**: `http://127.0.0.1:3001/api/backup`
- **Açıklama**: Belirtilen isim alanları ve dağıtımlar için bir yedekleme oluşturur.
- **Gövde**:
  ```json
  {
    "name": "backup-name3",
    "namespaces": ["my-namespace"],
    "deployments": [],
    "bucket": "default",
    "includeVolumes": true
  }
  ```

#### Yedeklemeleri Listele
- **Yöntem**: GET
- **Uç Nokta**: `http://127.0.0.1:3001/api/backups`
- **Açıklama**: Mevcut tüm yedeklemeleri listeler.
- **Geri Dönüşü**:
 ```json
        [
    {
        "name": "backup-name3",
        "bucket": "default",
        "created_at": "2024-06-15T10:36:58Z",
        "hasPersistentVolumes": false
    },
    {
        "name": "backup-name4",
        "bucket": "default",
        "created_at": "2024-06-15T10:37:05Z",
        "hasPersistentVolumes": false
    }
]
  ```
#### Yedeklemeyi Sil
- **Yöntem**: DELETE
- **Uç Nokta**: `http://127.0.0.1:3001/api/backup/:name`
- **Açıklama**: Belirtilen adıyla bir yedeklemeyi siler.
- **Yol Değişkeni**:
  - `name`: Silinecek yedeklemenin adı.

#### Yedekleme Detayı YAPILCAK 
- **Yöntem**: GET
- **Uç Nokta**: `http://127.0.0.1:3001/api/backup/:name`
- **Açıklama**: Belirtilen yedeklemenin detaylarını getirir.
- **Yol Değişkeni**:
  - `name`: Yedeklemenin adı.
- **Geri Dönüşü**:
 ```json
{
    "name":"backup-name3",
    "namespace": "velero",
    "includedNamespaces": [],
    "includedResources": [],
    "storageLocation": "default",
    "persistentVolumeClaims": [],
    "hasPersistentVolumes": false
}
  ```

### 2.  Bucket Yönetimi

####  Bucketları Listele
- **Yöntem**: GET
- **Uç Nokta**: `http://127.0.0.1:3001/api/buckets`
- **Açıklama**: Mevcut tüm  bucketları listeler.

####  Bucket Oluştur
- **Yöntem**: POST
- **Uç Nokta**: `http://127.0.0.1:3001/api/buckets`
- **Açıklama**: Yeni bir  bucket oluşturur.
- **Gövde**:
 ```json
     {
      "provider": "azure",
      "bucketName": "azure-01",
      "credentials": {
        "aws_access_key_id": "YOUR_AWS_ACCESS_KEY_ID",
        "aws_secret_access_key": "YOUR_AWS_SECRET_ACCESS_KEY",
        "region": "YOUR_AWS_REGION",
        "azure_client_id": "CLIENT ID",
        "azure_client_secret": "SECRET",
        "azure_tenant_id": "tennant",
        "azure_subscription_id": "sub",
        "azure_resourceGroup": "velero-resource-group",
        "azure_storageAccount": "veleroazure001",
        "gcp_project": "YOUR_GCP_PROJECT",
        "gcp_client_email": "YOUR_GCP_CLIENT_EMAIL",
        "gcp_private_key": "YOUR_GCP_PRIVATE_KEY"
      }
    }
```

####  Bucketdaki Yedeklemeleri Listele
- **Yöntem**: GET
- **Uç Nokta**: `http://127.0.0.1:3001/api/buckets/:bucketId/backups`
- **Açıklama**: Belirtilen  bucketdaki yedeklemeleri listeler.
- **Yol Değişkeni**:
  - `bucketId`:  Bucketnın kimliği.
- **Gövde**:
```json
[
    {
        "name": "backup-name3",
        "namespace": "velero",
        "created": "2024-06-15T10:36:58Z",
        "storageLocation": "default",
        "phase": "Completed"
    },
    {
        "name": "backup-name4",
        "namespace": "velero",
        "created": "2024-06-15T10:37:05Z",
        "storageLocation": "default",
        "phase": "Completed"
    }
]
```

####  Bucket Sil
- **Yöntem**: DELETE
- **Uç Nokta**: `http://127.0.0.1:3001/api/buckets/:bucketId`
- **Açıklama**: Belirtilen kimliğiyle bir  bucketyı siler.
- **Yol Değişkeni**:
  - `bucketId`: Silinecek  bucketnın kimliği.

### 3. Geri Yükleme Yönetimi

#### Geri Yükleme
- **Yöntem**: POST
- **Uç Nokta**: `http://127.0.0.1:3001/api/restore`
- **Açıklama**: Belirtilen yedeklemeyi geri yükler.
- **Gövde**:
  ```json
  {
    "backupName": "backup-name2"
  }
  ```

### 4.  Schedule Yönetimi

####  Schedule Oluştur
- **Yöntem**: POST
- **Uç Nokta**: `http://127.0.0.1:3001/api/schedule`
- **Açıklama**: Yeni bir yedekleme  schedulesı oluşturur.
- **Gövde**:
  ```json
  {
    "name": "daily-backup",
    "schedule": "0 2 * * *",
    "namespaces": ["default", "my-namespace"],
    "deployments": [],
    "bucket": "default",
    "includeVolumes": true
  }
  ```

####   Schedule'i Çalıştır
- **Yöntem**: POST
- **Uç Nokta**: `http://127.0.0.1:3001/api/schedule/run`
- **Açıklama**: Belirtilen   schedule'i manuel olarak çalıştırır.
- **Gövde**:
  ```json
  {
    "name": "daily-backup"
  }
  ```

####  Scheduleları Listele
- **Yöntem**: GET
- **Uç Nokta**: `http://127.0.0.1:3001/api/schedules`
- **Açıklama**: Mevcut tüm  scheduleları listeler.
- **Gövde**:
```json
[
    {
        "name": "daily-backup",
        "namespace": "velero",
        "creationTimestamp": "2024-06-15T15:04:04Z",
        "schedule": "0 2 * * *",
        "includedNamespaces": [
            "default",
            "my-namespace"
        ],
        "includedResources": [
            "pods",
            "pv",
            "pvc",
            "deployments",
            "services"
        ],
        "storageLocation": "default",
        "phase": "Enabled",
        "lastBackup": "2024-06-22T07:33:42Z"
    }
]
]
```
####   Schedule'i Sil
- **Yöntem**: DELETE
- **Uç Nokta**: `http://127.0.0.1:3001/api/schedule/:name`
- **Açıklama**: Belirtilen adıyla bir   schedule'i siler.
- **Yol Değişkeni**:
  - `name`: Silinecek  schedulenın adı.

### 5. Durum Yönetimi

#### İsim Alanlarını Listele
- **Yöntem**: GET
- **Uç Nokta**: `http://127.0.0.1:3001/api/state/namespaces`
- **Açıklama**: Kümedeki mevcut isim alanlarını listeler.
- **Gövde**:
```json
[
    {
        "name": "default",
        "status": "Active"
    },
    {
        "name": "kube-node-lease",
        "status": "Active"
    },
    {
        "name": "kube-public",
        "status": "Active"
    },
    {
        "name": "kube-system",
        "status": "Active"
    },
    {
        "name": "my-namespace",
        "status": "Active"
    },
    {
        "name": "oracle",
        "status": "Active"
    },
    {
        "name": "velero",
        "status": "Active"
    }
]
```
#### Dağıtımları Listele
- **Yöntem**: GET
- **Uç Nokta**: `http://127.0.0.1:3001/api/state/deployments`
- **Açıklama**: Kümedeki mevcut dağıtımları listeler.
- **Gövde**:
```json
[
    {
        "name": "coredns",
        "namespace": "kube-system",
        "replicas": 1,
        "availableReplicas": 1
    },
    {
        "name": "nginx-deployment",
        "namespace": "my-namespace",
        "replicas": 2,
        "availableReplicas": 2
    },
    {
        "name": "velero",
        "namespace": "velero",
        "replicas": 1,
        "availableReplicas": 1
    }
]
```
#### Servisleri Listele
- **Yöntem**: GET
- **Uç Nokta**: `http://127.0.0.1:3001/api/state/services`
- **Açıklama**: Kümedeki mevcut servisleri listeler.
- **Gövde**:
```json
[
    {
        "name": "kubernetes",
        "namespace": "default",
        "type": "ClusterIP",
        "clusterIP": "10.96.0.1"
    },
    {
        "name": "kube-dns",
        "namespace": "kube-system",
        "type": "ClusterIP",
        "clusterIP": "10.96.0.10"
    },
    {
        "name": "nginx-service",
        "namespace": "my-namespace",
        "type": "ClusterIP",
        "clusterIP": "10.97.18.56"
    },
    
]
```
#### Podları Listele
- **Yöntem**: GET
- **Uç Nokta**: `http://127.0.0.1:3001/api/state/services`
- **Açıklama**: Kümedeki mevcut servisleri listeler.
- **Gövde**:
```json
[
    {
        "name": "nginx-deployment-77d8468669-hv4km",
        "namespace": "my-namespace",
        "nodeName": "minikube",
        "status": "Running",
        "startTime": "2024-06-15T09:42:38Z"
    },
    {
        "name": "nginx-deployment-77d8468669-vgvxg",
        "namespace": "my-namespace",
        "nodeName": "minikube",
        "status": "Running",
        "startTime": "2024-06-15T09:42:38Z"
    },
```