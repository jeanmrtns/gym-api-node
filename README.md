[![Node.js CI](https://github.com/jeanmrtns/gym-api-node/actions/workflows/node.js.yml/badge.svg)](https://github.com/jeanmrtns/gym-api-node/actions/workflows/node.js.yml)

# Setup

- Create database with docker:
  ```bash
  docker compose up -d
  ```

- Install project dependencies
  ```bash
  npm install
  # or
  yarn
  ```

- Run migrations:
  ```bash
  npx prisma migrate dev
  ```

- Set environment variables as described in `.env.example` file (create your own `.env`).

- Initialize the application:
  ```bash
  npm run dev
  # or
  yarn dev
  ```

### Testing with Vitest
For E2E tests, first enter the prisma environment folder and link it to the project
```bash
  cd prisma/vitest-environment-prisma
  npm link

  cd ../../
  npm link vitest-environment-prisma
```