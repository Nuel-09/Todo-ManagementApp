# New Todo App Project - Requirements & Reusable Components

## 📋 Current Project Overview

**Project Name:** Fotherbys Auction System  
**Type:** Full-stack professional auction house management platform  
**Current Stack:** TypeScript + Node.js + Fastify + MongoDB + EJS

---

## 🎯 What This Project Does

A complete auction management system with:

- **Admin Dashboard** - Manage auctions, items/lots, seller leads
- **Public Interface** - Browse auctions and items
- **Seller Portal** - Sellers can submit items and manage leads
- **QR Code Access** - Auction access via QR codes
- **Authentication** - Session-based auth for admins and sellers
- **Professional Lot Metadata** - Artist, period, dimensions, condition, etc.

---

## 🛠️ Current Tech Stack

| Component          | Technology                    | Version   |
| ------------------ | ----------------------------- | --------- |
| **Backend**        | Node.js + Fastify             | 18+, 5.x  |
| **Language**       | TypeScript                    | 5.x       |
| **Database**       | MongoDB + Mongoose            | 5.x+, 8.x |
| **Frontend**       | EJS (Server-side templates)   | 3.x       |
| **Authentication** | Session-based (connect-mongo) | Custom    |
| **Dev Tools**      | tsx, TypeScript, ESLint       | Latest    |
| **Utilities**      | bcryptjs, QR code, CORS       | Various   |

---

## ✅ What to KEEP for Todo App

These components are reusable and will work for a todo app:

### 1. **Backend Architecture**

- ✅ Fastify framework setup
- ✅ TypeScript configuration
- ✅ Middleware system (authentication)
- ✅ Route organization pattern
- ✅ Controller pattern (business logic separation)
- ✅ Environment configuration (dotenv)
- ✅ CORS, cookies, sessions setup

### 2. **Database Layer**

- ✅ MongoDB + Mongoose connection
- ✅ Schema-based model structure
- ✅ Type definitions pattern (`src/types/index.ts`)
- ✅ Database seeding approach
- ✅ Session storage in MongoDB

### 3. **Authentication**

- ✅ Session-based auth middleware
- ✅ Password hashing (bcryptjs)
- ✅ Authentication hooks
- ✅ Session management

### 4. **Development Setup**

- ✅ TypeScript configuration
- ✅ Dev server with hot reload (tsx watch)
- ✅ Build process
- ✅ Package structure

---

## 🔄 What to REPLACE for Todo App

These need to be replaced for React-based development:

### 1. **Frontend - EJS → React**

| Current               | New                                    |
| --------------------- | -------------------------------------- |
| EJS templates         | React components                       |
| Server-side rendering | Client-side SPA                        |
| Form submissions      | Fetch/Axios API calls                  |
| Template inheritance  | Component composition                  |
| Static CSS            | CSS modules/Tailwind/Styled-components |

### 2. **View Folder Structure**

```
REMOVE: src/views/admin/*.ejs
REMOVE: src/views/public/*.ejs

ADD:
frontend/
├── src/
│   ├── components/
│   │   ├── TaskList.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskItem.tsx
│   │   └── ...
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   └── ...
│   ├── hooks/
│   ├── context/
│   ├── services/
│   └── App.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts (or similar)
```

### 3. **Public Folder**

```
KEEP CSS structure but update for:
- React component styling
- Responsive design adjustments

UPDATE CSS for:
- React component selectors
- Animation classes
- Utility classes
```

### 4. **API Changes Needed**

- Add REST endpoints for task CRUD operations
- Return JSON instead of rendering templates
- Implement proper error responses
- Add validation middleware

---

## 📊 Todo App - Required Models & Routes

### **Models to Create/Modify**

```typescript
// Keep User/Admin model structure
// Add Todo model:
interface ITodo {
  _id: ObjectId;
  userId: ObjectId; // FK to User
  title: string;
  description?: string;
  status: "pending" | "completed" | "deleted";
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  priority?: "low" | "medium" | "high";
}

interface IUser {
  _id: ObjectId;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### **Routes Needed**

```
Authentication:
POST   /api/auth/signup      - Register user
POST   /api/auth/login       - Login user
POST   /api/auth/logout      - Logout user
GET    /api/auth/profile     - Get current user

Todos (Protected):
GET    /api/todos            - Get all user todos (with filters)
POST   /api/todos            - Create new todo
GET    /api/todos/:id        - Get specific todo
PUT    /api/todos/:id        - Update todo
DELETE /api/todos/:id        - Delete todo
PATCH  /api/todos/:id        - Update status/fields
```

### **Controllers to Create**

```
src/controllers/
├── authController.ts       - Register, login, logout
├── todoController.ts       - CRUD for todos
└── userController.ts       - User profile management
```

---

## 📁 New Project Structure (Recommended)

```
todo-app/
├── backend/
│   ├── src/
│   │   ├── server.ts                          (Keep pattern from current)
│   │   ├── config/
│   │   │   └── database.ts                    (Reuse)
│   │   ├── models/
│   │   │   ├── User.ts                        (Adapt from Admin)
│   │   │   └── Todo.ts                        (New)
│   │   ├── controllers/
│   │   │   ├── authController.ts              (Adapt from admin auth)
│   │   │   ├── todoController.ts              (New)
│   │   │   └── userController.ts              (New)
│   │   ├── routes/
│   │   │   ├── authRoutes.ts                  (Adapt)
│   │   │   ├── todoRoutes.ts                  (New)
│   │   │   └── userRoutes.ts                  (New)
│   │   ├── middleware/
│   │   │   └── auth.ts                        (Keep/adapt)
│   │   └── types/
│   │       └── index.ts                       (Update)
│   ├── public/
│   │   └── css/                               (Keep/update)
│   ├── package.json                           (Keep deps, remove EJS)
│   ├── tsconfig.json                          (Keep)
│   └── .env.example                           (Update)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── SignupForm.tsx
│   │   │   └── Layout/
│   │   │       ├── Header.tsx
│   │   │       └── Navigation.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   └── DashboardPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── todoService.ts
│   │   │   └── authService.ts
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   │   ├── useTodos.ts
│   │   │   └── useAuth.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json                           (React + Vite)
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
│
├── .gitignore
└── README.md
```

---

## 🚀 Migration Checklist

### Phase 1: Backend Setup

- [ ] Create new backend folder or project
- [ ] Copy Fastify setup from `server.ts`
- [ ] Copy database config and connection setup
- [ ] Copy `src/middleware/auth.ts` (adapt for User model)
- [ ] Copy `src/types/index.ts` (update interfaces)
- [ ] Copy route pattern (create auth, todo routes)
- [ ] Copy controller pattern (create todo controller)
- [ ] Copy public folder CSS (update for React)

### Phase 2: Frontend Setup

- [ ] Initialize React + Vite project
- [ ] Setup TypeScript configuration
- [ ] Create folder structure (components, pages, services, hooks)
- [ ] Setup API service layer (fetch/axios)
- [ ] Create authentication context
- [ ] Create custom hooks (useTodos, useAuth)

### Phase 3: API Development

- [ ] Create Todo model (Mongoose schema)
- [ ] Create User model (adapt from Admin model)
- [ ] Implement auth controller
- [ ] Implement todo controller
- [ ] Setup routes with middleware
- [ ] Add validation

### Phase 4: Frontend Components

- [ ] Create form components (login, signup, task form)
- [ ] Create list components (task list, task item)
- [ ] Create pages (home, dashboard, login)
- [ ] Integrate API calls
- [ ] Add filtering/sorting logic

### Phase 5: Testing & Polish

- [ ] Test authentication flow
- [ ] Test CRUD operations
- [ ] Test sorting/filtering
- [ ] Responsive design
- [ ] Error handling

---

## 📝 Files to Copy/Reference

### Backend Files (Keep Pattern)

- [src/server.ts](src/server.ts) - Main server setup
- [src/config/database.ts](src/config/database.ts) - DB connection
- [src/middleware/auth.ts](src/middleware/auth.ts) - Auth middleware
- [src/types/index.ts](src/types/index.ts) - Interface patterns
- [src/controllers/baseController.ts](src/controllers/baseController.ts) - Base patterns
- [package.json](package.json) - Dependency baseline

### Frontend CSS (Keep/Update)

- [public/css/](public/css/) - Styling foundation

### Documentation

- [CODEBASE_STRUCTURE.md](CODEBASE_STRUCTURE.md) - Architecture patterns
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Implementation approach

---

## 🔧 Dependencies Changes

### Keep (Backend)

```json
{
  "fastify": "^5.6.2",
  "mongoose": "^9.0.2",
  "typescript": "^5.9.3",
  "bcryptjs": "^3.0.3",
  "dotenv": "^17.2.3",
  "@fastify/cors": "^11.2.0",
  "@fastify/cookie": "^11.0.2",
  "@fastify/session": "^11.1.1",
  "@fastify/static": "^9.0.0",
  "connect-mongo": "^6.0.0"
}
```

### Remove (Backend)

```json
{
  "ejs": "^3.1.10", // No more server-side rendering
  "@types/ejs": "^3.1.5", // Remove
  "@fastify/view": "^11.1.1", // Remove
  "qrcode": "^1.5.4" // Remove (unless needed)
}
```

### Add (Frontend)

```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "typescript": "^5.x",
  "vite": "^5.x",
  "axios": "^1.x" (or fetch API),
  "react-router-dom": "^6.x",          // Optional: routing
  "tailwindcss": "^3.x" (optional)    // Or styled-components, CSS modules
}
```

---

## 💡 Key Takeaways

1. **Backend Structure is Perfect** - Reuse the Fastify, Mongoose, TypeScript setup
2. **Authentication Pattern Works** - Session-based auth transfers directly
3. **Database Design Pattern is Sound** - Models, types, controllers pattern is clean
4. **Replace Only Frontend** - EJS → React/Vite is the main change
5. **API First Design** - Backend needs to serve JSON instead of rendering templates
6. **Keep the Organization** - Route structure, controller separation, middleware pattern all applicable

---

## 🎯 Next Steps

1. Decide on **monorepo** structure (combined) or **separate repos** (frontend/backend)
2. Choose **frontend framework/build tool** (Vite recommended over Create React App)
3. Choose **styling approach** (Tailwind CSS, styled-components, or CSS modules)
4. Decide on **state management** (Context API, Zustand, or Redux)
5. Start with backend setup, then build frontend around the API

Would you like help setting up the new project structure?
