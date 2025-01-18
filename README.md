# Firebomb

> Lightweight and Optimal way to use firebase in React.

[![NPM](https://img.shields.io/npm/v/firebomb.svg)](https://www.npmjs.com/package/firebomb) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


Firebomb is a powerful, modular library designed to simplify the integration of Firebase services into your web application. With a flexible API, Firebomb enables developers to utilize Firebase Authentication, Firestore, Cloud Functions, Cloud Messaging, Cloud Storage, and more with ease.

## Table of Contents

1. [Installation](#installation)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Configuration](#configuration)
5. [Client API Overview](#client-api-overview)
   - [Authentication](#authentication)
   - [Firestore](#firestore)
   - [Storage](#storage)
   - [Cloud Functions](#cloud-functions)
   - [Cloud Messaging](#cloud-messaging)
6. [Server-Side API Overview](#client-api-overview)
   - [Admin Authentication](#admin-authentication)
   - [Admin Firestore](#admin-firestore)
   - [Admin Cloud Messaging](#admin-cloud-messaging)
7. [Examples](#examples)
8. [Contributing](#contributing)
9. [License](#license)

---

## Installation

Install Firebomb via npm:

```bash
npm install firebomb
```

Install Firebomb via yarn:

```bash
yarn add firebomb
```

## Features

- Simplified Firebase service integration
- Comprehensive support for Firebase Authentication, Firestore, Cloud Functions, Cloud Messaging, and Storage
- React components and hooks for state management
- Client-side and Server-side support
- TypeScript support for strong typing
- Modular configuration to include only the services you need

## Getting Started

Firebomb is designed to work seamlessly with Firebase. To get started, initialize Firebomb in your project:

```typescript
import { init } from "firebomb/web";

init({
  useAuth: true,
  useFirestore: true,
  useFunctions: true,
  useMessaging: false,
});
```

## Configuration

Firebomb provides flexible configuration options through the `FirebombOptions` interface:

```typescript
interface FirebombOptions {
  useAuth?: boolean;       // Enable Firebase Authentication (default: true)
  useAnalytics?: boolean;  // Enable Firebase Analytics
  useRealtimeDB?: boolean; // Enable Firebase Realtime Database
  useFirestore?: boolean;  // Enable Firestore (default: true)
  useFunctions?: boolean;  // Enable Firebase Cloud Functions
  useMessaging?: boolean;  // Enable Firebase Cloud Messaging
}
```

### Example Configuration

```typescript
init({
  useAuth: true,
  useFirestore: true,
  useMessaging: true,
});
```

## Client API Overview

### Authentication

Firebomb simplifies authentication with built-in hooks and helper functions:

- `AuthProvider`: React context provider for authentication state.
- `useAuth`: Hook to access the current user state.
- `signIn(params: ISignIn)`: Sign in a user with email/password or other methods.
- `signOut()`: Sign out the current user.
- `getCurrentUser()`: Get the currently authenticated user.

Example:

```typescript
import { useAuth } from "firebomb/web";

const userState = useAuth();

if (userState.user) {
  console.log("User is logged in:", userState.user);
}
```

### Firestore

Work with Firestore documents and collections with ease:

- `useFirestore`: Hook to interact with Firestore.
- `createModel`: Create a Firestore model.
- `getDocuments`: Retrieve documents from a collection.
- `useCollection`: Hook to work with collections in real time.
- `useDocument`: Hook to work with individual documents in real time.

Example:

```typescript
import { getDocuments } from "firebomb/web";

const documents = getDocuments("users", { whereBy: [{ field: 'active', operator: '==', value: true }] });
console.log(documents);
```

### Storage

Upload and manage files in Firebase Storage:

- `uploadFile(file: StorageFile, pathname: string)`: Upload a single file.
- `uploadFiles(files: StorageFile[], pathname: string)`: Upload multiple files.
- `uploadUserPhoto(blobFile: Blob)`: Upload a user profile photo.

Example:

```typescript
import { uploadFile } from "firebomb/web";

const result = await uploadFile(file, "uploads/profile.jpg");
console.log("Uploaded file URL:", result.downloadURL);
```

### Cloud Functions

Call Firebase Cloud Functions with ease:

- `callFunction(name: string, payload: object)`: Invoke a function.

Example:

```typescript
import { callFunction } from "firebomb/web";

const result = await callFunction("sendWelcomeEmail", { userId: "12345" });
console.log("Function result:", result);
```

### Cloud Messaging

Integrate push notifications:

- `useAppNotifications`: Hook to manage app notifications.
- `getMessaging`: Get the Firebase Messaging instance.

Example:

```typescript
import { getMessaging } from "firebomb/web";

const messaging = getMessaging();
console.log("Messaging instance:", messaging);
```

## Server API Overview

Firebomb provides server-side support for Firebase services. To activate Admin services, add a service key configuration to your environment variables:

```bash
FB_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"my-project","private_key_id":"..."}'
FB_DATABASE_URL='https://my-project.firebaseio.com' # Optional
```

Firebase Admin will automatically initialize with the provided service account key.

### Admin Authentication

Firebomb provides server-side authentication methods for managing users:

- `generateEmailVerificationLink(email: string, actionCodeSettings?: ActionCodeSettings)`: Generate a verification link.
- `generatePasswordResetLink(email: string, actionCodeSettings?: ActionCodeSettings)`: Generate a password reset link.
- `getCurrentUser(options: IAuthOptions)`: Get the current user record.
- `isUserAuthenticated(session?: string, options?: IAuthOptions)`: Check if a user is authenticated.
- `revokeSession(session: string, options: IAuthOptions)`: Revoke a user session.

Example:

```typescript
import { generateEmailVerificationLink } from "firebomb/admin";

const emailVerificationLink = await generateEmailVerificationLink("user@example.com");
console.log("Verification link:", emailVerificationLink);
```

### Admin Firestore

Server-side Firestore operations are streamlined:

- `getDocuments(collection: string, options?: IDocumentsQueryOptions)`: Retrieve documents from a collection.
- `getDocument(collection: string, document: string)`: Retrieve a specific document.
- `deleteDocument(collection: string, document: string)`: Delete a specific document.
- `setDocument(collection: string, arg2: string | GenericObject, form?: GenericObject)`: Create or update a document.
- `listCollections(databaseId?: string)`: List all collections in a database.

Example:

```typescript
import { getDocuments } from "firebomb/admin";

const users = await getDocuments("users", {
  orderBy: [{ field: "createdAt", direction: "desc" }],
});
console.log("Active users:", users);
```

### Admin Cloud Messaging

Send notifications from the server:

- `getMessaging(app?: App)`: Get the Firebase Messaging instance.

Example:

```typescript
import { getMessaging } from "firebomb/admin";

const messaging = getMessaging();
messaging.send({
  notification: {
    title: "Hello!",
    body: "This is a test message.",
  },
  token: "user-device-token",
});
```

## Examples

### Basic Authentication

```typescript
import { signIn } from "firebomb/web";

const signInUser = async () => {
  try {
    const userCredential = await signIn({
      email: "user@example.com",
      password: "password123",
    });
    console.log("Signed in user:", userCredential.user);
  } catch (error) {
    console.error("Error signing in:", error);
  }
};
```

### Firestore Query

```typescript
import { getDocuments } from "firebomb/web";

const users = await getDocuments("users", {
  orderBy: [{ field: "createdAt", direction: "desc" }],
});
console.log("Active users:", users);
```

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
