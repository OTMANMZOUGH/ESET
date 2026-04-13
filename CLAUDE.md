# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

ESET is a Spanish language learning platform combining grammar/conjugation study with immersive reading and writing practice.

## Stack
- **Frontend:** Next.js (React) + Tailwind CSS
- **Backend:** Laravel (PHP) — REST API
- **Database:** PostgreSQL
- **Auth:** Laravel Sanctum (JWT)
- **Testing:** Pest (unit/integration) + Cypress (E2E)

## Dev Commands

### Laravel (backend)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve              # http://localhost:8000
php artisan test               # run Pest tests
php artisan test --filter ConjugationTest
```

### Next.js (frontend)
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev                    # http://localhost:3000
npm run build
npm run lint
```

### Cypress (E2E)
```bash
cd frontend
npx cypress open               # interactive mode
npx cypress run                # headless CI mode
```

## Project Structure

```
eset/
├── backend/                   # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
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
│   │   └── Services/
│   │       ├── ConjugationService.php   # core conjugation logic
│   │       └── SrsService.php           # spaced repetition algorithm
│   ├── database/migrations/
│   └── tests/
│       └── Feature/
│           ├── ConjugationTest.php
│           └── VocabularyTest.php
│
└── frontend/                  # Next.js app
    ├── app/
    │   ├── (auth)/
    │   ├── reader/
    │   ├── writer/
    │   ├── conjugation/
    │   └── vocabulary/
    ├── components/
    │   ├── Reader/
    │   ├── Flashcard/
    │   └── Editor/
    └── cypress/
        └── e2e/
            ├── auth.cy.js
            ├── reader.cy.js
            └── conjugation.cy.js
```

## Database Schema

```sql
-- Core tables
users               (id, name, email, password, level [A1-C2], created_at)
verbs               (id, infinitive, group, irregularity_type, translations JSON)
verb_forms          (id, verb_id, tense, person, form)
books               (id, title, author, content, difficulty_level, language)
notes               (id, user_id, title, content, created_at, updated_at)
user_vocabulary     (id, user_id, word, translation, next_review_at, mastery_level, source_book_id)
```

## API Routes (Laravel)

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout

GET    /api/verbs
GET    /api/verbs/{id}/conjugate?tense=presente
POST   /api/verbs/check           # check user answer

GET    /api/books
GET    /api/books/{id}
POST   /api/books/{id}/translate  # click-to-translate word

GET    /api/notes
POST   /api/notes
PUT    /api/notes/{id}
DELETE /api/notes/{id}

GET    /api/vocabulary
POST   /api/vocabulary            # save word from reader
GET    /api/vocabulary/due        # words due for SRS review
POST   /api/vocabulary/{id}/review
```

## Code Conventions

### Laravel
- Controllers: thin, delegate logic to Services
- `ConjugationService` handles all verb conjugation — never put conjugation logic in controllers
- Use Form Requests for validation
- All API responses use `ApiResponse` helper: `return ApiResponse::success($data)`
- Migrations: always include `down()` method

### Next.js
- App Router (`app/` directory), no Pages Router
- Server Components by default; use `'use client'` only when needed
- Fetch from Laravel API via `lib/api.ts` utility — never call API directly in components
- Tailwind only for styling — no inline styles, no CSS modules

### Naming
- Laravel: PascalCase classes, snake_case DB columns, camelCase JSON responses
- Next.js: PascalCase components, camelCase hooks (`useVocabulary`, `useConjugation`)
- Cypress: test files named `feature.cy.js`

## Key Business Logic

### Conjugation Engine (`ConjugationService.php`)
- Regular verbs: `-ar`, `-er`, `-ir` endings
- Irregular types: diphthongization (e→ie, o→ue), orthographic changes (c→qu, g→j, z→c)
- Stem-changers must be stored in `verbs.irregularity_type` — never hardcoded

### SRS Algorithm (`SrsService.php`)
- Based on SM-2 algorithm
- `mastery_level` 0–5; interval doubles on correct answer, resets to 1 day on failure
- `next_review_at` updated after every review session

## Testing Strategy

### Unit (Pest)
```php
// Test conjugation correctness
it('conjugates hablar in presente correctly', function () {
    $result = ConjugationService::conjugate('hablar', 'presente');
    expect($result['yo'])->toBe('hablo');
});
```

### E2E (Cypress) — Critical paths
1. `auth.cy.js` — register → login → logout
2. `reader.cy.js` — open book → click word → save to vocabulary
3. `conjugation.cy.js` — complete exercise without errors
4. `srs.cy.js` — review due flashcards → verify next_review_at updated

## Environment Variables

### Backend `.env`
```
APP_URL=http://localhost:8000
DB_CONNECTION=pgsql
DB_DATABASE=eset
SANCTUM_STATEFUL_DOMAINS=localhost:3000
DICTIONARY_API_KEY=your_key_here
```

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Phases
1. Laravel API — Auth + Verbs DB
2. Next.js frontend + API connection
3. E-Reader module + Notes
4. SRS vocabulary system
5. Global tests + deployment

## Future Features (not in MVP)
- Voice recognition for pronunciation testing
- Offline mode (PWA + service worker)
- Dark mode toggle