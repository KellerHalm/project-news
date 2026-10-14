# 🧩 next-template

Модульный шаблон на базе **Next.js** с использованием **Feature-Sliced Design (FSD)**, фокусирующийся на удобстве масштабирования, строгом code style и продуктивной разработке с помощью современного фронтенд-стека.

## Оглавление

0. [Минимальные требования перед запуском проекта](#Минимальные-требования-перед-запуском-проекта)
1. [Используемый стек](#Используемый-стек)
2. [Code style](#Code-style)
3. [Как включить авто форматирование кода в различных IDE](#Как-включить-авто-форматирование-кода-в-различных-ide)
4. [Структура проекта](#Структура-проекта)
5. [Комментирование кода](#Комментирование-кода)
6. [Команды](#Команды)

---

## Минимальные требования перед запуском проекта

1. Ознакомьтесь с [используемым стеком](#Используемый-стек).
2. Установите:

- **Node.js** `v22.x (LTS)` или новее
- **npm** `v10.x` или новее

---

## Используемый стек

- **Фреймворк:** [Next.js @^16](https://nextjs.org/docs), [React @^19](https://react.dev/)
- **Язык:** [TypeScript @^5](https://www.typescriptlang.org/docs/)
- **Архитектура:** [Feature-Sliced Design](https://feature-sliced.github.io/documentation/ru/)
- **Стилизация:** [Tailwind CSS @^4](https://tailwindcss.com/), [SASS @^1.97](https://sass-lang.com/)
- **UI компоненты:**
  - [shadcn/ui](https://ui.shadcn.com/) (Radix UI, tailwind-merge, tw-animate-css)
  - [Lucide React](https://lucide.dev/)
  - [Sonner](https://sonner.emilkowal.ski/) — тосты / уведомления
- **Тема приложения:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Хранилище:** [Zustand @^5](https://zustand-demo.pmnd.rs/)
- **Работа с куками:** [js-cookie](https://github.com/js-cookie/js-cookie)
- **HTTP-запросы:** [Axios @^1.16](https://axios-http.com/) — настроенный клиент в [`src/shared/core/client.ts`](src/shared/core/client.ts)
- **Работа с формами:** [React Hook Form](https://react-hook-form.com/get-started), [@hookform/resolvers](https://github.com/react-hook-form/resolvers)
- **Маски ввода:** [react-imask](https://imask.js.org/guide.html#react-imask) — телефон и другие masked-поля
- **Валидация:** [Zod @^3](https://zod.dev/)
- **Утилиты:** `clsx`, `class-variance-authority`, `tailwind-merge`
- **Линтинг и автоформатирование:**
  - [ESLint @^9](https://eslint.org/)
  - [Prettier](https://prettier.io/)
  - [Husky](https://typicode.github.io/husky/#/)
  - [lint-staged](https://github.com/okonet/lint-staged)

Для локального запуска скопируйте `.env.example` → `.env.local` и укажите `NEXT_PUBLIC_API_URL` вашего бэкенда.

---

## Code style

В проекте включены строгие правила линтинга и автоформатирования.  
Но есть **правила, которые не покрываются линтерами** — соблюдай их вручную, иначе 👀 прилетит на ревью.

### 📁 Нэйминг

| Сущность           | Формат                | Пример              |
| ------------------ | --------------------- | ------------------- |
| Файлы              | `kebab-case`          | `/user-card`        |
| Переменные/функции | `camelCase`           | `fetchUserData()`   |
| Константы          | `SCREAM_CASE`         | `API_BASE_URL`      |
| Компоненты         | `kebab-case`          | `user-form.tsx`     |
| Иконки             | `PascalCase` + `Icon` | `ArrowLeftIcon.tsx` |

### 🎨 Стилизация

- До **5** Tailwind-классов в компоненте — ок оставлять инлайн (`className`).
- Если Tailwind-классов **больше 5** — выносим стили в **модульный SCSS** рядом с компонентом (`component-name.module.scss`).
- **Исключение:** папка `shared/ui` — там допускается любое количество Tailwind-классов (shadcn/ui-паттерн).

---

## Как включить авто форматирование кода в различных IDE

### VS Code

1. Установи плагины:
   - ESLint
   - Prettier

2. В `.vscode/settings.json` добавь:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "typescript", "typescriptreact"]
}
```

3. Перезапустить `IDE`

## Webstorm

1. Зайти в настройки `Settings`
2. Вбить в поиске `ESLint`
3. Внутри `ESLint` выбрать пункт `Automatic ESLint configuration` и поставить галочку в графе `Run eslint --fix on save`
4. Перезапустить `IDE`

Теперь при сохранении файла будет выполняться авто форматирование кода.

---

## Структура проекта

Проект построен по принципам **Feature-Sliced Design (FSD)** с небольшим отступлением:  
вместо отдельной прослойки `pages/` используется встроенный механизм маршрутизации **Next.js** (`app/`).

Это решение принято ради более органичной интеграции с файловой маршрутизацией фреймворка —  
без излишнего усложнения и "велосипедов", но с сохранением архитектурной чистоты.

```
src/
├── app/ # Next.js app directory
├── shared/ # UI, utils, lib, constants, HTTP-клиент (axios в shared/core)
├── entities/ # Сущности бизнес-логики (user, product)
├── features/ # Фичи – поиски, фильтры, лайки
├── widgets/ # Крупные компоненты (карточки, таблицы)
```

---

## Комментирование кода

В каких случаях требуется комментирование кода:

- Объяснение цели или назначения определенного блока кода, если она не очевидна.
- Описание сложных алгоритмов или логики, которые могут быть сложно понятны для других разработчиков.
- Указание на предполагаемые ошибки или проблемы, которые могут возникнуть в коде.
- Описание намерений или целей разработчика при написании определенного фрагмента кода, если она не очевидна.
- Комментирование важных или критических частей кода для обеспечения понимания других разработчиков.

И все следующий файлы, даже если их назначение очевидно из названия файла/функции:

- Все файлы/функции внутри папки 📁 `helpers`
- Все файлы/функции внутри папки 📁 `hocs`
- Все файлы/функции внутри папки 📁 `hooks`
- Все файлы/функции внутри папки 📁 `libs`
- Все файлы/функции внутри папки 📁 `utils`

Пример, когда не стоит писать комментарий ❌:

```js
// Это объект, который представляет пользователя
const user = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com'
};
```

```js
// Функция для суммирования чисел
const add = (a, b) => a + b;
```

Но если мы создали `utils`, который помогает нам с суммированием, то описываем его следующим образом:

```js
/**
 * Функция для суммирования двух чисел.
 * @param a - Первое число для суммирования.
 * @param b - Второе число для суммирования.
 * @return {number} Сумма двух чисел.
 */
const add = (a, b) => {
  return a + b;
};
```

---

## Команды

| Команда         | Назначение                                       |
| --------------- | ------------------------------------------------ |
| npm run dev     | Запустить проект в режиме разработки (Turbopack) |
| npm run build   | Собрать проект                                   |
| npm run start   | Запустить production-сборку                      |
| npm run lint    | Запустить линтер                                 |
| npm run prepare | Установить git-хуки через husky                  |
#   k h o a m - f r o n t e n d  
 