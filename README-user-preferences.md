# User Preferences

This document outlines the user preferences system implemented in the AI Chat Web Application, which allows for persistent storage of user settings across sessions.

## Overview

The user preferences system enables the application to remember user-specific settings, such as theme preferences, API keys, and most recently used AI providers and models. These preferences are stored locally and persist across browser sessions, enhancing the user experience by maintaining continuity.

## Implementation Details

### User Interface

The user preferences are managed through:

- **Settings Page**: Allows users to configure API keys for different providers
- **Chat Interface**: Automatically remembers and restores the last used provider and model
- **Profile Page**: Enables users to update personal information and preferences

### Technical Implementation

#### User Context

The core of the user preferences system is implemented in `src/contexts/UserContext.tsx`. This context provides:

- A `User` interface that defines the structure of user data, including preferences
- Functions for updating and persisting user preferences
- Integration with local storage for data persistence

#### User Interface

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  preferences: {
    theme?: string;
    openaiApiKey?: string;
    anthropicApiKey?: string;
    geminiApiKey?: string;
    lastUsedProvider?: string;
    lastUsedModel?: string;
  };
}
```

#### Preference Storage

User preferences are stored in the browser's localStorage to ensure persistence across sessions:

```typescript
// Storing user data in localStorage
localStorage.setItem('currentUser', JSON.stringify(user));

// Retrieving user data from localStorage
const storedUser = localStorage.getItem('currentUser');
if (storedUser) {
  setCurrentUser(JSON.parse(storedUser));
}
```

#### Updating Preferences

The `updateProfile` function in the UserContext allows for updating user preferences:

```typescript
const updateProfile = (updates: Partial<User>) => {
  if (currentUser) {
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return true;
  }
  return false;
};
```

### Provider and Model Persistence

A key feature of the user preferences system is the ability to remember the last used AI provider and model:

1. When a user selects a provider or model in the Chat interface, these selections are saved to user preferences
2. When the user returns to the application or starts a new chat, these preferences are loaded automatically
3. The Chat component prioritizes provider/model settings from an existing chat if available, falling back to user preferences for new chats

#### Implementation in Chat Component

The Chat component (`src/pages/Chat.tsx`) implements the logic for loading and saving provider/model preferences:

```typescript
// Load user preferences when component mounts or user changes
useEffect(() => {
  if (user) {
    const initialProvider = getInitialProvider();
    setSelectedProvider(initialProvider);
    setSelectedModel(getInitialModel(initialProvider));
    
    console.log('Loaded user preferences:', {
      providerId: initialProvider.id,
      lastUsedProvider: user.preferences.lastUsedProvider,
      lastUsedModel: user.preferences.lastUsedModel
    });
  }
}, [user]);

// Save user preferences when provider or model changes
useEffect(() => {
  if (user && selectedProvider && selectedModel) {
    updateProfile({
      ...user,
      preferences: {
        ...user.preferences,
        lastUsedProvider: selectedProvider.id,
        lastUsedModel: selectedModel.id
      }
    });
  }
}, [selectedProvider, selectedModel, user]);
```

#### Chat Loading Logic

When loading a chat, the application follows this priority order:

1. If a specific chat is being loaded (via chatId), use that chat's provider and model if available
2. If no chat-specific provider/model or creating a new chat, use the user's last used provider/model from preferences
3. If no preferences are available, fall back to default provider and model

## Usage

### For Users

Users don't need to take any specific actions to use this feature. The application automatically:

- Remembers the last AI provider and model used
- Restores these selections when returning to the application
- Maintains API keys across sessions

### For Developers

When extending the user preferences system:

1. Add new preference properties to the `User` interface in `UserContext.tsx`
2. Update the relevant components to read from and write to these preferences
3. Ensure proper fallback values are provided for cases where preferences don't exist

## Troubleshooting

Common issues with user preferences:

- **Preferences not saving**: Check if the user is properly authenticated and the `updateProfile` function is being called
- **Preferences not loading**: Verify that localStorage is accessible and contains the expected data
- **Default values being used instead of preferences**: Ensure the loading logic is correctly prioritizing user preferences

## Future Enhancements

Planned improvements to the user preferences system:

- Cloud synchronization of preferences across devices
- More granular control over which preferences are stored locally vs. in the cloud
- User interface for managing all preferences in one place
- Preference export/import functionality 