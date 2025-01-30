# 🌐 Headscale UI - Interface Flask pour gérer les machines Headscale

EN Version : [English README](README_EN.md)

Ce projet est une interface web simple basée sur **Flask** qui permet de gérer les machines sur **Headscale** via une API REST et une UI intuitive.

## ✨ **Fonctionnalités**

- 🔑 Générer et enregistrer des clés d'authentification
- 🖥️ Lister les machines connectées à Headscale
- ✏️ Renommer une machine existante
- ❌ Supprimer une machine du réseau
- ⚡ Interface intuitive avec **SweetAlert2**

---

## 🛠 **Prérequis**

Avant d’installer et d’utiliser cette application, assurez-vous que votre système dispose de :

- **Python 3.x**
- **Headscale** installé et configuré
- **Tailscale** pour la gestion du réseau VPN (optionnel)
- **Nginx (si reverse proxy souhaité)**

---

## 🚀 **Installation**

```bash
git clone https://github.com/ton-repo/headscale-ui.git
cd headscale-ui
```

### 2️⃣ Créer un environnement virtuel et installer les dépendances

```bash
python3 -m venv venv
source venv/bin/activate  # Sur Linux/macOS
venv\Scripts\activate      # Sur Windows

pip install -r requirements.txt
```

### 3️⃣ Lancer l’application Flask

```bash
python app.py
```

L’interface sera disponible sur **http://127.0.0.1:8081/**.

---

## ⚙ **Configuration du service systemd (optionnel)**

Si tu veux que l’application tourne automatiquement au démarrage, crée un service `systemd`.

```bash
sudo nano /etc/systemd/system/flask_headscale.service
```

Ajoute ceci :

```toml
[Unit]
Description=Flask app for headscale key management
After=network.target

[Service]
User=root
WorkingDirectory=/root/headscaleUpUI
ExecStart=/root/headscaleUpUI/venv/bin/python /root/headscaleUpUI/app.py
Restart=always
Environment="PATH=/root/headscaleUpUI/venv/bin:/usr/bin:/bin"

[Install]
WantedBy=multi-user.target
```

Recharge et démarre le service :

```bash
sudo systemctl daemon-reload
sudo systemctl enable flask_headscale
sudo systemctl start flask_headscale
```

---

## 🌐 **Utilisation**

Accède à l’interface web via **http://127.0.0.1:8081/**.

---

## 📡 **Reverse Proxy avec Nginx (optionnel)**

Si tu veux accéder à l’interface via un **nom de domaine** et sans le port `8081`, configure **Nginx** comme reverse proxy.

```bash
sudo nano /etc/nginx/sites-available/headscale
```

Ajoute :

```jsx
server {
    listen 80;
    server_name vpn-up-technologies.fr;  # Remplace par ton domaine

    location / {
        proxy_pass http://127.0.0.1:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Active le site et redémarre Nginx :

```bash
sudo ln -s /etc/nginx/sites-available/headscale /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

---

## 📌 **API Endpoints**

L’application expose plusieurs endpoints REST :

| Méthode | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/generate-key` | Générer une clé d'authentification |
| `POST` | `/register-key` | Enregistrer une clé sur Headscale |
| `GET` | `/list-nodes` | Lister les machines connectées |
| `POST` | `/rename-node` | Renommer une machine |
| `POST` | `/delete-node` | Supprimer une machine |

---

## 🛠 **Dépannage**

1️⃣ **L’application ne démarre pas ?**

- Vérifie si Flask est bien installé :
    
    ```
    pip install flask
    ```
    

2️⃣ **Problèmes d’accès à Headscale (`permission denied`****) ?**

- Vérifie que le fichier socket `/var/run/headscale/headscale.sock` est accessible :
    
    ```
    sudo chmod 666 /var/run/headscale/headscale.sock
    ```
    

3️⃣ **Problème d’accès via le domaine ?**

- Vérifie que le DNS de **Tailscale** est bien configuré.
- Vérifie si **Nginx** est bien redémarré.

---

## 🎯 **Améliorations possibles**

- 🔐 **Ajout d'une authentification** pour sécuriser l'accès à l'UI
- 📊 **Ajout de graphiques** pour afficher des statistiques sur les connexions
- 🌍 **Multilingue** : Ajouter une option de changement de langue

---

## 📜 **Licence**

Ce projet est sous licence **MIT**. Tu es libre de le modifier et de le redistribuer.

---

**👨‍💻 Développé avec ❤️ pour simplifier la gestion de Headscale !**
