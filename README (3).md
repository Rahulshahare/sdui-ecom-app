# SDUI E-Commerce App

A **Server-Driven UI (SDUI)** e-commerce application built with **Expo SDK 57** and **React Native**. This project demonstrates how to build dynamic, remotely configurable mobile apps where the entire UI — screens, layouts, components, and navigation — is controlled by JSON schemas hosted on GitHub. Combined with **EAS Update (OTA)**, you can push instant UI changes and new screens to users without app store reviews.

---

## Table of Contents

- [Why SDUI?](#why-sdui)
- [Architecture Overview](#architecture-overview)
- [React Native Components & Structure](#react-native-components--structure)
  - [Core Components](#core-components)
  - [View — The Foundation](#view--the-foundation)
  - [Text — Displaying Content](#text--displaying-content)
  - [Image — Handling Visuals](#image--handling-visuals)
  - [ScrollView & FlatList](#scrollview--flatlist)
  - [Pressable — User Interaction](#pressable--user-interaction)
  - [TextInput — User Input](#textinput--user-input)
  - [Flexbox Layout System](#flexbox-layout-system)
  - [Styling in React Native](#styling-in-react-native)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Implementation Details](#implementation-details)
  - [Core Engine](#core-engine)
  - [Component Registry](#component-registry)
  - [Schema Service](#schema-service)
  - [Caching Layer](#caching-layer)
  - [OTA Updates](#ota-updates)
- [JSON Schema Format](#json-schema-format)
- [Available Screens](#available-screens)
- [How to Add New Components](#how-to-add-new-components)
- [How to Add New Screens](#how-to-add-new-screens)
- [Further Enhancements](#further-enhancements)
- [License](#license)

---

## Why SDUI?

Traditional mobile app development requires:
- Writing native/React code for every screen
- Rebuilding and redeploying for UI changes
- Waiting for app store approval (1-7 days)
- Users needing to update via App Store/Play Store

**SDUI solves all of this:**

| Problem | SDUI Solution |
|---------|--------------|
| UI changes need code changes | JSON schema changes only |
| New screens need new code | Just add a JSON file to GitHub |
| App store review delays | Instant updates via OTA + schema refresh |
| Users don't update apps | Silent background updates |
| A/B testing is complex | Serve different schemas to different users |
| Multiple platforms (iOS/Android) | One JSON schema drives both |

### Real-World Use Cases

- **E-commerce**: Update product layouts, seasonal themes, flash sales instantly
- **News/Content**: Change article layouts, featured sections on the fly
- **Finance**: Update dashboard widgets, promotional banners
- **Travel**: Modify booking flows, add new destination pages

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      GITHUB (Remote)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │home-screen  │  │product-list │  │  product-detail     │  │
│  │   .json     │  │   .json     │  │     .json           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  checkout   │  │order-success│  │   track-order       │  │
│  │   .json     │  │   .json     │  │     .json           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS (Raw GitHub URLs)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    REACT NATIVE APP (Local)                  │
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐ │
│  │   App.js    │───▶│ AppNavigator│───▶│   SDUIScreen    │ │
│  │  (Entry +   │    │  (Routing)  │    │ (Generic Screen │ │
│  │   OTA Check)│    └─────────────┘    │   Renderer)     │ │
│  └─────────────┘                       └────────┬────────┘ │
│                                                 │          │
│  ┌──────────────────────────────────────────────┘          │
│  │                                                         │
│  │  ┌─────────────┐    ┌─────────────┐    ┌────────────┐  │
│  │  │SchemaService│───▶│  SDUIEngine │───▶│ Component  │  │
│  │  │(Fetch +    │    │(Parse JSON  │    │ Registry   │  │
│  │  │  Cache)     │    │  → RN Tree) │    │(Type→Comp) │  │
│  │  └─────────────┘    └─────────────┘    └─────┬──────┘  │
│  │                                               │         │
│  │  ┌────────────────────────────────────────────┘         │
│  │  │                                                      │
│  │  │  SDText  SDImage  SDButton  SDContainer  SDList     │
│  │  │  SDRow   SDColumn  SDScrollView  SDProductCard      │
│  │  │  SDSpacer  SDDivider  SDCard  SDBadge  SDInput      │
│  │  │                                                      │
│  │  └──────────────────────────────────────────────────────┘
│  │                                                         │
│  │  ┌─────────────┐    ┌─────────────┐                     │
│  │  │CacheService │    │SchemaValidator                    │
│  │  │(AsyncStorage│    │(Validate JSON)                    │
│  │  │  5-min TTL) │    └─────────────┘                     │
│  │  └─────────────┘                                        │
│  │                                                         │
│  └─────────────────────────────────────────────────────────┘
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              EAS UPDATE (OTA Service)                    │ │
│  │  ┌─────────────┐    ┌─────────────┐    ┌────────────┐  │ │
│  │  │checkFor     │───▶│fetchUpdate  │───▶│ reloadAsync│  │ │
│  │  │UpdateAsync()│    │  Async()    │    │  (Apply)   │  │ │
│  │  └─────────────┘    └─────────────┘    └────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **App launches** → Checks for EAS OTA updates → Reloads if new JS bundle available
2. **Navigation** → `SDUIScreen` receives `screenName` param (e.g., `"home-screen"`)
3. **Fetch** → `SchemaService` checks cache → Fetches from GitHub raw URL if expired/missing
4. **Validate** → `SchemaValidator` ensures JSON structure is correct
5. **Render** → `SDUIEngine` recursively walks JSON tree → Maps `type` to React components via `ComponentRegistry`
6. **Interact** → User taps button → `action` object processed by `handleAction` → Navigation, custom handlers, or URL open

---

## React Native Components & Structure

React Native provides a set of built-in components that map directly to native platform views. Understanding these is essential for building SDUI components.

### Core Components

| React Native Component | Native Mapping | Purpose | SDUI Wrapper |
|----------------------|----------------|---------|-------------|
| `View` | `UIView` (iOS) / `android.View` (Android) | Container, layout building block | `SDContainer`, `SDRow`, `SDColumn`, `SDCard` |
| `Text` | `UILabel` / `android.widget.TextView` | Display text content | `SDText`, `SDBadge` |
| `Image` | `UIImageView` / `android.widget.ImageView` | Display images from URL or local | `SDImage` |
| `ScrollView` | `UIScrollView` / `ScrollView` | Scrollable content container | `SDScrollView` |
| `FlatList` | `UITableView` / `RecyclerView` | Efficient long lists | `SDList` |
| `Pressable` | Touch handlers on any view | Touch/press interaction | `SDButton` |
| `TextInput` | `UITextField` / `EditText` | User text input | `SDInput` |

### View — The Foundation

`View` is the most fundamental component — it's a container that supports layout with Flexbox, styling, touch handling, and accessibility.

```javascript
import { View, StyleSheet } from 'react-native';

// Basic View
<View style={styles.container}>
  <Text>Hello</Text>
</View>

const styles = StyleSheet.create({
  container: {
    flex: 1,                    // Fill available space
    flexDirection: 'column',   // Stack children vertically (default)
    justifyContent: 'center',  // Center children vertically
    alignItems: 'center',      // Center children horizontally
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',       // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,              // Android shadow
  },
});
```

**Key View Props:**
- `style`: Appearance and layout (flexbox, colors, borders, shadows)
- `onLayout`: Callback when component mounts/layout changes
- `pointerEvents`: Control touch handling (`auto`, `none`, `box-none`)
- `accessibilityLabel`: Screen reader text

### Text — Displaying Content

`Text` is for displaying text. Unlike web, text cannot be placed directly inside `View` — it must be wrapped in `Text`.

```javascript
import { Text, StyleSheet } from 'react-native';

<Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
  This is a long product name that might truncate
</Text>

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',        // 'normal', 'bold', '100'-'900'
    color: '#333',
    lineHeight: 24,            // Line spacing
    textAlign: 'center',      // 'auto', 'left', 'right', 'center', 'justify'
    textDecorationLine: 'underline', // 'none', 'underline', 'line-through'
  },
});
```

**Text-specific Props:**
- `numberOfLines`: Truncate after N lines
- `ellipsizeMode`: Where to add `...` (`head`, `middle`, `tail`, `clip`)
- `onPress`: Make text tappable
- `selectable`: Allow text selection

**Nested Text:**
```javascript
<Text>
  Normal text <Text style={{fontWeight: 'bold'}}>bold text</Text> more normal
</Text>
```

### Image — Handling Visuals

`Image` displays images from network URLs, local files, or base64 data.

```javascript
import { Image } from 'react-native';

// From URL
<Image 
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 200, height: 200 }}
  resizeMode="cover"        // 'cover', 'contain', 'stretch', 'center', 'repeat'
/>

// From local asset
<Image 
  source={require('./assets/logo.png')}
  style={{ width: 100, height: 100 }}
/>

// Base64
<Image 
  source={{ uri: 'data:image/png;base64,iVBORw0KGgo...' }}
  style={{ width: 50, height: 50 }}
/>
```

**Image Props:**
- `source`: `{uri: string}` for remote, `require()` for local
- `resizeMode`: How image fits container
- `onLoad`, `onError`, `onLoadStart`, `onLoadEnd`: Loading lifecycle
- `defaultSource`: Placeholder while loading (local only)
- `loadingIndicatorSource`: Spinner while loading

### ScrollView & FlatList

**ScrollView**: For scrollable content of unknown/limited length.

```javascript
import { ScrollView } from 'react-native';

<ScrollView 
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ padding: 16 }}
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
>
  {children}
</ScrollView>
```

**FlatList**: For long lists — renders only visible items for performance.

```javascript
import { FlatList } from 'react-native';

<FlatList
  data={[{id: 1, name: 'Item 1'}, {id: 2, name: 'Item 2'}]}
  renderItem={({item}) => <Text>{item.name}</Text>}
  keyExtractor={item => item.id.toString()}
  numColumns={2}              // Grid layout
  horizontal={false}           // Vertical (default)
  showsVerticalScrollIndicator={false}
  onEndReached={() => loadMore()}  // Pagination
/>
```

**When to use what:**
- **ScrollView**: Few items, mixed content types, need `refreshControl`
- **FlatList**: Many items, same item type, need performance, pagination

### Pressable — User Interaction

`Pressable` is the modern replacement for `TouchableOpacity`, `TouchableHighlight`, etc. It gives full control over press states.

```javascript
import { Pressable, Text } from 'react-native';

<Pressable
  onPress={() => console.log('Pressed')}
  onLongPress={() => console.log('Long pressed')}
  onPressIn={() => console.log('Finger down')}
  onPressOut={() => console.log('Finger up')}

  style={({ pressed }) => [
    { backgroundColor: pressed ? '#ddd' : '#fff' },
    styles.button
  ]}

  android_ripple={{ color: 'rgba(0,0,0,0.1)' }}  // Android ripple effect
  hitSlop={16}  // Expand touch area by 16px
  disabled={isLoading}
>
  <Text>Tap Me</Text>
</Pressable>
```

**Pressable Props:**
- `onPress`: Single tap
- `onLongPress`: Hold for ~500ms
- `onPressIn` / `onPressOut`: Touch begin/end
- `style`: Function receiving `{pressed, hovered, focused}`
- `android_ripple`: Android-specific ripple config
- `hitSlop`: Expand invisible touch area
- `pressRetentionOffset`: How far finger can move before cancel

### TextInput — User Input

```javascript
import { TextInput } from 'react-native';

const [text, setText] = useState('');

<TextInput
  value={text}
  onChangeText={setText}
  placeholder="Enter email"
  placeholderTextColor="#999"
  keyboardType="email-address"    // 'default', 'number-pad', 'email-address', etc.
  autoCapitalize="none"
  autoCorrect={false}
  secureTextEntry={false}          // true for passwords
  maxLength={100}
  multiline={false}
  numberOfLines={1}
  textAlign="left"
  editable={!isSubmitting}
  onFocus={() => console.log('Focused')}
  onBlur={() => console.log('Blurred')}
  onSubmitEditing={() => submitForm()}
  returnKeyType="done"             // 'done', 'go', 'next', 'search', 'send'
/>
```

**TextInput Props:**
- `value` + `onChangeText`: Controlled component pattern
- `placeholder`: Hint text when empty
- `keyboardType`: Controls which keyboard appears
- `secureTextEntry`: Mask text for passwords
- `autoCapitalize`, `autoCorrect`, `autoComplete`: Smart typing
- `multiline` + `numberOfLines`: Multi-line text areas
- `onSubmitEditing`: Handle return key press

### Flexbox Layout System

React Native uses Yoga — a cross-platform layout engine implementing Flexbox.

```
┌─────────────────────────────────────┐
│  container                          │
│  flexDirection: 'column' (default)  │
│  ┌─────────┐  ┌─────────┐           │
│  │  Item 1 │  │  Item 2 │           │
│  │ flex: 1 │  │ flex: 2 │           │
│  └─────────┘  └─────────┘           │
│  justifyContent: 'center'           │
│  alignItems: 'stretch'              │
└─────────────────────────────────────┘
```

**Flex Direction:**
```javascript
// Column (default) — stack vertically
{ flexDirection: 'column' }

// Row — place horizontally
{ flexDirection: 'row' }
```

**Justify Content** (main axis alignment):
```javascript
{ justifyContent: 'flex-start' }   // Default
{ justifyContent: 'center' }
{ justifyContent: 'flex-end' }
{ justifyContent: 'space-between' } // Equal space between items
{ justifyContent: 'space-around' }  // Equal space around items
{ justifyContent: 'space-evenly' } // Truly equal spacing
```

**Align Items** (cross axis alignment):
```javascript
{ alignItems: 'stretch' }    // Default — fill cross axis
{ alignItems: 'flex-start' }
{ alignItems: 'center' }
{ alignItems: 'flex-end' }
{ alignItems: 'baseline' }   // Text baseline alignment
```

**Flex Grow/Shrink:**
```javascript
// flex: 1 — fill remaining space equally
{ flex: 1 }

// flex: 2 — takes twice the space of flex: 1
{ flex: 2 }

// flex: 0 — don't grow, use intrinsic size
{ flex: 0 }
```

**Positioning:**
```javascript
{ position: 'relative' }   // Default
{ position: 'absolute', top: 10, left: 10 }  // Position relative to parent
```

**Common Layout Patterns:**

```javascript
// Center everything
{ flex: 1, justifyContent: 'center', alignItems: 'center' }

// Header + scrollable content + footer
{ flex: 1 }
// Header: { height: 60 }
// Content: { flex: 1 }
// Footer: { height: 80 }

// Two-column grid
{ flexDirection: 'row', flexWrap: 'wrap' }
// Each item: { width: '50%' }

// Sticky bottom button
// Parent: { flex: 1 }
// ScrollView: { flex: 1 }
// Button container: { position: 'absolute', bottom: 0, left: 0, right: 0 }
```

### Styling in React Native

React Native uses JavaScript objects for styling, not CSS.

**Key Differences from CSS:**

| CSS | React Native |
|-----|-------------|
| `background-color` | `backgroundColor` (camelCase) |
| `font-size` | `fontSize` |
| `margin-top` | `marginTop` or `margin: { top: 10 }` |
| `flex-direction` | `flexDirection` |
| `#fff` | `'#fff'` (strings) |
| `16px` | `16` (numbers, unitless) |
| `border: 1px solid red` | `{ borderWidth: 1, borderColor: 'red' }` |

**StyleSheet vs Inline:**

```javascript
// ✅ Recommended: StyleSheet (performance + validation)
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  text: { fontSize: 16, color: '#333' },
});

// ⚠️ Inline (slower, harder to maintain)
<View style={{ flex: 1, padding: 16 }}>

// ✅ Array styles (merge multiple)
<Text style={[styles.text, { color: 'red' }]}>Red text</Text>

// ✅ Conditional styles
<View style={[styles.box, isActive && styles.active]} />
```

**Platform-Specific Styles:**

```javascript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
```

### Component Lifecycle in SDUI Context

Understanding when components mount, update, and unmount is crucial for SDUI:

```
JSON Schema Change
       │
       ▼
┌──────────────┐
│ SDUIScreen   │  useEffect triggers → fetchSchema()
│  (receives   │
│   new params)│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ SchemaService│  Checks cache → fetches from GitHub
│  .fetchScreen│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ setSchema()  │  Triggers React re-render
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ SDUIEngine   │  renderScreen(schema) called
│  .renderNode │  Recursive component tree creation
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ React Native │  Native views created on device
│  Components  │  Images load, lists render visible items
└──────────────┘
```

**Performance Considerations:**
- `FlatList` only renders visible items — use for long lists
- `Image` caches automatically, but large images should be optimized
- `useMemo` / `useCallback` prevent unnecessary re-renders
- Avoid inline function definitions in render (creates new references)

---

## Project Structure

```
sdui-ecom-app/
│
├── App.js                          # Entry point + OTA update check
├── app.json                        # Expo config (EAS Update URL)
├── eas.json                        # EAS build profiles (dev/preview/prod)
├── package.json                    # Dependencies
│
├── src/
│   ├── core/
│   │   ├── ComponentRegistry.js    # Maps type strings → React components
│   │   ├── SDUIEngine.js           # JSON parser + renderer + action handler
│   │   └── SchemaValidator.js      # Validates schema structure before render
│   │
│   ├── components/                 # All SDUI-compatible components
│   │   ├── SDText.js               # Text with style support
│   │   ├── SDImage.js              # Image with loading/error states
│   │   ├── SDButton.js             # Pressable button with actions
│   │   ├── SDContainer.js          # Basic View wrapper
│   │   ├── SDScrollView.js         # Scrollable container
│   │   ├── SDRow.js                # Horizontal flex layout
│   │   ├── SDColumn.js             # Vertical flex layout
│   │   ├── SDList.js               # FlatList wrapper
│   │   ├── SDProductCard.js        # E-commerce product card
│   │   ├── SDSpacer.js             # Empty space (supports size prop)
│   │   ├── SDDivider.js            # Horizontal line
│   │   ├── SDCard.js               # Card with shadow
│   │   ├── SDBadge.js              # Label badge
│   │   └── SDInput.js              # Text input field
│   │
│   ├── screens/
│   │   └── SDUIScreen.js           # ONE screen renders ALL schemas
│   │
│   ├── navigation/
│   │   └── AppNavigator.js         # React Navigation setup
│   │
│   ├── services/
│   │   ├── SchemaService.js        # Fetches schemas from GitHub
│   │   └── CacheService.js         # AsyncStorage caching (5-min TTL)
│   │
│   └── utils/
│       └── Logger.js               # Debug/info/warn/error logging
│
└── github-schemas/                 # SDUI JSON files (push to GitHub)
    ├── home-screen.json            # Home/landing page
    ├── product-list.json           # Product grid with filters
    ├── product-detail.json         # Full product page
    ├── checkout.json               # Checkout form + payment
    ├── order-success.json          # Order confirmation
    └── track-order.json            # Order tracking timeline
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI / EAS CLI
- Git
- Expo account (free at [expo.dev](https://expo.dev))

### 1. Create Project

```bash
npx create-expo-app sdui-ecom-app --template blank
cd sdui-ecom-app
```

### 2. Install Dependencies

```bash
npx expo install expo-updates react-native-screens react-native-safe-area-context @react-navigation/native @react-navigation/native-stack react-native-gesture-handler @react-native-async-storage/async-storage
```

### 3. Copy Source Files

Copy all files from `src/` folder as provided in this project.

### 4. Configure GitHub Hosting

Edit `src/services/SchemaService.js`:

```javascript
const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/github-schemas';
```

Example:
```javascript
const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/johndoe/my-ecom-app/main/github-schemas';
```

### 5. Configure EAS Update

Edit `app.json` and replace `YOUR_EAS_PROJECT_ID`:

```bash
# Login and initialize
npx eas-cli login
npx eas-cli init

# This auto-fills your project ID in app.json
```

### 6. Push Schemas to GitHub

```bash
git init
git add .
git commit -m "Initial SDUI setup"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 7. Run Development

```bash
npx expo start
```

### 8. Build & Deploy OTA

```bash
# Build production app (one-time)
eas build --profile production

# Later — push instant JS updates (no app store!)
eas update --channel production --message "Added new home screen layout"
```

---

## Implementation Details

### Core Engine

The `SDUIEngine.js` is the heart of the system. It recursively transforms JSON into React Native components:

```javascript
// Simplified flow:
renderScreen(schema) 
  → validate(schema) 
  → renderNode(node) 
  → getComponent(node.type) 
  → <Component {...props}>{children}</Component>
```

Key features:
- **Recursive rendering**: Nested `children` arrays are processed automatically
- **Type mapping**: Any string `type` maps to a registered React component
- **Props extraction**: `style`, `action`, `content`, `source`, etc. are passed automatically
- **Error boundaries**: Invalid nodes render error placeholders instead of crashing
- **Action handling**: Buttons trigger navigation, URL opens, or custom app logic

### Component Registry

A simple lookup table that decouples JSON types from React components:

```javascript
const registry = {
  text: SDText,
  image: SDImage,
  button: SDButton,
  productCard: SDProductCard,
  // ... add yours here
};
```

**To add a new component:**
1. Create `src/components/MyComponent.js`
2. Import it in `ComponentRegistry.js`
3. Add to `registry` object: `myComponent: MyComponent`
4. Use in JSON: `{ "type": "myComponent", ... }`

### Schema Service

Handles all remote fetching with smart caching:

```javascript
// Check cache first (5-minute TTL)
const cached = await CacheService.get('home-screen');
if (cached) return cached;

// Fetch from GitHub raw URL
const response = await fetch(`${GITHUB_BASE_URL}/home-screen.json`);
const schema = await response.json();

// Save to cache
await CacheService.set('home-screen', schema);
```

**Features:**
- Cache-first strategy for instant loads
- Force refresh for pull-to-reload
- Stale cache fallback if network fails
- No cache = error (with retry option)

### Caching Layer

Uses `AsyncStorage` with TTL (time-to-live):

```javascript
// Stored as:
{
  data: { /* schema */ },
  timestamp: 1720700000000,
  ttl: 300000  // 5 minutes
}
```

Cache is automatically invalidated after TTL. Manual invalidation:

```javascript
SchemaService.invalidateScreen('home-screen');  // Single screen
SchemaService.invalidateAll();                   // All screens
```

### OTA Updates

EAS Update checks on every app launch:

```javascript
// App.js
const update = await Updates.checkForUpdateAsync();
if (update.isAvailable) {
  await Updates.fetchUpdateAsync();
  await Updates.reloadAsync();  // App restarts with new JS
}
```

**What OTA updates:**
- JavaScript bundle changes
- New components in `src/components/`
- Logic changes in `src/core/`, `src/services/`, etc.

**What OTA does NOT update:**
- Native module additions (requires new build)
- `app.json` / `AndroidManifest.xml` changes
- App icon / splash screen

---

## JSON Schema Format

Every screen is a JSON object with this structure:

```json
{
  "type": "scrollView",           // Component type (required)
  "id": "unique-id",              // Optional: stable key
  "style": {                      // Optional: React Native styles
    "flex": 1,
    "backgroundColor": "#fff"
  },
  "props": {                      // Optional: extra component props
    "size": 32                    // e.g., spacer size
  },
  "children": [                   // Optional: nested components
    { "type": "text", "content": "Hello" },
    { "type": "button", "text": "Tap me", "action": {...} }
  ],
  "action": {                     // Optional: tap/press action
    "type": "navigate",
    "screen": "SDUIScreen",
    "params": { "screenName": "detail" }
  }
}
```

### Component-Specific Fields

| Type | Required | Special Fields |
|------|----------|---------------|
| `text` | `content` | — |
| `image` | `source` | URL string or require() |
| `button` | `text` | `textStyle`, `action` |
| `input` | `placeholder` | `keyboardType`, `secureTextEntry` |
| `badge` | `text` | — |
| `productCard` | `product` | `product: { id, name, price, image, ... }` |
| `list` | `items` | `items: [...]` array of nodes |
| `spacer` | — | `props.size` or `style.height` |
| `divider` | — | `style.height`, `style.backgroundColor` |

### Action Types

```json
// Navigate to another SDUI screen
{ "type": "navigate", "screen": "SDUIScreen", "params": { "screenName": "checkout" } }

// Navigate to named route
{ "type": "navigate", "screen": "Home" }

// Open external URL
{ "type": "openUrl", "url": "https://example.com" }

// Custom app logic
{ "type": "custom", "handler": "addToCart", "payload": { "productId": "123" } }
```

---

## Available Screens

| Screen | File | Description |
|--------|------|-------------|
| **Home** | `home-screen.json` | Hero banner, featured products, category buttons |
| **Product List** | `product-list.json` | Search bar, filter chips, product grid (6 items) |
| **Product Detail** | `product-detail.json` | Image gallery, price, color selector, quantity, buy buttons |
| **Checkout** | `checkout.json` | Order summary, shipping form, payment method selection |
| **Order Success** | `order-success.json` | Confirmation, order ID, product recap, track/continue buttons |
| **Track Order** | `track-order.json` | 5-step timeline, shipping address, help links |

---

## How to Add New Components

### Step 1: Create the Component

```javascript
// src/components/SDRating.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SDRating({ value, style, ...props }) {
  const stars = '★'.repeat(Math.floor(value)) + '☆'.repeat(5 - Math.floor(value));

  return (
    <Text style={[styles.default, style]} {...props}>
      {stars} {value}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
    color: '#FF9500',
  },
});
```

### Step 2: Register in ComponentRegistry

```javascript
// src/core/ComponentRegistry.js
import SDRating from '../components/SDRating';

const registry = {
  // ... existing components
  rating: SDRating,  // ← Add this
};
```

### Step 3: Use in JSON Schema

```json
{
  "type": "rating",
  "value": 4.5,
  "style": { "fontSize": 18 }
}
```

### Step 4: Push OTA Update

```bash
eas update --channel production --message "Added star rating component"
```

**Users get the new component instantly!**

---

## How to Add New Screens

### Step 1: Create JSON Schema

Create `github-schemas/my-new-screen.json`:

```json
{
  "type": "scrollView",
  "style": { "flex": 1, "backgroundColor": "#fff" },
  "children": [
    {
      "type": "text",
      "content": "My New Screen!",
      "style": { "fontSize": 24, "fontWeight": "bold" }
    },
    {
      "type": "button",
      "text": "Go Home",
      "action": { "type": "navigate", "screen": "Home" }
    }
  ]
}
```

### Step 2: Push to GitHub

```bash
git add github-schemas/my-new-screen.json
git commit -m "Add my-new-screen"
git push origin main
```

### Step 3: Navigate to It

From any button action:
```json
{
  "type": "navigate",
  "screen": "SDUIScreen",
  "params": {
    "screenName": "my-new-screen",
    "title": "My New Screen"
  }
}
```

**No app code changes needed!** The generic `SDUIScreen` handles it.

---

## Further Enhancements

### Immediate (Basic → Intermediate)

| Feature | How to Implement |
|---------|-----------------|
| **Pull-to-refresh** | Add `RefreshControl` to `SDScrollView` in `SDUIScreen.js` |
| **Loading skeletons** | Create `SDSkeleton` component, show while schema loads |
| **Error retry UI** | Enhance `SDUIScreen` error state with retry button |
| **Image carousel** | Create `SDCarousel` using `FlatList` with horizontal paging |
| **Bottom sheet** | Create `SDBottomSheet` using `@gorhom/bottom-sheet` |
| **Video player** | Create `SDVideo` using `expo-av` |

### Advanced

| Feature | Implementation |
|---------|---------------|
| **A/B Testing** | Serve different schemas based on user ID or segment |
| **Personalization** | Inject user data (name, cart count) into schema before render |
| **Analytics** | Track screen views, button taps, conversion funnels |
| **Deep linking** | Map URLs to `screenName` params |
| **Offline mode** | Pre-cache all schemas, show offline indicator |
| **Multi-language** | Add `locale` param to schema fetch, host `home-screen-en.json`, `home-screen-es.json` |
| **Dark mode** | Add `theme` field to schema, toggle styles dynamically |
| **Real-time updates** | WebSocket connection for instant schema pushes |
| **Form validation** | Add `validation` rules to `input` schema, show errors |
| **Cart state** | Integrate Zustand/Redux, sync cart across all screens |

### Native Module Extensions

When you need capabilities beyond JSON:

```javascript
// Register native-capable component
registerComponent('map', SDMap);        // react-native-maps
registerComponent('chart', SDChart);     // react-native-chart-kit
registerComponent('scanner', SDScanner); // expo-camera barcode
```

These require EAS Build (not just OTA), but once built, their configuration can still be driven by JSON.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Schema not loading | Check `GITHUB_BASE_URL` in `SchemaService.js`. Ensure file is pushed to GitHub and URL is correct. |
| "Unknown type" error | Component not registered in `ComponentRegistry.js` |
| OTA not working | Verify `projectId` in `app.json` matches your Expo project |
| Cache too aggressive | Reduce TTL in `CacheService.js` or call `invalidateAll()` |
| Styles not applying | Check React Native style property names (camelCase, not kebab-case) |
| Images not showing | Verify URL is accessible, add `https://` prefix |

---

## License

MIT License — free to use, modify, and distribute.

---

## Credits

Built with:
- [Expo](https://expo.dev) — React Native toolchain
- [EAS Update](https://docs.expo.dev/eas-update/introduction/) — Over-the-air updates
- [React Navigation](https://reactnavigation.org) — Routing
- GitHub Raw URLs — Free schema hosting

---

**Happy building!** 🚀

For questions or contributions, open an issue on GitHub.
