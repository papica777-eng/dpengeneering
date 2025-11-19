# Инсталация и Използване на DP Portfolio за Windows
# Installation and Usage Guide for DP Portfolio on Windows

## За Българските Потребители / For Bulgarian Users

### Изисквания
1. Windows 10 или по-нова версия
2. Node.js версия 16 или по-нова (изтеглете от https://nodejs.org/)

### Инсталация

1. **Инсталирайте Node.js:**
   - Отворете https://nodejs.org/
   - Изтеглете LTS версията (препоръчителна)
   - Стартирайте инсталатора и следвайте инструкциите
   - Рестартирайте компютъра след инсталацията

2. **Изтеглете проекта:**
   - Изтеглете ZIP файла на проекта
   - Разархивирайте го в избрана от вас папка

3. **Инсталирайте зависимостите:**
   - Отворете папката с проекта
   - Направете двоен клик на `run-dev.bat` ИЛИ
   - Отворете Command Prompt в папката и изпълнете:
     ```
     npm install
     ```

### Стартиране на Приложението

**Метод 1 - Лесен начин:**
- Направете двоен клик на `run-dev.bat`

**Метод 2 - Ръчно:**
1. Отворете Command Prompt в папката с проекта
2. Изпълнете командата:
   ```
   npm start
   ```

### Създаване на Windows Инсталатор

**Метод 1 - Лесен начин:**
- Направете двоен клик на `build-windows.bat`

**Метод 2 - Ръчно:**
1. Отворете Command Prompt в папката с проекта
2. Изпълнете командата:
   ```
   npm run build
   ```
3. След приключване, инсталаторът ще бъде в папката `dist`
4. Инсталаторът ще се казва нещо като `DP Portfolio Setup 1.0.0.exe`

### Инсталиране на Готовото Приложение

След като сте създали инсталатора:
1. Отворете папката `dist`
2. Намерете файла `DP Portfolio Setup 1.0.0.exe`
3. Направете двоен клик на него
4. Следвайте инструкциите за инсталация
5. Приложението ще се инсталира и ще създаде икона на работния плот

### Функции на Приложението

- ✅ Работи офлайн (след първото зареждане)
- ✅ Родно Windows приложение
- ✅ Автоматични актуализации (при конфигуриране)
- ✅ Инсталатор за лесна инсталация
- ✅ Икона на работния плот

---

## For English Users

### Requirements
1. Windows 10 or newer
2. Node.js version 16 or higher (download from https://nodejs.org/)

### Installation

1. **Install Node.js:**
   - Go to https://nodejs.org/
   - Download the LTS version (recommended)
   - Run the installer and follow the instructions
   - Restart your computer after installation

2. **Download the project:**
   - Download the project ZIP file
   - Extract it to a folder of your choice

3. **Install dependencies:**
   - Open the project folder
   - Double-click `run-dev.bat` OR
   - Open Command Prompt in the folder and run:
     ```
     npm install
     ```

### Running the Application

**Method 1 - Easy way:**
- Double-click `run-dev.bat`

**Method 2 - Manual:**
1. Open Command Prompt in the project folder
2. Run the command:
   ```
   npm start
   ```

### Building Windows Installer

**Method 1 - Easy way:**
- Double-click `build-windows.bat`

**Method 2 - Manual:**
1. Open Command Prompt in the project folder
2. Run the command:
   ```
   npm run build
   ```
3. After completion, the installer will be in the `dist` folder
4. The installer will be named something like `DP Portfolio Setup 1.0.0.exe`

### Installing the Built Application

After creating the installer:
1. Open the `dist` folder
2. Find the file `DP Portfolio Setup 1.0.0.exe`
3. Double-click it
4. Follow the installation instructions
5. The application will be installed and create a desktop icon

### Application Features

- ✅ Works offline (after first load)
- ✅ Native Windows application
- ✅ Automatic updates (when configured)
- ✅ Installer for easy installation
- ✅ Desktop icon

---

## Troubleshooting / Отстраняване на проблеми

### Node.js не е разпознат като команда / Node.js is not recognized
**BG:** Трябва да инсталирате Node.js от https://nodejs.org/ и да рестартирате компютъра.

**EN:** You need to install Node.js from https://nodejs.org/ and restart your computer.

### Грешка при npm install / Error during npm install
**BG:** Изтрийте папката `node_modules` и файла `package-lock.json`, след което опитайте отново.

**EN:** Delete the `node_modules` folder and `package-lock.json` file, then try again.

### Приложението не стартира / Application won't start
**BG:** Уверете се, че сте инсталирали всички зависимости с `npm install`.

**EN:** Make sure you've installed all dependencies with `npm install`.

### Грешка при build / Build error
**BG:** Изчистете кеша и опитайте отново:
```
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json
npm install
npm run build
```

**EN:** Clear the cache and try again:
```
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json
npm install
npm run build
```

## Контакти / Contact

За въпроси и проблеми / For questions and issues:
- GitHub Issues: https://github.com/papica777-eng/dpengeneering/issues

Автор / Author: Димитър Продромов
