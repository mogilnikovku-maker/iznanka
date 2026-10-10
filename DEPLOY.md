# Деплой IZNANKA — Supabase + Vercel

Три шага: создать проект Supabase → залить код в Git → подключить к Vercel. ~15 минут.

---

## 1. Supabase

1. [supabase.com](https://supabase.com) → **New project**. Задайте имя, пароль БД, регион (ближе к аудитории).
2. **SQL Editor → New query** → вставьте содержимое [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql) → **Run**. Создаётся таблица `user_progress` с включённым RLS.
3. **Authentication → Providers → Email**: включите Email и опцию **magic link** (вход по ссылке, без пароля). Для MVP можно отключить подтверждение, но ссылка-вход уже подтверждает адрес.
4. **Project Settings → API** — скопируйте:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` ключ → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

   > Оба ключа публичные (идут в браузер) — это штатно. Данные защищает RLS. `service_role` ключ **никуда не вставляйте**.

5. Позже, когда будет домен на Vercel, вернитесь в **Authentication → URL Configuration**:
   - **Site URL**: `https://ваш-проект.vercel.app`
   - **Redirect URLs**: добавьте `https://ваш-проект.vercel.app/auth/callback` и `http://localhost:3000/auth/callback`.

---

## 2. Git

Из папки `iznanka/`:

```bash
git init
git add .
git commit -m "IZNANKA MVP"
git branch -M main
git remote add origin https://github.com/<ваш-аккаунт>/iznanka.git
git push -u origin main
```

(Создайте пустой репозиторий на GitHub без README/лицензии.)

---

## 3. Vercel

1. [vercel.com](https://vercel.com) → **Add New → Project** → импортируйте репозиторий `iznanka`. Framework определится как **Next.js** автоматически.
2. **Environment Variables** — добавьте три переменные (во все окружения):

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL из Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public ключ |
   | `NEXT_PUBLIC_SITE_URL` | `https://ваш-проект.vercel.app` (после первого деплоя подставьте реальный домен и передеплойте) |

3. **Deploy**. Через ~1–2 минуты приложение будет на `https://ваш-проект.vercel.app`.
4. Вернитесь в Supabase (шаг 1.5) и впишите боевой домен в Site URL / Redirect URLs — иначе magic-link будет редиректить неправильно.

---

## Проверка

- Карта знаний открывается, статусы тем меняются (Не изучено → В процессе → Освоено), прогресс-бар растёт.
- После освоения темы разблокируется итоговый кейс-тест.
- `/login` → ввод e-mail → письмо со ссылкой → переход по ней логинит и возвращает на карту.
- Прогресс сохраняется между перезагрузками; после входа — между устройствами.

## Частые проблемы

- **Magic-link ведёт на localhost** — не заполнен `NEXT_PUBLIC_SITE_URL` на Vercel или не добавлен Redirect URL в Supabase.
- **Прогресс не синхронизируется** — не применена миграция `0001_init.sql` или не заданы env-переменные.
- **Вход не предлагается, «Демо-режим»** — не заданы `NEXT_PUBLIC_SUPABASE_*` (приложение сознательно деградирует до localStorage).
