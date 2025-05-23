# http://localhost:8080

# 🔓 Публічні ендпоінти (не вимагають JWT)

### POST /auth/register
**Опис:** Реєстрація нового користувача

**Тіло запиту:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "Микола"
}
```
**Відповідь (айді юзера):**
```json
{
  "id": 1
}
```

### POST /auth/login
**Опис:** Авторизація користувача

**Тіло запиту:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Відповідь (200):**
```json
{
  "token": "JWT_TOKEN"
}
```

### GET /podcasts/public
**Опис:** Отримати всі публічні подкасти

**Відповідь (200):**
```json
[
  {
    "id": 1,
    "title": "Приклад",
    "prompt": "опис",
    "isPublic": true,
    "imagePath": "/images/1.png",
    "creatorId": 1
  }
]
```

### GET /podcasts/search?query=текст
**Опис:** Пошук публічних подкастів за текстом

**Відповідь (200):**
```json
[
  {
    "id": 1,
    "title": "Результат пошуку",
    "prompt": "опис",
    "isPublic": true,
    "imagePath": "/images/1.png",
    "creatorId": 1
  }
]
```

---

# 🔒 Захищені ендпоінти (вимагають JWT)

Потрібен хеадер - Authorization: Bearer JWT_TOKEN

(пробіл обов'язково між Bearer і токеном)

# /podcasts

### POST /podcasts
**Опис:** Створення нового подкасту

**Тіло запиту:**
```json
{
  "title": "Мій подкаст",
  "prompt": "про що подкаст",
  "isPublic": true
}
```
**Відповідь (айді створеного подкасту):**
```json
{
  "id": 1
}
```

### PATCH /podcasts/{id}
**Опис:** Зміна статусу публічності подкасту

**Відповідь (200):** Порожнє тіло, статус 200

### DELETE /podcasts/{id} *(лише модератор)*
**Опис:** Видалення подкасту

**Відповідь (200):**
```json
{
  "message": "Подкаст видалено"
}
```

# /podcasts/{id}/episodes

### POST /podcasts/{id}/episodes
**Опис:** Створення епізоду до подкасту

**Тіло запиту:**
```json
{
  "prompt": "про що епізод"
}
```
**Відповідь (айді створеного епізоду):**
```json
{
  "id": 1
}
```

### GET /podcasts/{id}/episodes
**Опис:** Отримати епізоди подкасту

**Відповідь (200):**
```json
[
  {
    "id": 1,
    "podcastId": 1,
    "summary": "короткий опис",
    "audioPath": "/audio/ep1.wav"
  }
]
```

# /episodes/{id}

### GET /episodes/{id}
**Опис:** Отримати конкретний епізод

**Відповідь (200):**
```json
{
  "id": 1,
  "podcastId": 1,
  "summary": "короткий опис",
  "audioPath": "/audio/ep1.wav"
}
```

# /users

### GET /users
**Опис:** Отримати інформацію про себе

**Відповідь (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "passwordHash": "hash",
  "displayName": "Микола"
}
```

### PATCH /users
**Опис:** Оновити профіль

**Тіло запиту:**
```json
{
    "email": "новий@email.com",
    "password": "новий пароль",
    "displayName": "Інше імʼя"
}
```
**Відповідь (200):**
```json
{
  "message": "✅ Профіль оновлено"
}
```

### GET /users/podcasts
**Опис:** Отримати подкасти, створені користувачем

**Відповідь (200):**
```json
[
    {
        "id": 1,
        "title": "приклад",
        "prompt": "опис",
        "isPublic": true,
        "imagePath": "/images/1.png",
        "creatorId": 1
    }
]
```

### GET /users/search?query=текст
**Опис:** Пошук серед власних подкастів

**Відповідь (200):**
```json
[
    {
        "id": 1,
        "title": "приклад",
        "prompt": "опис",
        "isPublic": true,
        "imagePath": "/images/1.png",
        "creatorId": 1
    }
]
```

### DELETE /users/{id} *(лише модератор)*
**Опис:** Видалення користувача

**Відповідь (200):**
```json
{
  "message": "Користувач видалений"
}
