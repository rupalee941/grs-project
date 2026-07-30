# Discussion Forum API Quick Reference

## Base URL
```
http://localhost:5000/api/discussion
```

---

## Endpoints

### 1. Create Question
```http
POST /question

Request Body:
{
  "userId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "question": "What is the process for filing a complaint?"
}

Response:
{
  "msg": "Question registered"
}
```

---

### 2. Get All Questions (For Users)
```http
GET /questions

Response:
{
  "msg": "Data fetched",
  "questions": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "userId": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0a1",
        "name": "John Doe"
      },
      "question": "How to track my complaint?",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "answers": [
        {
          "_id": "64a1b2c3d4e5f6g7h8i9j0a2",
          "userId": {
            "_id": "64a1b2c3d4e5f6g7h8i9j0b1",
            "name": "Jane Smith"
          },
          "answer": "You can track your complaint from the dashboard.",
          "status": "active",
          "createdAt": "2024-01-15T11:00:00Z"
        }
      ]
    }
  ]
}
```

---

### 3. Get All Questions (For Admin)
```http
GET /show

Response:
{
  "msg": "Data fetched",
  "questions": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "userId": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0a1",
        "name": "John Doe"
      },
      "question": "How to track my complaint?",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 4. Create Answer
```http
POST /answer

Request Body:
{
  "questionId": "64a1b2c3d4e5f6g7h8i9j0k2",
  "userId": "64a1b2c3d4e5f6g7h8i9j0a2",
  "answer": "You can track your complaint from the dashboard."
}

Response:
{
  "msg": "Answer added"
}
```

---

### 5. Get Answers by Question ID
```http
GET /answer/:id

Example:
GET /answer/64a1b2c3d4e5f6g7h8i9j0k2

Response:
{
  "msg": "data fetched",
  "answer": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0a2",
      "questionId": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
        "question": "How to track my complaint?"
      },
      "userId": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0b1",
        "name": "Jane Smith"
      },
      "answer": "You can track your complaint from the dashboard.",
      "status": "active",
      "createdAt": "2024-01-15T11:00:00Z"
    }
  ]
}
```

---

### 6. Get Forum Statistics
```http
GET /count

Response:
{
  "msg": "Count fetched",
  "totalQuestions": 15,
  "totalAnswers": 42
}
```

---

## Integration Points

### User Dashboard
```javascript
// Fetch forum count
GET /api/discussion/count
// Display card with totalQuestions count
```

### Admin Dashboard
```javascript
// Fetch forum count
GET /api/discussion/count
// Display two cards:
// 1. FORUM QUESTIONS (totalQuestions)
// 2. FORUM ANSWERS (totalAnswers)
```

### User Discussion Forum Page
```javascript
// Fetch all questions with answers
GET /api/discussion/questions

// Create question
POST /api/discussion/question
Body: { userId, question }

// Create answer
POST /api/discussion/answer
Body: { questionId, userId, answer }
```

### Admin Discussion Forum Page
```javascript
// Fetch all questions
GET /api/discussion/show
// Display in DataTable with columns:
// - S NO., QUESTION, POSTED BY, ANSWERS
```

---

## Error Handling

### Missing Required Fields
```json
{
  "msg": "All fields are required"
}
```

### Server Error
```json
{
  "msg": "Server Error"
}
```

---

## Status Values
- `active` - Question/Answer is visible
- `inactive` - Question/Answer is hidden
- `delete` - Question/Answer is marked for deletion

---

## Frontend Components Using These APIs

| Component | Endpoints Used | Purpose |
|-----------|----------------|---------|
| User Discussion Forum | /questions, /question, /answer, /count | Display & manage forum |
| Admin Discussion Forum | /show | Admin view of all questions |
| User Dashboard | /count | Show forum stats |
| Admin Dashboard | /count | Show forum stats |

---

## Important Notes

1. **UserId Required**: All question/answer creation requires a valid userId
2. **Populate Fields**: 
   - `userId` is populated with user `name`
   - Data is returned with proper relationships
3. **Timestamps**: All records include `createdAt` and `updatedAt`
4. **Status Filter**: 
   - `/questions` returns only `active` questions
   - `/show` returns `active` and `inactive` questions
   - `/count` counts only `active` questions/answers

---

## Testing Requests (cURL examples)

### Create Question
```bash
curl -X POST http://localhost:5000/api/discussion/question \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID_HERE","question":"Your question here?"}'
```

### Get Questions
```bash
curl http://localhost:5000/api/discussion/questions
```

### Create Answer
```bash
curl -X POST http://localhost:5000/api/discussion/answer \
  -H "Content-Type: application/json" \
  -d '{"questionId":"QUESTION_ID","userId":"USER_ID","answer":"Your answer"}'
```

### Get Count
```bash
curl http://localhost:5000/api/discussion/count
```

---

## Frontend LocalStorage Requirements

The frontend uses the following localStorage keys:
- `userId` - User ID for posting questions/answers (required)
- `user` - User object with email for complaint stats

---

## Database Collections

### Questions Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  question: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Answers Collection
```javascript
{
  _id: ObjectId,
  questionId: ObjectId,
  userId: ObjectId,
  answer: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Response Message Keys

| Operation | Success Message |
|-----------|-----------------|
| Create Question | "Question registered" |
| Get Questions | "Data fetched" |
| Get Admin Questions | "Data fetched" |
| Create Answer | "Answer added" |
| Get Answers | "data fetched" |
| Get Count | "Count fetched" |
| Error | "Server Error" or "All fields are required" |
