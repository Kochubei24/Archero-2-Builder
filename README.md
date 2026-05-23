# ⚔️ Archero 2 Build Constructor

Мобильное приложение для Android — конструктор билдов Archero 2.

---

## 📱 Как собрать APK (только GitHub, без ПК)

### Шаг 1 — Создай репозиторий на GitHub
1. Открой [github.com](https://github.com) → нажми **+** → **New repository**
2. Название: `archero2-builder`
3. Видимость: **Public**
4. Нажми **Create repository**

### Шаг 2 — Загрузи файлы
1. В репо нажми **Add file → Upload files**
2. Загрузи: `App.js`, `app.json`, `eas.json`, `package.json`, `babel.config.js`
3. Загрузи папку `assets/` (файл `icon.png`)
4. Папку `.github/workflows/` создай вручную:
   - Нажми **Add file → Create new file**
   - В поле имени введи: `.github/workflows/build-apk.yml`
   - Вставь содержимое файла `build-apk.yml`
   - Нажми **Commit changes**

### Шаг 3 — Запусти сборку
1. Перейди во вкладку **Actions** в репо
2. Слева выбери **Build Android APK**
3. Нажми **Run workflow → Run workflow**
4. Подожди ~10-15 минут

### Шаг 4 — Скачай APK
1. После завершения нажми на билд
2. Внизу страницы найди раздел **Artifacts**
3. Нажми **archero2-builder.apk** — файл скачается
4. Установи на телефон (разреши установку из неизвестных источников)

---

## 🔄 Обновление приложения
Измени любой файл в репо через GitHub → сделай commit.
GitHub Actions автоматически запустит новую сборку.

---

## 📁 Структура проекта
```
App.js                          — главный код приложения
app.json                        — конфигурация Expo
package.json                    — зависимости
babel.config.js                 — настройки сборщика
assets/icon.png                 — иконка приложения
.github/workflows/build-apk.yml — автосборка APK
```
