# Коди - Бот-асистент по програмиране

Коди е Firebase-базирана уеб апликация - чат бот, който помага на начинаещи програмисти с HTML, CSS, JavaScript и Python. Използва Google Gemini AI за интелигентни отговори на български език.

## Функционалности

- 💬 Чат интерфейс с AI асистент
- 🧠 Използва Google Gemini 1.5 Flash модел
- 🇧🇬 Отговаря на български език
- 🔥 Firebase Cloud Functions за backend
- 🎨 Модерен responsive UI дизайн

## Технологии

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Firebase Cloud Functions (Node.js)
- **AI**: Google Generative AI (Gemini)
- **Database**: Firestore
- **Hosting**: Firebase Hosting

## Предварителни изисквания

- Node.js 20 или по-висока версия (препоръчва се Node.js 22)
- Firebase CLI
- Google Cloud API ключ за Gemini
- Firebase проект

## Настройка

### 1. Инсталация на Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Влизане във Firebase

```bash
firebase login
```

### 3. Инсталация на зависимости

```bash
cd functions
npm install
```

### 4. Конфигурация на API ключ

1. Получете API ключ от [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Отворете `functions/index.js`
3. Заменете `"ТВОЯТ_КЛЮЧ_ТУК"` с вашия истински API ключ:

```javascript
const API_KEY = "your-actual-api-key-here";
```

### 5. Конфигурация на Firebase в frontend

1. Отидете в Firebase Console > Project Settings
2. Копирайте Firebase конфигурацията
3. Отворете `public/index.html`
4. Заменете placeholder стойностите в `firebaseConfig`:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.firebasestorage.app",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

## Стартиране на апликацията

### Локално тестване с емулатори

```bash
# Стартиране на всички емулатори
firebase emulators:start

# Само за functions
firebase emulators:start --only functions

# Само за hosting
firebase emulators:start --only hosting
```

Апликацията ще бъде достъпна на:
- Hosting: http://localhost:5000
- Functions: http://localhost:5001
- Firestore: http://localhost:8080
- Emulator UI: http://localhost:4000

### Deploy в продукция

```bash
# Deploy на всичко
firebase deploy

# Deploy само на functions
firebase deploy --only functions

# Deploy само на hosting
firebase deploy --only hosting
```

## Структура на проекта

```
dpengeneering/
├── functions/              # Cloud Functions
│   ├── index.js           # Основни функции
│   └── package.json       # Зависимости
├── public/                # Frontend файлове
│   ├── index.html         # Главна страница
│   └── manifest/          # Допълнителни ресурси
├── firebase.json          # Firebase конфигурация
├── firestore.rules        # Firestore правила за сигурност
├── firestore.indexes.json # Firestore индекси
└── storage.rules          # Storage правила за сигурност
```

## Cloud Functions

### 1. callKodyAPI
Основната AI функция за чат с Коди.

**Тип**: `https.onCall`

**Параметри**:
- `chatHistory`: История на разговора
- `userParts`: Съобщение от потребителя

### 2. systemHealth
Диагностична функция за проверка на системата.

**Тип**: `https.onRequest`

**URL**: `https://your-project.cloudfunctions.net/systemHealth`

### 3. greetUserDB
Функция за поздрав, която запазва потребители в Firestore.

**Тип**: `https.onRequest`

**URL**: `https://your-project.cloudfunctions.net/greetUserDB?name=YourName`

## Сигурност

⚠️ **ВАЖНО**: Преди deploy в продукция:

1. **API ключове**: Никога не commit-вайте истински API ключове в Git
2. **Environment variables**: Използвайте Firebase Environment Configuration:
   ```bash
   firebase functions:config:set gemini.api_key="your-api-key"
   ```
3. **Authentication**: Разкоментирайте проверката за authentication в `callKodyAPI`:
   ```javascript
   if (!context.auth) {
       throw new functions.https.HttpsError('unauthenticated', 'Моля, влезте в системата.');
   }
   ```
4. **Firestore Rules**: Актуализирайте `firestore.rules` за вашите нужди

## Troubleshooting

### Node version warning
Ако получите warning за несъвместима версия на Node:
```bash
nvm install 22
nvm use 22
```

### Firebase CLI issues
```bash
npm install -g firebase-tools@latest
firebase logout
firebase login
```

### CORS грешки
Уверете се, че домейнът е добавен в Authorized domains във Firebase Console.

## Автор

Проект на Камелия 💜

## Лиценз

MIT
