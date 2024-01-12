# Prisma

## Prisma CLI

### Init

Initialise schema.prisma file info

```bash
npx prisma init
```

### Studio

Database GUI

```bash
npx prisma studio
```

### Generate

Generate Prisma Client to be used in code

```bash
npx prisma generate
```

### Pull

Pull database schema into schema.prisma file

```bash
npx prisma pull
```

### Push

Push schema.prisma file into database

```bash
npx prisma push
```

### Format

Format schema.prisma file (prettier)

```bash
npx prisma format
```

### Prisma Migration (generate .sql for current schema)

#### [Prisma Migration Blog](https://blog.logrocket.com/effortless-database-schema-migration-prisma/)

```bash
npx prisma migrate dev --name cmd_why_migrate
```
