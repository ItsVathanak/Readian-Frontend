# 🎨 Visual Guide - Premium & Age Badges

## Book Card Badges Preview

```
┌─────────────────────────────────────────────────┐
│                          [👑 PREMIUM] [🔞 18+] │
│  ┌──────────┐                                   │
│  │          │  Title: The Adventures of...      │
│  │  Book    │  By: John Doe                     │
│  │  Cover   │                                   │
│  │  Image   │  Tags: fantasy, adventure         │
│  │          │                                   │
│  └──────────┘  Status: Ongoing                  │
│                Description: A thrilling...      │
│                                                  │
│                Chapters: 15 | Views: 1.2K       │
└─────────────────────────────────────────────────┘
```

## Badge Variations

### 1. Premium Book (Paid Subscription Required)
```
┌────────────┐
│ 👑 PREMIUM │  → Yellow gradient (from-yellow-400 to-yellow-600)
└────────────┘
```

### 2. Age Restricted Content (18+ Only)
```
┌─────────┐
│ 🔞 18+ │  → Red background (bg-red-600)
└─────────┘
```

### 3. Ongoing Book (Early Access - Premium Only)
```
┌─────────────┐
│ 📖 ONGOING  │  → Blue background (bg-blue-600)
└─────────────┘
```

### 4. Draft Status (Author Only)
```
┌───────────┐
│ ✏️ DRAFT  │  → Gray background (bg-gray-600)
└───────────┘
```

---

## Multiple Badges Example

### Example 1: Premium + Adult + Ongoing Book
```
Book Card Top-Right Corner:
┌─────────────┐
│ 👑 PREMIUM  │
├─────────────┤
│ 🔞 18+      │
├─────────────┤
│ 📖 ONGOING  │
└─────────────┘
```

### Example 2: Free + Kids + Finished Book
```
Book Card Top-Right Corner:
(No badges - completely accessible)
```

### Example 3: Premium + Draft
```
Book Card Top-Right Corner:
┌─────────────┐
│ 👑 PREMIUM  │
├─────────────┤
│ ✏️ DRAFT    │
└─────────────┘
```

---

## Access Control Modals

### Modal 1: Not Signed In - Adult Content
```
╔═══════════════════════════════════════╗
║              🔞                        ║
║                                        ║
║    Age Restricted Content              ║
║                                        ║
║  You must be signed in and 18 years   ║
║  or older to access this content.     ║
║                                        ║
║  ┌──────────────────────────────┐    ║
║  │  Sign In to Continue          │    ║
║  └──────────────────────────────┘    ║
╚═══════════════════════════════════════╝
```

### Modal 2: Age Not Set
```
╔═══════════════════════════════════════╗
║              ⚠️                        ║
║                                        ║
║    Age Verification Required          ║
║                                        ║
║  To access adult content, please add  ║
║  your age to your profile.            ║
║                                        ║
║  ┌──────────────────────────────┐    ║
║  │  Go to Settings               │    ║
║  └──────────────────────────────┘    ║
╚═══════════════════════════════════════╝
```

### Modal 3: Under 18 Years Old
```
╔═══════════════════════════════════════╗
║              🔞                        ║
║                                        ║
║         Access Denied                 ║
║                                        ║
║  You must be 18 years or older to     ║
║  access this content.                 ║
║                                        ║
║  Your age: 16 years old               ║
║                                        ║
║  ┌──────────────────────────────┐    ║
║  │  Browse Other Books           │    ║
║  └──────────────────────────────┘    ║
╚═══════════════════════════════════════╝
```

### Modal 4: Free User - Premium Book
```
╔═══════════════════════════════════════╗
║              👑                        ║
║                                        ║
║         Premium Book                  ║
║                                        ║
║  This is a premium book. Upgrade to   ║
║  Basic or Premium to read.            ║
║                                        ║
║  ┌─────────────────────────────────┐ ║
║  │  Upgrade Benefits:              │ ║
║  │  ✅ Access to all premium books │ ║
║  │  ✅ Ad-free reading experience  │ ║
║  │  ✅ Download books as PDF       │ ║
║  └─────────────────────────────────┘ ║
║                                        ║
║  ┌──────────────────────────────┐    ║
║  │  Upgrade Now                  │    ║
║  └──────────────────────────────┘    ║
╚═══════════════════════════════════════╝
```

### Modal 5: Free/Basic User - Ongoing Book
```
╔═══════════════════════════════════════╗
║              📖                        ║
║                                        ║
║  Ongoing Book - Early Access          ║
║                                        ║
║  This book is still being written.    ║
║  Upgrade to Premium to read chapters  ║
║  as they're released!                 ║
║                                        ║
║  ┌─────────────────────────────────┐ ║
║  │  Premium Benefits:              │ ║
║  │  ✅ Early access to ongoing     │ ║
║  │  ✅ Read new chapters first     │ ║
║  │  ✅ All Basic features included │ ║
║  └─────────────────────────────────┘ ║
║                                        ║
║  ┌──────────────────────────────┐    ║
║  │  Upgrade to Premium           │    ║
║  └──────────────────────────────┘    ║
╚═══════════════════════════════════════╝
```

### Modal 6: Subscription Expired
```
╔═══════════════════════════════════════╗
║              ⏰                        ║
║                                        ║
║     Subscription Expired              ║
║                                        ║
║  Your PREMIUM subscription has        ║
║  expired. Please renew to continue    ║
║  accessing premium content.           ║
║                                        ║
║  Expired on: October 15, 2025         ║
║                                        ║
║  ┌──────────────────────────────┐    ║
║  │  Renew Subscription           │    ║
║  └──────────────────────────────┘    ║
╚═══════════════════════════════════════╝
```

---

## Navbar Badge

### Desktop Navbar - Premium User
```
┌───────────────────────────────────────────────────┐
│  [Logo]  Home  Browse  Subscribe [👑 PREMIUM]  Profile  [Logout] │
└───────────────────────────────────────────────────┘
```

### Desktop Navbar - Basic User
```
┌───────────────────────────────────────────────────┐
│  [Logo]  Home  Browse  Subscribe [BASIC]  Profile  [Logout]      │
└───────────────────────────────────────────────────┘
```

### Desktop Navbar - Free User
```
┌───────────────────────────────────────────────────┐
│  [Logo]  Home  Browse  Subscribe  Profile  [Logout]              │
└───────────────────────────────────────────────────┘
```

---

## Book Detail Page Badges

```
┌──────────────────────────────────────────────┐
│  General Info                                 │
│                                               │
│  [Book Cover]    The Adventures of Brownie   │
│                  By: Jane Doe                 │
│                                               │
│                  [Published] [Completed]      │
│                  [⭐ Premium] [🔞 Adult]      │
│                                               │
│                  ⭐⭐⭐⭐⭐ 4.5 (120 ratings)  │
│                                               │
│                  Description: A thrilling...  │
└──────────────────────────────────────────────┘
```

---

## Settings Page - Age Field

### View Mode
```
┌────────────────────────────────┐
│  Name:           John Doe       │
│  Email:          john@email.com │
│  Age:            25             │  ← Age displayed
│  Role:           Reader         │
│  Subscription:   Active         │
└────────────────────────────────┘
```

### Edit Mode
```
┌────────────────────────────────┐
│  Name:    [John Doe        ]   │
│  Email:   [john@email.com  ]   │
│  Age:     [25              ]   │  ← Age editable (13-150)
│  Bio:     [________________]   │
│           [________________]   │
└────────────────────────────────┘
```

---

## Color Palette

```css
/* Premium Badge */
background: linear-gradient(to right, #FBBF24, #D97706);
color: white;

/* Adult Badge */
background: #DC2626;
color: white;

/* Ongoing Badge */
background: #2563EB;
color: white;

/* Draft Badge */
background: #4B5563;
color: white;

/* Basic Badge */
background: #3B82F6;
color: white;
```

---

## Responsive Breakpoints

### Mobile (< 640px)
- Badge text: `text-[10px]`
- Smaller padding: `px-2 py-1`
- Stacked vertically

### Desktop (≥ 640px)
- Badge text: `text-xs`
- Standard padding: `px-2 py-1`
- Better spacing

---

## User Flow Diagram

```
User Opens Book
      ↓
Is Content Adult (18+)?
   ↙        ↘
  NO        YES → Check Age
              ↓
          User 18+?
           ↙    ↘
         NO     YES
         ↓       ↓
      Deny    Check Subscription
      Access      ↓
              Is Premium/Ongoing?
               ↙            ↘
              NO            YES
              ↓              ↓
           Allow       Has Required Plan?
           Access       ↙           ↘
                      YES            NO
                       ↓              ↓
                   Allow          Show Upgrade
                   Access         Modal
```

---

## Testing Quick Reference

### Test Matrix

| User Type | Book Type | Expected Behavior |
|-----------|-----------|-------------------|
| Not Logged In | Any Adult | Redirect to Sign In |
| Logged In (No Age) | Adult | Prompt to Add Age |
| Under 18 | Adult | Access Denied |
| 18+ | Adult Free | Access Granted |
| Free User | Premium | Upgrade to Basic/Premium |
| Free User | Ongoing | Upgrade to Premium |
| Basic User | Ongoing | Upgrade to Premium |
| Basic User | Premium Finished | Access Granted |
| Premium User | Any | Access Granted |

---

## Implementation Stats

- **Files Created:** 2 (AgeGuard, SubscriptionGuard)
- **Files Modified:** 6
- **Total Lines Added:** ~400
- **Errors:** 0
- **Build Status:** ✅ Passing
- **ESLint Warnings:** 0

---

*This guide shows how badges appear in the UI. All styling uses Tailwind CSS and emojis for visual appeal.*

