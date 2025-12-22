# Leaderboard Endpoint Documentation

## Overview
The leaderboard feature requires a new backend endpoint to fetch and rank students by their total points.

## Endpoint Details

**URL:** `/functions/v1/make-server-33549613/leaderboard`  
**Method:** `GET`  
**Authentication:** Required (Bearer token)

## Request
```
GET https://{projectId}.supabase.co/functions/v1/make-server-33549613/leaderboard
Headers:
  Authorization: Bearer {accessToken}
```

## Response Format
```json
{
  "leaderboard": [
    {
      "userId": "user-id-1",
      "username": "student1",
      "name": "Student Name",
      "totalPoints": 1500,
      "rank": 1
    },
    {
      "userId": "user-id-2",
      "username": "student2",
      "name": "Another Student",
      "totalPoints": 1200,
      "rank": 2
    }
    // ... more entries
  ]
}
```

## Implementation Requirements

1. **Fetch all students** with their progress data
2. **Extract totalPoints** from each student's progress
3. **Sort students** by totalPoints in descending order (highest first)
4. **Assign ranks** based on sorted position (1 = highest points)
5. **Return complete list** (not just top 5 - filtering happens on frontend)

## Example SQL Query (Supabase)
```sql
SELECT 
  users.id as "userId",
  users.username,
  users.name,
  student_progress.total_points as "totalPoints",
  ROW_NUMBER() OVER (ORDER BY student_progress.total_points DESC) as rank
FROM users
INNER JOIN student_progress ON users.id = student_progress.user_id
WHERE users.role = 'student'
ORDER BY student_progress.total_points DESC;
```

## Frontend Display Rules
The frontend will automatically:
- Show **top 5 students** to everyone
- Show **current user's rank** if they're outside top 5
- Hide students ranked 6+ (except the current user)

## Notes
- Ranks should start at 1 (not 0)
- Students with equal points should have the same rank
- If no students exist, return empty array
- Ensure proper authentication check before returning data
