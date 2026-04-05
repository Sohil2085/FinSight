# FinSight 📊

FinSight is an advanced, production-ready SaaS application designed to help businesses and individuals effortlessly manage expenses, issue intelligent GST-compliant invoices, visualize real-time net-cash metrics, and orchestrate their workforce seamlessly.
 
## 🚀 Key Features

- **Real-Time Interactive Dashboard**: Instantly monitor Net Cash Flow, Paid vs Pending Payments, and analytical charts powered by Recharts.
- **Advanced Invoice & Taxation Engine**: 
  - Dynamic invoice generator with built-in GST taxonomy (Inter-state IGST & Intra-state CGST/SGST calculations).
  - Floating-point safe transaction builder utilizing precise *currency-integer* mathematical formulas.
  - Partial & full payment trackers linked with robust ACID `$transaction` blocks.
- **One-Click Client Dispatch**: Employs an innovative "Base64 Shadow Renderer" to instantly generate professional client PDFs in the background and bridge them securely to backend `Nodemailer` instances for flawless client delivery via email without messy multipart/form buffers.
- **AI Expense Categorization**: Smart spending module that utilizes integrated AI prompts to automatically classify receipt descriptions to standardized taxonomy tables.
- **Team & Role Management**: Multi-tenant workspace architecture restricting administrative company privileges from standard employees and accountants.
- **Universal Notification System**: Elegant contextual prompts distributed utilizing `react-hot-toast` across all data layers minimizing standard browser `alert()` bottlenecks.
- **Responsive Layout**: Designed specifically around a mobile-first paradigm adapting fluidly from small tablets to wide ultrawide desktop viewports.

## 💻 Tech Stack

**Frontend Architecture**:
- React 19 (Vite)
- TailwindCSS 4 (Component & Grid layouts)
- Recharts (Data visualizers)
- jsPDF & jsPDF-Autotable (Client-rendered PDF engines)
- Lucide-React (Iconography)
- react-hot-toast (Universal feedback pipeline)

**Backend Architecture**:
- Node.js & Express.js (REST architectural pattern)
- Prisma ORM (Relational mapper)
- PostgreSQL (Designed against serverless instances like NeonDB w/ aggressive timeout handlers)
- JSON Web Token (Stateless Authentication)
- Nodemailer (SMTP bridging engine)

## 🛠️ Installation & Setup

1. **Clone the repository**
2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```
3. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```
4. **Environment Variables**:
   Establish a `.env` in the `/backend` matching the following schema:
   ```env
   # Database Configuration
   DATABASE_URL="postgres://user:password@host/dbname?sslmode=require"
   
   # Security
   JWT_SECRET="your_hyper_secure_encryption_key"
   
   # SMTP Configuration (Optional: Falls back to console Ethereal intercepts)
   SMTP_HOST="smtp.test.com"
   SMTP_PORT=587
   SMTP_SECURE="false"
   SMTP_USER="user@domain.com"
   SMTP_PASS="password"
   
   # Frontend URL
   FRONTEND_URL="http://localhost:5173"
   ```
5. **Database Migration Sync**:
    ```bash
    cd backend
    npx prisma generate
    npx prisma migrate dev
    ```

## ⚡ Running the Project (Windows Native)

The absolute quickest way to start the entire environment locally without manually bridging terminal tabs:

**Using the batch script**:
1. Double-click the **`start.bat`** file in the root `FinSight` directory.
2. Two standalone native terminal windows will open automatically porting `:5173` & `:5000`.
3. Open `http://localhost:5173` to explore your environment!

**Manual Boot**:
- **Terminal 1 (Backend)**:
  ```bash
  cd backend
  npm run dev
  ```
- **Terminal 2 (Frontend)**:
  ```bash
  cd frontend
  npm run dev
  ```
