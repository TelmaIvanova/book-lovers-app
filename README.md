## Intro

The project is created for educational purposes.

### Installation

In order to start the project you need to have installed **Node.js** and **npm** on your local machine.

To install the project dependencies, follow these steps:

**Clone the repository to your local machine:**

`git clone https://github.com/TelmaIvanova/book-lovers-app.git`

**Install the project dependencies for FE:**

`npm install`

**After that navigate to the BE directory:**

`cd book-lovers-app/backend`

**And install the project dependencies for BE:**

`npm install`

**After installation, you should start the server in one terminal:**

`npm start`

**and in another terminal start React App in the main book-lovers-app directory**

`npm start`

**Environment Variables**

Create `.env` file inside the **`/backend`** directory with the following content:
```
PORT=5000
CLIENT_URL=http://localhost:3000

CONNECTION=mongodb+srv://<username>:<password>@cluster.mongodb.net/book-lovers
JWT_SECRET=<secret>
JWT_EXPIRES_IN=8h

EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_PASSWORD=<YOUR_SENDGRID_API_KEY>
EMAIL_FROM=book-lovers@email.com

CLOUD_NAME=<cloudinary_name>
API_KEY=<cloudinary_api_key>
API_SECRET=<cloudinary_api_secret>

ETH_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/
<alchemy_key>
```
---

**Frontend Proxy Configuration**

Inside **`client/package.json`**, there is a `proxy` field:

```
{
"proxy": "http://localhost:5000"
}
```
This means that when the frontend (running on port 3000) calls routes like `/api/route`,
the requests are automatically forwarded to the backend (running on port 5000).

**Important:** When you deploy the project on a different server or domain, you must update the "proxy" field in client/package.json to point to the correct backend URL.