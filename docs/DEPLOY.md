# วิธี deploy เว็บ NavaLab บนเซิร์ฟเวอร์ตัวเอง

สแต็กทั้งหมดรันผ่าน Docker Compose บนเซิร์ฟเวอร์เดียว ประกอบด้วย 5 service:

| service | หน้าที่ |
|---|---|
| `caddy` | reverse proxy หน้าบ้าน + ออก TLS certificate อัตโนมัติ (Let's Encrypt) |
| `web` | nginx เสิร์ฟเว็บไซต์ที่ build แล้ว |
| `builder` | clone/pull repo, `npm run build`, สลับ release แบบ atomic |
| `webhook` | รับ webhook จาก GitHub เมื่อมี push แล้วสั่ง `builder` rebuild |
| `oauth` | GitHub OAuth proxy สำหรับหน้า `/admin` (CMS) login |

## สิ่งที่ต้องมีก่อนเริ่ม

1. เซิร์ฟเวอร์ Linux ที่ลง Docker + Docker Compose แล้ว, เปิดพอร์ต 80 และ 443
2. โดเมน (เช่น `navalab.org`) ที่ตั้ง DNS A record ชี้มาที่ IP เซิร์ฟเวอร์แล้ว
3. Repo บน GitHub ที่มีโค้ดเว็บนี้ (push ขึ้นไปก่อน)

## ขั้นตอน

### 1. เตรียมเครื่อง (SSH เข้า VPS)

SSH เข้าเครื่องด้วย user ที่มีสิทธิ์ `sudo` (หรือ root) แล้วรันตามลำดับ:

```bash
apt update && apt upgrade -y

# ลง Docker Engine + compose plugin จาก repo ทางการของ Docker
# (อย่าใช้ apt install docker.io — เวอร์ชันเก่าเกินไป ใช้กับสแต็กนี้ไม่ได้)
curl -fsSL https://get.docker.com | sh
apt install -y docker-compose-plugin
```

**ทดสอบทันทีหลังลงเสร็จ ก่อนทำอย่างอื่นต่อ:**

```bash
systemd-detect-virt          # ต้องได้ kvm หรือ qemu
docker run --rm hello-world  # ต้องรันผ่านและ print ข้อความสำเร็จ
free -h                      # ยืนยันว่าเห็น RAM 4 GB ตามที่ซื้อจริง
```

ถ้า `systemd-detect-virt` ไม่ใช่ `kvm`/`qemu` (เช่นได้ `openvz` หรือ `lxc`) **ให้หยุดตรงนี้** —
เครื่องแบบนั้นรัน Docker ไม่ได้เต็มรูปแบบ ต้องติดต่อผู้ให้บริการเปลี่ยนเครื่องก่อน อย่าทำขั้นถัดไป

ถ้า `free -h` แสดง swap เป็น 0 ให้สร้าง swapfile กันไว้ (`astro build` จะได้ไม่โดน OOM
kill ตอนช่วง build peak แรม):

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

ตั้ง firewall เปิดแค่พอร์ตที่ใช้จริง (22 สำหรับ SSH, 80/443 สำหรับเว็บ):

```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

สุดท้าย clone repo ไปไว้ที่ `/srv`:

```bash
mkdir -p /srv/navalab
cd /srv/navalab
git clone https://github.com/Git-Thanapol/NavaLab.git .
```

ขั้นตอนที่เหลือด้านล่าง (`.env`, `config.yml`, `docker compose up`) ให้ทำจากในโฟลเดอร์
`/srv/navalab` นี้ทั้งหมด

**ข้อควรระวัง:** ตั้งค่า `.env` (มีค่า secret จริงทั้งหมด) โดยพิมพ์ผ่าน `nano .env` หรือ
`vim .env` **บนเครื่อง VPS นี้โดยตรงเท่านั้น** ห้ามพิมพ์ค่าจริงแล้วเก็บไว้ในเครื่องคอมพิวเตอร์
ส่วนตัวที่ sync กับ cloud storage (Google Drive, OneDrive ฯลฯ) — ถ้าไฟล์นั้นหลุดขึ้น cloud
sync ต้อง revoke/regenerate ค่าที่หลุดทั้งหมดทันที

### 2. สร้าง GitHub Personal Access Token

Settings → Developer settings → Fine-grained tokens → สร้างใหม่ ให้สิทธิ์ `Contents: Read-only` กับ repo นี้เท่านั้น ใช้เป็นค่า `GITHUB_TOKEN`

### 3. สร้าง GitHub OAuth App (สำหรับ CMS login)

GitHub → Settings → Developer settings → OAuth Apps → New OAuth App

- Homepage URL: `https://<โดเมนของคุณ>`
- Authorization callback URL: `https://<โดเมนของคุณ>/oauth/callback`

จะได้ Client ID และ Client Secret มาใส่ในไฟล์ `.env`

### 4. ตั้งค่า `.env`

```bash
cp .env.example .env
```

แก้ทุกค่าใน `.env` ให้ตรงกับของจริง (โดเมน, token, secret ต่างๆ) — สุ่ม secret ด้วย `openssl rand -hex 32`

### 5. แก้ `public/admin/config.yml`

แก้บรรทัด `repo:` ให้เป็น `owner/repo` จริง และ `base_url:` ให้ตรงกับโดเมนจริง (`https://<โดเมน>/oauth`) แล้ว commit push ขึ้น GitHub

### 6. รันสแต็ก

```bash
docker compose up -d --build
```

ครั้งแรก `builder` จะ clone repo แล้ว build ทันที ดู log ได้ด้วย `docker compose logs -f builder`

### 7. ตั้ง GitHub Webhook

Repo → Settings → Webhooks → Add webhook

- Payload URL: `https://<โดเมนของคุณ>/hooks/deploy`
- Content type: `application/json`
- Secret: ค่าเดียวกับ `WEBHOOK_SECRET` ใน `.env`
- Events: เลือกแค่ `push`

จากนี้ทุกครั้งที่มีการ push (รวมถึงตอน admin กด save ใน CMS ซึ่ง commit ตรงเข้า repo) เว็บจะ build ใหม่และอัปเดตให้อัตโนมัติภายในประมาณ 1 นาที โดยไม่มี downtime

## ตรวจสอบว่าใช้งานได้

- `https://<โดเมน>/` เปิดเว็บได้ปกติ
- `https://<โดเมน>/admin/` เข้า CMS ได้ กด "Sign In with GitHub" แล้ว login สำเร็จ
- push commit ทดสอบเข้า repo แล้วดู `docker compose logs -f webhook builder` ว่า trigger rebuild จริง

## คำสั่งที่ใช้บ่อย

```bash
docker compose logs -f            # ดู log ทุก service
docker compose restart builder    # รีสตาร์ท builder (จะ build ใหม่ตอน start)
docker compose down               # ปิดทั้งหมด (ข้อมูลใน volume ยังอยู่)
docker compose pull && docker compose up -d --build   # อัปเดตอิมเมจ base (nginx, caddy)
```
