# TODO: Implement Profile Edit, Auth, Reset Password, and Home Reviews

## Step 1: Install Dependencies
- [x] Install @emailjs/browser: `npm install @emailjs/browser`

## Step 2: Update Backend Structure
- [x] Edit src/services/db.json: Add "users": [] and "reviews": [] arrays.

## Step 3: Extend Services
- [x] Update src/services/fetch.js: Add functions for:
  - registerUser(userData): POST /users
  - loginUser(email, password): GET /users, match credentials
  - updateUser(id, userData): PUT /users/${id}
  - deleteUser(id): DELETE /users/${id}
  - getReviews(): GET /reviews
  - postReview(reviewData): POST /reviews
  - sendResetEmail(email): Use EmailJS with provided service/template/public key

## Step 4: Implement Authentication
- [x] Update src/components/RegisterForm.jsx: On submit, call registerUser, store user in localStorage, navigate to /dashboard
- [x] Update src/components/LoginForm.jsx: On submit, call loginUser, store user, navigate to /dashboard. Add forgot password: Prompt email, call sendResetEmail
- [x] Enhance src/routes/PrivateRoute.jsx: Check localStorage user, redirect to /login if not

## Step 5: Create Profile Features
- [x] Create src/components/ProfileEdit.jsx: Form for edit name/email/photo (FileReader for preview, base64), change password, delete (confirm, deleteUser, clear localStorage, to /login), back to home button
- [x] Create src/pages/Profile.jsx: Import and render ProfileEdit
- [x] Update src/routes/Routing.jsx: Add { path: 'profile', element: <PrivateRoute><Profile /></PrivateRoute> }

## Step 6: Integrate Home Reviews
- [x] Read/update src/components/HomeContent.jsx: Check localStorage user, show rating form (stars, comment) if logged in, on submit call postReview with userId, fetch/display reviews with user names (join with users)

## Step 7: Additional Updates
- [x] Update src/components/Header.jsx: Add profile link if logged in, logout button (clear localStorage, to /)
- [x] Create src/styles/Profile.css: Styles for profile form/upload
- [x] Test: Register, login, edit profile (upload photo), delete, reset email, home review submission/display

## Step 8: Verification
- [x] Ensure all routes protected where needed (dashboard, profile)
- [x] Confirm EmailJS config in services
