# Teacher Registration Code

## Overview

To create a teacher account, you need a special registration code. This prevents unauthorized users from creating teacher accounts.

## Teacher Registration Codes

There are two types of teacher accounts:

### Regular Teacher
**Code:** **QURAN2024**
- Can view all students
- Can view student passwords
- Can unlock levels for students
- Can delete students

### Master Teacher
**Code:** **MASTER2024**
- All regular teacher permissions
- **Can also delete other teachers**
- Has full administrative access

You can change these codes by editing the file `/supabase/functions/server/index.tsx` on lines 8-9.

## How to Register as a Teacher

1. Go to the signup page
2. Fill in your name, username, and password
3. Select "Teacher" as your role
4. Enter the teacher registration code:
   - **QURAN2024** for regular teacher
   - **MASTER2024** for master teacher
5. Click "Sign Up"

## Teacher Permissions

Once logged in as a teacher, you have access to the following features:

### Student Management
- **View all students** - See a complete list of all registered students
- **View student passwords** - Click the eye icon to view a student's password (in case they forget)
- **Unlock levels** - Click the unlock icon to manually unlock any level for a student
- **Delete students** - Click the trash icon to permanently remove a student account

### Progress Tracking
- View detailed progress for each student
- See when students were last active
- Track completion rates across all students
- View level distribution statistics

## Important Notes

1. **Password Storage**: Student passwords are stored in the database to allow teachers to recover them if students forget. Make sure to inform students not to use sensitive passwords.

2. **Teacher Code Security**: Keep the teacher registration code private and only share it with authorized teachers.

3. **Deletion**: Deleting a student is permanent and cannot be undone. All their progress will be lost.

## Security Recommendations

For production use, consider:
- Changing the default teacher registration code
- Using environment variables for the teacher code
- Implementing additional teacher verification steps
- Adding audit logs for teacher actions