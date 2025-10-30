# Registration Route Update Instructions

## File to Update
`src/app/api/auth/register/route.js`

## Changes Needed

### 1. Add Import Statement (at the top of the file)
Add this import after the existing imports:
```javascript
import { validateRegistrationCredentials } from '../../../../middleware/blockedCredentialsCheck';
```

### 2. Add Blocked Credentials Check (in the POST function, after line 10)
Add this code block after `const { userType, email, password, ...profileData } = body;`:

```javascript
// Check if any credentials are blocked (only for designers)
if (userType === 'designer') {
  const validationResult = await validateRegistrationCredentials({
    userType,
    email,
    ...profileData
  });

  if (!validationResult.allowed) {
    // Credentials are blocked - automatically block this registration attempt
    return NextResponse.json(
      {
        error: 'Account Blocked',
        message: validationResult.message,
        blocked: true
      },
      { status: 403 }
    );
  }
}
```

### Complete Updated Section Should Look Like:
```javascript
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { userType, email, password, ...profileData } = body;

    // Check if any credentials are blocked (only for designers)
    if (userType === 'designer') {
      const validationResult = await validateRegistrationCredentials({
        userType,
        email,
        ...profileData
      });

      if (!validationResult.allowed) {
        // Credentials are blocked - automatically block this registration attempt
        return NextResponse.json(
          {
            error: 'Account Blocked',
            message: validationResult.message,
            blocked: true
          },
          { status: 403 }
        );
      }
    }

    // Validate required fields
    if (!email || !password || !userType) {
      return NextResponse.json(
        { error: 'Email, password, and user type are required' },
        { status: 400 }
      );
    }

    // ... rest of the existing code
```

## What This Does
1. Before allowing registration, it checks if the designer's credentials (email, phone, Aadhaar, PAN) are in the blocked list
2. If any credential is blocked, it immediately returns a 403 error and prevents registration
3. The error message tells the user their account is blocked
4. This check only applies to designer registrations (buyers are not affected)
