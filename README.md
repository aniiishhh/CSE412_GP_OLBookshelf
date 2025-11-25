# Online Bookshelf

A full-stack web application for browsing, searching, and managing your personal reading list. Built with React (TypeScript) frontend and FastAPI (Python) backend, using PostgreSQL as the database.

## Features

- **User Authentication**: Secure signup and login with JWT-based authentication
- **Book Browsing**: Browse through a collection of 100,000+ books with pagination (50 books per page)
- **Advanced Search & Filtering**:
  - Search books by title
  - Filter by multiple authors (type-to-search dropdown with tag selection)
  - Filter by multiple genres (type-to-search dropdown with tag selection)
  - Filter by rating range (dual-handle slider for min/max rating)
- **Book Details**: Comprehensive book information page showing:
  - Book cover image
  - Title, authors, and genres
  - Average rating and total ratings
  - Description, page count, ISBN
  - Goodreads link
- **Reading List Management**:
  - Add/remove books from personal reading list
  - Track reading status (Want to Read, Reading, Completed, Dropped)
  - Update progress (pages read)
  - Rate books (0-5 stars)
  - Write and save personal notes
  - All data persists in the database
- **Responsive UI**: Modern, clean interface with sticky navigation and floating search bar

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** and npm ([Download](https://nodejs.org/))
- **PostgreSQL 12+** ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

### Optional Tools

- **pgAdmin** (for easier database management) ([Download](https://www.pgadmin.org/download/))

## Setup Instructions

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd OL_Bookshelf/CSE412_GP_OLBookshelf
```

### Step 2: Extract Data Files

The data files are compressed in a ZIP file. Extract them before populating the database.

**On macOS/Linux:**
```bash
cd data
unzip Data.zip
cd ..
```

**On Windows (PowerShell):**
```powershell
cd data
Expand-Archive -Path Data.zip -DestinationPath .
cd ..
```

**On Windows (Command Prompt):**
```cmd
cd data
tar -xf Data.zip
cd ..
```

After extraction, you should see the following structure in `data/clean_data/`:
- `authors_table.csv`
- `book_author_table.csv`
- `book_genre_table.csv`
- `books_table.csv`
- `genres_table.csv`
- `reading_list_table.csv`
- `users_table.csv`

> **Note**: The data cleaning and preprocessing was done in the Jupyter notebook at [`notebooks/preprocessing.ipynb`](notebooks/preprocessing.ipynb). This notebook processes the raw GoodReads data (`data/GoodReads_100k_books.csv`) and generates the clean CSV files used for database population.

### Step 3: Set Up PostgreSQL Database

#### Option A: Local PostgreSQL Installation

1. Install PostgreSQL on your machine (if not already installed)
2. Start the PostgreSQL service
3. Create a new database:

```sql
CREATE DATABASE bookshelf;
```

4. Note down your database credentials:
   - Host: `localhost` (default)
   - Port: `5432` (default)
   - Database name: `bookshelf`
   - Username: `postgres` (or your custom username)
   - Password: (your PostgreSQL password)

#### Option B: Online PostgreSQL (e.g., AWS RDS, Heroku, ElephantSQL)

1. Create a PostgreSQL database instance on your chosen platform
2. Note down the connection details (host, port, database name, username, password)

### Step 4: Create Database Tables

Run the DDL script to create all necessary tables in your database.

**Using pgAdmin:**
1. Open pgAdmin and connect to your database
2. Right-click on your database → Query Tool
3. Open the file [`sql/DDL/CREATE_MASTER.sql`](sql/DDL/CREATE_MASTER.sql)
4. Execute the script (F5 or click Run)

**Using psql command line:**
```bash
psql -U postgres -d bookshelf -f sql/DDL/CREATE_MASTER.sql
```

This script creates the following tables:
- `User` - User accounts
- `Book` - Book information
- `Author` - Author information
- `Genre` - Genre categories
- `BookAuthor` - Many-to-many relationship between books and authors
- `BookGenre` - Many-to-many relationship between books and genres
- `ReadingList` - User's personal reading list entries

### Step 5: Update Data Population Script Paths

Before running the data population script, you need to update the file paths in [`sql/DataPopulation/data_population.sql`](sql/DataPopulation/data_population.sql) to match your system's absolute path.

**On macOS/Linux:**
The paths should look like:
```sql
FROM '/Users/yourusername/path/to/CSE412_GP_OLBookshelf/data/clean_data/users_table.csv'
```

**On Windows:**
The paths should look like:
```sql
FROM 'C:\Users\yourusername\path\to\CSE412_GP_OLBookshelf\data\clean_data\users_table.csv'
```

**Quick Path Update:**

**On macOS/Linux:**
```bash
# Get your current absolute path
pwd
# Then update the paths in sql/DataPopulation/data_population.sql accordingly
```

**On Windows (PowerShell):**
```powershell
# Get your current absolute path
Get-Location
# Then update the paths in sql/DataPopulation/data_population.sql accordingly
```

**On Windows (Command Prompt):**
```cmd
cd
# Then update the paths in sql/DataPopulation/data_population.sql accordingly
```

### Step 6: Populate Database with Data

Run the data population script to load all CSV data into the database.

**Using pgAdmin:**
1. Open the file [`sql/DataPopulation/data_population.sql`](sql/DataPopulation/data_population.sql)
2. Make sure all file paths are updated (see Step 5)
3. Execute the script in pgAdmin Query Tool

**Using psql command line:**
```bash
psql -U postgres -d bookshelf -f sql/DataPopulation/data_population.sql
```

> **Note**: If you encounter permission errors with the `COPY` command, you may need to use `\copy` instead in psql, or ensure PostgreSQL has read access to the CSV files.

This will populate your database with:
- User accounts
- Books (100,000+ entries)
- Authors and their relationships to books
- Genres and their relationships to books
- Sample reading list entries

### Step 7: Configure Backend Environment Variables

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a `.env` file from the example:
```bash
# On macOS/Linux
cp env.example .env

# On Windows (PowerShell)
Copy-Item env.example .env

# On Windows (Command Prompt)
copy env.example .env
```

3. Edit the `.env` file and update the following variables with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookshelf
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=your_jwt_secret_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=30
```

> **Important**: 
> - Replace `your_password_here` with your actual PostgreSQL password
> - Replace `your_jwt_secret_key_here` with a secure random string (e.g., generate one using `openssl rand -hex 32`)

### Step 8: Install Backend Dependencies

1. Create a Python virtual environment (recommended):

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows:**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

The main dependencies include:
- FastAPI
- SQLAlchemy
- psycopg2-binary (PostgreSQL adapter)
- python-jose (JWT authentication)
- bcrypt (password hashing)
- python-dotenv (environment variables)

### Step 9: Install Frontend Dependencies

1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

This will install all required packages including:
- React
- TypeScript
- Vite (build tool)
- React Router (for navigation)
- And other UI dependencies

### Step 10: Run the Application

#### Start the Backend Server

1. Navigate to the backend directory:
```bash
cd backend
```

2. Activate your virtual environment (if not already active):

**On macOS/Linux:**
```bash
source venv/bin/activate
```

**On Windows:**
```powershell
.\venv\Scripts\Activate.ps1
```

3. Start the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`

You can also access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

#### Start the Frontend Development Server

1. Open a new terminal window/tab
2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Start the Vite development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Step 11: Test the Application

1. Open your browser and navigate to `http://localhost:5173`
2. You should see the login page
3. Create a new account or use an existing user from the database
4. After logging in, you'll be able to:
   - Browse books on the homepage
   - Search and filter books
   - View book details
   - Add books to your reading list
   - Manage your reading list

## Project Structure

```
CSE412_GP_OLBookshelf/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Database configuration
│   ├── models.py               # SQLAlchemy ORM models and Pydantic schemas
│   ├── auth.py                 # Authentication utilities
│   ├── requirements.txt        # Python dependencies
│   ├── env.example             # Environment variables template
│   └── routers/                # API route handlers
│       ├── auth.py             # Authentication endpoints
│       ├── books.py            # Book-related endpoints
│       ├── authors.py          # Author-related endpoints
│       ├── genres.py           # Genre-related endpoints
│       ├── users.py            # User-related endpoints
│       └── readinglist.py      # Reading list endpoints
├── frontend/
│   ├── src/
│   │   ├── App.tsx             # Main React application (all UI logic)
│   │   ├── main.tsx            # React entry point
│   │   └── index.css           # Global styles
│   ├── package.json            # Node.js dependencies
│   └── vite.config.ts          # Vite configuration
├── data/
│   ├── Data.zip                # Compressed data files
│   ├── clean_data/             # Extracted CSV files for database population
│   └── GoodReads_100k_books.csv # Raw source data
├── sql/
│   ├── DDL/
│   │   └── CREATE_MASTER.sql   # Database schema creation script
│   └── DataPopulation/
│       └── data_population.sql  # Data population script
├── notebooks/
│   └── preprocessing.ipynb     # Data cleaning and preprocessing notebook
└── README.md                   # This file
```

## API Endpoints

The backend provides the following main API endpoints:

- **Authentication**:
  - `POST /auth/register` - Register a new user
  - `POST /auth/login` - Login and get JWT token

- **Books**:
  - `GET /books/` - Get paginated list of books with filters
  - `GET /books/{book_id}` - Get book details

- **Authors**:
  - `GET /authors/` - Get list of authors (with search)

- **Genres**:
  - `GET /genres/` - Get list of genres (with search)

- **Reading List**:
  - `GET /readinglist/{user_id}` - Get user's reading list
  - `POST /readinglist/` - Add book to reading list
  - `PATCH /readinglist/{user_id}/{book_id}` - Update reading list item
  - `DELETE /readinglist/{user_id}/{book_id}` - Remove book from reading list

For detailed API documentation, visit `http://localhost:8000/docs` when the backend is running.

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Verify database credentials in `.env` file
- Test connection using: `psql -U postgres -d bookshelf`

### Port Already in Use

- Backend (port 8000): Change port in `uvicorn` command or kill the process using the port
- Frontend (port 5173): Vite will automatically suggest an alternative port

### CORS Errors

- Ensure the backend CORS middleware is configured correctly in [`backend/main.py`](backend/main.py)
- The frontend URL (`http://localhost:5173`) should be in the allowed origins list

### Data Population Errors

- Verify CSV file paths in [`sql/DataPopulation/data_population.sql`](sql/DataPopulation/data_population.sql) are correct
- Ensure PostgreSQL has read permissions for the CSV files
- Check that tables were created successfully before running the population script

## Development Notes

- The frontend code is consolidated in [`frontend/src/App.tsx`](frontend/src/App.tsx) for simplicity
- All database models and schemas are defined in [`backend/models.py`](backend/models.py)
- The database schema follows the DDL defined in [`sql/DDL/CREATE_MASTER.sql`](sql/DDL/CREATE_MASTER.sql)

## License

See [LICENSE](LICENSE) file for details.

## Contributors

- CSE 412 Group Project Team

---

For questions or issues, please refer to the project documentation or contact the development team.

