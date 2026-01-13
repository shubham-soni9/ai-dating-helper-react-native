# React Native Email Verification Sign-In Flow - Complete Specification

## Project Overview

Create a complete, production-ready email verification authentication flow for React Native Expo with modular architecture and best practices.

---

## 1. Project Structure & Architecture

```
src/
├── screens/
│   ├── EmailInputScreen.tsx
│   ├── VerificationCodeScreen.tsx
│   └── WebViewScreen.tsx
├── components/
│   ├── common/
│   │   ├── CustomButton.tsx
│   │   ├── CustomTextInput.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── FooterLinks.tsx
│   └── auth/
│       ├── EmailInput.tsx
│       ├── VerificationCodeInput.tsx
│       └── ResendTimer.tsx
├── navigation/
│   └── AuthNavigator.tsx
├── services/
│   └── authService.ts
├── hooks/
│   ├── useEmailValidation.ts
│   ├── useVerificationCode.ts
│   └── useResendTimer.ts
├── utils/
│   ├── validation.ts
│   └── constants.ts
├── types/
│   └── auth.types.ts
└── theme/
    ├── colors.ts
    ├── typography.ts
    └── spacing.ts
```

---

## 2. Screen 1: Email Input Screen

### Features

- Email input field with validation
- Real-time email format validation
- Clear button (X) when email is entered
- Continue button (disabled until valid email)
- Helper text: "Use an organisation email to easily collaborate with teammates"
- Terms & Conditions checkbox/agreement text with clickable links
- Footer with "Privacy & terms" and "Need help?" links
- Copyright notice: "© 2025 Notion Labs, Inc."

### Validation Rules

- Valid email format (regex)
- Non-empty field
- Button enabled only when email is valid

### User Interactions

- Tap email field → show keyboard, highlight field with blue border
- Type email → show X button to clear
- Invalid email → show subtle error state (optional red border)
- Valid email → enable Continue button
- Tap Continue → send verification code API call → navigate to verification screen
- Tap Terms/Privacy links → open WebView screen

---

## 3. Screen 2: Verification Code Screen

### Features

- Display entered email at top (editable with X button to go back)
- Verification code input field (6-character code)
- Message: "We have sent a code to your inbox"
- Continue button (disabled until code length = 6)
- Resend timer: "Resend in Xs" countdown from 25-30 seconds
- After timer expires: "Resend code" clickable link
- Loading state on Continue button when verifying
- Same footer links as Screen 1

### Code Input Behavior

- Auto-focus on mount
- Accept only alphanumeric characters
- Auto-capitalize (e.g., "JC26Nc")
- Max length: 6 characters
- When 6 characters entered → auto-enable Continue button

### Resend Logic

- Start 25-second countdown on screen mount
- Disable resend during countdown
- After countdown → enable "Resend code" link
- On resend → restart countdown, call API to resend code
- Show success toast: "Code resent to your email"

### Verification Flow

- Tap Continue → show loading spinner
- Call verification API with email + code
- Success → navigate to main app
- Error → show error message below code input: "Invalid code. Please try again."
- Keep code in field for user to edit

### Email Edit

- Tap X next to email → clear email and navigate back to Email Input screen

---

## 4. Screen 3: WebView Screen

### Features

- Full-screen WebView component
- Navigation header with:
  - Back button (← arrow)
  - Page title (dynamic: "Privacy Policy" or "Terms & Conditions")
  - Close button (X)
- Loading indicator while page loads
- Error handling for failed page loads
- SafeAreaView for notch/status bar handling

### URLs to Support

- Privacy Policy URL (passed as param)
- Terms & Conditions URL (passed as param)

---

## 5. Technical Implementation Requirements

### Navigation

- Use React Navigation (Stack Navigator)
- Screens: EmailInput → VerificationCode → WebView (modal)
- Pass params: email, verification URLs

### State Management

- Use React hooks (useState, useEffect)
- Optional: Context API for auth state
- No Redux required for this flow

### API Integration

Create `authService.ts` with functions:

- `sendVerificationCode(email: string): Promise<Response>`
- `verifyCode(email: string, code: string): Promise<Response>`
- `resendCode(email: string): Promise<Response>`

Requirements:
- Use axios or fetch
- Handle errors gracefully with try-catch
- Show loading states during API calls

### Form Validation

- Email regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Real-time validation (onChange)
- Visual feedback (border colors)

### Styling

**Dark Theme Colors:**
- Background: `#191919` or `#1a1a1a`
- Input background: `#2d2d2d`
- Input border (default): `#3d3d3d`
- Input border (focused): `#3b82f6` (blue)
- Text: `#ffffff`
- Secondary text: `#a0a0a0`
- Button: `#3b82f6` (blue)
- Button disabled: `#4a5568`

**Typography:**
- Primary font: System default or Inter
- Input text: 16px
- Button text: 16px, semi-bold
- Helper text: 14px
- Footer links: 14px

### Accessibility

- accessibilityLabel for all interactive elements
- accessibilityHint for buttons
- Keyboard navigation support
- Screen reader support

### Error Handling

- Network errors → show retry option
- Invalid code → show inline error message
- API errors → show user-friendly messages
- Timeout handling

### Edge Cases

- No internet connection → show alert
- Resend code multiple times → implement rate limiting
- Navigate back from verification screen → preserve email
- App backgrounded → pause countdown timer
- Invalid email format → prevent submission

---

## 6. Component Specifications

### CustomButton Component

```typescript
Props: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}
```

### CustomTextInput Component

```typescript
Props: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
  showClearButton?: boolean;
  onClear?: () => void;
  error?: string;
}
```

### ResendTimer Component

```typescript
Props: {
  initialSeconds: number;
  onResend: () => void;
}
```

---

## 7. Dependencies Required

```json
{
  "@react-navigation/native": "^6.x",
  "@react-navigation/stack": "^6.x",
  "react-native-webview": "^13.x",
  "axios": "^1.x",
  "expo": "~50.x",
  "expo-status-bar": "~1.x"
}
```

### Installation Commands

```bash
npx expo install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-webview
npm install axios
```

---

## 8. Testing Checklist

- [ ] Email validation works correctly
- [ ] Continue button enables/disables properly
- [ ] Verification code input accepts 6 characters
- [ ] Resend timer counts down correctly
- [ ] Resend code API call works
- [ ] Code verification API call works
- [ ] Error messages display correctly
- [ ] WebView loads URLs properly
- [ ] Navigation flow works smoothly
- [ ] Keyboard dismisses when needed
- [ ] Loading states show correctly
- [ ] App works on iOS and Android
- [ ] Dark theme renders correctly
- [ ] Accessibility features work

---

## 9. Code Quality Requirements

- TypeScript strict mode enabled
- ESLint configuration for code quality
- Proper error boundaries
- Modular, reusable components
- Clean code principles (DRY, SOLID)
- Comprehensive comments for complex logic
- Proper prop-types or TypeScript interfaces
- Performance optimizations (useMemo, useCallback where needed)

---

## 10. API Integration Example

### authService.ts Structure

```typescript
import axios from 'axios';

const API_BASE_URL = 'https://api.yourapp.com';

export const authService = {
  async sendVerificationCode(email: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/send-code`, {
        email,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async verifyCode(email: string, code: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-code`, {
        email,
        code,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async resendCode(email: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/resend-code`, {
        email,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
```

---

## 11. Environment Setup

### .env File

```
API_BASE_URL=https://api.yourapp.com
PRIVACY_POLICY_URL=https://yourapp.com/privacy
TERMS_CONDITIONS_URL=https://yourapp.com/terms
```

### Installing env support

```bash
npm install react-native-dotenv
```

---

## 12. Deliverables

1. Complete source code with folder structure
2. Navigation setup
3. All screens implemented
4. Reusable components
5. API service layer
6. Custom hooks
7. Type definitions
8. Theme configuration
9. README with setup instructions
10. Example environment variables file

---

## 13. Getting Started Guide

### Initial Setup

```bash
# Create new Expo project
npx create-expo-app email-auth-flow --template blank-typescript

# Navigate to project
cd email-auth-flow

# Install dependencies
npm install

# Install required packages
npx expo install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-webview
npm install axios
```

### Running the Project

```bash
# Start development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android
```

---

## 14. Best Practices

### Performance

- Use `React.memo` for components that don't need frequent re-renders
- Implement `useCallback` for event handlers
- Use `useMemo` for expensive calculations
- Optimize images and assets
- Lazy load screens when possible

### Security

- Never store sensitive data in AsyncStorage without encryption
- Validate all user inputs
- Implement proper error handling
- Use HTTPS for all API calls
- Implement rate limiting for resend functionality

### User Experience

- Provide clear error messages
- Show loading states for all async operations
- Implement haptic feedback for important actions
- Ensure smooth animations and transitions
- Support both light and dark modes (optional enhancement)

---

## 15. Future Enhancements

- Biometric authentication support
- Social login integration (Google, Apple)
- Multi-language support (i18n)
- Analytics integration
- Push notifications setup
- Offline support
- Email typo suggestions (e.g., "Did you mean gmail.com?")
- Password-based authentication option

---

## 16. Troubleshooting Guide

### Common Issues

**Issue: WebView not loading**
- Ensure react-native-webview is properly installed
- Check internet connectivity
- Verify URL is valid and accessible

**Issue: Keyboard covering input fields**
- Wrap screen in `KeyboardAvoidingView`
- Use `behavior="padding"` on iOS
- Implement `ScrollView` with `keyboardShouldPersistTaps="handled"`

**Issue: Timer not working correctly**
- Check for memory leaks
- Ensure cleanup in useEffect
- Verify timer logic in background state

**Issue: Navigation not working**
- Verify navigation container setup
- Check screen names match exactly
- Ensure navigation prop is passed correctly

---

## 17. Support & Resources

### Documentation Links

- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native WebView](https://github.com/react-native-webview/react-native-webview)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Community Resources

- [Expo Forums](https://forums.expo.dev/)
- [React Native Community](https://reactnative.dev/community/overview)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)

---

**Document Version:** 1.0  
**Last Updated:** December 2025  
**Author:** Development Specification  
**Status:** Ready for Implementation

---

## Notes for Developers

This specification provides a comprehensive guide for implementing a production-ready email verification flow. Follow the structure and requirements carefully to ensure consistency, maintainability, and excellent user experience.

For questions or clarifications, refer to the troubleshooting guide or community resources listed above.