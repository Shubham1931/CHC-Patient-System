# CHC Patient Management System

A digital patient registration and management system designed for Government Community Health Centres. The application provides robust tools for patient tracking, analytics, and administrative workflows.

## Features

- Dashboard with key metrics and analytics
- Patient registration and management
- Search functionality for patient records
- Vital signs recording
- Appointment booking with doctors
- Analytics for patient demographics and doctor allocation

## Technology Stack

- Simple JavaScript-based server (no TypeScript dependencies)
- Express.js for the backend
- Vanilla JavaScript frontend with Bootstrap for UI
- Chart.js for data visualization
- In-memory data store (with optional PostgreSQL support)

## Deployment Options

### Option 1: Deploy to Vercel

1. **Install Vercel CLI**:
   ```
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```
   vercel login
   ```

3. **Deploy to Vercel**:
   Navigate to your project directory and run:
   ```
   vercel
   ```

4. **For Production Deployment**:
   ```
   vercel --prod
   ```

5. **Environment Variables**:
   If you want to use a PostgreSQL database, add the `DATABASE_URL` environment variable in the Vercel project settings.

### Option 2: Traditional Hosting

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   node start.js
   ```

## Running Locally

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL (optional - for persistent storage)

### Setup Instructions

#### Using Visual Studio Code

1. Open the project folder in VS Code
2. Launch the application using one of these methods:

   **Method 1: Using VS Code Debugger**
   - Open the Run and Debug view (Ctrl+Shift+D or Cmd+Shift+D)
   - Select "Launch CHC Patient Management" from the dropdown
   - Click the green play button or press F5

   **Method 2: Using Terminal**
   - Open a terminal in VS Code (Terminal > New Terminal)
   - Run the application by typing:
     ```
     node start.js
     ```

   **Method 3: Using Batch/Shell Scripts**
   - **Windows**: Run `.\start.bat` in the terminal or double-click from File Explorer
   - **Mac/Linux**: Run `./start.sh` in the terminal (you may need to make it executable first with `chmod +x start.sh`)

3. Access the application by opening your browser and navigating to:
   ```
   http://localhost:5000
   ```

### Application Structure

- `start.js` - Main application entry point
- `server/routes.js` - API routes and endpoints
- `server/storage.js` - Data storage and retrieval logic
- `client/simple-index.html` - Main UI for the application
- `start.bat` / `start.sh` - Scripts to easily start the application
- `vercel.json` - Configuration for Vercel deployment

## Using the Application

1. **Dashboard** - View key metrics and statistics
2. **Register Patient** - Add new patient records
3. **Search Patients** - Find and view patient information
4. **Record Vitals** - Record patient vital signs
5. **Book Appointment** - Schedule patient appointments with doctors

## Database Information

By default, the application uses an in-memory storage system that will reset when the server restarts. If you'd like to use PostgreSQL for persistent storage, set up a PostgreSQL database and update the DATABASE_URL environment variable.

## Support

For issues or questions, please contact the system administrator.