#!/bin/bash


set -e

# Node.js ve npm'in kurulumu
echo "Node.js ve npm kontrol ediliyor..."
if ! command -v node &> /dev/null; then
    echo "Node.js bulunamadı, kuruluyor..."
    NODE_VERSION="v14.17.0"
    curl -O https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-linux-x64.tar.xz
    tar -xf node-$NODE_VERSION-linux-x64.tar.xz
    sudo mv node-$NODE_VERSION-linux-x64 /usr/local/nodejs
    sudo ln -s /usr/local/nodejs/bin/node /usr/bin/node
    sudo ln -s /usr/local/nodejs/bin/npm /usr/bin/npm
else
    echo "Node.js zaten kurulu."
fi

# kubectl kurulumu
echo "kubectl kontrol ediliyor..."
if ! command -v kubectl &> /dev/null; then
    echo "kubectl bulunamadı, kuruluyor..."
    KUBECTL_VERSION="v1.21.0"
    curl -LO "https://dl.k8s.io/release/$KUBECTL_VERSION/bin/linux/amd64/kubectl"
    chmod +x kubectl
    sudo mv kubectl /usr/local/bin/
else
    echo "kubectl zaten kurulu."
fi

# Velero kurulumu
echo "Velero kontrol ediliyor..."
if ! command -v velero &> /dev/null; then
    echo "Velero bulunamadı, kuruluyor..."
    VELERO_VERSION="v1.5.4"
    curl -LO "https://github.com/vmware-tanzu/velero/releases/download/$VELERO_VERSION/velero-$VELERO_VERSION-linux-amd64.tar.gz"
    tar -xzf velero-$VELERO_VERSION-linux-amd64.tar.gz
    sudo mv velero-$VELERO_VERSION-linux-amd64/velero /usr/local/bin/
else
    echo "Velero zaten kurulu."
fi

INSTALL_DIR="/opt/scube"

if [ -d "$INSTALL_DIR" ]; then
    sudo rm -rf "$INSTALL_DIR"
fi

echo "Proje dosyaları taşınıyor..."
sudo mkdir -p "$INSTALL_DIR"
sudo cp -r * "$INSTALL_DIR"

cd "$INSTALL_DIR"
sudo chown -R $USER:$USER "$INSTALL_DIR"

echo "NPM bağımlılıkları yükleniyor..."
npm install

USER=$(id -un)
GROUP=$(id -gn)

SERVICE_FILE="/etc/systemd/system/scube.service"

echo "Systemd servisi oluşturuluyor..."
sudo bash -c "cat > $SERVICE_FILE" <<EOL
[Unit]
Description=Scube Project Service. Usage: systemctl {start|stop|restart|status} scube
After=network.target

[Service]
ExecStart=/usr/bin/npm run dev
WorkingDirectory=$INSTALL_DIR
Restart=always
RestartSec=10
StartLimitInterval=0
StartLimitBurst=10
User=$USER
Group=$GROUP
Environment=PATH=/usr/local/nodejs/bin:/usr/bin:/usr/local/bin:/bin
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOL

echo "Systemd servisi etkinleştiriliyor ve başlatılıyor..."
sudo systemctl daemon-reload
sudo systemctl enable scube.service
sudo systemctl start scube.service

echo "Kurulum tamamlandı!"
echo "Servisi kontrol etmek için aşağıdaki komutları kullanabilirsiniz:"
echo "Başlatmak için: sudo systemctl start scube"
echo "Durdurmak için: sudo systemctl stop scube"
echo "Durumunu kontrol etmek için: sudo systemctl status scube"

