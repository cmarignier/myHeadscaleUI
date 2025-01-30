# 🌐 Headscale UI - Flask interface to manage Headscale machines

This project is a simple web interface based on **Flask** that allows to manage machines on **Headscale** via a REST API and an intuitive UI.

## ✨ **Features**

- 🔑 Generate and save authentication keys
- 🖥️ List machines connected to Headscale
- ✏️ Rename an existing machine
- ❌ Remove a machine from the network
- ⚡ Intuitive interface with **SweetAlert2**

---

## 🛠 **Prerequisites**

Before installing and using this application, make sure that your system has:

- **Python 3.x**
- **Headscale** installed and configured
- **Tailscale** for VPN network management (optional)
- **Nginx (if reverse proxy desired)**

---

## 🚀 **Installation**

```bash
git clone https://github.com/ton-repo/headscale-ui.git
cd headscale-ui
```

### 2️⃣ Create a virtual environment and install dependencies

```bash
python3 -m venv venv
source venv/bin/activate # On Linux/macOS
venv\Scripts\activate # On Windows

pip install -r requirements.txt
```

### 3️⃣ Run the Flask application

```bash
python app.py
```

The interface will be available at **http://127.0.0.1:8081/**.

---

## ⚙ **Configuring the systemd service (optional)**

If you want the application to run automatically at startup, create a `systemd` service.

```bash
sudo nano /etc/systemd/system/flask_headscale.service
```

Add this:

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

Recharge and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable flask_headscale
sudo systemctl start flask_headscale
```

---

## 🌐 **Usage**

Access the web interface via **http://127.0.0.1:8081/**.

---

## 📡 **Reverse Proxy with Nginx (optional)**

If you want to access the interface via a **domain name** and without the port `8081`, configure **Nginx** as a reverse proxy.

```bash
sudo nano /etc/nginx/sites-available/headscale
```

Add:

```jsx
server {
listen 80;
server_name vpn-up-technologies.fr; # Replace with your domain

location / {
proxy_pass http://127.0.0.1:8081;
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
}
```

Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/headscale /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

---

## 📌 **Endpoints API**

The application exposes several REST endpoints:

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/generate-key` | Generate an authentication key |
| `POST` | `/register-key` | Register a key on Headscale |
| `GET` | `/list-nodes` | List connected machines |
| `POST` | `/rename-node` | Rename a machine |
| `POST` | `/delete-node` | Delete a machine |

---

## 🛠 **Troubleshooting**

1️⃣ **Application does not start?**

- Check if Flask is installed correctly:

```
pip install flask
```

2️⃣ **Problems accessing Headscale (`permission denied`****)?**

- Check that the socket file `/var/run/headscale/headscale.sock` is accessible:

```
sudo chmod 666 /var/run/headscale/headscale.sock
```

3️⃣ **Problem accessing via the domain?**

- Check that the **Tailscale** DNS is configured correctly.
- Check if **Nginx** is restarted correctly.

---

## 🎯 **Possible improvements**

- 🔐 **Add authentication** to secure access to the UI
- 📊 **Add graphs** to display statistics on connections
- 🌍 **Multilingual**: Add a language change option

---

## 📜 **License**

This project is licensed under **MIT**. You are free to modify and redistribute it.

---

**👨‍💻 Developed with ❤️ to simplify Headscale management!**