# Finance Dashboard Frontend

A modern, responsive React-based frontend for the Finance Dashboard system, inspired by the Finseed design.

## Features

- 🎨 **Modern Design**: Dark theme with blue accents inspired by Finseed
- 📱 **Responsive**: Mobile-friendly layout
- 📊 **Dashboard Analytics**: Visual overview of financial data
- 💰 **Records Management**: Create, view, and manage financial transactions
- 🔐 **Role-Based Access**: Different interfaces based on user role
- ⚡ **Fast & Smooth**: Built with React and Vite

## Design Inspiration

The frontend is designed with the color scheme and layout patterns from the Finseed financial dashboard:

- **Primary Color**: Blue (#0066FF)
- **Accent Color**: Yellow/Orange (#FFB81C)
- **Success Color**: Green (#10B981)
- **Dark Theme**: Professional dark background (#0F0F0F)
- **Components**: Card-based layouts, clean typography, smooth animations

## Installation

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Configuration

### API Endpoint

The frontend communicates with the backend at `http://localhost:8000`. 

To change this, edit `vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://your-backend-url:8000',
      changeOrigin: true
    }
  }
}
```

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── index.js          # API service layer
│   ├── components/
│   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   ├── SummaryCard.jsx   # Summary statistics card
│   │   ├── Chart.jsx         # Chart component
│   │   └── ProtectedRoute.jsx # Auth protection
│   ├── pages/
│   │   ├── Login.jsx         # Login page
│   │   ├── Register.jsx      # Registration page
│   │   ├── Dashboard.jsx     # Main dashboard
│   │   ├── Records.jsx       # Records management
│   │   └── Profile.jsx       # User profile
│   ├── App.jsx               # Main app component
│   ├── index.css             # Global styles
│   └── main.jsx              # Entry point
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

## Available Pages

### Login (`/login`)
- Email/password authentication
- Links to registration
- Demo credentials displayed

### Register (`/register`)
- Create new account
- Select user role (Viewer, Analyst, Admin)
- Auto-login after registration

### Dashboard (`/dashboard`)
- Financial overview with summary cards
- Total balance, income, and expenses
- Income vs expenses pie chart
- Spending by category breakdown
- Recent transactions list

### Records (`/records`)
- Create new financial transactions
- Filter records by type, category, date
- View all transactions in table format
- Delete records (with confirmation)

### Profile (`/profile`)
- View user information
- See role permissions
- Account actions
- System information

## Styling

The application uses a custom CSS design system with:

- **CSS Variables** for theme colors and spacing
- **Responsive Grid Layout** for components
- **Card-based Design** for content organization
- **Dark Theme** throughout for modern appearance
- **Smooth Animations** for interactive elements

### Color Palette

```css
--primary-blue: #0066FF
--accent-yellow: #FFB81C
--success-green: #10B981
--danger-red: #EF4444
--bg-primary: #0F0F0F
--bg-secondary: #1A1A1A
--bg-tertiary: #2D2D2D
--text-primary: #FFFFFF
--text-secondary: #9CA3AF
```

## API Integration

The frontend integrates with the backend APIs:

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Users
- `GET /users/me` - Get current user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user

### Records
- `POST /records` - Create record
- `GET /records` - List records with filters
- `DELETE /records/:id` - Delete record

### Dashboard
- `GET /dashboard/summary` - Get financial summary

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Testing the Application

1. **Start both backend and frontend**
   ```bash
   # Terminal 1: Backend
   cd backend
   python -m uvicorn main:app --reload
   
   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

2. **Login with demo account**
   - Email: `analyst@test.com`
   - Password: `test123`
   - Role: Analyst

3. **Test features**
   - Create a new financial record
   - View dashboard analytics
   - Filter and manage records
   - Check profile settings

## Authentication

Currently uses `X-User-ID` header for authentication (development only).

**Production Note**: Should be replaced with JWT tokens:
```javascript
// In src/api/index.js
if (token) {
  config.headers['Authorization'] = `Bearer ${token}`
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized for fast load times with Vite
- Efficient API calls with request debouncing
- Responsive images and lazy loading
- Minimal bundle size

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Hot Module Replacement (HMR)

Changes are reflected instantly during development thanks to Vite's HMR.

## Troubleshooting

### API Connection Error

If you see "Failed to load dashboard", ensure:
1. Backend is running on `http://localhost:8000`
2. PostgreSQL database is initialized
3. CORS is enabled on the backend

### Login Issues

- Check that user exists in database
- Verify email and password are correct
- Check browser console for error messages

### Styling Not Applied

- Clear browser cache (Ctrl+Shift+Delete)
- Reload the page
- Check CSS variables are loaded

## Future Enhancements

- [ ] Dark/Light theme toggle
- [ ] Advanced charting library (Recharts)
- [ ] Data export (CSV, PDF)
- [ ] Budget alerts
- [ ] Category customization
- [ ] Transaction search
- [ ] Monthly trends
- [ ] Mobile app version

## License

This is a demo application for assessment purposes.
