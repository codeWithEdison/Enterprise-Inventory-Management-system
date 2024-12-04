# 🏥 UR HG STOCK MS

<div align="center">

![alt text](/public/homepage.png)

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-blue.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Role-Based Access](#role-based-access)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🌟 Overview

The Hospital Inventory Management System (HIMS) is a comprehensive solution designed to streamline inventory management processes in healthcare facilities. It provides role-based access control, real-time inventory tracking, automated request workflows, and detailed reporting capabilities.

### 🎯 Key Objectives

- Streamline medical inventory management
- Reduce stock-outs and overstocking
- Automate approval workflows
- Enhance transparency and accountability
- Improve decision-making with data-driven insights

## ✨ Features

### 🔐 Role-Based Access Control
- **Admin Dashboard**: Complete system control and configuration
- **HOD Interface**: Department-level oversight and approval management
- **Stock Keeper Portal**: Inventory management and stock control
- **Nurse Access**: Request creation and tracking

### 📦 Inventory Management
- Real-time stock tracking
- Multi-location support
- Minimum stock alerts
- Batch tracking
- Expiry date management

### 🔄 Request Workflow
- Automated request processing
- Multi-level approval system
- Status tracking
- Email notifications
- Request history

### 📊 Reporting & Analytics
- Stock level reports
- Usage analytics
- Department-wise consumption
- Trend analysis
- Custom report generation

## 💻 Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Query
- React Router 6
- React Hook Form
- Zod
- Recharts

### State Management
- Context API
- React Query for server state
- Zustand for global state

### Development Tools
- Vite
- ESLint
- Prettier
- Husky
- Commitlint

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://codewith_edison.ur-hg-stock.git

# Navigate to the project directory
cd ur-hg-stock

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_API_URL=your_api_url
VITE_APP_NAME=HIMS
VITE_APP_VERSION=1.0.0
```

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
├── features/          # Feature-based modules
├── hooks/            # Custom React hooks
├── layouts/          # Page layouts
├── lib/              # Utility functions
├── pages/            # Route pages
├── services/         # API services
├── store/            # Global state management
├── styles/           # Global styles
└── types/            # TypeScript definitions
```

## 👥 Role-Based Access

### Admin
- Full system access
- User management
- System configuration
- Report generation

### HOD (Head of Department)
- Department oversight
- Request approval
- Stock monitoring
- Department reports

### Stock Keeper
- Inventory management
- Stock updates
- Request fulfillment
- Stock reports

### Nurse
- Item requests
- Stock viewing
- Request tracking
- Basic reporting

## 📚 API Documentation

Comprehensive API documentation is available at:
[API Documentation](https://ur-hg-backend.programmerdatch.com/api-docs/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

code with edison - [@codewithedison](https://github.com/codeWithEdison)

Project Link: [https://github.com/codeWithEdison/UR-HG-STOCK](https://github.com/codeWithEdison/UR-HG-STOCK)

---

<div align="center">
Developed with ❤️ by code with edison 
</div>