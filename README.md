# ESET - Spanish Language Learning Platform

A comprehensive Spanish language learning platform combining grammar/conjugation study with immersive reading and writing practice.

## Features

- **Verb Conjugation Practice**: Learn and practice Spanish verb conjugations with immediate feedback
- **Spaced Repetition System (SRS)**: Smart vocabulary learning using the SM-2 algorithm
- **Interactive Reader**: Read Spanish texts with click-to-translate functionality
- **Note Taking**: Create and manage personal study notes
- **Progress Tracking**: Monitor your learning journey with detailed statistics

## Tech Stack

### Backend
- **Laravel 13** (PHP 8.3+)
- **PostgreSQL** / SQLite (for development)
- **Laravel Sanctum** (JWT Authentication)
- **PHPUnit** (Testing)

### Frontend
- **Next.js 15** (React 19)
- **TypeScript**
- **Tailwind CSS**
- **Turbopack**

## Getting Started

### Prerequisites
- PHP 8.3+
- Composer
- Node.js 20+
- PostgreSQL (or use SQLite for development)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations and seeders
php artisan migrate:fresh --seed

# Start the development server
php artisan serve
# Server will run on http://localhost:8000
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Start the development server
npm run dev
# Server will run on http://localhost:3000
```

## Project Structure

```
eset/
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   ├── VerbController.php
│   │   │   ├── BookController.php
│   │   │   ├── NoteController.php
│   │   │   └── VocabularyController.php
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Verb.php
│   │   │   ├── Book.php
│   │   │   ├── Note.php
│   │   │   └── UserVocabulary.php
│   │   ├── Services/
│   │   │   ├── ConjugationService.php
│   │   │   └── SrsService.php
│   │   └── Helpers/
│   │       └── ApiResponse.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
│
└── frontend/                   # Next.js app
    ├── app/
    ├── components/
    └── lib/
        └── api.ts             # API client utility
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/user` - Get authenticated user

### Verbs
- `GET /api/verbs` - List all verbs
- `GET /api/verbs/random` - Get random verb for practice
- `GET /api/verbs/{id}/conjugate?tense=presente` - Get conjugations
- `POST /api/verbs/check` - Check user answer

### Books
- `GET /api/books` - List all books
- `GET /api/books/{id}` - Get book details
- `POST /api/books/{id}/translate` - Translate word

### Notes
- `GET /api/notes` - List user notes
- `POST /api/notes` - Create note
- `PUT /api/notes/{id}` - Update note
- `DELETE /api/notes/{id}` - Delete note

### Vocabulary
- `GET /api/vocabulary` - List user vocabulary
- `POST /api/vocabulary` - Add word
- `GET /api/vocabulary/due` - Get words due for review
- `POST /api/vocabulary/{id}/review` - Submit review
- `GET /api/vocabulary/stats` - Get user statistics

## Database Schema

### Core Tables
- **users**: User accounts with Spanish proficiency level (A1-C2)
- **verbs**: Spanish verbs with irregularity types
- **verb_forms**: Pre-computed verb conjugations
- **books**: Spanish reading materials with difficulty levels
- **notes**: User-created study notes
- **user_vocabulary**: SRS-tracked vocabulary with mastery levels

## Key Features

### Conjugation Engine
The `ConjugationService` handles:
- Regular verbs: `-ar`, `-er`, `-ir` patterns
- Stem-changing verbs: `e→ie`, `o→ue`, `e→i`
- Orthographic changes: `c→qu`, `g→gu`, `z→c`
- Multiple tenses: presente, preterito, imperfecto, futuro

### SRS Algorithm
The `SrsService` implements SM-2 algorithm with:
- 6 mastery levels (0-5)
- Adaptive review intervals (1 day → 30 days)
- Automatic scheduling based on performance

## Development

### Running Tests
```bash
cd backend
php artisan test
```

### Code Standards
- **Laravel**: PSR-12, thin controllers, service layer pattern
- **Next.js**: TypeScript strict mode, server components by default
- **API**: RESTful conventions, consistent JSON responses

## Environment Variables

### Backend (.env)
```env
APP_URL=http://localhost:8000
DB_CONNECTION=pgsql
DB_DATABASE=eset
SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is open-source and available under the MIT License.

## Roadmap

- [ ] Frontend UI implementation
- [ ] E2E tests with Cypress
- [ ] Voice recognition for pronunciation
- [ ] PWA offline mode
- [ ] Mobile apps (React Native)
- [ ] Dark mode theme

## Support

For issues and questions, please open an issue on GitHub.
