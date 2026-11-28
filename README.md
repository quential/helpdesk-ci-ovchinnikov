# Helpdesk CI

Учебный сервис регистрации заявок в техническую поддержку. Дисциплина 3253.ДЕВ.F.26О DevOps, КТ 3.

## Инструменты

Node.js 22 (не ниже 22.13), npm, Git, Docker Desktop с интеграцией Ubuntu/WSL либо Docker Desktop для macOS. Команды выполняются в Bash.

## Проверки

```
npm ci
npm run lint
npm test
docker compose -f compose.test.yaml up -d --wait
DB_NAME=helpdesk_test DB_PORT=55432 npm run test:integration
docker compose -f compose.test.yaml down
```

Интеграционные тесты обращаются к настоящей отдельной БД helpdesk_test. Рабочая база helpdesk не затрагивается.

## Локальный запуск

```
docker compose up -d --build --wait
curl -f http://localhost:3000/health
curl -f -H 'Content-Type: application/json' -d '{"title":"VPN does not connect","priority":"high"}' http://localhost:3000/tickets
curl -f http://localhost:3000/tickets
docker compose down
```

Том helpdesk_data сохраняется. Не используйте down -v. Учебный пароль local_training_only предназначен только для локального стенда и одноразовой БД CI.

## Контрольная точка

Выберите стартовый проект и выполните Word-инструкцию: создайте Dockerfile, .dockerignore, .github/workflows/ci-cd.yml; добавьте приоритет critical со сроком реакции 15 минут и тесты; пройдите путь feature -> develop -> release -> main через реальные Pull Request.

В готовом варианте job lint запускает ESLint, test — Jest и настоящие API/SQL-проверки с PostgreSQL. build-and-push публикует образ только после успешных проверок при push в main. При PR и push в develop эта задача пропускается. GITHUB_TOKEN выдаёт GitHub автоматически; создавать PAT для workflow не нужно.

Заполните перед сдачей: ФИО, группа, ссылки на PR, упавший и успешный запуски Actions, полный SHA релизного коммита, адрес образа GHCR. Добавьте в README объяснение CI/Delivery/Deployment и порядок проверки опубликованного образа.

Овчинников Эмлиь Михайлович, 3Р2, PR #1 https://github.com/quential/helpdesk-ci-ovchinnikov/pull/1  |  PR #2 https://github.com/quential/helpdesk-ci-ovchinnikov/pull/2  
