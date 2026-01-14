# Base App Setup

Complete setup guide for a Next.js app with Shadcn UI, Neon Postgres, Drizzle ORM, and AI SDK.

## Next.js on Vercel

Create a Next.js app running on Bun, configure the development environment, and deploy to Vercel with automatic deployments on push.

## Create the Next.js App

Initialize a new Next.js application:

```bash
bunx create-next-app@latest my-app --ts --tailwind --react-compiler --no-linter --src-dir --app --use-bun
cd my-app
```

This command uses the following recommended options: TypeScript and Tailwind CSS for type safety and utility-first styling, enables the React Compiler for automatic optimizations, skips linter configuration (can be added later if needed), organizes code inside a `src/` directory for cleaner project structure, uses the App Router, and bootstraps with Bun as the package manager.

## Setup Vercel Configuration

Install the Vercel config package to programatically configure the Vercel project:

```bash
bun add -D @vercel/config
```

Create the `vercel.ts` file:

```typescript
// vercel.ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {};
```

## Configure Bun as the Runtime on Vercel (Optional)

Using Bun both as the package manager and runtime provides a consistent development experience. To configure Bun as the runtime on Vercel, add the following to the `vercel.ts` file:

```typescript
// vercel.ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
	bunVersion: "1.x",
};
```

Add Bun types for better TypeScript support:

```bash
bun add -D @types/bun
```

## Install GitHub CLI

Install the GitHub CLI to manage your GitHub repositories:

```bash
brew install gh
```

Login to your GitHub account:

```bash
gh auth login
```

## Create GitHub Repository

Initialize git and create a new GitHub repository inside the project root:

```bash
# Create GitHub repository and push
gh repo create my-app --public --source=. --push
```

The `gh repo create` command:

- Creates a new repository on GitHub
- Sets the remote origin
- Pushes your local code

Use `--private` instead of `--public` for a private repository.

## Install Vercel CLI

Install the Vercel CLI globally to manage your Vercel projects:

```bash
bun add -g vercel
```

Authenticate with Vercel:

```bash
vercel login
```

## Deploy to Vercel

Link your project to Vercel and deploy:

```bash
# Deploy to Vercel (creates project on first run)
vercel
```

On first run, you'll be prompted to:

- Set up and deploy the project
- Link to an existing project or create a new one
- Configure project settings

### Connect Git for Automatic Deployments

Connect your GitHub repository to enable automatic deployments on push:

```bash
vercel git connect
```

This links your local Git repository to your Vercel project, enabling:

- Automatic deployments on push to main branch
- Preview deployments for pull requests
- Deployment status checks on GitHub

## Deployment Workflow

After initial setup, your workflow is:

1. **Develop locally**: `bun run dev`
2. **Commit and push**: `git push origin main`
3. **Automatic deployment**: Vercel deploys on push

---

## Editor and Linting Setup

Configure Prettier for code formatting and TypeScript for typechecking. Includes VSCode settings and EditorConfig for consistent code style. Skips ESLint/Biome to avoid config complexity.

### Step 1: Install Prettier

```bash
bun add -D prettier
```

### Step 2: Add scripts

Add these scripts to your `package.json`:

```json
{
	"scripts": {
		"typecheck": "tsc --noEmit",
		"fmt": "prettier --write ."
	}
}
```

### Step 3: Install VSCode Extension (Optional)

Install the Prettier VSCode extension for automatic formatting:

- [Install in Cursor](cursor:extension/esbenp.prettier-vscode)
- Or via VS Code command line: `ext install esbenp.prettier-vscode`

Note: The extension may be marked as deprecated (replaced by `prettier.prettier-vscode`), however I've found that at least in Cursor `esbenp.prettier-vscode` works without issues while `prettier.prettier-vscode` has issues formatting .tsx files.

### Step 4: Add .vscode Configuration (Optional)

Create a `.vscode` folder in your project root with the following files:

#### .vscode/extensions.json

Recommend the Prettier extension to all contributors:

```json
{
	// See https://go.microsoft.com/fwlink/?LinkId=827846 to learn about workspace recommendations.
	// Extension identifier format: ${publisher}.${name}. Example: vscode.csharp
	// List of extensions which should be recommended for users of this workspace.
	"recommendations": ["esbenp.prettier-vscode"],
	// List of extensions recommended by VS Code that should not be recommended for users of this workspace.
	"unwantedRecommendations": []
}
```

#### .vscode/settings.json

Enable format on save with Prettier as the default formatter:

```json
{
	"editor.formatOnSave": true,
	"editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### Step 5: Add .editorconfig (Optional)

Create a `.editorconfig` file in your project root. This is optional since Prettier already enforces these rules by default, but it ensures consistency when contributors use editors without setting up Prettier:

```editorconfig
# Editor config - see http://EditorConfig.org

root = true

[*]
charset = utf-8
insert_final_newline = true
end_of_line = lf
indent_style = space
indent_size = 2
max_line_length = 80
```

---

## References

- [Prettier Philosophy](https://prettier.io/docs/option-philosophy)
- [EditorConfig](https://editorconfig.org/)

---

## AI Coding Agent Configuration

Configure AI coding agents like Cursor, GitHub Copilot, or Claude Code with project-specific patterns, coding guidelines, and MCP servers for consistent AI-assisted development.

### Step 1: Create an agents.md file

Create an `agents.md` file in your project root. This file provides coding guidelines and patterns for AI assistants to follow.

```markdown
# Patterns

- Everything is a library: Organize features and domains as self-contained folders in `src/lib/` (e.g., `chat`, `ai`, `db`). Co-locate schema, queries, types, and utilities together. Components go in `components/<feature>/`.
- Use the web platform: Prefer native APIs and standards. Avoid abstractions that hide what the code actually does.

# Coding Guidelines

## Runtime and Package Manager

- Use Bun instead of Node.js, npm, pnpm, or vite.
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`.
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`.

## TypeScript

- Avoid `export default` in favor of `export` whenever possible.
- Only create an abstraction if it's actually needed
- Prefer clear function/variable names over inline comments
- Avoid helper functions when a simple inline expression would suffice
- Don't use emojis
- No barrel index files - just export from the source files instead
- No type.ts files, just inline types or co-locate them with their related code
- Don't unnecessarily add `try`/`catch`
- Don't cast to `any`

## React

- Avoid massive JSX blocks and compose smaller components
- Colocate code that changes together
- Avoid `useEffect` unless absolutely needed

## Tailwind

- Mostly use built-in values, occasionally allow dynamic values, rarely globals
- Always use v4 + global CSS file format + shadcn/ui

## Next

- Prefer fetching data in RSC (page can still be static)
- Use next/font + next/script when applicable
- next/image above the fold should have `sync` / `eager` / use `priority` sparingly
- Be mindful of serialized prop size for RSC → child components
```

> This `agents.md` file is based on [Lee Robinson's](https://x.com/leerob) original [shared here](https://x.com/leerob/status/1993162978410004777).

### Step 2: Configure MCP Servers

Use MCP (Model Context Protocol) servers to enhance your coding agent's capabilities. Different recipes may introduce additional MCP servers. For now, start by adding these foundational MCP servers to your `.cursor/mcp.json`:

```json
{
	"mcpServers": {
		"vercel": {
			"url": "https://mcp.vercel.com"
		},
		"next-devtools": {
			"command": "npx",
			"args": ["-y", "next-devtools-mcp@latest"]
		},
		"playwright": {
			"command": "npx",
			"args": ["@playwright/mcp@latest"]
		},
		"context7": {
			"url": "https://mcp.context7.com/mcp"
		},
		"fullstackrecipes": {
			"url": "https://fullstackrecipes.com/api/mcp"
		}
	}
}
```

| Server | Description |
| `vercel` | Manage Vercel projects, deployments, and search Vercel docs |
| `next-devtools` | Next.js development tools for debugging, routing, and build info |
| `playwright` | Browser automation for testing and interacting with web pages |
| `context7` | Up-to-date documentation lookup for any library |
| `fullstackrecipes` | Fullstackrecipes recipes |

> **Vercel MCP:** On first connection, Cursor will show a "Needs login" prompt. Click it to authorize access to your Vercel account. For project-specific context, use `https://mcp.vercel.com/<teamSlug>/<projectSlug>` instead.

---

## Shadcn UI & Theming

Add Shadcn UI components with dark mode support using next-themes. Includes theme provider and CSS variables configuration.

### Step 1: Initialize Shadcn

```bash
bunx --bun shadcn@latest init
```

Follow the prompts to configure your project. The CLI will create a `components.json` config file and set up your CSS variables in `globals.css`.

### Step 2: Add components

Install all components:

```bash
bunx --bun shadcn@latest add --all --yes
```

Note: Shadcn is highly configurable. Omit `--yes` and follow the setup wizard to configure Shadcn to your liking.

### Step 3: Add dark mode

Install the theme provider:

```bash
bun add next-themes
```

Create the theme provider component:

```tsx
// src/components/themes/provider.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

Wrap your app with the provider in your layout:

```tsx
// src/app/layout.tsx
import { ThemeProvider } from "@/components/themes/provider";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body>
				<ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
					{children}
					<Toaster richColors position='top-center' />
				</ThemeProvider>
			</body>
		</html>
	);
}
```

Create the theme selector component to toggle between light, dark, and system themes:

```tsx
// src/components/themes/selector.tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSelector() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='icon'>
					<Sun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
					<Moon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
					<span className='sr-only'>Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
```

---

## References

- [Shadcn Next.js Installation](https://ui.shadcn.com/docs/installation/next)
- [Shadcn Dark Mode Guide](https://ui.shadcn.com/docs/dark-mode/next)

---

## Assertion Helper

TypeScript assertion function for runtime type narrowing with descriptive error messages. Based on tiny-invariant.

**Install via shadcn registry:**

```bash
bunx --bun shadcn@latest add https://fullstackrecipes.com/r/assert.json
```

**Or copy the source code:**

`lib/common/assert.ts`:

```typescript
const prefix: string = "Assertion failed";

/**
 * TypeScript assertion function that narrows types when condition is truthy.
 * Throws if condition is falsy. Message can be string or lazy function.
 */
export default function assert(condition: any, message?: string | (() => string)): asserts condition {
	if (condition) {
		return;
	}

	const provided: string | undefined = typeof message === "function" ? message() : message;
	const value: string = provided ? `${prefix}: ${provided}` : prefix;
	throw new Error(value);
}
```

### Why This Pattern?

- **Type narrowing**: TypeScript understands the assertion and narrows types after the check
- **Descriptive errors**: Know exactly what assertion failed and why
- **Lazy messages**: Defer expensive message construction until failure occurs

### Usage

The `assert` function throws if the condition is falsy, and narrows the type when it passes:

```typescript
import assert from "@/lib/common/assert";

function processUser(user: User | null) {
	assert(user, "User must exist");
	// TypeScript now knows `user` is `User`, not `User | null`
	console.log(user.name);
}
```

### Lazy Message Evaluation

For expensive message construction, pass a function that only runs on failure:

```typescript
assert(TOOL_TYPES.includes(part.type as ToolType), () => `Invalid tool type: ${part.type}`);
```

---

### Attribution

This implementation is based on [tiny-invariant](https://www.npmjs.com/package/tiny-invariant).

---

## References

- [TypeScript Assertion Functions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)
- [tiny-invariant](https://www.npmjs.com/package/tiny-invariant)

---

## Type-Safe Environment Configuration

Type-safe environment variable validation using Zod with a Drizzle-like schema API. Supports server/public fields, feature flags, either-or constraints, and client-side protection.

### Config Schema Utility

Instead of accessing environment variables directly (`process.env.DATABASE_URL`), use the `config-schema` utility to specify and validate environment variables.

First, set up the `config-schema` utility and a `mainConfig` for common environment variables such as `NODE_ENV`:

**Install via shadcn registry:**

```bash
bunx --bun shadcn@latest add https://fullstackrecipes.com/r/config-schema.json
```

**Or copy the source code:**

`lib/config/schema.ts`:

````typescript
import { z } from "zod";

// =============================================================================
// Types
// =============================================================================

/** Base field definition with schema type */
type FieldDefBase<TSchema extends z.ZodTypeAny = z.ZodString> = {
	env: string;
	value: string | undefined;
	schema: TSchema;
	isOptional: boolean;
};

/** Server field definition */
type ServerFieldDef<TSchema extends z.ZodTypeAny = z.ZodString> = FieldDefBase<TSchema> & { _type: "server" };

/** Public field definition */
type PublicFieldDef<TSchema extends z.ZodTypeAny = z.ZodString> = FieldDefBase<TSchema> & { _type: "public" };

/** Field definition union */
type FieldDef = ServerFieldDef<z.ZodTypeAny> | PublicFieldDef<z.ZodTypeAny>;

/** Schema fields record */
type SchemaFields = Record<string, FieldDef>;

/** Constraint result */
type ConstraintResult<T extends SchemaFields> = {
	type: "oneOf";
	fields: (keyof T)[];
	satisfied: boolean;
};

/** Constraint function */
type Constraint<T extends SchemaFields> = (fields: T) => ConstraintResult<T>;

/** Infer the output type from a FieldDef based on schema and optionality */
type InferField<F> =
	F extends FieldDefBase<infer S> ? (F["isOptional"] extends true ? z.infer<S> | undefined : z.infer<S>) : never;

/** Extract server field keys */
type ServerKeys<T extends SchemaFields> = {
	[K in keyof T]: T[K] extends ServerFieldDef<z.ZodTypeAny> ? K : never;
}[keyof T];

/** Extract public field keys */
type PublicKeys<T extends SchemaFields> = {
	[K in keyof T]: T[K] extends PublicFieldDef<z.ZodTypeAny> ? K : never;
}[keyof T];

/** Build server section type */
type ServerSection<T extends SchemaFields> = {
	[K in ServerKeys<T>]: InferField<T[K]>;
};

/** Build public section type */
type PublicSection<T extends SchemaFields> = {
	[K in PublicKeys<T>]: InferField<T[K]>;
};

/** Check if there are any server fields */
type HasServerFields<T extends SchemaFields> = ServerKeys<T> extends never ? false : true;

/** Check if there are any public fields */
type HasPublicFields<T extends SchemaFields> = PublicKeys<T> extends never ? false : true;

/** Infer config result from fields (no isEnabled) */
type InferConfigResult<T extends SchemaFields> = (HasServerFields<T> extends true
	? { server: ServerSection<T> }
	: object) &
	(HasPublicFields<T> extends true ? { public: PublicSection<T> } : object);

/** Config with feature flag enabled */
type EnabledConfig<T extends SchemaFields> = InferConfigResult<T> & {
	isEnabled: true;
};

/** Config with feature flag disabled */
type DisabledConfig = { isEnabled: false };

/** Feature config (when flag is used) */
export type FeatureConfig<T extends SchemaFields> = EnabledConfig<T> | DisabledConfig;

/** Flag options */
type FlagOptions = {
	env: string;
	value: string | undefined;
};

/** Options object with flag (returns FeatureConfig) */
type ConfigOptionsWithFlag<T extends SchemaFields> = {
	flag: FlagOptions;
	constraints?: (schema: T) => Constraint<T>[];
};

/** Options object without flag (returns InferConfigResult) */
type ConfigOptionsWithoutFlag<T extends SchemaFields> = {
	flag?: undefined;
	constraints: (schema: T) => Constraint<T>[];
};

// =============================================================================
// Errors
// =============================================================================

/**
 * Error thrown when configuration validation fails.
 */
export class InvalidConfigurationError extends Error {
	constructor(message: string, schemaName?: string) {
		const schema = schemaName ? ` for ${schemaName}` : "";
		super(
			`Configuration validation error${schema}! Did you correctly set all required environment variables in your .env* file?\n - ${message}`,
		);
		this.name = "InvalidConfigurationError";
	}
}

/**
 * Error thrown when server-only config is accessed on the client.
 */
export class ServerConfigClientAccessError extends Error {
	constructor(schemaName: string, key: string, envName: string) {
		super(
			`[${schemaName}] Attempted to access server-only config 'server.${key}' (${envName}) on client. ` +
				`Move this value to 'public' if it needs client access, or ensure this code only runs on server.`,
		);
		this.name = "ServerConfigClientAccessError";
	}
}

// =============================================================================
// Field Builders
// =============================================================================

type ServerFieldOptionsBase = {
	env: string;
	value?: string | undefined;
	optional?: boolean;
};

type ServerFieldOptionsWithSchema<T extends z.ZodTypeAny> = ServerFieldOptionsBase & {
	schema: T;
};

type ServerFieldOptionsWithoutSchema = ServerFieldOptionsBase & {
	schema?: undefined;
};

type PublicFieldOptionsBase = {
	env: string;
	value: string | undefined; // Required for public fields (Next.js inlining)
	optional?: boolean;
};

type PublicFieldOptionsWithSchema<T extends z.ZodTypeAny> = PublicFieldOptionsBase & {
	schema: T;
};

type PublicFieldOptionsWithoutSchema = PublicFieldOptionsBase & {
	schema?: undefined;
};

/**
 * Define a server-only config field.
 * Server fields are only accessible on the server and throw on client access.
 *
 * @example
 * ```ts
 * server({ env: "DATABASE_URL" })
 * server({ env: "PORT", schema: z.coerce.number().default(3000) })
 * server({ env: "OPTIONAL_KEY", optional: true })
 * ```
 */
export function server<T extends z.ZodTypeAny>(options: ServerFieldOptionsWithSchema<T>): ServerFieldDef<T>;
export function server(options: ServerFieldOptionsWithoutSchema): ServerFieldDef<z.ZodString>;
export function server(options: ServerFieldOptionsBase & { schema?: z.ZodTypeAny }): ServerFieldDef<z.ZodTypeAny> {
	const { env, value, schema = z.string(), optional = false } = options;

	return {
		_type: "server" as const,
		env,
		value: value ?? process.env[env],
		schema,
		isOptional: optional,
	};
}

/**
 * Define a public config field (accessible on both server and client).
 * The value must be passed directly for Next.js to inline NEXT_PUBLIC_* variables.
 *
 * @example
 * ```ts
 * pub({ env: "NEXT_PUBLIC_DSN", value: process.env.NEXT_PUBLIC_DSN })
 * pub({ env: "NEXT_PUBLIC_ENABLED", value: process.env.NEXT_PUBLIC_ENABLED, schema: z.string().optional() })
 * ```
 */
export function pub<T extends z.ZodTypeAny>(options: PublicFieldOptionsWithSchema<T>): PublicFieldDef<T>;
export function pub(options: PublicFieldOptionsWithoutSchema): PublicFieldDef<z.ZodString>;
export function pub(options: PublicFieldOptionsBase & { schema?: z.ZodTypeAny }): PublicFieldDef<z.ZodTypeAny> {
	const { env, value, schema = z.string(), optional = false } = options;

	return {
		_type: "public" as const,
		env,
		value,
		schema,
		isOptional: optional,
	};
}

// =============================================================================
// Constraints
// =============================================================================

/**
 * Create a "one of" constraint.
 * At least one of the specified fields must have a value.
 *
 * @example
 * ```ts
 * configSchema("AI", {
 *   oidcToken: server({ env: "VERCEL_OIDC_TOKEN" }),
 *   apiKey: server({ env: "API_KEY" }),
 * }, {
 *   constraints: (s) => [oneOf([s.oidcToken, s.apiKey])],
 * })
 * ```
 */
export function oneOf<T extends SchemaFields>(fieldDefs: FieldDef[]): Constraint<T> {
	return (allFields) => {
		// Find which field names match the provided field defs
		const fieldNames: (keyof T)[] = [];
		for (const [name, field] of Object.entries(allFields)) {
			if (fieldDefs.includes(field)) {
				fieldNames.push(name as keyof T);
			}
		}

		const satisfied = fieldDefs.some((field) => field.value !== undefined && field.value !== "");

		return {
			type: "oneOf",
			fields: fieldNames,
			satisfied,
		};
	};
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Checks if a flag value is truthy.
 */
function isFlagEnabled(flag: string | undefined): boolean {
	if (!flag) return false;
	return ["true", "1", "yes"].includes(flag.toLowerCase());
}

/**
 * Creates a Proxy that throws when server config is accessed on client.
 */
function createServerProxy<T extends object>(data: T, schemaName: string, fieldEnvMap: Record<string, string>): T {
	if (typeof window === "undefined") {
		return data;
	}

	return new Proxy(data, {
		get(target, prop, receiver) {
			if (typeof prop === "symbol") {
				return Reflect.get(target, prop, receiver);
			}
			const key = String(prop);
			const envName = fieldEnvMap[key] ?? "UNKNOWN";
			throw new ServerConfigClientAccessError(schemaName, key, envName);
		},
	});
}

// =============================================================================
// Schema Builder
// =============================================================================

// Overload 1: No options (just name and fields)
export function configSchema<T extends SchemaFields>(name: string, fields: T): InferConfigResult<T>;

// Overload 2: With flag option (returns FeatureConfig)
export function configSchema<T extends SchemaFields>(
	name: string,
	fields: T,
	options: ConfigOptionsWithFlag<T>,
): FeatureConfig<T>;

// Overload 3: With constraints but no flag (returns InferConfigResult)
export function configSchema<T extends SchemaFields>(
	name: string,
	fields: T,
	options: ConfigOptionsWithoutFlag<T>,
): InferConfigResult<T>;

/**
 * Define a configuration schema with typed server and public fields.
 *
 * @example Basic server-only config
 * ```ts
 * const dbConfig = configSchema("Database", {
 *   url: server({ env: "DATABASE_URL" }),
 * });
 * // Type: { server: { url: string } }
 * dbConfig.server.url
 * ```
 *
 * @example Feature flag
 * ```ts
 * const sentryConfig = configSchema("Sentry", {
 *   token: server({ env: "SENTRY_AUTH_TOKEN" }),
 *   dsn: pub({ env: "NEXT_PUBLIC_SENTRY_DSN", value: process.env.NEXT_PUBLIC_SENTRY_DSN }),
 * }, {
 *   flag: { env: "NEXT_PUBLIC_ENABLE_SENTRY", value: process.env.NEXT_PUBLIC_ENABLE_SENTRY },
 * });
 *
 * if (sentryConfig.isEnabled) {
 *   sentryConfig.server.token;  // string
 *   sentryConfig.public.dsn;    // string
 * }
 * ```
 *
 * @example Either-or with oneOf (no flag)
 * ```ts
 * const aiConfig = configSchema("AI", {
 *   oidcToken: server({ env: "VERCEL_OIDC_TOKEN" }),
 *   apiKey: server({ env: "API_KEY" }),
 * }, {
 *   constraints: (s) => [oneOf([s.oidcToken, s.apiKey])],
 * });
 * // Type: { server: { oidcToken?: string; apiKey?: string } }
 * ```
 *
 * @example Flag + constraints
 * ```ts
 * const config = configSchema("MyFeature", {
 *   token: server({ env: "TOKEN" }),
 *   backupToken: server({ env: "BACKUP_TOKEN" }),
 * }, {
 *   flag: { env: "ENABLE_FEATURE", value: process.env.ENABLE_FEATURE },
 *   constraints: (s) => [oneOf([s.token, s.backupToken])],
 * });
 * ```
 */
export function configSchema<T extends SchemaFields>(
	name: string,
	fields: T,
	options?: ConfigOptionsWithFlag<T> | ConfigOptionsWithoutFlag<T>,
): InferConfigResult<T> | FeatureConfig<T> {
	const flagOptions = options?.flag;
	const constraintsFn = options?.constraints;
	const hasFlag = flagOptions !== undefined;

	// Check if config has public fields
	const hasPublicFields = Object.values(fields).some((f) => f._type === "public");

	// Enforce: if config has public fields and a flag, flag must be NEXT_PUBLIC_*
	if (hasFlag && hasPublicFields) {
		const flagEnv = flagOptions.env;
		if (!flagEnv.startsWith("NEXT_PUBLIC_")) {
			throw new InvalidConfigurationError(
				`Flag "${flagEnv}" must use a NEXT_PUBLIC_* variable when config has public fields. ` +
					`Otherwise, isEnabled will always be false on the client.`,
				name,
			);
		}
	}

	// If flag exists and is disabled, return early
	if (hasFlag && !isFlagEnabled(flagOptions.value)) {
		return { isEnabled: false };
	}

	// Evaluate constraints if provided
	const constraintList = constraintsFn ? constraintsFn(fields) : [];
	const constraintResults = constraintList.map((c) => c(fields));

	// Collect oneOf constraint results
	const oneOfResults = constraintResults.filter((r): r is ConstraintResult<T> => r.type === "oneOf");

	// Track which fields are covered by oneOf (making them conditionally optional)
	const oneOfFieldNames = new Set<string>();

	for (const result of oneOfResults) {
		for (const fieldName of result.fields) {
			oneOfFieldNames.add(fieldName as string);
		}
	}

	const isClient = typeof window !== "undefined";

	// Process fields
	const serverFields: Record<string, unknown> = {};
	const publicFields: Record<string, unknown> = {};

	for (const [key, field] of Object.entries(fields)) {
		// Skip server validation on client
		if (field._type === "server" && isClient) {
			continue;
		}

		const { value, schema, isOptional } = field;

		// Check if this field is covered by a oneOf constraint
		const isInOneOf = oneOfFieldNames.has(key);
		let canSkipValidation = isOptional;

		if (isInOneOf && value === undefined) {
			// Check if any oneOf constraint covering this field is satisfied
			const relevantOneOf = oneOfResults.find((r) => r.fields.includes(key as keyof T));
			if (relevantOneOf?.satisfied) {
				canSkipValidation = true;
			}
		}

		// Skip validation for optional fields with undefined value
		if (value === undefined && canSkipValidation) {
			if (field._type === "server") {
				serverFields[key] = undefined;
			} else {
				publicFields[key] = undefined;
			}
			continue;
		}

		// Validate
		const parseResult = schema.safeParse(value);

		if (!parseResult.success) {
			const section = field._type;
			const issue = parseResult.error.issues[0];
			let message: string;

			if (value === undefined) {
				// Check if part of oneOf
				if (isInOneOf) {
					const relevantOneOf = oneOfResults.find((r) => r.fields.includes(key as keyof T));
					if (relevantOneOf) {
						const otherFields = relevantOneOf.fields
							.filter((f) => f !== key)
							.map((f) => {
								const otherField = fields[f as string];
								return `${section}.${String(f)} (${otherField.env})`;
							});
						if (otherFields.length === 1) {
							message = `Either ${section}.${key} (${field.env}) or ${otherFields[0]} must be defined.`;
						} else {
							message = `Either ${section}.${key} (${field.env}) or one of [${otherFields.join(", ")}] must be defined.`;
						}
					} else {
						message = `${section}.${key} (${field.env}) must be defined.`;
					}
				} else {
					message = `${section}.${key} (${field.env}) must be defined.`;
				}
			} else {
				message = `${section}.${key} (${field.env}) is invalid: ${issue?.message ?? "validation failed"}`;
			}

			throw new InvalidConfigurationError(message, name);
		}

		if (field._type === "server") {
			serverFields[key] = parseResult.data;
		} else {
			publicFields[key] = parseResult.data;
		}
	}

	// Build result
	const result: Record<string, unknown> = {};

	const hasServer = Object.values(fields).some((f) => f._type === "server");
	const hasPublic = Object.values(fields).some((f) => f._type === "public");

	if (hasServer) {
		// Build env name map for server fields (used for client-side error messages)
		const serverFieldEnvMap: Record<string, string> = {};
		for (const [key, field] of Object.entries(fields)) {
			if (field._type === "server") {
				serverFieldEnvMap[key] = field.env;
			}
		}
		result.server = createServerProxy(serverFields, name, serverFieldEnvMap);
	}

	if (hasPublic) {
		result.public = publicFields;
	}

	// Return with isEnabled only if flag was provided
	if (hasFlag) {
		return { ...result, isEnabled: true } as FeatureConfig<T>;
	}

	return result as InferConfigResult<T>;
}
````

`lib/config/main.ts`:

```typescript
import { z } from "zod";
import { configSchema, server } from "./schema";

export const mainConfig = configSchema("Main", {
	nodeEnv: server({
		env: "NODE_ENV",
		schema: z.enum(["development", "production", "test"]).default("development"),
	}),
});
```

#### Basic Usage

The API uses a Drizzle-like schema pattern with `server()` and `pub()` field builders:

```typescript
// src/lib/db/config.ts
import { configSchema, server } from "@/lib/config/schema";

export const databaseConfig = configSchema("Database", {
	url: server({ env: "DATABASE_URL" }),
});
// Type: { server: { url: string } }
```

If `DATABASE_URL` is missing, you get a clear error:

```plain
Error [InvalidConfigurationError]: Configuration validation error for Database!
Did you correctly set all required environment variables in your .env* file?
 - server.url (DATABASE_URL) must be defined.
```

Then import and use it:

```typescript
// src/lib/db/client.ts
import { databaseConfig } from "./config";

const pool = new Pool({
	connectionString: databaseConfig.server.url,
});
```

#### Server vs Public Fields

Use `server()` for server-only secrets and `pub()` for client-accessible values:

```typescript
import { configSchema, server, pub } from "@/lib/config/schema";

export const sentryConfig = configSchema(
	"Sentry",
	{
		// Server-only - throws if accessed on client
		token: server({ env: "SENTRY_AUTH_TOKEN" }),
		// Client-accessible - work everywhere
		dsn: pub({
			env: "NEXT_PUBLIC_SENTRY_DSN",
			value: process.env.NEXT_PUBLIC_SENTRY_DSN,
		}),
		project: pub({
			env: "NEXT_PUBLIC_SENTRY_PROJECT",
			value: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
		}),
	},
	{
		flag: {
			env: "NEXT_PUBLIC_ENABLE_SENTRY",
			value: process.env.NEXT_PUBLIC_ENABLE_SENTRY,
		},
	},
);
```

**Why pass `value` for public fields?**

Next.js only inlines `NEXT_PUBLIC_*` environment variables when accessed statically (like `process.env.NEXT_PUBLIC_DSN`). Dynamic lookups like `process.env[varName]` don't work on the client. By passing `value` directly, the static references are preserved and properly inlined at build time.

Server fields can omit `value` since they use `process.env[env]` internally and are only accessed on the server.

#### Feature Flags

Use the `flag` option for features that can be enabled/disabled:

```typescript
// src/lib/sentry/config.ts
import { configSchema, server, pub } from "@/lib/config/schema";

export const sentryConfig = configSchema(
	"Sentry",
	{
		token: server({ env: "SENTRY_AUTH_TOKEN" }),
		dsn: pub({
			env: "NEXT_PUBLIC_SENTRY_DSN",
			value: process.env.NEXT_PUBLIC_SENTRY_DSN,
		}),
		project: pub({
			env: "NEXT_PUBLIC_SENTRY_PROJECT",
			value: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
		}),
		org: pub({
			env: "NEXT_PUBLIC_SENTRY_ORG",
			value: process.env.NEXT_PUBLIC_SENTRY_ORG,
		}),
	},
	{
		flag: {
			env: "NEXT_PUBLIC_ENABLE_SENTRY",
			value: process.env.NEXT_PUBLIC_ENABLE_SENTRY,
		},
	},
);
// Type: FeatureConfig<...> (has isEnabled)
```

> **Enforced:** If your config has public fields, the flag must use a `NEXT_PUBLIC_*` variable. This is validated at definition time and throws an error if violated:
>
> ```plain
> Error [InvalidConfigurationError]: Configuration validation error for Sentry!
> Did you correctly set all required environment variables in your .env* file?
>  - Flag "ENABLE_SENTRY" must use a NEXT_PUBLIC_* variable when config has public fields. Otherwise, isEnabled will always be false on the client.
> ```
>
> This prevents a common bug where the flag is `undefined` on the client (since non-public env vars aren't inlined), causing `isEnabled` to always be `false` in client code even when the feature is enabled on the server.

Behavior:

- Flag not set or falsy: `{ isEnabled: false }` (no validation, no errors)
- Flag is `"true"`, `"1"`, or `"yes"`: validates all values, returns `{ ..., isEnabled: true }`
- Flag truthy + missing value: throws `InvalidConfigurationError`

Usage:

```typescript
// src/instrumentation.ts
import { sentryConfig } from "./lib/sentry/config";

export async function register() {
	if (sentryConfig.isEnabled) {
		const Sentry = await import("@sentry/nextjs");
		Sentry.init({
			dsn: sentryConfig.public.dsn,
		});
	}
}
```

#### Either-Or Values

Use the `oneOf` constraint when a feature can be configured with alternative credentials:

```typescript
// src/lib/ai/config.ts
import { configSchema, server, oneOf } from "@/lib/config/schema";

export const aiConfig = configSchema(
	"AI",
	{
		oidcToken: server({ env: "VERCEL_OIDC_TOKEN" }),
		gatewayApiKey: server({ env: "AI_GATEWAY_API_KEY" }),
	},
	{
		constraints: (s) => [oneOf([s.oidcToken, s.gatewayApiKey])],
	},
);
// Type: { server: { oidcToken?: string; gatewayApiKey?: string } }
// Note: No isEnabled property (no flag used)
```

At least one of the specified fields must have a value. Error messages include the alternatives:

```plain
Error [InvalidConfigurationError]: Configuration validation error for AI!
Did you correctly set all required environment variables in your .env* file?
 - Either server.oidcToken (VERCEL_OIDC_TOKEN) or server.gatewayApiKey (AI_GATEWAY_API_KEY) must be defined.
```

#### Combining Flag and Constraints

You can use both `flag` and `constraints` together:

```typescript
export const myConfig = configSchema(
	"MyFeature",
	{
		token: server({ env: "TOKEN" }),
		backupToken: server({ env: "BACKUP_TOKEN" }),
	},
	{
		flag: { env: "ENABLE_FEATURE", value: process.env.ENABLE_FEATURE },
		constraints: (s) => [oneOf([s.token, s.backupToken])],
	},
);
// Type: FeatureConfig<...> (has isEnabled because flag is used)
```

#### Optional Fields

Use `optional: true` for fields that are always optional:

```typescript
export const authConfig = configSchema("Auth", {
	secret: server({ env: "BETTER_AUTH_SECRET" }),
	url: server({ env: "BETTER_AUTH_URL" }),
	vercelClientId: server({ env: "VERCEL_CLIENT_ID", optional: true }),
	vercelClientSecret: server({ env: "VERCEL_CLIENT_SECRET", optional: true }),
});
```

#### Client-Side Protection

Server fields use a Proxy to protect values from being accessed on the client:

```typescript
// On the server - everything works
sentryConfig.public.dsn; // "https://..."
sentryConfig.server.token; // "secret-token"

// On the client
sentryConfig.public.dsn; // works (public field)
sentryConfig.server.token; // throws ServerConfigClientAccessError
```

This catches accidental client-side access to secrets at runtime:

```plain
Error [ServerConfigClientAccessError]: [Sentry] Attempted to access server-only config 'server.token' (SENTRY_AUTH_TOKEN) on client.
Move this value to 'public' if it needs client access, or ensure this code only runs on server.
```

#### Custom Validation

For transforms, defaults, or complex validation, pass a `schema` option with a Zod schema:

```typescript
import { z } from "zod";
import { configSchema, server } from "@/lib/config/schema";

export const databaseConfig = configSchema("Database", {
	url: server({ env: "DATABASE_URL" }),
	// Transform string to number with default
	poolSize: server({
		env: "DATABASE_POOL_SIZE",
		schema: z.coerce.number().default(10),
	}),
});
// Type: { server: { url: string; poolSize: number } }
```

More examples:

```typescript
import { z } from "zod";
import { configSchema, server } from "@/lib/config/schema";

export const config = configSchema("App", {
	// Required string (default)
	apiKey: server({ env: "API_KEY" }),

	// Optional string
	debugMode: server({
		env: "DEBUG_MODE",
		schema: z.string().optional(),
	}),

	// String with regex validation
	fromEmail: server({
		env: "FROM_EMAIL",
		schema: z.string().regex(/^.+\s<.+@.+\..+>$/, 'Must match "Name <email>" format'),
	}),

	// Enum with default
	nodeEnv: server({
		env: "NODE_ENV",
		schema: z.enum(["development", "production", "test"]).default("development"),
	}),

	// Boolean
	enableFeature: server({
		env: "ENABLE_FEATURE",
		schema: z.coerce.boolean().default(false),
	}),
});
```

---

### Adding New Environment Variables

When adding a new feature that needs env vars:

1. Create `src/lib/<feature>/config.ts`
2. Use `configSchema` with `server()` and/or `pub()` fields
3. Add `flag` option if the feature should be toggleable
4. Add `constraints` option with `oneOf()` for either-or validation
5. Import the config in `src/instrumentation.ts` for early validation
6. Import and use the config within that feature

Example for adding Stripe:

```typescript
// src/lib/stripe/config.ts
import { configSchema, server, pub } from "@/lib/config/schema";

export const stripeConfig = configSchema("Stripe", {
	secretKey: server({ env: "STRIPE_SECRET_KEY" }),
	webhookSecret: server({ env: "STRIPE_WEBHOOK_SECRET" }),
	publishableKey: pub({
		env: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
		value: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
	}),
});
```

Then use it in your Stripe client:

```typescript
// src/lib/stripe/client.ts
import Stripe from "stripe";
import { stripeConfig } from "./config";

export const stripe = new Stripe(stripeConfig.server.secretKey);
```

#### Main Config

The `config-schema` utility provides a `mainConfig` that can be used to access all common environment variables. Inititally, it includes the `NODE_ENV` variable.

Review the code base and add all used common environment variables to the `mainConfig`. This may include the server domain and other common variables that don't belong to a specific feature.

```typescript
// src/lib/config/main.ts
import { z } from "zod";
import { configSchema, server } from "./schema";

export const mainConfig = configSchema("Main", {
	nodeEnv: server({
		env: "NODE_ENV",
		schema: z.enum(["development", "production", "test"]).default("development"),
	}),
});
```

Now replace all direct access to environment variables with the `mainConfig`:

```typescript
import { mainConfig } from "@/lib/config/main";

const isDev = mainConfig.server.nodeEnv === "development";
```

---

## Build-Time Environment Variable Validation

Validate environment variables on server start and before builds. Catch missing or invalid variables early with clear error messages.

## Implement Environment Validation

Validate environment variables on server start and before builds. Catch missing or invalid variables early with clear error messages.

**See:**

- Resource: `env-validation` in Fullstack Recipes
- URL: https://fullstackrecipes.com/recipes/env-validation

---

### Validating Configs on Server Start

Some environment variables are read internally by packages rather than passed as arguments. To catch missing variables early instead of at runtime, import your configs in `instrumentation.ts`:

```typescript
// src/instrumentation.ts
import * as Sentry from "@sentry/nextjs";
import { sentryConfig } from "./lib/sentry/config";

// Validate required configs on server start
import "./lib/ai/config";
import "./lib/db/config";

export async function register() {
	// ... initialization code
}
```

The side-effect imports trigger `configSchema` validation immediately when the server starts. If any required environment variable is missing, the server fails to start with a clear error rather than failing later when the code path is executed.

---

### Validating Environment Files Pre-Build

**Install via shadcn registry:**

```bash
bunx --bun shadcn@latest add https://fullstackrecipes.com/r/validate-env.json
```

**Or copy the source code:**

`scripts/validate-env.ts`:

```typescript
#!/usr/bin/env bun
/**
 * Validate environment configuration
 *
 * Usage:
 *   bun run validate-env
 *   bun run validate-env --environment=development
 *   bun run validate-env --environment=production
 *
 * This script:
 * 1. Loads env files using Next.js's loadEnvConfig
 * 2. Finds all config.ts files in src/lib/\*\/
 * 3. Validates each config by importing it (triggers configSchema validation)
 * 4. Warns about env variables in .env files that aren't used by any config
 */

import { loadEnvConfig } from "@next/env";
import { Glob } from "bun";
import path from "path";

// ANSI colors
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;

// Parse CLI args
function parseArgs(): { environment?: string } {
	const args = process.argv.slice(2);
	const result: { environment?: string } = {};

	for (const arg of args) {
		if (arg.startsWith("--environment=")) {
			result.environment = arg.split("=")[1];
		}
	}

	return result;
}

// Track which env vars are referenced by configs
const referencedEnvVars = new Set<string>();

// Patch process.env to track access
function trackEnvAccess() {
	const originalEnv = process.env;
	const handler: ProxyHandler<NodeJS.ProcessEnv> = {
		get(target, prop) {
			if (typeof prop === "string" && !prop.startsWith("_")) {
				referencedEnvVars.add(prop);
			}
			return Reflect.get(target, prop);
		},
	};
	process.env = new Proxy(originalEnv, handler);
}

async function main() {
	const args = parseArgs();
	const projectDir = process.cwd();

	console.log(bold("\n🔍 Environment Configuration Validator\n"));

	// Set NODE_ENV if environment specified
	const environment = args.environment ?? process.env.NODE_ENV ?? "development";
	(process.env as Record<string, string>).NODE_ENV = environment;
	console.log(dim(`  Environment: ${environment}\n`));

	// Load env files
	// Second param `dev` tells loadEnvConfig to load .env.development files
	const isDev = environment === "development";
	console.log(dim("  Loading environment files..."));

	const loadedEnvFiles: string[] = [];
	const { combinedEnv, loadedEnvFiles: files } = loadEnvConfig(projectDir, isDev);

	for (const file of files) {
		loadedEnvFiles.push(file.path);
		console.log(dim(`    ✓ ${path.relative(projectDir, file.path)}`));
	}

	if (loadedEnvFiles.length === 0) {
		console.log(dim("    No .env files found"));
	}

	console.log("");

	// Start tracking env access before importing configs
	trackEnvAccess();

	// Find all config.ts files
	const configGlob = new Glob("src/lib/*/config.ts");
	const configFiles: string[] = [];

	for await (const file of configGlob.scan(projectDir)) {
		configFiles.push(file);
	}

	if (configFiles.length === 0) {
		console.log(yellow("  ⚠ No config.ts files found in src/lib/*/\n"));
		process.exit(0);
	}

	console.log(dim(`  Found ${configFiles.length} config files:\n`));

	// Validate each config
	const errors: { file: string; error: Error }[] = [];
	const validated: string[] = [];

	for (const configFile of configFiles) {
		const relativePath = configFile;
		const absolutePath = path.join(projectDir, configFile);

		try {
			// Import the config module - this triggers validation
			await import(absolutePath);
			console.log(green(`  ✓ ${relativePath}`));
			validated.push(relativePath);
		} catch (error) {
			if (error instanceof Error) {
				// Check if it's a disabled feature flag (not an error)
				if (error.message.includes("isEnabled: false")) {
					console.log(dim(`  ○ ${relativePath} (feature disabled)`));
					validated.push(relativePath);
				} else {
					console.log(red(`  ✗ ${relativePath}`));
					errors.push({ file: relativePath, error });
				}
			}
		}
	}

	console.log("");

	// Report validation errors
	if (errors.length > 0) {
		console.log(red(bold("Validation Errors:\n")));

		for (const { file, error } of errors) {
			console.log(red(`  ${file}:`));
			// Extract the actual error message
			const message = error.message.split("\n").slice(0, 3).join("\n    ");
			console.log(red(`    ${message}\n`));
		}
	}

	// Find unused env variables (in .env files but not referenced by configs)
	const envVarsInFiles = new Set<string>();

	// Parse loaded env files to get all defined variables
	for (const envFile of loadedEnvFiles) {
		try {
			const content = await Bun.file(envFile).text();
			const lines = content.split("\n");

			for (const line of lines) {
				const trimmed = line.trim();
				// Skip comments and empty lines
				if (!trimmed || trimmed.startsWith("#")) continue;

				// Extract variable name (before = sign)
				const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)\s*=/);
				if (match) {
					envVarsInFiles.add(match[1]);
				}
			}
		} catch {
			// Ignore file read errors
		}
	}

	// Common system/framework vars to ignore
	const ignoredVars = new Set([
		// System
		"NODE_ENV",
		"PATH",
		"HOME",
		"USER",
		"SHELL",
		"TERM",
		"LANG",
		"PWD",
		"OLDPWD",
		"HOSTNAME",
		"LOGNAME",
		"TMPDIR",
		"XDG_CONFIG_HOME",
		"XDG_DATA_HOME",
		"XDG_CACHE_HOME",
		"CI",
		"TZ",
		// Vercel
		"VERCEL",
		"VERCEL_ENV",
		"VERCEL_URL",
		"VERCEL_REGION",
		"VERCEL_TARGET_ENV",
		"VERCEL_GIT_COMMIT_SHA",
		"VERCEL_GIT_COMMIT_MESSAGE",
		"VERCEL_GIT_COMMIT_AUTHOR_LOGIN",
		"VERCEL_GIT_COMMIT_AUTHOR_NAME",
		"VERCEL_GIT_PREVIOUS_SHA",
		"VERCEL_GIT_PROVIDER",
		"VERCEL_GIT_REPO_ID",
		"VERCEL_GIT_REPO_OWNER",
		"VERCEL_GIT_REPO_SLUG",
		"VERCEL_GIT_COMMIT_REF",
		"VERCEL_GIT_PULL_REQUEST_ID",
		// Build tools (Turbo, NX)
		"TURBO_CACHE",
		"TURBO_REMOTE_ONLY",
		"TURBO_RUN_SUMMARY",
		"TURBO_DOWNLOAD_LOCAL_ENABLED",
		"NX_DAEMON",
	]);

	// Find vars in .env files but not referenced by configs
	const unusedVars: { name: string; files: string[] }[] = [];

	for (const envVar of envVarsInFiles) {
		if (ignoredVars.has(envVar)) continue;
		if (referencedEnvVars.has(envVar)) continue;

		// Find which files define this var
		const definingFiles: string[] = [];
		for (const envFile of loadedEnvFiles) {
			try {
				const content = await Bun.file(envFile).text();
				if (new RegExp(`^${envVar}\\s*=`, "m").test(content)) {
					definingFiles.push(path.relative(projectDir, envFile));
				}
			} catch {
				// Ignore
			}
		}

		if (definingFiles.length > 0) {
			unusedVars.push({ name: envVar, files: definingFiles });
		}
	}

	// Report unused vars
	if (unusedVars.length > 0) {
		console.log(yellow(bold("Unused Environment Variables:\n")));
		console.log(dim("  These variables are defined in .env files but not used by any config:\n"));

		for (const { name, files } of unusedVars.sort((a, b) => a.name.localeCompare(b.name))) {
			console.log(yellow(`  ⚠ ${name}`));
			console.log(dim(`    defined in: ${files.join(", ")}`));
		}

		console.log("");
	}

	// Summary
	console.log(bold("Summary:\n"));
	console.log(`  Configs validated: ${green(String(validated.length))}`);
	console.log(`  Validation errors: ${errors.length > 0 ? red(String(errors.length)) : green("0")}`);
	console.log(`  Unused env vars:   ${unusedVars.length > 0 ? yellow(String(unusedVars.length)) : green("0")}`);
	console.log("");

	// Exit with error code if validation failed
	if (errors.length > 0) {
		process.exit(1);
	}
}

main().catch((error) => {
	console.error(red("Unexpected error:"), error);
	process.exit(1);
});
```

Add the validation script to your `package.json`:

```json
{
	"scripts": {
		"prebuild": "bun run env:validate:prod",
		"env:validate": "bun run scripts/validate-env.ts --environment=development",
		"env:validate:prod": "bun run scripts/validate-env.ts --environment=production"
	}
}
```

Use the `env:validate` and `env:validate:prod` scripts to validate all your configs (`config.ts` files in `src/lib/*/`) against your `.env` files.

The `prebuild` script (configured above) runs automatically before `build`, ensuring environment variables are validated before every build (locally and in CI/Vercel). If validation fails, the build stops early with a clear error.

The script:

1. Loads `.env` files using Next.js's `loadEnvConfig` (respects the same load order as Next.js)
2. Finds all `config.ts` files in `src/lib/*/`
3. Imports each config to trigger `configSchema` validation
4. Reports any missing or invalid environment variables
5. Warns about variables defined in `.env` files but not used by any config

Example output with a validation error:

```plain
🔍 Environment Configuration Validator

  Environment: development

  Loading environment files...
    ✓ .env.local
    ✓ .env.development

  Found 5 config files:

  ✗ src/lib/resend/config.ts
  ✓ src/lib/sentry/config.ts
  ✓ src/lib/db/config.ts
  ✓ src/lib/ai/config.ts
  ✓ src/lib/auth/config.ts

Validation Errors:

  src/lib/resend/config.ts:
    Configuration validation error for Resend!
    Did you correctly set all required environment variables in your .env* file?
     - server.fromEmail (FROM_EMAIL) must be defined.

Summary:

  Configs validated: 4
  Validation errors: 1
  Unused env vars:   0
```

Example output with an unused variable:

```plain
🔍 Environment Configuration Validator

  Environment: development

  Loading environment files...
    ✓ .env.local
    ✓ .env.development

  Found 5 config files:

  ✓ src/lib/resend/config.ts
  ✓ src/lib/sentry/config.ts
  ✓ src/lib/db/config.ts
  ✓ src/lib/ai/config.ts
  ✓ src/lib/auth/config.ts

Unused Environment Variables:

  These variables are defined in .env files but not used by any config:

  ⚠ OLD_API_KEY
    defined in: .env.local

Summary:

  Configs validated: 5
  Validation errors: 0
  Unused env vars:   1
```

The script exits with code 1 if any validation errors occur (useful for CI), but unused variables only trigger warnings without failing the build.

---

## Neon + Drizzle Setup

Connect a Next.js app to Neon Postgres using Drizzle ORM with optimized connection pooling for Vercel serverless functions.

### Step 1: Install the Neon MCP Server globally

```bash
bunx neonctl@latest init
```

> **Note**: This installs the MCP server globally (not project-scoped) using your user API key. By default, the MCP server has **write access** to your Neon account.

For production apps in your organization, configure the MCP server to be read-only:

```json
{
	"mcpServers": {
		"Neon": {
			"url": "https://mcp.neon.tech/mcp",
			"headers": {
				"Authorization": "Bearer <$NEON_API_KEY>",
				"x-read-only": "true"
			}
		}
	}
}
```

### Step 2: Create a new Neon project

Use an existing Neon project or create a new one, either through the [Neon Dashboard](https://console.neon.tech/) or by instructing your coding agent to create a new project or retrieve the connection string of an existing project.

### Step 3: Get your Neon database URL

1. Go to the [Neon Dashboard](https://console.neon.tech/)
2. Select your project
3. Copy the connection string from the **Connection Details** widget
4. Add it to your `.env.development`:

```env
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

Then sync to Vercel with `bun run env:push`. See [Environment Variable Management](/recipes/env-management) for the full setup.

> **Tip**: Use the **pooled** connection string for production workloads to improve performance and handle more concurrent connections.

### Step 4: Create the database config

Instead of accessing `process.env.DATABASE_URL` directly, use the type-safe config pattern:

```typescript
// src/lib/db/config.ts
import { loadConfig } from "@/lib/common/load-config";

export const databaseConfig = loadConfig({
	server: {
		url: process.env.DATABASE_URL,
	},
});
```

Then access via `databaseConfig.server.url` instead of `process.env.DATABASE_URL`. See the [Environment Variable Management](/recipes/env-management) recipe for the full pattern.

### Step 5: Validate config on server start

Import the config in `instrumentation.ts` to validate the environment variable when the server starts:

```typescript
// src/instrumentation.ts

// Validate required configs on server start
import "./lib/db/config";
```

This ensures the server fails immediately on startup if `DATABASE_URL` is missing, rather than failing later when a database query runs.

### Step 6: Install packages

```bash
bun add drizzle-orm pg @vercel/functions
bun add -D drizzle-kit @types/pg @next/env
```

The `@next/env` package loads environment variables in the same order as Next.js, ensuring your `.env.development` and `.env.local` variables are available when running Drizzle Kit commands outside of the Next.js runtime.

### Step 7: Create the database client

Create the Drizzle database client:

```typescript
// src/lib/db/client.ts
import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { databaseConfig } from "./config";

// Replace with your app's schemas
import * as authSchema from "@/lib/auth/schema";
import * as chatSchema from "@/lib/chat/schema";

const schema = {
	...authSchema,
	...chatSchema,
};

const pool = new Pool({
	connectionString: databaseConfig.server.url,
});
attachDatabasePool(pool);

const db = drizzle({ client: pool, schema });

export { db };
```

The `databaseConfig` import provides type-safe access to the `DATABASE_URL` environment variable. See the [Environment Variable Management](/recipes/env-management) recipe for the config setup pattern.

Each feature library owns its own schema file (e.g., `@/lib/auth/schema`, `@/lib/chat/schema`). Instead of a central `db/schema.ts` aggregation file, schemas are imported directly in `client.ts` and merged into a single object for type-safe queries.

### Step 8: Configure Drizzle Kit

Create the Drizzle Kit configuration in your project root:

```typescript
// drizzle.config.ts
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { defineConfig } from "drizzle-kit";
import { databaseConfig } from "./src/lib/db/config";

export default defineConfig({
	schema: "./src/lib/*/schema.ts",
	out: "./src/lib/db/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: databaseConfig.server.url,
	},
});
```

The `loadEnvConfig` call at the top loads environment variables from `.env.development`, `.env.local`, and other `.env` files in the same order as Next.js. This ensures your `DATABASE_URL` is available when running Drizzle Kit commands like `drizzle-kit generate` or `drizzle-kit migrate`.

The `schema` glob pattern picks up `schema.ts` files from all feature libraries in `src/lib/`, following the "everything is a library" pattern where each feature owns its own schema. See [Philosophy](/philosophy) for more details.

### Step 9: Add package.json scripts

Add these scripts to your `package.json`:

```json
{
	"scripts": {
		"db:generate": "drizzle-kit generate",
		"db:migrate": "drizzle-kit migrate",
		"db:studio": "drizzle-kit studio"
	}
}
```

### Step 11: Generate and run migrations

```bash
bun run db:generate
bun run db:migrate
```

---

## Understanding Connection Pooling

The `attachDatabasePool` helper from `@vercel/functions` is the key to efficient database connections on Vercel.

**Why it matters:**

1. **Without pooling**: Each request opens a new TCP connection (~8 roundtrips), adding latency
2. **With pooling**: The first request establishes a connection; subsequent requests reuse it instantly
3. **The helper**: `attachDatabasePool` ensures idle connections close gracefully before function suspension, preventing connection leaks

---

## Info: Alternative Drivers

This recipe uses `node-postgres` (the `pg` package) because it provides the best performance on Vercel with Fluid compute. However, Drizzle supports other Postgres drivers:

| Driver | When to consider |
| **postgres.js** | If you prefer its API or need specific features like tagged template queries |
| **Neon Serverless** | For platforms without connection pooling (Netlify, Deno Deploy, Cloudflare Workers) |

> **Note**: If you're deploying to a serverless platform that doesn't support connection pooling, the [Neon Serverless driver](https://orm.drizzle.team/docs/connect-neon) connects over HTTP (~3 roundtrips) instead of TCP (~8 roundtrips), which is faster for single queries in classic serverless environments.

---

## References

- [Neon MCP Server](https://github.com/neondatabase/mcp-server-neon)
- [Drizzle Postgres docs](https://orm.drizzle.team/docs/get-started-postgresql)
- [Drizzle Neon integration](https://orm.drizzle.team/docs/connect-neon)
- [Vercel Connection Pooling Guide](https://vercel.com/guides/connection-pooling-with-functions)
- [Neon + Vercel Connection Methods](https://neon.tech/docs/guides/vercel-connection-methods)

---

## AI SDK & Simple Chat

Install the Vercel AI SDK with AI Elements components. Build a streaming chat interface with the useChat hook.

### Step 1: Install AI SDK v6

```bash
bun add ai @ai-sdk/react
```

### Step 2: Install AI Elements (optional)

AI Elements are pre-built UI components for AI interfaces:

```bash
bunx shadcn@latest add @ai-elements/all
```

This adds components like:

- Chat bubbles and message lists
- Streaming text displays
- Loading indicators
- Code blocks with syntax highlighting

### Step 3: Configure your AI provider

**Option A: Using Vercel AI Gateway**

The AI Gateway supports two authentication methods. Add one of these to your `.env.development`:

```env
AI_GATEWAY_API_KEY="your-api-key-here"
VERCEL_OIDC_TOKEN="your-oidc-token"
```

You can create an API key at [Vercel AI Gateway](https://vercel.com/ai-gateway) and add it to your `.env.development` and sync to Vercel with `bun run env:push`.

Alternatively, you can get a Vercel OIDC token by logging in via the Vercel CLI:

```bash
vercel login
```

This will prompt you to authorize the Vercel CLI to access your Vercel account. Once authorized, you can run `bun run env:pull` to sync your environment variables, which will include the Vercel OIDC token.

At least one must be set when using the AI Gateway.

**Option B: Using a specific provider**

Install the provider SDK directly:

```bash
# OpenAI
bun add @ai-sdk/openai

# Anthropic
bun add @ai-sdk/anthropic

# Google
bun add @ai-sdk/google
```

Add your API key to `.env.development`:

```env
OPENAI_API_KEY="sk-..."
# or
ANTHROPIC_API_KEY="sk-ant-..."
```

### Step 4: Create the AI config

Create a type-safe config with either-or validation using the config schema pattern:

```ts
// src/lib/ai/config.ts
import { configSchema, server, oneOf } from "@/lib/config/schema";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModelV1 } from "ai";

const config = configSchema(
	"AI",
	{
		oidcToken: server({ env: "VERCEL_OIDC_TOKEN" }),
		gatewayApiKey: server({ env: "AI_GATEWAY_API_KEY" }),
	},
	{
		constraints: (s) => [oneOf([s.oidcToken, s.gatewayApiKey])],
	},
);

function createProvider() {
	const { oidcToken, gatewayApiKey } = config.server;

	if (gatewayApiKey) {
		return createOpenAI({
			apiKey: gatewayApiKey,
			baseURL: "https://api.openai.com/v1",
		});
	}

	return createOpenAI({
		apiKey: oidcToken,
		baseURL: "https://api.vercel.ai/v1",
	});
}

function getModel(model: string): LanguageModelV1 {
	const provider = createProvider();
	return provider(model);
}

export const aiConfig = {
	...config,
	getModel,
};
```

The `oneOf` constraint creates an either-or relationship: at least one of `oidcToken` or `gatewayApiKey` must be defined. See the [Environment Variable Management](/recipes/env-management) recipe for the full config schema pattern.

### Step 5: Validate config on server start

Import the config in `instrumentation.ts` to validate environment variables when the server starts:

```ts
// src/instrumentation.ts

// Validate required configs on server start
import "./lib/ai/config";
```

This ensures the server fails immediately on startup if neither `VERCEL_OIDC_TOKEN` nor `AI_GATEWAY_API_KEY` is set, rather than failing later when AI features are used.

---

## References

- [AI SDK Documentation](https://ai-sdk.dev/docs/introduction)
- [AI SDK Providers](https://ai-sdk.dev/providers/ai-sdk-providers)
- [Vercel AI Gateway](https://vercel.com/ai-gateway)
- [AI Elements](https://ui.shadcn.com/docs/registry/ai-elements)

---

## Build a Simple Chat

Create a basic chat interface with streaming responses.

### Step 1: Create the API route

Create the chat API route:

```ts
// src/app/api/chat/route.ts
import { convertToModelMessages, streamText, UIMessage } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages }: { messages: UIMessage[] } = await req.json();

	const result = streamText({
		model: "anthropic/claude-sonnet-4.5",
		system: "You are a helpful assistant.",
		messages: await convertToModelMessages(messages),
	});

	return result.toUIMessageStreamResponse();
}
```

> **Note**: Replace the model string with your preferred model. See the [AI SDK providers docs](https://ai-sdk.dev/providers/ai-sdk-providers) for available options.

### Step 2: Create the chat page

Create the chat interface:

```tsx
// src/app/page.tsx
"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

export default function Page() {
	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/chat",
		}),
	});
	const [input, setInput] = useState("");

	return (
		<div className='flex flex-col min-h-screen p-4 max-w-2xl mx-auto'>
			<div className='flex-1 space-y-4 pb-4'>
				{messages.map((message) => (
					<div key={message.id} className={message.role === "user" ? "text-right" : "text-left"}>
						<span className='font-medium'>{message.role === "user" ? "You" : "AI"}:</span>{" "}
						{message.parts.map((part, index) => (part.type === "text" ? <span key={index}>{part.text}</span> : null))}
					</div>
				))}
			</div>

			<form
				className='flex gap-2'
				onSubmit={(e) => {
					e.preventDefault();
					if (input.trim()) {
						sendMessage({ text: input });
						setInput("");
					}
				}}
			>
				<input
					className='flex-1 px-3 py-2 border rounded-md'
					value={input}
					onChange={(e) => setInput(e.target.value)}
					disabled={status !== "ready"}
					placeholder='Say something...'
				/>
				<button
					className='px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50'
					type='submit'
					disabled={status !== "ready"}
				>
					Send
				</button>
			</form>
		</div>
	);
}
```

### Step 3: Test your chat

Start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) and start chatting.

---

## References

- [AI SDK Chat UI](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot)
- [AI SDK Streaming](https://ai-sdk.dev/docs/ai-sdk-core/generating-text#streaming-text)
- [useChat Hook](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat)

---

## Working with Drizzle

Write type-safe database queries with Drizzle ORM. Covers select, insert, update, delete, relational queries, and adding new tables.

## Implement Working with Drizzle

Write type-safe database queries with Drizzle ORM. Covers select, insert, update, delete, relational queries, and adding new tables.

**See:**

- Resource: `using-drizzle-queries` in Fullstack Recipes
- URL: https://fullstackrecipes.com/recipes/using-drizzle-queries

---

### Writing Queries

Use Drizzle's query API for type-safe database operations:

```typescript
import { db } from "@/lib/db/client";
import { chats } from "@/lib/chat/schema";
import { eq, desc } from "drizzle-orm";

// Select all
const allChats = await db.select().from(chats);

// Select with filter
const userChats = await db.select().from(chats).where(eq(chats.userId, userId)).orderBy(desc(chats.createdAt));

// Select single record
const chat = await db
	.select()
	.from(chats)
	.where(eq(chats.id, chatId))
	.limit(1)
	.then((rows) => rows[0]);
```

### Inserting Data

```typescript
import { db } from "@/lib/db/client";
import { chats } from "@/lib/chat/schema";

// Insert single record
const [newChat] = await db
	.insert(chats)
	.values({
		userId,
		title: "New Chat",
	})
	.returning();

// Insert multiple records
await db.insert(messages).values([
	{ chatId, role: "user", content: "Hello" },
	{ chatId, role: "assistant", content: "Hi there!" },
]);
```

### Updating Data

```typescript
import { db } from "@/lib/db/client";
import { chats } from "@/lib/chat/schema";
import { eq } from "drizzle-orm";

await db.update(chats).set({ title: "Updated Title" }).where(eq(chats.id, chatId));
```

### Deleting Data

```typescript
import { db } from "@/lib/db/client";
import { chats } from "@/lib/chat/schema";
import { eq } from "drizzle-orm";

await db.delete(chats).where(eq(chats.id, chatId));
```

### Using Relational Queries

For queries with relations, use the query API:

```typescript
import { db } from "@/lib/db/client";

const chatWithMessages = await db.query.chats.findFirst({
	where: eq(chats.id, chatId),
	with: {
		messages: {
			orderBy: (messages, { asc }) => [asc(messages.createdAt)],
		},
	},
});
```

### Adding New Tables

1. Create the schema in the feature's library folder:

```typescript
// src/lib/feature/schema.ts
import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const items = pgTable("items", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

1. Import the schema in `src/lib/db/client.ts`:

```typescript
import * as itemSchema from "@/lib/feature/schema";

const schema = {
	...authSchema,
	...chatSchema,
	...itemSchema,
};
```

1. Generate and run migrations:

```bash
bun run db:generate
bun run db:migrate
```

---

## References

- [Drizzle ORM Select](https://orm.drizzle.team/docs/select)
- [Drizzle ORM Insert](https://orm.drizzle.team/docs/insert)
- [Drizzle ORM Relational Queries](https://orm.drizzle.team/docs/rqb)

---

# Next.js on Vercel

Create a Next.js app running on Bun, configure the development environment, and deploy to Vercel with automatic deployments on push.

## Create the Next.js App

Initialize a new Next.js application:

```bash
bunx create-next-app@latest my-app --ts --tailwind --react-compiler --no-linter --src-dir --app --use-bun
cd my-app
```

This command uses the following recommended options: TypeScript and Tailwind CSS for type safety and utility-first styling, enables the React Compiler for automatic optimizations, skips linter configuration (can be added later if needed), organizes code inside a `src/` directory for cleaner project structure, uses the App Router, and bootstraps with Bun as the package manager.

## Setup Vercel Configuration

Install the Vercel config package to programatically configure the Vercel project:

```bash
bun add -D @vercel/config
```

Create the `vercel.ts` file:

```typescript
// vercel.ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {};
```

## Configure Bun as the Runtime on Vercel (Optional)

Using Bun both as the package manager and runtime provides a consistent development experience. To configure Bun as the runtime on Vercel, add the following to the `vercel.ts` file:

```typescript
// vercel.ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
	bunVersion: "1.x",
};
```

Add Bun types for better TypeScript support:

```bash
bun add -D @types/bun
```

## Install GitHub CLI

Install the GitHub CLI to manage your GitHub repositories:

```bash
brew install gh
```

Login to your GitHub account:

```bash
gh auth login
```

## Create GitHub Repository

Initialize git and create a new GitHub repository inside the project root:

```bash
# Create GitHub repository and push
gh repo create my-app --public --source=. --push
```

The `gh repo create` command:

- Creates a new repository on GitHub
- Sets the remote origin
- Pushes your local code

Use `--private` instead of `--public` for a private repository.

## Install Vercel CLI

Install the Vercel CLI globally to manage your Vercel projects:

```bash
bun add -g vercel
```

Authenticate with Vercel:

```bash
vercel login
```

## Deploy to Vercel

Link your project to Vercel and deploy:

```bash
# Deploy to Vercel (creates project on first run)
vercel
```

On first run, you'll be prompted to:

- Set up and deploy the project
- Link to an existing project or create a new one
- Configure project settings

### Connect Git for Automatic Deployments

Connect your GitHub repository to enable automatic deployments on push:

```bash
vercel git connect
```

This links your local Git repository to your Vercel project, enabling:

- Automatic deployments on push to main branch
- Preview deployments for pull requests
- Deployment status checks on GitHub

## Deployment Workflow

After initial setup, your workflow is:

1. **Develop locally**: `bun run dev`
2. **Commit and push**: `git push origin main`
3. **Automatic deployment**: Vercel deploys on push

---

# Editor and Linting Setup

Configure Prettier for code formatting and TypeScript for typechecking. Includes VSCode settings and EditorConfig for consistent code style. Skips ESLint/Biome to avoid config complexity.

### Step 1: Install Prettier

```bash
bun add -D prettier
```

### Step 2: Add scripts

Add these scripts to your `package.json`:

```json
{
	"scripts": {
		"typecheck": "tsc --noEmit",
		"fmt": "prettier --write ."
	}
}
```

### Step 3: Install VSCode Extension (Optional)

Install the Prettier VSCode extension for automatic formatting:

- [Install in Cursor](cursor:extension/esbenp.prettier-vscode)
- Or via VS Code command line: `ext install esbenp.prettier-vscode`

Note: The extension may be marked as deprecated (replaced by `prettier.prettier-vscode`), however I've found that at least in Cursor `esbenp.prettier-vscode` works without issues while `prettier.prettier-vscode` has issues formatting .tsx files.

### Step 4: Add .vscode Configuration (Optional)

Create a `.vscode` folder in your project root with the following files:

#### .vscode/extensions.json

Recommend the Prettier extension to all contributors:

```json
{
	// See https://go.microsoft.com/fwlink/?LinkId=827846 to learn about workspace recommendations.
	// Extension identifier format: ${publisher}.${name}. Example: vscode.csharp
	// List of extensions which should be recommended for users of this workspace.
	"recommendations": ["esbenp.prettier-vscode"],
	// List of extensions recommended by VS Code that should not be recommended for users of this workspace.
	"unwantedRecommendations": []
}
```

#### .vscode/settings.json

Enable format on save with Prettier as the default formatter:

```json
{
	"editor.formatOnSave": true,
	"editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### Step 5: Add .editorconfig (Optional)

Create a `.editorconfig` file in your project root. This is optional since Prettier already enforces these rules by default, but it ensures consistency when contributors use editors without setting up Prettier:

```editorconfig
# Editor config - see http://EditorConfig.org

root = true

[*]
charset = utf-8
insert_final_newline = true
end_of_line = lf
indent_style = space
indent_size = 2
max_line_length = 80
```

---

## References

- [Prettier Philosophy](https://prettier.io/docs/option-philosophy)
- [EditorConfig](https://editorconfig.org/)

---

# AI Coding Agent Configuration

Configure AI coding agents like Cursor, GitHub Copilot, or Claude Code with project-specific patterns, coding guidelines, and MCP servers for consistent AI-assisted development.

### Step 1: Create an agents.md file

Create an `agents.md` file in your project root. This file provides coding guidelines and patterns for AI assistants to follow.

```markdown
# Patterns

- Everything is a library: Organize features and domains as self-contained folders in `src/lib/` (e.g., `chat`, `ai`, `db`). Co-locate schema, queries, types, and utilities together. Components go in `components/<feature>/`.
- Use the web platform: Prefer native APIs and standards. Avoid abstractions that hide what the code actually does.

# Coding Guidelines

## Runtime and Package Manager

- Use Bun instead of Node.js, npm, pnpm, or vite.
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`.
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`.

## TypeScript

- Avoid `export default` in favor of `export` whenever possible.
- Only create an abstraction if it's actually needed
- Prefer clear function/variable names over inline comments
- Avoid helper functions when a simple inline expression would suffice
- Don't use emojis
- No barrel index files - just export from the source files instead
- No type.ts files, just inline types or co-locate them with their related code
- Don't unnecessarily add `try`/`catch`
- Don't cast to `any`

## React

- Avoid massive JSX blocks and compose smaller components
- Colocate code that changes together
- Avoid `useEffect` unless absolutely needed

## Tailwind

- Mostly use built-in values, occasionally allow dynamic values, rarely globals
- Always use v4 + global CSS file format + shadcn/ui

## Next

- Prefer fetching data in RSC (page can still be static)
- Use next/font + next/script when applicable
- next/image above the fold should have `sync` / `eager` / use `priority` sparingly
- Be mindful of serialized prop size for RSC → child components
```

> This `agents.md` file is based on [Lee Robinson's](https://x.com/leerob) original [shared here](https://x.com/leerob/status/1993162978410004777).

### Step 2: Configure MCP Servers

Use MCP (Model Context Protocol) servers to enhance your coding agent's capabilities. Different recipes may introduce additional MCP servers. For now, start by adding these foundational MCP servers to your `.cursor/mcp.json`:

```json
{
	"mcpServers": {
		"vercel": {
			"url": "https://mcp.vercel.com"
		},
		"next-devtools": {
			"command": "npx",
			"args": ["-y", "next-devtools-mcp@latest"]
		},
		"playwright": {
			"command": "npx",
			"args": ["@playwright/mcp@latest"]
		},
		"context7": {
			"url": "https://mcp.context7.com/mcp"
		},
		"fullstackrecipes": {
			"url": "https://fullstackrecipes.com/api/mcp"
		}
	}
}
```

| Server | Description |
| `vercel` | Manage Vercel projects, deployments, and search Vercel docs |
| `next-devtools` | Next.js development tools for debugging, routing, and build info |
| `playwright` | Browser automation for testing and interacting with web pages |
| `context7` | Up-to-date documentation lookup for any library |
| `fullstackrecipes` | Fullstackrecipes recipes |

> **Vercel MCP:** On first connection, Cursor will show a "Needs login" prompt. Click it to authorize access to your Vercel account. For project-specific context, use `https://mcp.vercel.com/<teamSlug>/<projectSlug>` instead.

---

# Ralph Agent Loop

Set up automated agent-driven development with Ralph. Run AI agents in a loop to implement features from user stories, verify acceptance criteria, and log progress for the next agent.

**Install via shadcn registry:**

```bash
bunx --bun shadcn@latest add https://fullstackrecipes.com/r/ralph.json
```

**Or copy the source code:**

`scripts/ralph/runner.ts`:

```typescript
#!/usr/bin/env bun

import { spawn } from "bun";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const promptPath = join(scriptDir, "prompt.md");

const { values } = parseArgs({
	args: Bun.argv.slice(2),
	options: {
		"max-iterations": { type: "string", default: "100" },
		prompt: { type: "string" },
	},
});

async function runRalph() {
	const baselinePrompt = await Bun.file(promptPath).text();

	const prompt = values.prompt ? `${values.prompt}\n\n---\n\n${baselinePrompt}` : baselinePrompt;

	const maxIterations = values["max-iterations"] || "100";

	// Escape the prompt for shell
	const escapedPrompt = prompt.replace(/'/g, "'\\''");

	// Use the official Ralph plugin via /ralph-loop command
	const ralphCommand = `/ralph-loop:ralph-loop '${escapedPrompt}' --completion-promise "FINISHED" --max-iterations ${maxIterations}`;

	console.log("[runner] Starting Ralph loop via Claude Code plugin...\n");
	console.log(`[runner] Max iterations: ${maxIterations}\n`);

	const proc = spawn({
		cmd: ["sh", "-c", `claude --permission-mode bypassPermissions --verbose '${ralphCommand.replace(/'/g, "'\\''")}'`],
		stdout: "inherit",
		stderr: "inherit",
		stdin: "inherit",
	});

	await proc.exited;

	const exitCode = proc.exitCode ?? 0;
	if (exitCode === 0) {
		console.log("\n[runner] Ralph loop completed successfully!");
	} else {
		console.log(`\n[runner] Ralph loop exited with code ${exitCode}`);
	}

	process.exit(exitCode);
}

runRalph().catch((err) => {
	console.error("[runner] Error:", err);
	process.exit(1);
});
```

`scripts/ralph/prompt.md`:

```md
# Ralph Agent Task

Implement features from user stories until all are complete.

## Workflow Per Iteration

1. Read `scripts/ralph/log.md` to understand what previous iterations completed.

2. Search `docs/user-stories/` for features with `"passes": false`.

3. If no features remain with `"passes": false`:
   - Output: <promise>FINISHED</promise>

4. Pick ONE feature - the highest priority non-passing feature based on dependencies and logical order.

5. Implement the feature following TDD:
   - Write/update tests for the feature
   - Implement until all acceptance criteria pass
   - Generate and migrate DB schema if needed: `bun run db:generate && bun run db:migrate`
   - Format code: `bun run fmt`

6. Verify the feature:
   - Run typecheck: `bun run typecheck`
   - Run build: `bun run build`
   - Run tests: `bun run test`
   - Use Playwright MCP to interact with the app at `http://localhost:3000`

7. If verification fails, debug and fix. Repeat until passing.

8. Once verified:
   - Update the user story's `passes` property to `true`
   - Append to `scripts/ralph/log.md` (keep it short but helpful)
   - Commit with a descriptive message

9. The iteration ends here. The next iteration will pick up the next feature.

## Notes

- Dev server should be running on `http://localhost:3000`. Start with `bun run dev` if needed.
- Connected to test database - use migrate commands freely.
- Avoid interacting with database directly.

## Completion

When ALL user stories have `"passes": true`, output:

<promise>FINISHED</promise>
```

`scripts/ralph/log.md`:

```md
# Ralph Agent Log

This file tracks what each agent run has completed. Append your changes below.

---

## 2026-01-09 - Example Entry (Template)

**Task:** Brief description of the task or user story worked on

**Changes:**

- `src/components/example.tsx` - Added new component for X
- `src/lib/example/queries.ts` - Created query function for Y

**Status:** Completed | In Progress | Blocked

**Notes:** Any relevant context, blockers, or follow-up items

---
```

Ralph is a pattern for automated agent-driven development. It runs AI coding agents in a loop, where each agent picks up a user story, implements it, verifies it passes, and logs what it did for the next agent.

## Background & References

- [Ralph - Geoffrey Huntley](https://ghuntley.com/ralph/) - Original concept and implementation
- [Effective Harnesses for Long-Running Agents - Anthropic](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) - Engineering patterns for agent loops
- [Matt Pocock on Ralph](https://www.youtube.com/watch?v=_IK18goX4X8) - Video walkthrough

---

### Step 1: Create the User Stories Directory

Create a `docs/user-stories/` directory to store acceptance criteria for features. Each user story is a JSON file containing test scenarios:

```json
[
	{
		"category": "functional",
		"description": "User signs in with email and password",
		"steps": [
			"Navigate to /sign-in page",
			"Enter email and password",
			"Submit the form",
			"Verify successful login",
			"Verify redirect to /chats"
		],
		"passes": false
	}
]
```

Each user story file can contain multiple scenarios. The `passes` field tracks whether the feature has been implemented and verified.

### Step 2: Add npm Script

Add a script to `package.json` to run Ralph:

```json
{
	"scripts": {
		"ralph": "bun run scripts/ralph/runner.ts"
	}
}
```

### Step 3: Install Claude Code CLI

Ralph uses the Claude Code CLI to spawn agent sessions. Install it globally:

```bash
npm install -g @anthropic-ai/claude-code
```

---

## Running Ralph

Start the dev server in one terminal, then run Ralph:

```bash
bun run dev
```

```bash
bun run ralph
```

Ralph will:

1. Read the prompt instructions
2. Check the log for previous work
3. Find a user story with `"passes": false`
4. Implement and verify the feature
5. Update the story to `"passes": true`
6. Log what it did
7. Repeat until all stories pass

To provide additional context or corrections:

```bash
bun run ralph --prompt "Focus on authentication features first"
```

---

## Writing User Stories

Each user story file should cover a single feature area. Group related scenarios together:

```json
[
	{
		"category": "functional",
		"description": "Chat is automatically named after first message",
		"steps": [
			"Create a new chat",
			"Send the first message",
			"Wait for AI response to complete",
			"Navigate to /chats list",
			"Verify chat has a descriptive title based on first message"
		],
		"passes": false
	},
	{
		"category": "edge-case",
		"description": "Empty message does not trigger naming",
		"steps": ["Create a new chat", "Submit empty message", "Verify chat title remains 'New Chat'"],
		"passes": false
	}
]
```

Categories help agents prioritize:

- `functional` - Core feature behavior
- `edge-case` - Error handling and boundary conditions
- `integration` - Features that span multiple systems
- `ui` - Visual and interaction requirements

---

## Best Practices

1. **Atomic stories**: Each scenario should test one specific behavior
2. **Clear steps**: Write steps that an agent can verify programmatically
3. **Independent stories**: Stories should not depend on execution order
4. **Descriptive filenames**: Use kebab-case names that describe the feature area (e.g., `chat-auto-naming.json`, `authentication-sign-in.json`)

---

# Assertion Helper

TypeScript assertion function for runtime type narrowing with descriptive error messages. Based on tiny-invariant.

**Install via shadcn registry:**

```bash
bunx --bun shadcn@latest add https://fullstackrecipes.com/r/assert.json
```

**Or copy the source code:**

`lib/common/assert.ts`:

```typescript
const prefix: string = "Assertion failed";

/**
 * TypeScript assertion function that narrows types when condition is truthy.
 * Throws if condition is falsy. Message can be string or lazy function.
 */
export default function assert(condition: any, message?: string | (() => string)): asserts condition {
	if (condition) {
		return;
	}

	const provided: string | undefined = typeof message === "function" ? message() : message;
	const value: string = provided ? `${prefix}: ${provided}` : prefix;
	throw new Error(value);
}
```

### Why This Pattern?

- **Type narrowing**: TypeScript understands the assertion and narrows types after the check
- **Descriptive errors**: Know exactly what assertion failed and why
- **Lazy messages**: Defer expensive message construction until failure occurs

### Usage

The `assert` function throws if the condition is falsy, and narrows the type when it passes:

```typescript
import assert from "@/lib/common/assert";

function processUser(user: User | null) {
	assert(user, "User must exist");
	// TypeScript now knows `user` is `User`, not `User | null`
	console.log(user.name);
}
```

### Lazy Message Evaluation

For expensive message construction, pass a function that only runs on failure:

```typescript
assert(TOOL_TYPES.includes(part.type as ToolType), () => `Invalid tool type: ${part.type}`);
```

---

### Attribution

This implementation is based on [tiny-invariant](https://www.npmjs.com/package/tiny-invariant).

---

## References

- [TypeScript Assertion Functions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)
- [tiny-invariant](https://www.npmjs.com/package/tiny-invariant)

---

# Type-Safe Environment Configuration

Type-safe environment variable validation using Zod with a Drizzle-like schema API. Supports server/public fields, feature flags, either-or constraints, and client-side protection.

### Config Schema Utility

Instead of accessing environment variables directly (`process.env.DATABASE_URL`), use the `config-schema` utility to specify and validate environment variables.

First, set up the `config-schema` utility and a `mainConfig` for common environment variables such as `NODE_ENV`:

**Install via shadcn registry:**

```bash
bunx --bun shadcn@latest add https://fullstackrecipes.com/r/config-schema.json
```

**Or copy the source code:**

`lib/config/schema.ts`:

````typescript
import { z } from "zod";

// =============================================================================
// Types
// =============================================================================

/** Base field definition with schema type */
type FieldDefBase<TSchema extends z.ZodTypeAny = z.ZodString> = {
	env: string;
	value: string | undefined;
	schema: TSchema;
	isOptional: boolean;
};

/** Server field definition */
type ServerFieldDef<TSchema extends z.ZodTypeAny = z.ZodString> = FieldDefBase<TSchema> & { _type: "server" };

/** Public field definition */
type PublicFieldDef<TSchema extends z.ZodTypeAny = z.ZodString> = FieldDefBase<TSchema> & { _type: "public" };

/** Field definition union */
type FieldDef = ServerFieldDef<z.ZodTypeAny> | PublicFieldDef<z.ZodTypeAny>;

/** Schema fields record */
type SchemaFields = Record<string, FieldDef>;

/** Constraint result */
type ConstraintResult<T extends SchemaFields> = {
	type: "oneOf";
	fields: (keyof T)[];
	satisfied: boolean;
};

/** Constraint function */
type Constraint<T extends SchemaFields> = (fields: T) => ConstraintResult<T>;

/** Infer the output type from a FieldDef based on schema and optionality */
type InferField<F> =
	F extends FieldDefBase<infer S> ? (F["isOptional"] extends true ? z.infer<S> | undefined : z.infer<S>) : never;

/** Extract server field keys */
type ServerKeys<T extends SchemaFields> = {
	[K in keyof T]: T[K] extends ServerFieldDef<z.ZodTypeAny> ? K : never;
}[keyof T];

/** Extract public field keys */
type PublicKeys<T extends SchemaFields> = {
	[K in keyof T]: T[K] extends PublicFieldDef<z.ZodTypeAny> ? K : never;
}[keyof T];

/** Build server section type */
type ServerSection<T extends SchemaFields> = {
	[K in ServerKeys<T>]: InferField<T[K]>;
};

/** Build public section type */
type PublicSection<T extends SchemaFields> = {
	[K in PublicKeys<T>]: InferField<T[K]>;
};

/** Check if there are any server fields */
type HasServerFields<T extends SchemaFields> = ServerKeys<T> extends never ? false : true;

/** Check if there are any public fields */
type HasPublicFields<T extends SchemaFields> = PublicKeys<T> extends never ? false : true;

/** Infer config result from fields (no isEnabled) */
type InferConfigResult<T extends SchemaFields> = (HasServerFields<T> extends true
	? { server: ServerSection<T> }
	: object) &
	(HasPublicFields<T> extends true ? { public: PublicSection<T> } : object);

/** Config with feature flag enabled */
type EnabledConfig<T extends SchemaFields> = InferConfigResult<T> & {
	isEnabled: true;
};

/** Config with feature flag disabled */
type DisabledConfig = { isEnabled: false };

/** Feature config (when flag is used) */
export type FeatureConfig<T extends SchemaFields> = EnabledConfig<T> | DisabledConfig;

/** Flag options */
type FlagOptions = {
	env: string;
	value: string | undefined;
};

/** Options object with flag (returns FeatureConfig) */
type ConfigOptionsWithFlag<T extends SchemaFields> = {
	flag: FlagOptions;
	constraints?: (schema: T) => Constraint<T>[];
};

/** Options object without flag (returns InferConfigResult) */
type ConfigOptionsWithoutFlag<T extends SchemaFields> = {
	flag?: undefined;
	constraints: (schema: T) => Constraint<T>[];
};

// =============================================================================
// Errors
// =============================================================================

/**
 * Error thrown when configuration validation fails.
 */
export class InvalidConfigurationError extends Error {
	constructor(message: string, schemaName?: string) {
		const schema = schemaName ? ` for ${schemaName}` : "";
		super(
			`Configuration validation error${schema}! Did you correctly set all required environment variables in your .env* file?\n - ${message}`,
		);
		this.name = "InvalidConfigurationError";
	}
}

/**
 * Error thrown when server-only config is accessed on the client.
 */
export class ServerConfigClientAccessError extends Error {
	constructor(schemaName: string, key: string, envName: string) {
		super(
			`[${schemaName}] Attempted to access server-only config 'server.${key}' (${envName}) on client. ` +
				`Move this value to 'public' if it needs client access, or ensure this code only runs on server.`,
		);
		this.name = "ServerConfigClientAccessError";
	}
}

// =============================================================================
// Field Builders
// =============================================================================

type ServerFieldOptionsBase = {
	env: string;
	value?: string | undefined;
	optional?: boolean;
};

type ServerFieldOptionsWithSchema<T extends z.ZodTypeAny> = ServerFieldOptionsBase & {
	schema: T;
};

type ServerFieldOptionsWithoutSchema = ServerFieldOptionsBase & {
	schema?: undefined;
};

type PublicFieldOptionsBase = {
	env: string;
	value: string | undefined; // Required for public fields (Next.js inlining)
	optional?: boolean;
};

type PublicFieldOptionsWithSchema<T extends z.ZodTypeAny> = PublicFieldOptionsBase & {
	schema: T;
};

type PublicFieldOptionsWithoutSchema = PublicFieldOptionsBase & {
	schema?: undefined;
};

/**
 * Define a server-only config field.
 * Server fields are only accessible on the server and throw on client access.
 *
 * @example
 * ```ts
 * server({ env: "DATABASE_URL" })
 * server({ env: "PORT", schema: z.coerce.number().default(3000) })
 * server({ env: "OPTIONAL_KEY", optional: true })
 * ```
 */
export function server<T extends z.ZodTypeAny>(options: ServerFieldOptionsWithSchema<T>): ServerFieldDef<T>;
export function server(options: ServerFieldOptionsWithoutSchema): ServerFieldDef<z.ZodString>;
export function server(options: ServerFieldOptionsBase & { schema?: z.ZodTypeAny }): ServerFieldDef<z.ZodTypeAny> {
	const { env, value, schema = z.string(), optional = false } = options;

	return {
		_type: "server" as const,
		env,
		value: value ?? process.env[env],
		schema,
		isOptional: optional,
	};
}

/**
 * Define a public config field (accessible on both server and client).
 * The value must be passed directly for Next.js to inline NEXT_PUBLIC_* variables.
 *
 * @example
 * ```ts
 * pub({ env: "NEXT_PUBLIC_DSN", value: process.env.NEXT_PUBLIC_DSN })
 * pub({ env: "NEXT_PUBLIC_ENABLED", value: process.env.NEXT_PUBLIC_ENABLED, schema: z.string().optional() })
 * ```
 */
export function pub<T extends z.ZodTypeAny>(options: PublicFieldOptionsWithSchema<T>): PublicFieldDef<T>;
export function pub(options: PublicFieldOptionsWithoutSchema): PublicFieldDef<z.ZodString>;
export function pub(options: PublicFieldOptionsBase & { schema?: z.ZodTypeAny }): PublicFieldDef<z.ZodTypeAny> {
	const { env, value, schema = z.string(), optional = false } = options;

	return {
		_type: "public" as const,
		env,
		value,
		schema,
		isOptional: optional,
	};
}

// =============================================================================
// Constraints
// =============================================================================

/**
 * Create a "one of" constraint.
 * At least one of the specified fields must have a value.
 *
 * @example
 * ```ts
 * configSchema("AI", {
 *   oidcToken: server({ env: "VERCEL_OIDC_TOKEN" }),
 *   apiKey: server({ env: "API_KEY" }),
 * }, {
 *   constraints: (s) => [oneOf([s.oidcToken, s.apiKey])],
 * })
 * ```
 */
export function oneOf<T extends SchemaFields>(fieldDefs: FieldDef[]): Constraint<T> {
	return (allFields) => {
		// Find which field names match the provided field defs
		const fieldNames: (keyof T)[] = [];
		for (const [name, field] of Object.entries(allFields)) {
			if (fieldDefs.includes(field)) {
				fieldNames.push(name as keyof T);
			}
		}

		const satisfied = fieldDefs.some((field) => field.value !== undefined && field.value !== "");

		return {
			type: "oneOf",
			fields: fieldNames,
			satisfied,
		};
	};
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Checks if a flag value is truthy.
 */
function isFlagEnabled(flag: string | undefined): boolean {
	if (!flag) return false;
	return ["true", "1", "yes"].includes(flag.toLowerCase());
}

/**
 * Creates a Proxy that throws when server config is accessed on client.
 */
function createServerProxy<T extends object>(data: T, schemaName: string, fieldEnvMap: Record<string, string>): T {
	if (typeof window === "undefined") {
		return data;
	}

	return new Proxy(data, {
		get(target, prop, receiver) {
			if (typeof prop === "symbol") {
				return Reflect.get(target, prop, receiver);
			}
			const key = String(prop);
			const envName = fieldEnvMap[key] ?? "UNKNOWN";
			throw new ServerConfigClientAccessError(schemaName, key, envName);
		},
	});
}

// =============================================================================
// Schema Builder
// =============================================================================

// Overload 1: No options (just name and fields)
export function configSchema<T extends SchemaFields>(name: string, fields: T): InferConfigResult<T>;

// Overload 2: With flag option (returns FeatureConfig)
export function configSchema<T extends SchemaFields>(
	name: string,
	fields: T,
	options: ConfigOptionsWithFlag<T>,
): FeatureConfig<T>;

// Overload 3: With constraints but no flag (returns InferConfigResult)
export function configSchema<T extends SchemaFields>(
	name: string,
	fields: T,
	options: ConfigOptionsWithoutFlag<T>,
): InferConfigResult<T>;

/**
 * Define a configuration schema with typed server and public fields.
 *
 * @example Basic server-only config
 * ```ts
 * const dbConfig = configSchema("Database", {
 *   url: server({ env: "DATABASE_URL" }),
 * });
 * // Type: { server: { url: string } }
 * dbConfig.server.url
 * ```
 *
 * @example Feature flag
 * ```ts
 * const sentryConfig = configSchema("Sentry", {
 *   token: server({ env: "SENTRY_AUTH_TOKEN" }),
 *   dsn: pub({ env: "NEXT_PUBLIC_SENTRY_DSN", value: process.env.NEXT_PUBLIC_SENTRY_DSN }),
 * }, {
 *   flag: { env: "NEXT_PUBLIC_ENABLE_SENTRY", value: process.env.NEXT_PUBLIC_ENABLE_SENTRY },
 * });
 *
 * if (sentryConfig.isEnabled) {
 *   sentryConfig.server.token;  // string
 *   sentryConfig.public.dsn;    // string
 * }
 * ```
 *
 * @example Either-or with oneOf (no flag)
 * ```ts
 * const aiConfig = configSchema("AI", {
 *   oidcToken: server({ env: "VERCEL_OIDC_TOKEN" }),
 *   apiKey: server({ env: "API_KEY" }),
 * }, {
 *   constraints: (s) => [oneOf([s.oidcToken, s.apiKey])],
 * });
 * // Type: { server: { oidcToken?: string; apiKey?: string } }
 * ```
 *
 * @example Flag + constraints
 * ```ts
 * const config = configSchema("MyFeature", {
 *   token: server({ env: "TOKEN" }),
 *   backupToken: server({ env: "BACKUP_TOKEN" }),
 * }, {
 *   flag: { env: "ENABLE_FEATURE", value: process.env.ENABLE_FEATURE },
 *   constraints: (s) => [oneOf([s.token, s.backupToken])],
 * });
 * ```
 */
export function configSchema<T extends SchemaFields>(
	name: string,
	fields: T,
	options?: ConfigOptionsWithFlag<T> | ConfigOptionsWithoutFlag<T>,
): InferConfigResult<T> | FeatureConfig<T> {
	const flagOptions = options?.flag;
	const constraintsFn = options?.constraints;
	const hasFlag = flagOptions !== undefined;

	// Check if config has public fields
	const hasPublicFields = Object.values(fields).some((f) => f._type === "public");

	// Enforce: if config has public fields and a flag, flag must be NEXT_PUBLIC_*
	if (hasFlag && hasPublicFields) {
		const flagEnv = flagOptions.env;
		if (!flagEnv.startsWith("NEXT_PUBLIC_")) {
			throw new InvalidConfigurationError(
				`Flag "${flagEnv}" must use a NEXT_PUBLIC_* variable when config has public fields. ` +
					`Otherwise, isEnabled will always be false on the client.`,
				name,
			);
		}
	}

	// If flag exists and is disabled, return early
	if (hasFlag && !isFlagEnabled(flagOptions.value)) {
		return { isEnabled: false };
	}

	// Evaluate constraints if provided
	const constraintList = constraintsFn ? constraintsFn(fields) : [];
	const constraintResults = constraintList.map((c) => c(fields));

	// Collect oneOf constraint results
	const oneOfResults = constraintResults.filter((r): r is ConstraintResult<T> => r.type === "oneOf");

	// Track which fields are covered by oneOf (making them conditionally optional)
	const oneOfFieldNames = new Set<string>();

	for (const result of oneOfResults) {
		for (const fieldName of result.fields) {
			oneOfFieldNames.add(fieldName as string);
		}
	}

	const isClient = typeof window !== "undefined";

	// Process fields
	const serverFields: Record<string, unknown> = {};
	const publicFields: Record<string, unknown> = {};

	for (const [key, field] of Object.entries(fields)) {
		// Skip server validation on client
		if (field._type === "server" && isClient) {
			continue;
		}

		const { value, schema, isOptional } = field;

		// Check if this field is covered by a oneOf constraint
		const isInOneOf = oneOfFieldNames.has(key);
		let canSkipValidation = isOptional;

		if (isInOneOf && value === undefined) {
			// Check if any oneOf constraint covering this field is satisfied
			const relevantOneOf = oneOfResults.find((r) => r.fields.includes(key as keyof T));
			if (relevantOneOf?.satisfied) {
				canSkipValidation = true;
			}
		}

		// Skip validation for optional fields with undefined value
		if (value === undefined && canSkipValidation) {
			if (field._type === "server") {
				serverFields[key] = undefined;
			} else {
				publicFields[key] = undefined;
			}
			continue;
		}

		// Validate
		const parseResult = schema.safeParse(value);

		if (!parseResult.success) {
			const section = field._type;
			const issue = parseResult.error.issues[0];
			let message: string;

			if (value === undefined) {
				// Check if part of oneOf
				if (isInOneOf) {
					const relevantOneOf = oneOfResults.find((r) => r.fields.includes(key as keyof T));
					if (relevantOneOf) {
						const otherFields = relevantOneOf.fields
							.filter((f) => f !== key)
							.map((f) => {
								const otherField = fields[f as string];
								return `${section}.${String(f)} (${otherField.env})`;
							});
						if (otherFields.length === 1) {
							message = `Either ${section}.${key} (${field.env}) or ${otherFields[0]} must be defined.`;
						} else {
							message = `Either ${section}.${key} (${field.env}) or one of [${otherFields.join(", ")}] must be defined.`;
						}
					} else {
						message = `${section}.${key} (${field.env}) must be defined.`;
					}
				} else {
					message = `${section}.${key} (${field.env}) must be defined.`;
				}
			} else {
				message = `${section}.${key} (${field.env}) is invalid: ${issue?.message ?? "validation failed"}`;
			}

			throw new InvalidConfigurationError(message, name);
		}

		if (field._type === "server") {
			serverFields[key] = parseResult.data;
		} else {
			publicFields[key] = parseResult.data;
		}
	}

	// Build result
	const result: Record<string, unknown> = {};

	const hasServer = Object.values(fields).some((f) => f._type === "server");
	const hasPublic = Object.values(fields).some((f) => f._type === "public");

	if (hasServer) {
		// Build env name map for server fields (used for client-side error messages)
		const serverFieldEnvMap: Record<string, string> = {};
		for (const [key, field] of Object.entries(fields)) {
			if (field._type === "server") {
				serverFieldEnvMap[key] = field.env;
			}
		}
		result.server = createServerProxy(serverFields, name, serverFieldEnvMap);
	}

	if (hasPublic) {
		result.public = publicFields;
	}

	// Return with isEnabled only if flag was provided
	if (hasFlag) {
		return { ...result, isEnabled: true } as FeatureConfig<T>;
	}

	return result as InferConfigResult<T>;
}
````

`lib/config/main.ts`:

```typescript
import { z } from "zod";
import { configSchema, server } from "./schema";

export const mainConfig = configSchema("Main", {
	nodeEnv: server({
		env: "NODE_ENV",
		schema: z.enum(["development", "production", "test"]).default("development"),
	}),
});
```

#### Basic Usage

The API uses a Drizzle-like schema pattern with `server()` and `pub()` field builders:

```typescript
// src/lib/db/config.ts
import { configSchema, server } from "@/lib/config/schema";

export const databaseConfig = configSchema("Database", {
	url: server({ env: "DATABASE_URL" }),
});
// Type: { server: { url: string } }
```

If `DATABASE_URL` is missing, you get a clear error:

```plain
Error [InvalidConfigurationError]: Configuration validation error for Database!
Did you correctly set all required environment variables in your .env* file?
 - server.url (DATABASE_URL) must be defined.
```

Then import and use it:

```typescript
// src/lib/db/client.ts
import { databaseConfig } from "./config";

const pool = new Pool({
	connectionString: databaseConfig.server.url,
});
```

#### Server vs Public Fields

Use `server()` for server-only secrets and `pub()` for client-accessible values:

```typescript
import { configSchema, server, pub } from "@/lib/config/schema";

export const sentryConfig = configSchema(
	"Sentry",
	{
		// Server-only - throws if accessed on client
		token: server({ env: "SENTRY_AUTH_TOKEN" }),
		// Client-accessible - work everywhere
		dsn: pub({
			env: "NEXT_PUBLIC_SENTRY_DSN",
			value: process.env.NEXT_PUBLIC_SENTRY_DSN,
		}),
		project: pub({
			env: "NEXT_PUBLIC_SENTRY_PROJECT",
			value: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
		}),
	},
	{
		flag: {
			env: "NEXT_PUBLIC_ENABLE_SENTRY",
			value: process.env.NEXT_PUBLIC_ENABLE_SENTRY,
		},
	},
);
```

**Why pass `value` for public fields?**

Next.js only inlines `NEXT_PUBLIC_*` environment variables when accessed statically (like `process.env.NEXT_PUBLIC_DSN`). Dynamic lookups like `process.env[varName]` don't work on the client. By passing `value` directly, the static references are preserved and properly inlined at build time.

Server fields can omit `value` since they use `process.env[env]` internally and are only accessed on the server.

#### Feature Flags

Use the `flag` option for features that can be enabled/disabled:

```typescript
// src/lib/sentry/config.ts
import { configSchema, server, pub } from "@/lib/config/schema";

export const sentryConfig = configSchema(
	"Sentry",
	{
		token: server({ env: "SENTRY_AUTH_TOKEN" }),
		dsn: pub({
			env: "NEXT_PUBLIC_SENTRY_DSN",
			value: process.env.NEXT_PUBLIC_SENTRY_DSN,
		}),
		project: pub({
			env: "NEXT_PUBLIC_SENTRY_PROJECT",
			value: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
		}),
		org: pub({
			env: "NEXT_PUBLIC_SENTRY_ORG",
			value: process.env.NEXT_PUBLIC_SENTRY_ORG,
		}),
	},
	{
		flag: {
			env: "NEXT_PUBLIC_ENABLE_SENTRY",
			value: process.env.NEXT_PUBLIC_ENABLE_SENTRY,
		},
	},
);
// Type: FeatureConfig<...> (has isEnabled)
```

> **Enforced:** If your config has public fields, the flag must use a `NEXT_PUBLIC_*` variable. This is validated at definition time and throws an error if violated:
>
> ```plain
> Error [InvalidConfigurationError]: Configuration validation error for Sentry!
> Did you correctly set all required environment variables in your .env* file?
>  - Flag "ENABLE_SENTRY" must use a NEXT_PUBLIC_* variable when config has public fields. Otherwise, isEnabled will always be false on the client.
> ```
>
> This prevents a common bug where the flag is `undefined` on the client (since non-public env vars aren't inlined), causing `isEnabled` to always be `false` in client code even when the feature is enabled on the server.

Behavior:

- Flag not set or falsy: `{ isEnabled: false }` (no validation, no errors)
- Flag is `"true"`, `"1"`, or `"yes"`: validates all values, returns `{ ..., isEnabled: true }`
- Flag truthy + missing value: throws `InvalidConfigurationError`

Usage:

```typescript
// src/instrumentation.ts
import { sentryConfig } from "./lib/sentry/config";

export async function register() {
	if (sentryConfig.isEnabled) {
		const Sentry = await import("@sentry/nextjs");
		Sentry.init({
			dsn: sentryConfig.public.dsn,
		});
	}
}
```

#### Either-Or Values

Use the `oneOf` constraint when a feature can be configured with alternative credentials:

```typescript
// src/lib/ai/config.ts
import { configSchema, server, oneOf } from "@/lib/config/schema";

export const aiConfig = configSchema(
	"AI",
	{
		oidcToken: server({ env: "VERCEL_OIDC_TOKEN" }),
		gatewayApiKey: server({ env: "AI_GATEWAY_API_KEY" }),
	},
	{
		constraints: (s) => [oneOf([s.oidcToken, s.gatewayApiKey])],
	},
);
// Type: { server: { oidcToken?: string; gatewayApiKey?: string } }
// Note: No isEnabled property (no flag used)
```

At least one of the specified fields must have a value. Error messages include the alternatives:

```plain
Error [InvalidConfigurationError]: Configuration validation error for AI!
Did you correctly set all required environment variables in your .env* file?
 - Either server.oidcToken (VERCEL_OIDC_TOKEN) or server.gatewayApiKey (AI_GATEWAY_API_KEY) must be defined.
```

#### Combining Flag and Constraints

You can use both `flag` and `constraints` together:

```typescript
export const myConfig = configSchema(
	"MyFeature",
	{
		token: server({ env: "TOKEN" }),
		backupToken: server({ env: "BACKUP_TOKEN" }),
	},
	{
		flag: { env: "ENABLE_FEATURE", value: process.env.ENABLE_FEATURE },
		constraints: (s) => [oneOf([s.token, s.backupToken])],
	},
);
// Type: FeatureConfig<...> (has isEnabled because flag is used)
```

#### Optional Fields

Use `optional: true` for fields that are always optional:

```typescript
export const authConfig = configSchema("Auth", {
	secret: server({ env: "BETTER_AUTH_SECRET" }),
	url: server({ env: "BETTER_AUTH_URL" }),
	vercelClientId: server({ env: "VERCEL_CLIENT_ID", optional: true }),
	vercelClientSecret: server({ env: "VERCEL_CLIENT_SECRET", optional: true }),
});
```

#### Client-Side Protection

Server fields use a Proxy to protect values from being accessed on the client:

```typescript
// On the server - everything works
sentryConfig.public.dsn; // "https://..."
sentryConfig.server.token; // "secret-token"

// On the client
sentryConfig.public.dsn; // works (public field)
sentryConfig.server.token; // throws ServerConfigClientAccessError
```

This catches accidental client-side access to secrets at runtime:

```plain
Error [ServerConfigClientAccessError]: [Sentry] Attempted to access server-only config 'server.token' (SENTRY_AUTH_TOKEN) on client.
Move this value to 'public' if it needs client access, or ensure this code only runs on server.
```

#### Custom Validation

For transforms, defaults, or complex validation, pass a `schema` option with a Zod schema:

```typescript
import { z } from "zod";
import { configSchema, server } from "@/lib/config/schema";

export const databaseConfig = configSchema("Database", {
	url: server({ env: "DATABASE_URL" }),
	// Transform string to number with default
	poolSize: server({
		env: "DATABASE_POOL_SIZE",
		schema: z.coerce.number().default(10),
	}),
});
// Type: { server: { url: string; poolSize: number } }
```

More examples:

```typescript
import { z } from "zod";
import { configSchema, server } from "@/lib/config/schema";

export const config = configSchema("App", {
	// Required string (default)
	apiKey: server({ env: "API_KEY" }),

	// Optional string
	debugMode: server({
		env: "DEBUG_MODE",
		schema: z.string().optional(),
	}),

	// String with regex validation
	fromEmail: server({
		env: "FROM_EMAIL",
		schema: z.string().regex(/^.+\s<.+@.+\..+>$/, 'Must match "Name <email>" format'),
	}),

	// Enum with default
	nodeEnv: server({
		env: "NODE_ENV",
		schema: z.enum(["development", "production", "test"]).default("development"),
	}),

	// Boolean
	enableFeature: server({
		env: "ENABLE_FEATURE",
		schema: z.coerce.boolean().default(false),
	}),
});
```

---

### Adding New Environment Variables

When adding a new feature that needs env vars:

1. Create `src/lib/<feature>/config.ts`
2. Use `configSchema` with `server()` and/or `pub()` fields
3. Add `flag` option if the feature should be toggleable
4. Add `constraints` option with `oneOf()` for either-or validation
5. Import the config in `src/instrumentation.ts` for early validation
6. Import and use the config within that feature

Example for adding Stripe:

```typescript
// src/lib/stripe/config.ts
import { configSchema, server, pub } from "@/lib/config/schema";

export const stripeConfig = configSchema("Stripe", {
	secretKey: server({ env: "STRIPE_SECRET_KEY" }),
	webhookSecret: server({ env: "STRIPE_WEBHOOK_SECRET" }),
	publishableKey: pub({
		env: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
		value: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
	}),
});
```

Then use it in your Stripe client:

```typescript
// src/lib/stripe/client.ts
import Stripe from "stripe";
import { stripeConfig } from "./config";

export const stripe = new Stripe(stripeConfig.server.secretKey);
```

#### Main Config

The `config-schema` utility provides a `mainConfig` that can be used to access all common environment variables. Inititally, it includes the `NODE_ENV` variable.

Review the code base and add all used common environment variables to the `mainConfig`. This may include the server domain and other common variables that don't belong to a specific feature.

```typescript
// src/lib/config/main.ts
import { z } from "zod";
import { configSchema, server } from "./schema";

export const mainConfig = configSchema("Main", {
	nodeEnv: server({
		env: "NODE_ENV",
		schema: z.enum(["development", "production", "test"]).default("development"),
	}),
});
```

Now replace all direct access to environment variables with the `mainConfig`:

```typescript
import { mainConfig } from "@/lib/config/main";

const isDev = mainConfig.server.nodeEnv === "development";
```

---

# Build-Time Environment Variable Validation

Validate environment variables on server start and before builds. Catch missing or invalid variables early with clear error messages.

## Implement Environment Validation

Validate environment variables on server start and before builds. Catch missing or invalid variables early with clear error messages.

**See:**

- Resource: `env-validation` in Fullstack Recipes
- URL: https://fullstackrecipes.com/recipes/env-validation

---

### Validating Configs on Server Start

Some environment variables are read internally by packages rather than passed as arguments. To catch missing variables early instead of at runtime, import your configs in `instrumentation.ts`:

```typescript
// src/instrumentation.ts
import * as Sentry from "@sentry/nextjs";
import { sentryConfig } from "./lib/sentry/config";

// Validate required configs on server start
import "./lib/ai/config";
import "./lib/db/config";

export async function register() {
	// ... initialization code
}
```

The side-effect imports trigger `configSchema` validation immediately when the server starts. If any required environment variable is missing, the server fails to start with a clear error rather than failing later when the code path is executed.

---

### Validating Environment Files Pre-Build

**Install via shadcn registry:**

```bash
bunx --bun shadcn@latest add https://fullstackrecipes.com/r/validate-env.json
```

**Or copy the source code:**

`scripts/validate-env.ts`:

```typescript
#!/usr/bin/env bun
/**
 * Validate environment configuration
 *
 * Usage:
 *   bun run validate-env
 *   bun run validate-env --environment=development
 *   bun run validate-env --environment=production
 *
 * This script:
 * 1. Loads env files using Next.js's loadEnvConfig
 * 2. Finds all config.ts files in src/lib/\*\/
 * 3. Validates each config by importing it (triggers configSchema validation)
 * 4. Warns about env variables in .env files that aren't used by any config
 */

import { loadEnvConfig } from "@next/env";
import { Glob } from "bun";
import path from "path";

// ANSI colors
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;

// Parse CLI args
function parseArgs(): { environment?: string } {
	const args = process.argv.slice(2);
	const result: { environment?: string } = {};

	for (const arg of args) {
		if (arg.startsWith("--environment=")) {
			result.environment = arg.split("=")[1];
		}
	}

	return result;
}

// Track which env vars are referenced by configs
const referencedEnvVars = new Set<string>();

// Patch process.env to track access
function trackEnvAccess() {
	const originalEnv = process.env;
	const handler: ProxyHandler<NodeJS.ProcessEnv> = {
		get(target, prop) {
			if (typeof prop === "string" && !prop.startsWith("_")) {
				referencedEnvVars.add(prop);
			}
			return Reflect.get(target, prop);
		},
	};
	process.env = new Proxy(originalEnv, handler);
}

async function main() {
	const args = parseArgs();
	const projectDir = process.cwd();

	console.log(bold("\n🔍 Environment Configuration Validator\n"));

	// Set NODE_ENV if environment specified
	const environment = args.environment ?? process.env.NODE_ENV ?? "development";
	(process.env as Record<string, string>).NODE_ENV = environment;
	console.log(dim(`  Environment: ${environment}\n`));

	// Load env files
	// Second param `dev` tells loadEnvConfig to load .env.development files
	const isDev = environment === "development";
	console.log(dim("  Loading environment files..."));

	const loadedEnvFiles: string[] = [];
	const { combinedEnv, loadedEnvFiles: files } = loadEnvConfig(projectDir, isDev);

	for (const file of files) {
		loadedEnvFiles.push(file.path);
		console.log(dim(`    ✓ ${path.relative(projectDir, file.path)}`));
	}

	if (loadedEnvFiles.length === 0) {
		console.log(dim("    No .env files found"));
	}

	console.log("");

	// Start tracking env access before importing configs
	trackEnvAccess();

	// Find all config.ts files
	const configGlob = new Glob("src/lib/*/config.ts");
	const configFiles: string[] = [];

	for await (const file of configGlob.scan(projectDir)) {
		configFiles.push(file);
	}

	if (configFiles.length === 0) {
		console.log(yellow("  ⚠ No config.ts files found in src/lib/*/\n"));
		process.exit(0);
	}

	console.log(dim(`  Found ${configFiles.length} config files:\n`));

	// Validate each config
	const errors: { file: string; error: Error }[] = [];
	const validated: string[] = [];

	for (const configFile of configFiles) {
		const relativePath = configFile;
		const absolutePath = path.join(projectDir, configFile);

		try {
			// Import the config module - this triggers validation
			await import(absolutePath);
			console.log(green(`  ✓ ${relativePath}`));
			validated.push(relativePath);
		} catch (error) {
			if (error instanceof Error) {
				// Check if it's a disabled feature flag (not an error)
				if (error.message.includes("isEnabled: false")) {
					console.log(dim(`  ○ ${relativePath} (feature disabled)`));
					validated.push(relativePath);
				} else {
					console.log(red(`  ✗ ${relativePath}`));
					errors.push({ file: relativePath, error });
				}
			}
		}
	}

	console.log("");

	// Report validation errors
	if (errors.length > 0) {
		console.log(red(bold("Validation Errors:\n")));

		for (const { file, error } of errors) {
			console.log(red(`  ${file}:`));
			// Extract the actual error message
			const message = error.message.split("\n").slice(0, 3).join("\n    ");
			console.log(red(`    ${message}\n`));
		}
	}

	// Find unused env variables (in .env files but not referenced by configs)
	const envVarsInFiles = new Set<string>();

	// Parse loaded env files to get all defined variables
	for (const envFile of loadedEnvFiles) {
		try {
			const content = await Bun.file(envFile).text();
			const lines = content.split("\n");

			for (const line of lines) {
				const trimmed = line.trim();
				// Skip comments and empty lines
				if (!trimmed || trimmed.startsWith("#")) continue;

				// Extract variable name (before = sign)
				const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)\s*=/);
				if (match) {
					envVarsInFiles.add(match[1]);
				}
			}
		} catch {
			// Ignore file read errors
		}
	}

	// Common system/framework vars to ignore
	const ignoredVars = new Set([
		// System
		"NODE_ENV",
		"PATH",
		"HOME",
		"USER",
		"SHELL",
		"TERM",
		"LANG",
		"PWD",
		"OLDPWD",
		"HOSTNAME",
		"LOGNAME",
		"TMPDIR",
		"XDG_CONFIG_HOME",
		"XDG_DATA_HOME",
		"XDG_CACHE_HOME",
		"CI",
		"TZ",
		// Vercel
		"VERCEL",
		"VERCEL_ENV",
		"VERCEL_URL",
		"VERCEL_REGION",
		"VERCEL_TARGET_ENV",
		"VERCEL_GIT_COMMIT_SHA",
		"VERCEL_GIT_COMMIT_MESSAGE",
		"VERCEL_GIT_COMMIT_AUTHOR_LOGIN",
		"VERCEL_GIT_COMMIT_AUTHOR_NAME",
		"VERCEL_GIT_PREVIOUS_SHA",
		"VERCEL_GIT_PROVIDER",
		"VERCEL_GIT_REPO_ID",
		"VERCEL_GIT_REPO_OWNER",
		"VERCEL_GIT_REPO_SLUG",
		"VERCEL_GIT_COMMIT_REF",
		"VERCEL_GIT_PULL_REQUEST_ID",
		// Build tools (Turbo, NX)
		"TURBO_CACHE",
		"TURBO_REMOTE_ONLY",
		"TURBO_RUN_SUMMARY",
		"TURBO_DOWNLOAD_LOCAL_ENABLED",
		"NX_DAEMON",
	]);

	// Find vars in .env files but not referenced by configs
	const unusedVars: { name: string; files: string[] }[] = [];

	for (const envVar of envVarsInFiles) {
		if (ignoredVars.has(envVar)) continue;
		if (referencedEnvVars.has(envVar)) continue;

		// Find which files define this var
		const definingFiles: string[] = [];
		for (const envFile of loadedEnvFiles) {
			try {
				const content = await Bun.file(envFile).text();
				if (new RegExp(`^${envVar}\\s*=`, "m").test(content)) {
					definingFiles.push(path.relative(projectDir, envFile));
				}
			} catch {
				// Ignore
			}
		}

		if (definingFiles.length > 0) {
			unusedVars.push({ name: envVar, files: definingFiles });
		}
	}

	// Report unused vars
	if (unusedVars.length > 0) {
		console.log(yellow(bold("Unused Environment Variables:\n")));
		console.log(dim("  These variables are defined in .env files but not used by any config:\n"));

		for (const { name, files } of unusedVars.sort((a, b) => a.name.localeCompare(b.name))) {
			console.log(yellow(`  ⚠ ${name}`));
			console.log(dim(`    defined in: ${files.join(", ")}`));
		}

		console.log("");
	}

	// Summary
	console.log(bold("Summary:\n"));
	console.log(`  Configs validated: ${green(String(validated.length))}`);
	console.log(`  Validation errors: ${errors.length > 0 ? red(String(errors.length)) : green("0")}`);
	console.log(`  Unused env vars:   ${unusedVars.length > 0 ? yellow(String(unusedVars.length)) : green("0")}`);
	console.log("");

	// Exit with error code if validation failed
	if (errors.length > 0) {
		process.exit(1);
	}
}

main().catch((error) => {
	console.error(red("Unexpected error:"), error);
	process.exit(1);
});
```

Add the validation script to your `package.json`:

```json
{
	"scripts": {
		"prebuild": "bun run env:validate:prod",
		"env:validate": "bun run scripts/validate-env.ts --environment=development",
		"env:validate:prod": "bun run scripts/validate-env.ts --environment=production"
	}
}
```

Use the `env:validate` and `env:validate:prod` scripts to validate all your configs (`config.ts` files in `src/lib/*/`) against your `.env` files.

The `prebuild` script (configured above) runs automatically before `build`, ensuring environment variables are validated before every build (locally and in CI/Vercel). If validation fails, the build stops early with a clear error.

The script:

1. Loads `.env` files using Next.js's `loadEnvConfig` (respects the same load order as Next.js)
2. Finds all `config.ts` files in `src/lib/*/`
3. Imports each config to trigger `configSchema` validation
4. Reports any missing or invalid environment variables
5. Warns about variables defined in `.env` files but not used by any config

Example output with a validation error:

```plain
🔍 Environment Configuration Validator

  Environment: development

  Loading environment files...
    ✓ .env.local
    ✓ .env.development

  Found 5 config files:

  ✗ src/lib/resend/config.ts
  ✓ src/lib/sentry/config.ts
  ✓ src/lib/db/config.ts
  ✓ src/lib/ai/config.ts
  ✓ src/lib/auth/config.ts

Validation Errors:

  src/lib/resend/config.ts:
    Configuration validation error for Resend!
    Did you correctly set all required environment variables in your .env* file?
     - server.fromEmail (FROM_EMAIL) must be defined.

Summary:

  Configs validated: 4
  Validation errors: 1
  Unused env vars:   0
```

Example output with an unused variable:

```plain
🔍 Environment Configuration Validator

  Environment: development

  Loading environment files...
    ✓ .env.local
    ✓ .env.development

  Found 5 config files:

  ✓ src/lib/resend/config.ts
  ✓ src/lib/sentry/config.ts
  ✓ src/lib/db/config.ts
  ✓ src/lib/ai/config.ts
  ✓ src/lib/auth/config.ts

Unused Environment Variables:

  These variables are defined in .env files but not used by any config:

  ⚠ OLD_API_KEY
    defined in: .env.local

Summary:

  Configs validated: 5
  Validation errors: 0
  Unused env vars:   1
```

The script exits with code 1 if any validation errors occur (useful for CI), but unused variables only trigger warnings without failing the build.

---

# Neon + Drizzle Setup

Connect a Next.js app to Neon Postgres using Drizzle ORM with optimized connection pooling for Vercel serverless functions.

### Step 1: Install the Neon MCP Server globally

```bash
bunx neonctl@latest init
```

> **Note**: This installs the MCP server globally (not project-scoped) using your user API key. By default, the MCP server has **write access** to your Neon account.

For production apps in your organization, configure the MCP server to be read-only:

```json
{
	"mcpServers": {
		"Neon": {
			"url": "https://mcp.neon.tech/mcp",
			"headers": {
				"Authorization": "Bearer <$NEON_API_KEY>",
				"x-read-only": "true"
			}
		}
	}
}
```

### Step 2: Create a new Neon project

Use an existing Neon project or create a new one, either through the [Neon Dashboard](https://console.neon.tech/) or by instructing your coding agent to create a new project or retrieve the connection string of an existing project.

### Step 3: Get your Neon database URL

1. Go to the [Neon Dashboard](https://console.neon.tech/)
2. Select your project
3. Copy the connection string from the **Connection Details** widget
4. Add it to your `.env.development`:

```env
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

Then sync to Vercel with `bun run env:push`. See [Environment Variable Management](/recipes/env-management) for the full setup.

> **Tip**: Use the **pooled** connection string for production workloads to improve performance and handle more concurrent connections.

### Step 4: Create the database config

Instead of accessing `process.env.DATABASE_URL` directly, use the type-safe config pattern:

```typescript
// src/lib/db/config.ts
import { loadConfig } from "@/lib/common/load-config";

export const databaseConfig = loadConfig({
	server: {
		url: process.env.DATABASE_URL,
	},
});
```

Then access via `databaseConfig.server.url` instead of `process.env.DATABASE_URL`. See the [Environment Variable Management](/recipes/env-management) recipe for the full pattern.

### Step 5: Validate config on server start

Import the config in `instrumentation.ts` to validate the environment variable when the server starts:

```typescript
// src/instrumentation.ts

// Validate required configs on server start
import "./lib/db/config";
```

This ensures the server fails immediately on startup if `DATABASE_URL` is missing, rather than failing later when a database query runs.

### Step 6: Install packages

```bash
bun add drizzle-orm pg @vercel/functions
bun add -D drizzle-kit @types/pg @next/env
```

The `@next/env` package loads environment variables in the same order as Next.js, ensuring your `.env.development` and `.env.local` variables are available when running Drizzle Kit commands outside of the Next.js runtime.

### Step 7: Create the database client

Create the Drizzle database client:

```typescript
// src/lib/db/client.ts
import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { databaseConfig } from "./config";

// Replace with your app's schemas
import * as authSchema from "@/lib/auth/schema";
import * as chatSchema from "@/lib/chat/schema";

const schema = {
	...authSchema,
	...chatSchema,
};

const pool = new Pool({
	connectionString: databaseConfig.server.url,
});
attachDatabasePool(pool);

const db = drizzle({ client: pool, schema });

export { db };
```

The `databaseConfig` import provides type-safe access to the `DATABASE_URL` environment variable. See the [Environment Variable Management](/recipes/env-management) recipe for the config setup pattern.

Each feature library owns its own schema file (e.g., `@/lib/auth/schema`, `@/lib/chat/schema`). Instead of a central `db/schema.ts` aggregation file, schemas are imported directly in `client.ts` and merged into a single object for type-safe queries.

### Step 8: Configure Drizzle Kit

Create the Drizzle Kit configuration in your project root:

```typescript
// drizzle.config.ts
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { defineConfig } from "drizzle-kit";
import { databaseConfig } from "./src/lib/db/config";

export default defineConfig({
	schema: "./src/lib/*/schema.ts",
	out: "./src/lib/db/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: databaseConfig.server.url,
	},
});
```

The `loadEnvConfig` call at the top loads environment variables from `.env.development`, `.env.local`, and other `.env` files in the same order as Next.js. This ensures your `DATABASE_URL` is available when running Drizzle Kit commands like `drizzle-kit generate` or `drizzle-kit migrate`.

The `schema` glob pattern picks up `schema.ts` files from all feature libraries in `src/lib/`, following the "everything is a library" pattern where each feature owns its own schema. See [Philosophy](/philosophy) for more details.

### Step 9: Add package.json scripts

Add these scripts to your `package.json`:

```json
{
	"scripts": {
		"db:generate": "drizzle-kit generate",
		"db:migrate": "drizzle-kit migrate",
		"db:studio": "drizzle-kit studio"
	}
}
```

### Step 11: Generate and run migrations

```bash
bun run db:generate
bun run db:migrate
```

---

## Understanding Connection Pooling

The `attachDatabasePool` helper from `@vercel/functions` is the key to efficient database connections on Vercel.

**Why it matters:**

1. **Without pooling**: Each request opens a new TCP connection (~8 roundtrips), adding latency
2. **With pooling**: The first request establishes a connection; subsequent requests reuse it instantly
3. **The helper**: `attachDatabasePool` ensures idle connections close gracefully before function suspension, preventing connection leaks

---

## Info: Alternative Drivers

This recipe uses `node-postgres` (the `pg` package) because it provides the best performance on Vercel with Fluid compute. However, Drizzle supports other Postgres drivers:

| Driver | When to consider |
| **postgres.js** | If you prefer its API or need specific features like tagged template queries |
| **Neon Serverless** | For platforms without connection pooling (Netlify, Deno Deploy, Cloudflare Workers) |

> **Note**: If you're deploying to a serverless platform that doesn't support connection pooling, the [Neon Serverless driver](https://orm.drizzle.team/docs/connect-neon) connects over HTTP (~3 roundtrips) instead of TCP (~8 roundtrips), which is faster for single queries in classic serverless environments.

---

## References

- [Neon MCP Server](https://github.com/neondatabase/mcp-server-neon)
- [Drizzle Postgres docs](https://orm.drizzle.team/docs/get-started-postgresql)
- [Drizzle Neon integration](https://orm.drizzle.team/docs/connect-neon)
- [Vercel Connection Pooling Guide](https://vercel.com/guides/connection-pooling-with-functions)
- [Neon + Vercel Connection Methods](https://neon.tech/docs/guides/vercel-connection-methods)

---

# Working with Drizzle

Write type-safe database queries with Drizzle ORM. Covers select, insert, update, delete, relational queries, and adding new tables.

## Implement Working with Drizzle

Write type-safe database queries with Drizzle ORM. Covers select, insert, update, delete, relational queries, and adding new tables.

**See:**

- Resource: `using-drizzle-queries` in Fullstack Recipes
- URL: https://fullstackrecipes.com/recipes/using-drizzle-queries

---

### Writing Queries

Use Drizzle's query API for type-safe database operations:

```typescript
import { db } from "@/lib/db/client";
import { chats } from "@/lib/chat/schema";
import { eq, desc } from "drizzle-orm";

// Select all
const allChats = await db.select().from(chats);

// Select with filter
const userChats = await db.select().from(chats).where(eq(chats.userId, userId)).orderBy(desc(chats.createdAt));

// Select single record
const chat = await db
	.select()
	.from(chats)
	.where(eq(chats.id, chatId))
	.limit(1)
	.then((rows) => rows[0]);
```

### Inserting Data

```typescript
import { db } from "@/lib/db/client";
import { chats } from "@/lib/chat/schema";

// Insert single record
const [newChat] = await db
	.insert(chats)
	.values({
		userId,
		title: "New Chat",
	})
	.returning();

// Insert multiple records
await db.insert(messages).values([
	{ chatId, role: "user", content: "Hello" },
	{ chatId, role: "assistant", content: "Hi there!" },
]);
```

### Updating Data

```typescript
import { db } from "@/lib/db/client";
import { chats } from "@/lib/chat/schema";
import { eq } from "drizzle-orm";

await db.update(chats).set({ title: "Updated Title" }).where(eq(chats.id, chatId));
```

### Deleting Data

```typescript
import { db } from "@/lib/db/client";
import { chats } from "@/lib/chat/schema";
import { eq } from "drizzle-orm";

await db.delete(chats).where(eq(chats.id, chatId));
```

### Using Relational Queries

For queries with relations, use the query API:

```typescript
import { db } from "@/lib/db/client";

const chatWithMessages = await db.query.chats.findFirst({
	where: eq(chats.id, chatId),
	with: {
		messages: {
			orderBy: (messages, { asc }) => [asc(messages.createdAt)],
		},
	},
});
```

### Adding New Tables

1. Create the schema in the feature's library folder:

```typescript
// src/lib/feature/schema.ts
import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const items = pgTable("items", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

1. Import the schema in `src/lib/db/client.ts`:

```typescript
import * as itemSchema from "@/lib/feature/schema";

const schema = {
	...authSchema,
	...chatSchema,
	...itemSchema,
};
```

1. Generate and run migrations:

```bash
bun run db:generate
bun run db:migrate
```

---

## References

- [Drizzle ORM Select](https://orm.drizzle.team/docs/select)
- [Drizzle ORM Insert](https://orm.drizzle.team/docs/insert)
- [Drizzle ORM Relational Queries](https://orm.drizzle.team/docs/rqb)

---

# Shadcn UI & Theming

Add Shadcn UI components with dark mode support using next-themes. Includes theme provider and CSS variables configuration.

### Step 1: Initialize Shadcn

```bash
bunx --bun shadcn@latest init
```

Follow the prompts to configure your project. The CLI will create a `components.json` config file and set up your CSS variables in `globals.css`.

### Step 2: Add components

Install all components:

```bash
bunx --bun shadcn@latest add --all --yes
```

Note: Shadcn is highly configurable. Omit `--yes` and follow the setup wizard to configure Shadcn to your liking.

### Step 3: Add dark mode

Install the theme provider:

```bash
bun add next-themes
```

Create the theme provider component:

```tsx
// src/components/themes/provider.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

Wrap your app with the provider in your layout:

```tsx
// src/app/layout.tsx
import { ThemeProvider } from "@/components/themes/provider";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body>
				<ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
					{children}
					<Toaster richColors position='top-center' />
				</ThemeProvider>
			</body>
		</html>
	);
}
```

Create the theme selector component to toggle between light, dark, and system themes:

```tsx
// src/components/themes/selector.tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSelector() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='icon'>
					<Sun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
					<Moon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
					<span className='sr-only'>Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
```

---

## References

- [Shadcn Next.js Installation](https://ui.shadcn.com/docs/installation/next)
- [Shadcn Dark Mode Guide](https://ui.shadcn.com/docs/dark-mode/next)

---

# AI SDK & Simple Chat

Install the Vercel AI SDK with AI Elements components. Build a streaming chat interface with the useChat hook.

### Step 1: Install AI SDK v6

```bash
bun add ai @ai-sdk/react
```

### Step 2: Install AI Elements (optional)

AI Elements are pre-built UI components for AI interfaces:

```bash
bunx shadcn@latest add @ai-elements/all
```

This adds components like:

- Chat bubbles and message lists
- Streaming text displays
- Loading indicators
- Code blocks with syntax highlighting

### Step 3: Configure your AI provider

**Option A: Using Vercel AI Gateway**

The AI Gateway supports two authentication methods. Add one of these to your `.env.development`:

```env
AI_GATEWAY_API_KEY="your-api-key-here"
VERCEL_OIDC_TOKEN="your-oidc-token"
```

You can create an API key at [Vercel AI Gateway](https://vercel.com/ai-gateway) and add it to your `.env.development` and sync to Vercel with `bun run env:push`.

Alternatively, you can get a Vercel OIDC token by logging in via the Vercel CLI:

```bash
vercel login
```

This will prompt you to authorize the Vercel CLI to access your Vercel account. Once authorized, you can run `bun run env:pull` to sync your environment variables, which will include the Vercel OIDC token.

At least one must be set when using the AI Gateway.

**Option B: Using a specific provider**

Install the provider SDK directly:

```bash
# OpenAI
bun add @ai-sdk/openai

# Anthropic
bun add @ai-sdk/anthropic

# Google
bun add @ai-sdk/google
```

Add your API key to `.env.development`:

```env
OPENAI_API_KEY="sk-..."
# or
ANTHROPIC_API_KEY="sk-ant-..."
```

### Step 4: Create the AI config

Create a type-safe config with either-or validation using the config schema pattern:

```ts
// src/lib/ai/config.ts
import { configSchema, server, oneOf } from "@/lib/config/schema";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModelV1 } from "ai";

const config = configSchema(
	"AI",
	{
		oidcToken: server({ env: "VERCEL_OIDC_TOKEN" }),
		gatewayApiKey: server({ env: "AI_GATEWAY_API_KEY" }),
	},
	{
		constraints: (s) => [oneOf([s.oidcToken, s.gatewayApiKey])],
	},
);

function createProvider() {
	const { oidcToken, gatewayApiKey } = config.server;

	if (gatewayApiKey) {
		return createOpenAI({
			apiKey: gatewayApiKey,
			baseURL: "https://api.openai.com/v1",
		});
	}

	return createOpenAI({
		apiKey: oidcToken,
		baseURL: "https://api.vercel.ai/v1",
	});
}

function getModel(model: string): LanguageModelV1 {
	const provider = createProvider();
	return provider(model);
}

export const aiConfig = {
	...config,
	getModel,
};
```

The `oneOf` constraint creates an either-or relationship: at least one of `oidcToken` or `gatewayApiKey` must be defined. See the [Environment Variable Management](/recipes/env-management) recipe for the full config schema pattern.

### Step 5: Validate config on server start

Import the config in `instrumentation.ts` to validate environment variables when the server starts:

```ts
// src/instrumentation.ts

// Validate required configs on server start
import "./lib/ai/config";
```

This ensures the server fails immediately on startup if neither `VERCEL_OIDC_TOKEN` nor `AI_GATEWAY_API_KEY` is set, rather than failing later when AI features are used.

---

## References

- [AI SDK Documentation](https://ai-sdk.dev/docs/introduction)
- [AI SDK Providers](https://ai-sdk.dev/providers/ai-sdk-providers)
- [Vercel AI Gateway](https://vercel.com/ai-gateway)
- [AI Elements](https://ui.shadcn.com/docs/registry/ai-elements)

---

## Build a Simple Chat

Create a basic chat interface with streaming responses.

### Step 1: Create the API route

Create the chat API route:

```ts
// src/app/api/chat/route.ts
import { convertToModelMessages, streamText, UIMessage } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages }: { messages: UIMessage[] } = await req.json();

	const result = streamText({
		model: "anthropic/claude-sonnet-4.5",
		system: "You are a helpful assistant.",
		messages: await convertToModelMessages(messages),
	});

	return result.toUIMessageStreamResponse();
}
```

> **Note**: Replace the model string with your preferred model. See the [AI SDK providers docs](https://ai-sdk.dev/providers/ai-sdk-providers) for available options.

### Step 2: Create the chat page

Create the chat interface:

```tsx
// src/app/page.tsx
"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

export default function Page() {
	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/chat",
		}),
	});
	const [input, setInput] = useState("");

	return (
		<div className='flex flex-col min-h-screen p-4 max-w-2xl mx-auto'>
			<div className='flex-1 space-y-4 pb-4'>
				{messages.map((message) => (
					<div key={message.id} className={message.role === "user" ? "text-right" : "text-left"}>
						<span className='font-medium'>{message.role === "user" ? "You" : "AI"}:</span>{" "}
						{message.parts.map((part, index) => (part.type === "text" ? <span key={index}>{part.text}</span> : null))}
					</div>
				))}
			</div>

			<form
				className='flex gap-2'
				onSubmit={(e) => {
					e.preventDefault();
					if (input.trim()) {
						sendMessage({ text: input });
						setInput("");
					}
				}}
			>
				<input
					className='flex-1 px-3 py-2 border rounded-md'
					value={input}
					onChange={(e) => setInput(e.target.value)}
					disabled={status !== "ready"}
					placeholder='Say something...'
				/>
				<button
					className='px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50'
					type='submit'
					disabled={status !== "ready"}
				>
					Send
				</button>
			</form>
		</div>
	);
}
```

### Step 3: Test your chat

Start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) and start chatting.

---

## References

- [AI SDK Chat UI](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot)
- [AI SDK Streaming](https://ai-sdk.dev/docs/ai-sdk-core/generating-text#streaming-text)
- [useChat Hook](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat)

---

# Better Auth Setup

Add user authentication using Better Auth with Drizzle ORM and Neon Postgres. Base setup with email/password authentication.

### MCP Server

Add the Better Auth MCP server to your `.cursor/mcp.json` for accurate API guidance:

```json
{
	"mcpServers": {
		"better-auth": {
			"url": "https://mcp.chonkie.ai/better-auth/better-auth-builder/mcp"
		}
	}
}
```

---

### Step 1: Install the package

```bash
bun add better-auth
```

### Step 2: Add environment variables

Add the secret to your `.env.development` (synced to Vercel):

```env
BETTER_AUTH_SECRET="your-random-secret-at-least-32-chars"
```

Generate a secret using:

```bash
openssl rand -base64 32
```

Add the URL to your `.env.local` (local override):

```env
BETTER_AUTH_URL="http://localhost:3000"
```

The `BETTER_AUTH_URL` differs between local (`http://localhost:3000`) and deployed environments, so it belongs in `.env.local`. On Vercel, set `BETTER_AUTH_URL` to your production URL in the dashboard.

### Step 3: Create the auth config

Create the auth config following the [Environment Variable Management](/recipes/env-management) pattern:

```typescript
// src/lib/auth/config.ts
import { loadConfig } from "../common/load-config";

export const authConfig = loadConfig({
	server: {
		secret: process.env.BETTER_AUTH_SECRET,
		url: process.env.BETTER_AUTH_URL,
	},
});
```

### Step 4: Update the db generate script

Create a `scripts/db/generate-schema.ts` script to generate the Better Auth schema before running Drizzle migrations:

```typescript
// scripts/db/generate-schema.ts
import { $ } from "bun";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

await $`bunx @better-auth/cli@latest generate --config src/lib/auth/server.tsx --output src/lib/auth/schema.ts`;

await $`drizzle-kit generate`;
```

The Better Auth CLI generates `schema.ts` from your server config. Running it before `drizzle-kit generate` ensures your auth schema is always in sync when creating Drizzle migrations.

Replace the `package.json` `db:generate` script with this one.

```json
"scripts": {
  "db:generate": "bun run scripts/db/generate-schema.ts",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio"
}
```

Note: This script is needed (vs. just running `better-auth generate &&drizzle-kit generate`) because the better-auth CLI doesn't load `.env.development` and `.env.local` files automatically. We use `loadEnvConfig` to load them manually. See [Environment Variable Management](/recipes/env-management) for the full setup.

See [Neon + Drizzle Setup](/recipes/drizzle-with-node-postgres) for the initial script setup and `package.json` scripts.

### Step 5: Create the auth server instance

Create the auth server with basic email/password authentication:

> **Note:** We use `.tsx` instead of `.ts` to support JSX email templates when you add [Better Auth Emails](/recipes/better-auth-emails) later.

```tsx
// src/lib/auth/server.tsx
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/client";
import { authConfig } from "./config";

export const auth = betterAuth({
	secret: authConfig.server.secret,
	baseURL: authConfig.server.url,
	database: drizzleAdapter(db, {
		provider: "pg",
		usePlural: true,
	}),
	emailAndPassword: {
		enabled: true,
	},
});
```

### Step 6: Create the API route handler

Create the catch-all route handler for auth:

```typescript
// src/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth/server";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
```

### Step 7: Create the auth client

Create the client-side auth hooks:

```typescript
// src/lib/auth/client.ts
"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
```

### Step 8: Generate and run migrations

```bash
bun run db:generate
bun run db:migrate
```

---

## Usage

### Sign Up

```typescript
import { signUp } from "@/lib/auth/client";

await signUp.email({
	email: "user@example.com",
	password: "securepassword",
	name: "John Doe",
});
```

### Sign In

```typescript
import { signIn } from "@/lib/auth/client";

await signIn.email({
	email: "user@example.com",
	password: "securepassword",
});
```

### Sign Out

```typescript
import { signOut } from "@/lib/auth/client";

await signOut();
```

### Get Session (Client)

```tsx
"use client";

import { useSession } from "@/lib/auth/client";

export function UserProfile() {
	const { data: session, isPending } = useSession();

	if (isPending) return <div>Loading...</div>;
	if (!session) return <div>Not signed in</div>;

	return <div>Hello, {session.user.name}</div>;
}
```

### Get Session (Server)

```typescript
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div>Not signed in</div>;
  }

  return <div>Hello, {session.user.name}</div>;
}
```

### Protected Page Pattern

```tsx
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";

export default async function ProtectedPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	return <div>Welcome, {session.user.name}</div>;
}
```

---

## File Structure

```plain
src/lib/auth/
  config.ts    # Environment validation
  schema.ts    # Auto-generated by Better Auth CLI
  server.tsx   # Better Auth server instance (.tsx for email template support)
  client.ts    # React client hooks

src/app/api/auth/
  [...all]/route.ts  # API route handler
```

---

## Adding Social Providers

To add OAuth providers like GitHub, Google, or Vercel, first add them as fields in your auth config:

```typescript
// src/lib/auth/config.ts
import { loadConfig } from "../common/load-config";

export const authConfig = loadConfig({
	server: {
		secret: process.env.BETTER_AUTH_SECRET,
		url: process.env.BETTER_AUTH_URL,
		vercelClientId: { value: process.env.VERCEL_CLIENT_ID, optional: true },
		vercelClientSecret: {
			value: process.env.VERCEL_CLIENT_SECRET,
			optional: true,
		},
	},
});
```

Then configure them in the server:

```tsx
// src/lib/auth/server.tsx
export const auth = betterAuth({
	// ...existing config
	socialProviders: {
		...(authConfig.server.vercelClientId &&
			authConfig.server.vercelClientSecret && {
				vercel: {
					clientId: authConfig.server.vercelClientId,
					clientSecret: authConfig.server.vercelClientSecret,
				},
			}),
	},
});
```

Here we're doing it conditionally and treat Vercel Sign In as an optional feature.

Then use on the client:

```typescript
await signIn.social({ provider: "vercel", callbackURL: "/chats" });
```

---

## References

- [Better Auth Next.js Docs](https://www.better-auth.com/docs/integrations/next)
- [Better Auth Drizzle Adapter](https://www.better-auth.com/docs/adapters/drizzle)

---

# Working with Authentication

Use Better Auth for client and server-side authentication. Covers session access, protected routes, sign in/out, and fetching user data.

## Implement Working with Authentication

Use Better Auth for client and server-side authentication. Covers session access, protected routes, sign in/out, and fetching user data.

**See:**

- Resource: `using-authentication` in Fullstack Recipes
- URL: https://fullstackrecipes.com/recipes/using-authentication

---

### Client-Side Authentication

Use the auth client hooks in React components:

```tsx
"use client";

import { useSession, signOut } from "@/lib/auth/client";

export function UserMenu() {
	const { data: session, isPending } = useSession();

	if (isPending) return <div>Loading...</div>;
	if (!session) return <a href='/sign-in'>Sign In</a>;

	return (
		<div>
			<span>{session.user.name}</span>
			<button onClick={() => signOut()}>Sign Out</button>
		</div>
	);
}
```

### Server-Side Session Access

Get the session in Server Components and API routes:

```typescript
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";

// In a Server Component
export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div>Not signed in</div>;
  }

  return <div>Hello, {session.user.name}</div>;
}
```

```typescript
// In an API route
export async function POST(request: Request) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return new Response("Unauthorized", { status: 401 });
	}

	// Use session.user.id for queries...
}
```

### Protected Pages Pattern

Redirect unauthenticated users:

```tsx
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";

export default async function ProtectedPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	return <Dashboard user={session.user} />;
}
```

### Auth Pages Pattern

Redirect authenticated users away from auth pages:

```tsx
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";

export default async function SignInPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		redirect("/chats"); // Already signed in
	}

	return <SignIn />;
}
```

### Signing In

```typescript
import { signIn } from "@/lib/auth/client";

// Email/password
await signIn.email({
	email: "user@example.com",
	password: "password",
	callbackURL: "/chats",
});

// Social provider
await signIn.social({
	provider: "google",
	callbackURL: "/chats",
});
```

### Signing Up

```typescript
import { signUp } from "@/lib/auth/client";

await signUp.email({
	email: "user@example.com",
	password: "password",
	name: "John Doe",
	callbackURL: "/verify-email",
});
```

### Signing Out

```typescript
import { signOut } from "@/lib/auth/client";

await signOut({
	fetchOptions: {
		onSuccess: () => {
			router.push("/");
		},
	},
});
```

### Fetching User Data After Auth

In protected pages, fetch user-specific data after validating the session:

```tsx
export default async function DashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	const [chats, profile] = await Promise.all([getUserChats(session.user.id), getUserProfile(session.user.id)]);

	return <Dashboard chats={chats} profile={profile} />;
}
```

---

## References

- [Better Auth React](https://www.better-auth.com/docs/react)
- [Better Auth Server](https://www.better-auth.com/docs/server)

---

# AI Chat Persistence with Neon

Persist AI chat conversations to Neon Postgres with full support for AI SDK message parts including tools, reasoning, and streaming. Uses UUID v7 for chronologically-sortable IDs.

### Install packages

```bash
bun add uuid zod
bun add -D @types/uuid
```

### Why UUID v7?

UUID v7 encodes a Unix timestamp in its first 48 bits, making IDs lexicographically ordered by creation time:

```typescript
import { v7 as uuidv7 } from "uuid";

const id = uuidv7(); // e.g., "019012c5-7f3a-7000-8000-000000000000"
```

This enables:

- **Message ordering** - Sort by ID instead of requiring a separate `createdAt` index
- **Part ordering** - Message parts (text, reasoning, tools) maintain insertion order when sorted by ID
- **Efficient queries** - UUID v7 primary keys serve as natural sort keys

### Enable UUID v7 in Postgres

Before creating tables, enable the `pg_uuidv7` extension:

```sql
CREATE EXTENSION IF NOT EXISTS pg_uuidv7;
```

> **Note**: Postgres 18+ includes native UUID v7 support via `uuidv7()`. Update your schema to use `uuidv7()` instead of `uuid_generate_v7()` when available.

### Schema Definition

Create the chat database schema:

```typescript
// src/lib/chat/schema.ts
import { pgTable, text, timestamp, uuid, jsonb, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "@/lib/auth/schema";
import { TOOL_TYPES } from "@/lib/ai/tools";

export const chats = pgTable("chats", {
	id: uuid("id")
		.primaryKey()
		.default(sql`uuid_generate_v7()`),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	title: text("title").notNull().default("New chat"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// runId is non-null while message is streaming, null when complete
export const messages = pgTable("messages", {
	id: uuid("id")
		.primaryKey()
		.default(sql`uuid_generate_v7()`),
	chatId: uuid("chat_id")
		.notNull()
		.references(() => chats.id, { onDelete: "cascade" }),
	role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
	runId: text("run_id"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

The `runId` column enables stream resumption - it's set when a message starts streaming and cleared when complete.

### Message Part Tables

AI SDK messages contain multiple part types. Each gets its own table for efficient querying and parallel insertion:

```typescript
// Text content parts
export const messageTexts = pgTable("message_texts", {
	id: uuid("id")
		.primaryKey()
		.default(sql`uuid_generate_v7()`),
	messageId: uuid("message_id")
		.notNull()
		.references(() => messages.id, { onDelete: "cascade" }),
	chatId: uuid("chat_id")
		.notNull()
		.references(() => chats.id, { onDelete: "cascade" }),
	text: text("text").notNull(),
	providerMetadata: jsonb("provider_metadata"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Reasoning/thinking parts (for models with extended thinking)
export const messageReasoning = pgTable("message_reasoning", {
	id: uuid("id")
		.primaryKey()
		.default(sql`uuid_generate_v7()`),
	messageId: uuid("message_id")
		.notNull()
		.references(() => messages.id, { onDelete: "cascade" }),
	chatId: uuid("chat_id")
		.notNull()
		.references(() => chats.id, { onDelete: "cascade" }),
	text: text("text").notNull(),
	providerMetadata: jsonb("provider_metadata"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tool invocation parts
export const messageTools = pgTable("message_tools", {
	id: uuid("id")
		.primaryKey()
		.default(sql`uuid_generate_v7()`),
	messageId: uuid("message_id")
		.notNull()
		.references(() => messages.id, { onDelete: "cascade" }),
	chatId: uuid("chat_id")
		.notNull()
		.references(() => chats.id, { onDelete: "cascade" }),
	title: text("title"),
	toolCallId: text("tool_call_id").notNull(),
	providerExecuted: boolean("provider_executed").notNull().default(false),
	errorText: text("error_text"),
	input: jsonb("input").notNull(),
	output: jsonb("output"),
	toolType: text("tool_type", {
		enum: TOOL_TYPES,
	}).notNull(),
	state: text("state", {
		enum: ["output-available", "output-error", "output-denied"],
	})
		.notNull()
		.default("output-available"),
	callProviderMetadata: jsonb("call_provider_metadata"),
	approvalId: text("approval_id"),
	approvalReason: text("approval_reason"),
	approved: boolean("approved"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Source URL citation parts
export const messageSourceUrls = pgTable("message_source_urls", {
	id: uuid("id")
		.primaryKey()
		.default(sql`uuid_generate_v7()`),
	messageId: uuid("message_id")
		.notNull()
		.references(() => messages.id, { onDelete: "cascade" }),
	chatId: uuid("chat_id")
		.notNull()
		.references(() => chats.id, { onDelete: "cascade" }),
	sourceId: text("source_id").notNull(),
	url: text("url").notNull(),
	title: text("title"),
	providerMetadata: jsonb("provider_metadata"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Custom data parts (progress updates, structured data)
export const messageData = pgTable("message_data", {
	id: uuid("id")
		.primaryKey()
		.default(sql`uuid_generate_v7()`),
	messageId: uuid("message_id")
		.notNull()
		.references(() => messages.id, { onDelete: "cascade" }),
	chatId: uuid("chat_id")
		.notNull()
		.references(() => chats.id, { onDelete: "cascade" }),
	dataType: text("data_type").notNull(), // data-progress, data-weather, etc.
	data: jsonb("data").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// File attachment parts
export const messageFiles = pgTable("message_files", {
	id: uuid("id")
		.primaryKey()
		.default(sql`uuid_generate_v7()`),
	messageId: uuid("message_id")
		.notNull()
		.references(() => messages.id, { onDelete: "cascade" }),
	chatId: uuid("chat_id")
		.notNull()
		.references(() => chats.id, { onDelete: "cascade" }),
	mediaType: text("media_type").notNull(), // IANA media type (image/png, application/pdf)
	filename: text("filename"),
	url: text("url").notNull(), // Data URL or regular URL
	providerMetadata: jsonb("provider_metadata"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Source document citation parts
export const messageSourceDocuments = pgTable("message_source_documents", {
	id: uuid("id")
		.primaryKey()
		.default(sql`uuid_generate_v7()`),
	messageId: uuid("message_id")
		.notNull()
		.references(() => messages.id, { onDelete: "cascade" }),
	chatId: uuid("chat_id")
		.notNull()
		.references(() => chats.id, { onDelete: "cascade" }),
	sourceId: text("source_id").notNull(),
	mediaType: text("media_type").notNull(),
	title: text("title").notNull(),
	filename: text("filename"),
	providerMetadata: jsonb("provider_metadata"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### Type Exports

Add type exports at the end of your schema file:

```typescript
export type Chat = typeof chats.$inferSelect;
export type NewChat = typeof chats.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type MessageText = typeof messageTexts.$inferSelect;
export type NewMessageText = typeof messageTexts.$inferInsert;
export type MessageReasoning = typeof messageReasoning.$inferSelect;
export type NewMessageReasoning = typeof messageReasoning.$inferInsert;
export type MessageTool = typeof messageTools.$inferSelect;
export type NewMessageTool = typeof messageTools.$inferInsert;
export type MessageSourceUrl = typeof messageSourceUrls.$inferSelect;
export type NewMessageSourceUrl = typeof messageSourceUrls.$inferInsert;
export type MessageData = typeof messageData.$inferSelect;
export type NewMessageData = typeof messageData.$inferInsert;
export type MessageFile = typeof messageFiles.$inferSelect;
export type NewMessageFile = typeof messageFiles.$inferInsert;
export type MessageSourceDocument = typeof messageSourceDocuments.$inferSelect;
export type NewMessageSourceDocument = typeof messageSourceDocuments.$inferInsert;
```

### Re-export from Central Schema

Update the central schema file:

```typescript
// src/lib/db/schema.ts
export * from "@/lib/chat/schema";
```

### Generate and Run Migration

```bash
bun run db:generate
bun run db:migrate
```

---

## Design Decisions

### Separate Tables vs JSONB

Message parts are stored in separate tables rather than a single JSONB column:

- **Efficient queries** - Query specific part types without scanning all messages
- **Parallel insertion** - Different part types can be inserted concurrently
- **Indexing** - Add indexes on specific columns (e.g., `toolType`, `sourceId`)
- **Type safety** - Drizzle provides full type inference for each table

### chatId on Part Tables

Each part table includes a `chatId` column even though it could be derived through `messageId`:

- **Query efficiency** - Fetch all parts for a chat in one query without joins
- **Cascade deletes** - Both message and chat deletions cascade correctly
- **Index usage** - Filter by chat without touching the messages table

### runId for Stream Resumption

The `runId` column on messages enables workflow stream resumption:

- Set when streaming starts, cleared when complete
- If a user refreshes mid-stream, the page can detect incomplete messages
- Pass `runId` to client for automatic reconnection

---

## Chat Types

Define types that extend AI SDK's base types with your tools and data parts. Place these in your workflow folder:

```typescript
// src/workflows/chat/types.ts
import type { UIMessage, UIMessagePart, InferUITools } from "ai";
import { z } from "zod";
import { allTools, TOOL_TYPES } from "@/lib/ai/tools";
import assert from "@/lib/common/assert";

const metadataSchema = z.object({});
type ChatMetadata = z.infer<typeof metadataSchema>;

const dataPartSchema = z.object({
	progress: z.object({
		text: z.string(),
	}),
});
export type ChatDataPart = z.infer<typeof dataPartSchema>;

export type ChatToolSet = InferUITools<typeof allTools>;

export type ChatAgentUIMessage = UIMessage<ChatMetadata, ChatDataPart, ChatToolSet>;
export type ChatUIMessagePart = UIMessagePart<ChatDataPart, ChatToolSet>;

export type ChatTextPart = Extract<ChatUIMessagePart, { type: "text" }>;
export type ChatReasoningPart = Extract<ChatUIMessagePart, { type: "reasoning" }>;
export type ChatSourceUrlPart = Extract<ChatUIMessagePart, { type: "source-url" }>;
export type ChatToolPart = Extract<ChatUIMessagePart, { type: `tool-${string}` }>;
export type ChatDataProgressPart = Extract<ChatUIMessagePart, { type: "data-progress" }>;
export type ChatFilePart = Extract<ChatUIMessagePart, { type: "file" }>;

export function isToolPart(part: ChatUIMessagePart): part is ChatToolPart {
	return part.type.startsWith("tool-");
}

export function isDataProgressPart(part: ChatUIMessagePart): part is ChatDataProgressPart {
	return part.type === "data-progress";
}

const VALID_PART_TYPES = new Set([
	"text",
	"reasoning",
	"source-url",
	"source-document",
	"file",
	"step-start",
	"data-progress",
	...TOOL_TYPES,
]);

/**
 * Asserts that UIMessage parts are valid ChatAgentUIMessage parts.
 * Validates tool types against known TOOL_TYPES and data types against known data part types.
 */
export function assertChatAgentParts(parts: UIMessage["parts"]): asserts parts is ChatAgentUIMessage["parts"] {
	for (const part of parts) {
		if (part.type.startsWith("tool-")) {
			assert(
				TOOL_TYPES.includes(part.type as (typeof TOOL_TYPES)[number]),
				`Unknown tool type: ${part.type}. Valid types: ${TOOL_TYPES.join(", ")}`,
			);
		} else if (part.type.startsWith("data-")) {
			assert(part.type === "data-progress", `Unknown data type: ${part.type}. Valid types: data-progress`);
		} else {
			assert(
				VALID_PART_TYPES.has(part.type),
				`Unknown part type: ${part.type}. Valid types: ${[...VALID_PART_TYPES].join(", ")}`,
			);
		}
	}
}
```

---

## Tool Definitions

Define your tools with their schemas. The `TOOL_TYPES` array must match tool keys prefixed with `tool-`:

```typescript
// src/lib/ai/tools.ts
import { tool } from "ai";
import { z } from "zod";

export const researchTools = {
	webSearch: tool({
		description: "Search the web for information on a topic",
		inputSchema: z.object({
			query: z.string().describe("The search query"),
		}),
		execute: async ({ query }: { query: string }) => {
			// Implement your web search logic here
			return {
				results: [
					{
						title: `Search result for: ${query}`,
						url: "https://example.com",
						snippet: "This is a placeholder search result.",
					},
				],
			};
		},
	}),
};

export const draftingTools = {
	countCharacters: tool({
		description: "Count the number of characters in a text. Use this to verify tweet length before finalizing.",
		inputSchema: z.object({
			text: z.string().describe("The text to count characters for"),
		}),
		execute: async ({ text }: { text: string }) => {
			const count = text.length;
			const remaining = 280 - count;
			return {
				characterCount: count,
				remainingCharacters: remaining,
				isWithinLimit: count <= 280,
				status:
					count <= 280
						? `${count}/280 characters (${remaining} remaining)`
						: `${count}/280 characters (${Math.abs(remaining)} over limit)`,
			};
		},
	}),
	saveDocument: tool({
		description: "Save a document draft",
		inputSchema: z.object({
			title: z.string().describe("Document title"),
			content: z.string().describe("Document content"),
		}),
		execute: async ({ title, content }: { title: string; content: string }) => {
			return {
				saved: true,
				title,
				contentLength: content.length,
			};
		},
	}),
};

export const allTools = {
	...researchTools,
	...draftingTools,
};

// Tool type names for database schema - must match keys in allTools as "tool-{key}"
export const TOOL_TYPES = ["tool-webSearch", "tool-countCharacters", "tool-saveDocument"] as const;

export type ToolType = (typeof TOOL_TYPES)[number];
```

---

## Query Helpers

Create functions to persist and retrieve messages:

```typescript
// src/lib/chat/queries.ts
import { TOOL_TYPES, type ToolType } from "@/lib/ai/tools";
import { isToolPart, type ChatAgentUIMessage, type ChatToolPart } from "@/workflows/chat/types";
import { db } from "@/lib/db/client";
import {
	chats,
	messages,
	messageTexts,
	messageReasoning,
	messageTools,
	messageSourceUrls,
	messageData,
	messageFiles,
	messageSourceDocuments,
	type NewMessageText,
	type NewMessageReasoning,
	type NewMessageTool,
	type NewMessageSourceUrl,
	type NewMessageData,
	type NewMessageFile,
	type NewMessageSourceDocument,
	type Message,
	type MessageText,
	type MessageReasoning,
	type MessageTool,
	type MessageSourceUrl,
	type MessageData,
	type MessageFile,
	type MessageSourceDocument,
} from "./schema";
import { v7 as uuidv7 } from "uuid";
import assert from "@/lib/common/assert";
import { eq, and, desc } from "drizzle-orm";

/**
 * Ensure a chat exists for the given user, creating it if necessary.
 * Returns false if chat exists but belongs to a different user.
 */
export async function ensureChatExists(chatId: string, userId: string): Promise<boolean> {
	const existing = await db.query.chats.findFirst({
		where: eq(chats.id, chatId),
	});

	if (!existing) {
		await db.insert(chats).values({ id: chatId, userId });
		return true;
	}

	return existing.userId === userId;
}

/**
 * Verify that a chat belongs to a specific user.
 */
export async function verifyChatOwnership(chatId: string, userId: string): Promise<boolean> {
	const chat = await db.query.chats.findFirst({
		where: and(eq(chats.id, chatId), eq(chats.userId, userId)),
	});
	return !!chat;
}

function parseMetadata(metadata: unknown): any {
	if (!metadata) return undefined;
	if (typeof metadata !== "object") return undefined;
	if (Object.keys(metadata).length === 0) return undefined;
	return metadata;
}
```

### Message Part Insertion

Pre-generate UUID v7 IDs to maintain insertion order:

```typescript
export async function insertMessageParts(chatId: string, messageId: string, parts: ChatAgentUIMessage["parts"]) {
	const textInserts: Array<NewMessageText> = [];
	const reasoningInserts: Array<NewMessageReasoning> = [];
	const toolInserts: Array<NewMessageTool> = [];
	const sourceUrlInserts: Array<NewMessageSourceUrl> = [];
	const dataInserts: Array<NewMessageData> = [];
	const fileInserts: Array<NewMessageFile> = [];
	const sourceDocumentInserts: Array<NewMessageSourceDocument> = [];

	for (const part of parts) {
		if (part.type === "step-start") {
			continue;
		}

		if (part.type === "text" && "text" in part && part.text.trim()) {
			textInserts.push({
				id: uuidv7(),
				messageId,
				chatId,
				text: part.text,
				providerMetadata: part.providerMetadata,
			});
		} else if (part.type === "reasoning" && "text" in part && part.text.trim()) {
			reasoningInserts.push({
				id: uuidv7(),
				messageId,
				chatId,
				text: part.text,
				providerMetadata: part.providerMetadata,
			});
		} else if (isToolPart(part)) {
			assert(
				TOOL_TYPES.includes(part.type as ToolType),
				`Invalid tool type: ${part.type}. Valid types: ${TOOL_TYPES.join(", ")}`,
			);
			if (part.state === "output-available") {
				toolInserts.push({
					id: uuidv7(),
					messageId,
					chatId,
					input: part.input,
					toolCallId: part.toolCallId,
					toolType: part.type,
					callProviderMetadata: part.callProviderMetadata,
					title: part.title,
					providerExecuted: part.providerExecuted,
					output: part.output,
					state: "output-available",
				});
			} else if (part.state === "output-error") {
				toolInserts.push({
					id: uuidv7(),
					messageId,
					chatId,
					input: part.input,
					toolCallId: part.toolCallId,
					toolType: part.type,
					callProviderMetadata: part.callProviderMetadata,
					title: part.title,
					providerExecuted: part.providerExecuted,
					errorText: part.errorText,
					state: "output-error",
				});
			} else if (part.state === "output-denied") {
				assert(!!part.approval?.id, "Approval ID is required");
				toolInserts.push({
					id: uuidv7(),
					messageId,
					chatId,
					input: part.input,
					toolCallId: part.toolCallId,
					toolType: part.type,
					callProviderMetadata: part.callProviderMetadata,
					title: part.title,
					providerExecuted: part.providerExecuted,
					state: "output-denied",
					approvalId: part.approval?.id,
					approvalReason: part.approval?.reason,
					approved: false,
				});
			}
		} else if (part.type === "source-url") {
			sourceUrlInserts.push({
				id: uuidv7(),
				messageId,
				chatId,
				sourceId: part.sourceId,
				url: part.url,
				title: part.title,
				providerMetadata: part.providerMetadata,
			});
		} else if (part.type.startsWith("data-")) {
			if (part.type === "data-progress") {
				dataInserts.push({
					id: uuidv7(),
					messageId,
					chatId,
					dataType: part.type,
					data: part.data,
				});
			} else {
				throw new Error(`Unknown data type ${part.type}`);
			}
		} else if (part.type === "file") {
			fileInserts.push({
				id: uuidv7(),
				messageId,
				chatId,
				mediaType: part.mediaType,
				filename: part.filename ?? null,
				url: part.url,
				providerMetadata: part.providerMetadata ?? null,
			});
		} else if (part.type === "source-document") {
			sourceDocumentInserts.push({
				id: uuidv7(),
				messageId,
				chatId,
				sourceId: part.sourceId,
				mediaType: part.mediaType,
				title: part.title,
				filename: part.filename ?? null,
				providerMetadata: part.providerMetadata ?? null,
			});
		}
	}

	const insertPromises = [];

	if (textInserts.length > 0) {
		insertPromises.push(db.insert(messageTexts).values(textInserts));
	}
	if (reasoningInserts.length > 0) {
		insertPromises.push(db.insert(messageReasoning).values(reasoningInserts));
	}
	if (toolInserts.length > 0) {
		insertPromises.push(db.insert(messageTools).values(toolInserts));
	}
	if (sourceUrlInserts.length > 0) {
		insertPromises.push(db.insert(messageSourceUrls).values(sourceUrlInserts));
	}
	if (dataInserts.length > 0) {
		insertPromises.push(db.insert(messageData).values(dataInserts));
	}
	if (fileInserts.length > 0) {
		insertPromises.push(db.insert(messageFiles).values(fileInserts));
	}
	if (sourceDocumentInserts.length > 0) {
		insertPromises.push(db.insert(messageSourceDocuments).values(sourceDocumentInserts));
	}

	if (insertPromises.length > 0) {
		await Promise.all(insertPromises);
	}
}

export async function persistMessage({
	chatId,
	message: uiMessage,
	runId,
}: {
	chatId: string;
	message: ChatAgentUIMessage;
	runId?: string | null;
}) {
	const [{ messageId }] = await db
		.insert(messages)
		.values({
			id: uiMessage.id || undefined,
			chatId,
			role: uiMessage.role,
			runId: runId || null,
		})
		.returning({ messageId: messages.id });

	await insertMessageParts(chatId, messageId, uiMessage.parts);
}
```

### Fetching Messages

Fetch all parts in parallel and reconstruct messages:

```typescript
type MessagePart =
	| ({ type: "text" } & MessageText)
	| ({ type: "reasoning" } & MessageReasoning)
	| ({ type: "tool" } & MessageTool)
	| ({ type: "source-url" } & MessageSourceUrl)
	| ({ type: "data" } & MessageData)
	| ({ type: "file" } & MessageFile)
	| ({ type: "source-document" } & MessageSourceDocument);

export type MessageWithParts = Message & {
	parts: MessagePart[];
};

export async function clearMessageRunId(messageId: string): Promise<void> {
	await db.update(messages).set({ runId: null }).where(eq(messages.id, messageId));
}

export async function getChatMessages(chatId: string): Promise<MessageWithParts[]> {
	const [messagesData, textsData, reasoningData, toolsData, sourceUrlsData, dataData, filesData, sourceDocumentsData] =
		await Promise.all([
			db.query.messages.findMany({
				where: eq(messages.chatId, chatId),
				orderBy: (messages, { asc }) => [asc(messages.createdAt)],
			}),
			db.query.messageTexts.findMany({
				where: eq(messageTexts.chatId, chatId),
			}),
			db.query.messageReasoning.findMany({
				where: eq(messageReasoning.chatId, chatId),
			}),
			db.query.messageTools.findMany({
				where: eq(messageTools.chatId, chatId),
			}),
			db.query.messageSourceUrls.findMany({
				where: eq(messageSourceUrls.chatId, chatId),
			}),
			db.query.messageData.findMany({
				where: eq(messageData.chatId, chatId),
			}),
			db.query.messageFiles.findMany({
				where: eq(messageFiles.chatId, chatId),
			}),
			db.query.messageSourceDocuments.findMany({
				where: eq(messageSourceDocuments.chatId, chatId),
			}),
		]);

	const partsMap = new Map<string, MessagePart[]>();

	function addToMap<T extends { messageId: string }>(parts: T[], transform: (part: T) => MessagePart) {
		for (const part of parts) {
			const existing = partsMap.get(part.messageId) || [];
			existing.push(transform(part));
			partsMap.set(part.messageId, existing);
		}
	}

	addToMap(textsData, (part) => ({ ...part, type: "text" as const }));
	addToMap(reasoningData, (part) => ({ ...part, type: "reasoning" as const }));
	addToMap(toolsData, (part) => ({ ...part, type: "tool" as const }));
	addToMap(sourceUrlsData, (part) => ({
		...part,
		type: "source-url" as const,
	}));
	addToMap(dataData, (part) => ({ ...part, type: "data" as const }));
	addToMap(filesData, (part) => ({ ...part, type: "file" as const }));
	addToMap(sourceDocumentsData, (part) => ({
		...part,
		type: "source-document" as const,
	}));

	return messagesData.map((message) => {
		const parts = partsMap.get(message.id) || [];
		// UUID v7 IDs are chronologically ordered
		parts.sort((a, b) => a.id.localeCompare(b.id));

		return {
			...message,
			parts,
		};
	});
}
```

### Converting to UI Messages

Transform database records back to AI SDK format:

```typescript
export function convertDbMessagesToUIMessages(messageHistory: MessageWithParts[]): ChatAgentUIMessage[] {
	return messageHistory.map((msg) => {
		const uiParts: ChatAgentUIMessage["parts"] = [];
		uiParts.push({
			type: "step-start",
		});

		for (const part of msg.parts) {
			let uiPart: ChatAgentUIMessage["parts"][0];
			switch (part.type) {
				case "text":
					uiPart = {
						type: "text",
						text: part.text,
						state: "done",
						providerMetadata: parseMetadata(part.providerMetadata),
					};
					break;
				case "tool":
					// Cast needed: TS can't narrow discriminated union from runtime string
					if (part.state === "output-available") {
						uiPart = {
							type: part.toolType,
							toolCallId: part.toolCallId,
							state: "output-available",
							input: part.input,
							output: part.output,
							callProviderMetadata: parseMetadata(part.callProviderMetadata),
						} as ChatToolPart;
					} else if (part.state === "output-error") {
						assert(part.errorText !== null, "Error text is required");
						uiPart = {
							type: part.toolType,
							toolCallId: part.toolCallId,
							state: "output-error",
							errorText: part.errorText ?? "",
							input: part.input,
							callProviderMetadata: parseMetadata(part.callProviderMetadata),
						} as ChatToolPart;
					} else if (part.state === "output-denied") {
						assert(part.approvalId !== null, "Approval ID is required");
						uiPart = {
							type: part.toolType,
							toolCallId: part.toolCallId,
							state: "output-denied",
							approval: {
								id: part.approvalId,
								approved: false,
								reason: part.approvalReason || "",
							},
							input: part.input,
							callProviderMetadata: parseMetadata(part.callProviderMetadata),
						} as ChatToolPart;
					} else {
						throw new Error(`Unknown part state ${part.state}`);
					}
					break;
				case "reasoning":
					uiPart = {
						type: "reasoning",
						text: part.text,
						providerMetadata: parseMetadata(part.providerMetadata),
					};
					break;
				case "source-url":
					uiPart = {
						type: "source-url",
						sourceId: part.sourceId,
						url: part.url,
						title: part.title ?? undefined,
						providerMetadata: parseMetadata(part.providerMetadata),
					};
					break;
				case "data": {
					if (part.dataType === "data-progress") {
						uiPart = {
							type: "data-progress",
							data: part.data as { text: string },
						};
					} else {
						throw new Error(`Unknown data type: ${part.dataType}`);
					}
					break;
				}
				case "file":
					uiPart = {
						type: "file",
						mediaType: part.mediaType,
						url: part.url,
						filename: part.filename ?? undefined,
						providerMetadata: parseMetadata(part.providerMetadata),
					};
					break;
				case "source-document":
					uiPart = {
						type: "source-document",
						sourceId: part.sourceId,
						mediaType: part.mediaType,
						title: part.title,
						filename: part.filename ?? undefined,
						providerMetadata: parseMetadata(part.providerMetadata),
					};
					break;
				default:
					throw new Error(`Unknown part ${JSON.stringify(part)}`);
			}
			uiParts.push(uiPart);
		}

		return {
			id: msg.id,
			role: msg.role,
			parts: uiParts,
		};
	});
}
```

---

## Chat List Queries

Add functions to list and manage user chats:

```typescript
export type ChatWithPreview = {
	id: string;
	title: string;
	createdAt: Date;
	updatedAt: Date;
	messageCount: number;
	lastMessagePreview: string | null;
};

export async function getUserChats(userId: string): Promise<ChatWithPreview[]> {
	const userChats = await db.query.chats.findMany({
		where: eq(chats.userId, userId),
		orderBy: [desc(chats.updatedAt)],
	});

	const chatPreviews = await Promise.all(
		userChats.map(async (chat) => {
			const chatMessages = await db.query.messages.findMany({
				where: eq(messages.chatId, chat.id),
			});

			const lastUserMessage = chatMessages.filter((m) => m.role === "user").at(-1);

			let lastMessagePreview: string | null = null;
			if (lastUserMessage) {
				const textPart = await db.query.messageTexts.findFirst({
					where: eq(messageTexts.messageId, lastUserMessage.id),
				});
				lastMessagePreview = textPart?.text?.slice(0, 100) ?? null;
			}

			return {
				id: chat.id,
				title: chat.title,
				createdAt: chat.createdAt,
				updatedAt: chat.updatedAt,
				messageCount: chatMessages.length,
				lastMessagePreview,
			};
		}),
	);

	return chatPreviews;
}

export async function deleteChat(chatId: string, userId: string): Promise<boolean> {
	const chat = await db.query.chats.findFirst({
		where: and(eq(chats.id, chatId), eq(chats.userId, userId)),
	});

	if (!chat) {
		return false;
	}

	await db.delete(chats).where(eq(chats.id, chatId));
	return true;
}

export async function renameChat(chatId: string, userId: string, newTitle: string): Promise<boolean> {
	const chat = await db.query.chats.findFirst({
		where: and(eq(chats.id, chatId), eq(chats.userId, userId)),
	});

	if (!chat) {
		return false;
	}

	await db.update(chats).set({ title: newTitle, updatedAt: new Date() }).where(eq(chats.id, chatId));
	return true;
}
```

---

## References

- [AI SDK useChat Documentation](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat)
- [AI SDK UIMessage Types](https://ai-sdk.dev/docs/reference/ai-sdk-ui/ui-message)
- [UUID v7 Specification](https://datatracker.ietf.org/doc/html/draft-peabody-dispatch-new-uuid-format)

---

# Workflow Development Kit Setup

Install and configure the Workflow Development Kit for resumable, durable AI agent workflows with step-level persistence, stream resumption, and agent orchestration.

### Step 1: Install the packages

```bash
bun add workflow @workflow/ai
```

### Step 2: Create the workflows folder

Create a `src/workflows/` folder to organize workflow code:

```plain
src/workflows/
```

Each workflow gets its own subfolder with a `steps/` directory for step functions and an `index.ts` for the orchestration function:

```plain
src/workflows/
  chat/
    index.ts       # Workflow orchestration function
    steps/         # Step functions ("use step")
      history.ts
      logger.ts
      name-chat.ts
    types.ts       # Workflow-specific types
```

### Step 3: Update Next.js config

Update the Next.js configuration:

```ts
// next.config.ts
import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
};

export default withWorkflow(nextConfig);
```

---

## The Chat Workflow

Create the main workflow that processes user messages and generates AI responses:

```typescript
// src/workflows/chat/index.ts
import { getWorkflowMetadata, getWritable } from "workflow";
import type { ChatAgentUIMessage } from "./types";
import {
	persistUserMessage,
	createAssistantMessage,
	getMessageHistory,
	removeRunId,
	persistMessageParts,
} from "./steps/history";
import { log } from "./steps/logger";
import { nameChatStep } from "./steps/name-chat";
import { chatAgent } from "@/lib/ai/chat-agent";

/**
 * Main chat workflow that processes user messages and generates AI responses.
 * Uses runId for stream resumability on client reconnection.
 */
export async function chatWorkflow({ chatId, userMessage }: { chatId: string; userMessage: ChatAgentUIMessage }) {
	"use workflow";

	const { workflowRunId } = getWorkflowMetadata();

	await log("info", "Starting chat workflow", { chatId, runId: workflowRunId });

	// Persist the user message
	await persistUserMessage({ chatId, message: userMessage });

	// Create a placeholder assistant message with runId for resumability
	const messageId = await createAssistantMessage({
		chatId,
		runId: workflowRunId,
	});

	// Get full message history
	const history = await getMessageHistory(chatId);

	// Run the agent with streaming
	const { parts } = await chatAgent.run(history, {
		maxSteps: 10,
		writable: getWritable(),
	});

	// Persist the assistant message parts
	await persistMessageParts({ chatId, messageId, parts });

	// Clear the runId to mark the message as complete
	await removeRunId(messageId);

	// Generate a chat title if this is the first message
	await nameChatStep(chatId, userMessage);

	await log("info", "Chat workflow completed", {
		chatId,
		runId: workflowRunId,
		partsCount: parts.length,
	});
}
```

---

## History Steps

Create step functions for message persistence:

```typescript
// src/workflows/chat/steps/history.ts
import type { UIMessage } from "ai";
import { db } from "@/lib/db/client";
import { messages, chats } from "@/lib/chat/schema";
import {
	persistMessage,
	insertMessageParts,
	getChatMessages,
	convertDbMessagesToUIMessages,
	clearMessageRunId,
} from "@/lib/chat/queries";
import { eq } from "drizzle-orm";
import { assertChatAgentParts, type ChatAgentUIMessage } from "../types";
import { v7 as uuidv7 } from "uuid";

/**
 * Persist a user message to the database.
 */
export async function persistUserMessage({
	chatId,
	message,
}: {
	chatId: string;
	message: ChatAgentUIMessage;
}): Promise<void> {
	"use step";

	await persistMessage({ chatId, message });

	// Update chat timestamp
	await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, chatId));
}

/**
 * Create a placeholder assistant message with a runId for stream resumption.
 * Parts will be added later when streaming completes.
 */
export async function createAssistantMessage({ chatId, runId }: { chatId: string; runId: string }): Promise<string> {
	"use step";

	const [{ messageId }] = await db
		.insert(messages)
		.values({
			id: uuidv7(),
			chatId,
			role: "assistant",
			runId,
		})
		.returning({ messageId: messages.id });

	return messageId;
}

/**
 * Persist message parts after streaming completes.
 * Validates and narrows generic UIMessage parts to ChatAgentUIMessage parts.
 */
export async function persistMessageParts({
	chatId,
	messageId,
	parts,
}: {
	chatId: string;
	messageId: string;
	parts: UIMessage["parts"];
}): Promise<void> {
	"use step";

	assertChatAgentParts(parts);

	await insertMessageParts(chatId, messageId, parts);

	// Update chat timestamp
	await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, chatId));
}

/**
 * Get message history for a chat, converted to UI message format.
 */
export async function getMessageHistory(chatId: string): Promise<ChatAgentUIMessage[]> {
	"use step";

	const dbMessages = await getChatMessages(chatId);
	return convertDbMessagesToUIMessages(dbMessages);
}

/**
 * Clear the runId from a message after streaming is complete.
 * This marks the message as finalized.
 */
export async function removeRunId(messageId: string): Promise<void> {
	"use step";

	await clearMessageRunId(messageId);
}
```

---

## Logging in Workflows

Workflow functions run in a restricted environment that doesn't support Node.js modules like `fs`, `events`, or `worker_threads`. Since pino uses these modules, you cannot import the logger directly in workflow functions.

Instead, wrap logger calls in a step function:

```ts
// src/workflows/chat/steps/logger.ts
import { logger } from "@/lib/logging/logger";

type LogLevel = "info" | "warn" | "error" | "debug";

/**
 * Workflow-safe logger step.
 * Wraps pino logger calls in a step function to avoid bundling
 * Node.js modules (fs, events, worker_threads) into workflow functions.
 */
export async function log(level: LogLevel, message: string, data?: Record<string, unknown>): Promise<void> {
	"use step";

	if (data) {
		logger[level](data, message);
	} else {
		logger[level](message);
	}
}
```

This pattern applies to any library that uses Node.js modules. Move the import and usage into a step function to isolate it from the workflow runtime.

---

## References

- [Workflow Development Kit Documentation](https://useworkflow.dev/docs)
- [Getting Started on Next.js](https://useworkflow.dev/docs/getting-started/next)

---

# Resumable AI Response Streams

Add automatic stream recovery to AI chat with WorkflowChatTransport, start/resume API endpoints, and the useResumableChat hook.

### Start Workflow Endpoint

Create the endpoint to start workflow runs:

```typescript
// src/app/api/chats/[chatId]/messages/route.ts
import { headers } from "next/headers";
import { ensureChatExists } from "@/lib/chat/queries";
import { auth } from "@/lib/auth/server";
import { chatWorkflow } from "@/workflows/chat";
import { start } from "workflow/api";
import { createUIMessageStreamResponse } from "ai";
import type { ChatAgentUIMessage } from "@/workflows/chat/types";

export async function POST(request: Request) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return new Response("Unauthorized", { status: 401 });
	}

	const { chatId, message } = (await request.json()) as {
		chatId: string;
		message: ChatAgentUIMessage;
	};

	if (!chatId || !message) {
		return new Response("Missing chatId or message", { status: 400 });
	}

	// Ensure chat exists (create if needed) and verify ownership
	const isAuthorized = await ensureChatExists(chatId, session.user.id);
	if (!isAuthorized) {
		return new Response("Forbidden", { status: 403 });
	}

	// Start workflow with user message
	const run = await start(chatWorkflow, [
		{
			chatId,
			userMessage: message,
		},
	]);

	// Return stream with runId for resumability
	return createUIMessageStreamResponse({
		stream: run.readable,
		headers: {
			"x-workflow-run-id": run.runId,
		},
	});
}
```

### Resume Stream Endpoint

Create the endpoint to resume workflow streams:

```typescript
// src/app/api/chats/[chatId]/messages/[runId]/stream/route.ts
import { headers } from "next/headers";
import { getRun } from "workflow/api";
import { createUIMessageStreamResponse } from "ai";
import { auth } from "@/lib/auth/server";
import { verifyChatOwnership } from "@/lib/chat/queries";

/**
 * GET /api/chats/:chatId/messages/:runId/stream
 * Resume endpoint for workflow streams
 *
 * Query params:
 *   - startIndex: optional chunk index to resume from
 */
export async function GET(request: Request, { params }: { params: Promise<{ chatId: string; runId: string }> }) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return new Response("Unauthorized", { status: 401 });
	}

	const { chatId, runId } = await params;

	if (!runId) {
		return new Response("Missing runId parameter", { status: 400 });
	}

	const isAuthorized = await verifyChatOwnership(chatId, session.user.id);
	if (!isAuthorized) {
		return new Response("Forbidden", { status: 403 });
	}

	const { searchParams } = new URL(request.url);
	const startIndexParam = searchParams.get("startIndex");
	const startIndex = startIndexParam !== null ? parseInt(startIndexParam, 10) : undefined;

	const run = await getRun(runId);
	const readable = await run.getReadable({ startIndex });

	return createUIMessageStreamResponse({
		stream: readable,
	});
}
```

### Key Workflow API Functions

**`start(workflow, args)`**

Starts a new workflow run:

- Returns `{ runId, readable }`
- `runId` uniquely identifies this run for resumption
- `readable` is a `ReadableStream` of UI message chunks

**`getRun(runId)`**

Gets an existing workflow run:

- Returns a run object with `getReadable({ startIndex? })`
- `startIndex` allows resuming from a specific chunk

### Response Headers

The `x-workflow-run-id` header is critical for resumability:

```typescript
return createUIMessageStreamResponse({
	stream: run.readable,
	headers: {
		"x-workflow-run-id": run.runId,
	},
});
```

The client captures this header and uses it for reconnection.

### Authorization

Both endpoints verify:

1. User is authenticated (session exists)
2. User owns the chat (`ensureChatExists` / `verifyChatOwnership`)

This prevents unauthorized access to other users' workflow streams.

---

## Workflow Client Integration

The client uses `WorkflowChatTransport` for automatic stream resumption.

### Resumable Chat Hook

**Install via shadcn registry:**

```bash
bunx --bun shadcn@latest add https://fullstackrecipes.com/r/use-resumable-chat.json
```

**Or copy the source code:**

`hooks/use-resumable-chat.ts`:

```typescript
"use client";

import { useChat } from "@ai-sdk/react";
import { WorkflowChatTransport } from "@workflow/ai";
import { v7 as uuidv7 } from "uuid";
import type { ChatAgentUIMessage } from "@/workflows/chat/types";
import { useRef } from "react";

interface UseResumableChatOptions {
	chatId: string;
	messageHistory: ChatAgentUIMessage[];
	/** Initial workflow run ID for resuming an interrupted stream */
	initialRunId?: string;
}

/**
 * Custom hook that wraps useChat with WorkflowChatTransport for resumable streaming.
 *
 * Uses useStateRef to track the active workflow run ID, enabling automatic
 * reconnection to interrupted streams without stale closure issues.
 */
export function useResumableChat({ chatId, messageHistory, initialRunId }: UseResumableChatOptions) {
	const activeRunIdRef = useRef<string | undefined>(initialRunId);

	const chatResult = useChat<ChatAgentUIMessage>({
		messages: messageHistory,
		resume: !!initialRunId,
		transport: new WorkflowChatTransport({
			// Send new messages
			prepareSendMessagesRequest: ({ messages }) => ({
				api: `/api/chats/${chatId}/messages`,
				body: {
					chatId,
					message: messages[messages.length - 1],
				},
			}),

			// Store the workflow run ID when a message is sent
			onChatSendMessage: (response) => {
				const workflowRunId = response.headers.get("x-workflow-run-id");
				if (workflowRunId) {
					activeRunIdRef.current = workflowRunId;
				}
			},

			// Configure reconnection to use the ref for the latest value
			prepareReconnectToStreamRequest: ({ api, ...rest }) => {
				const currentRunId = activeRunIdRef.current;
				if (!currentRunId) {
					throw new Error("No active workflow run ID found for reconnection");
				}
				return {
					...rest,
					api: `/api/chats/${chatId}/messages/${encodeURIComponent(currentRunId)}/stream`,
				};
			},

			// Clear the workflow run ID when the chat stream ends
			onChatEnd: () => {
				activeRunIdRef.current = undefined;
			},

			// Retry up to 5 times on reconnection errors
			maxConsecutiveErrors: 5,
		}),
		id: chatId,
		generateId: () => uuidv7(),
	});

	return {
		...chatResult,
	};
}
```

Create the hook:

```typescript
// src/hooks/use-resumable-chat.ts
"use client";

import { useChat } from "@ai-sdk/react";
import { WorkflowChatTransport } from "@workflow/ai";
import { v7 as uuidv7 } from "uuid";
import type { ChatAgentUIMessage } from "@/workflows/chat/types";
import { useRef } from "react";

interface UseResumableChatOptions {
	chatId: string;
	messageHistory: ChatAgentUIMessage[];
	/** Initial workflow run ID for resuming an interrupted stream */
	initialRunId?: string;
}

/**
 * Custom hook that wraps useChat with WorkflowChatTransport for resumable streaming.
 *
 * Uses useStateRef to track the active workflow run ID, enabling automatic
 * reconnection to interrupted streams without stale closure issues.
 */
export function useResumableChat({ chatId, messageHistory, initialRunId }: UseResumableChatOptions) {
	const activeRunIdRef = useRef<string | undefined>(initialRunId);

	const chatResult = useChat<ChatAgentUIMessage>({
		messages: messageHistory,
		resume: !!initialRunId,
		transport: new WorkflowChatTransport({
			// Send new messages
			prepareSendMessagesRequest: ({ messages }) => ({
				api: `/api/chats/${chatId}/messages`,
				body: {
					chatId,
					message: messages[messages.length - 1],
				},
			}),

			// Store the workflow run ID when a message is sent
			onChatSendMessage: (response) => {
				const workflowRunId = response.headers.get("x-workflow-run-id");
				if (workflowRunId) {
					activeRunIdRef.current = workflowRunId;
				}
			},

			// Configure reconnection to use the ref for the latest value
			prepareReconnectToStreamRequest: ({ api, ...rest }) => {
				const currentRunId = activeRunIdRef.current;
				if (!currentRunId) {
					throw new Error("No active workflow run ID found for reconnection");
				}
				return {
					...rest,
					api: `/api/chats/${chatId}/messages/${encodeURIComponent(currentRunId)}/stream`,
				};
			},

			// Clear the workflow run ID when the chat stream ends
			onChatEnd: () => {
				activeRunIdRef.current = undefined;
			},

			// Retry up to 5 times on reconnection errors
			maxConsecutiveErrors: 5,
		}),
		id: chatId,
		generateId: () => uuidv7(),
	});

	return {
		...chatResult,
	};
}
```

### Chat Page with Resumption Detection

Create or update the chat page with resumption detection:

```typescript
// src/app/chats/[chatId]/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Chat } from "@/components/chat/chat";
import {
  convertDbMessagesToUIMessages,
  ensureChatExists,
  getChatMessages,
} from "@/lib/chat/queries";
import { auth } from "@/lib/auth/server";
import { UserMenu } from "@/components/auth/user-menu";
import { ThemeSelector } from "@/components/themes/selector";

export const metadata: Metadata = {
  title: "Chat",
  description: "Continue your AI-powered conversation.",
};

interface PageProps {
  params: Promise<{
    chatId: string;
  }>;
}

export default async function ChatPage({ params }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { chatId } = await params;
  const userId = session.user.id;

  const isAuthorized = await ensureChatExists(chatId, userId);
  if (!isAuthorized) {
    redirect("/");
  }

  // Fetch all messages for this chat
  const persistedMessages = await getChatMessages(chatId);

  // Check if the last message is an incomplete assistant message (has runId but no parts)
  // This happens when a workflow was interrupted mid-stream
  const lastMessage = persistedMessages.at(-1);
  const isIncompleteMessage =
    lastMessage?.role === "assistant" &&
    lastMessage?.runId &&
    lastMessage?.parts.length === 0;

  // If incomplete, extract the runId for resumption and remove the empty message from history
  const initialRunId = isIncompleteMessage ? lastMessage.runId : undefined;
  const messagesToConvert = isIncompleteMessage
    ? persistedMessages.slice(0, -1)
    : persistedMessages;

  const history = convertDbMessagesToUIMessages(messagesToConvert);

  return (
    <div className="h-dvh bg-gradient-to-b from-background via-background to-muted/20 grid grid-rows-[auto_1fr]">
      <header className="z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/chats"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only text-sm font-medium">
                Back to chats
              </span>
            </Link>
            <span className="text-border hidden sm:inline">|</span>
            <span className="hidden sm:block font-mono text-lg font-semibold tracking-tight">
              AI Chat
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSelector />
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="min-h-0 overflow-hidden">
        <Chat
          messageHistory={history}
          chatId={chatId}
          initialRunId={initialRunId ?? undefined}
        />
      </main>
    </div>
  );
}
```

### How Resumption Detection Works

1. **On page load**, fetch all messages for the chat
2. **Check last message** - if it's an assistant message with `runId` but no parts, it's incomplete
3. **Extract `runId`** - pass to client for resumption
4. **Remove empty message** - don't show the incomplete message in UI
5. **Client resumes** - `WorkflowChatTransport` reconnects using the `runId`

### WorkflowChatTransport Options

| Option | Description |
| `prepareSendMessagesRequest` | Configure the initial message send request |
| `onChatSendMessage` | Callback when message is sent (capture `runId`) |
| `prepareReconnectToStreamRequest` | Configure reconnection request URL |
| `onChatEnd` | Callback when stream completes |
| `maxConsecutiveErrors` | Number of reconnection retries |

### Using the Hook in Components

```tsx
"use client";

import { useResumableChat } from "@/hooks/use-resumable-chat";

export function Chat({ chatId, messageHistory, initialRunId }) {
	const { messages, sendMessage, status } = useResumableChat({
		chatId,
		messageHistory,
		initialRunId,
	});

	// Render messages and input...
}
```

---

# Custom Durable Agent

Build a custom durable AI agent with full control over streamText options, provider configs, and tool loops. Compatible with the Workflow Development Kit.

## Why a Custom Agent?

The built-in [`DurableAgent`](https://useworkflow.dev/docs/api-reference/workflow-ai/durable-agent) from `@workflow/ai/agent` covers most use cases. This custom agent is needed when:

1. **Streaming reasoning/sources** - `DurableAgent` doesn't expose `sendReasoning` or `sendSources` options
2. **UIMessage persistence** - `DurableAgent.onFinish` provides `ModelMessage[]`, but this agent provides `UIMessage` with its `parts` array directly via `toUIMessageStream().onFinish`

## How It Works

The `Agent` class wraps the AI SDK's `streamText` with a tool loop. It uses `toUIMessageStream()` internally to capture `responseMessage: UIMessage` in each step.

Key design decisions:

1. **Serializable config** - Tool functions are referenced by key and resolved inside the step executor
2. **Standalone step executor** - The `"use step"` directive only works in standalone functions, not class methods

## Defining an Agent

**Install via shadcn registry:**

```bash
bunx --bun shadcn@latest add https://fullstackrecipes.com/r/durable-agent.json
```

**Or copy the source code:**

`lib/ai/agent.ts`:

````typescript
import {
	streamText,
	convertToModelMessages,
	type FinishReason,
	type UIMessage,
	type UIMessageChunk,
	type ModelMessage,
} from "ai";
import type { ProviderOptions } from "@ai-sdk/provider-utils";
import { researchTools, draftingTools } from "./tools";

type MessagePart = UIMessage["parts"][number];

export type ToolsKey = "research" | "drafting";

const toolSets = {
	research: researchTools,
	drafting: draftingTools,
} as const;

/**
 * Serializable stream options (excludes callbacks like onFinish).
 */
export interface StreamOptions {
	sendStart?: boolean;
	sendFinish?: boolean;
	sendReasoning?: boolean;
	sendSources?: boolean;
}

/**
 * Serializable options for streamText (excludes callbacks and messages).
 */
export interface StepOptions {
	model: string;
	system: string;
	/** Tool set key - resolved to actual tools inside the step executor */
	tools: ToolsKey;
	providerOptions?: ProviderOptions;
}

/**
 * All properties must be serializable for workflow compatibility.
 */
export interface AgentConfig {
	stepOptions: StepOptions;
	streamOptions?: StreamOptions;
}

export interface AgentRunConfig {
	/** @default 20 */
	maxSteps?: number;
	/** Pass getWritable() in workflows, or any WritableStream outside */
	writable?: WritableStream<UIMessageChunk>;
}

export interface AgentRunResult {
	parts: MessagePart[];
	stepCount: number;
}

interface AgentStepResult {
	shouldContinue: boolean;
	responseMessage: UIMessage;
	finishReason: FinishReason;
}

interface StepExecutorConfig {
	stepOptions: StepOptions;
	streamOptions?: StreamOptions;
	writable?: WritableStream<UIMessageChunk>;
}

/**
 * AI agent that executes streamText in a tool loop.
 *
 * Configuration is fully serializable for workflow compatibility.
 * Tools are referenced by key and resolved inside the step executor.
 *
 * @example
 * ```ts
 * const draftingAgent = new Agent({
 *   stepOptions: {
 *     model: "google/gemini-3-pro-preview",
 *     system: "You are a drafting agent...",
 *     tools: "drafting",
 *   },
 *   streamOptions: { sendReasoning: true },
 * });
 *
 * const { parts } = await draftingAgent.run(history, {
 *   maxSteps: 10,
 *   writable: getWritable(),
 * });
 * ```
 */
export class Agent {
	constructor(private config: AgentConfig) {}

	async run(history: UIMessage[], runConfig: AgentRunConfig = {}): Promise<AgentRunResult> {
		const { maxSteps = 20, writable } = runConfig;

		const stepConfig: StepExecutorConfig = {
			stepOptions: this.config.stepOptions,
			streamOptions: this.config.streamOptions,
			writable,
		};

		let modelMessages: ModelMessage[] = await convertToModelMessages(history);
		let stepCount = 0;
		let shouldContinue = true;
		let allParts: MessagePart[] = [];

		while (shouldContinue && stepCount < maxSteps) {
			const result = await executeAgentStep(modelMessages, stepConfig);

			allParts = [...allParts, ...result.responseMessage.parts];
			modelMessages = [...modelMessages, ...(await convertToModelMessages([result.responseMessage]))];

			shouldContinue = result.shouldContinue;
			stepCount++;
		}

		return { parts: allParts, stepCount };
	}
}

/**
 * Step executor with "use step" directive.
 * Separated from class because "use step" only works in standalone functions.
 * @internal
 */
async function executeAgentStep(messages: ModelMessage[], config: StepExecutorConfig): Promise<AgentStepResult> {
	"use step";

	const tools = toolSets[config.stepOptions.tools];

	const resultStream = streamText({
		model: config.stepOptions.model,
		system: config.stepOptions.system,
		tools,
		messages,
		providerOptions: config.stepOptions.providerOptions,
	});

	let responseMessage: UIMessage | null = null;

	const uiStream = resultStream.toUIMessageStream({
		sendStart: config.streamOptions?.sendStart ?? false,
		sendFinish: config.streamOptions?.sendFinish ?? false,
		sendReasoning: config.streamOptions?.sendReasoning ?? false,
		sendSources: config.streamOptions?.sendSources ?? false,
		onFinish: ({ responseMessage: msg }) => {
			responseMessage = msg;
		},
	});

	if (config.writable) {
		await pipeToWritable(uiStream, config.writable);
	} else {
		await consumeStream(uiStream);
	}

	await resultStream.consumeStream();
	const finishReason = await resultStream.finishReason;

	if (!responseMessage) {
		throw new Error("No response message received from stream");
	}

	const shouldContinue = finishReason === "tool-calls";

	return { shouldContinue, responseMessage, finishReason };
}

async function consumeStream<T>(stream: ReadableStream<T>): Promise<void> {
	const reader = stream.getReader();
	try {
		while (true) {
			const { done } = await reader.read();
			if (done) break;
		}
	} finally {
		reader.releaseLock();
	}
}

async function pipeToWritable<T>(readable: ReadableStream<T>, writable: WritableStream<T>): Promise<void> {
	const writer = writable.getWriter();
	const reader = readable.getReader();

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			await writer.write(value);
		}
	} finally {
		reader.releaseLock();
		writer.releaseLock();
	}
}

export function createAgent(config: AgentConfig): Agent {
	return new Agent(config);
}
````

Create the agent class:

````typescript
// src/lib/ai/agent.ts
import {
	streamText,
	convertToModelMessages,
	type FinishReason,
	type UIMessage,
	type UIMessageChunk,
	type ModelMessage,
} from "ai";
import type { ProviderOptions } from "@ai-sdk/provider-utils";
import { researchTools, draftingTools } from "./tools";
import { aiConfig } from "./config";

type MessagePart = UIMessage["parts"][number];

export type ToolsKey = "research" | "drafting";

const toolSets = {
	research: researchTools,
	drafting: draftingTools,
} as const;

/**
 * Serializable stream options (excludes callbacks like onFinish).
 */
export interface StreamOptions {
	sendStart?: boolean;
	sendFinish?: boolean;
	sendReasoning?: boolean;
	sendSources?: boolean;
}

/**
 * Serializable options for streamText (excludes callbacks and messages).
 */
export interface StepOptions {
	model: string;
	system: string;
	/** Tool set key - resolved to actual tools inside the step executor */
	tools: ToolsKey;
	providerOptions?: ProviderOptions;
}

/**
 * All properties must be serializable for workflow compatibility.
 */
export interface AgentConfig {
	stepOptions: StepOptions;
	streamOptions?: StreamOptions;
}

export interface AgentRunConfig {
	/** @default 20 */
	maxSteps?: number;
	/** Pass getWritable() in workflows, or any WritableStream outside */
	writable?: WritableStream<UIMessageChunk>;
}

export interface AgentRunResult {
	parts: MessagePart[];
	stepCount: number;
}

interface AgentStepResult {
	shouldContinue: boolean;
	responseMessage: UIMessage;
	finishReason: FinishReason;
}

interface StepExecutorConfig {
	stepOptions: StepOptions;
	streamOptions?: StreamOptions;
	writable?: WritableStream<UIMessageChunk>;
}

/**
 * AI agent that executes streamText in a tool loop.
 *
 * Configuration is fully serializable for workflow compatibility.
 * Tools are referenced by key and resolved inside the step executor.
 *
 * @example
 * ```ts
 * const draftingAgent = new Agent({
 *   stepOptions: {
 *     model: "gpt-4o",
 *     system: "You are a drafting agent...",
 *     tools: "drafting",
 *   },
 *   streamOptions: { sendReasoning: true },
 * });
 *
 * const { parts } = await draftingAgent.run(history, {
 *   maxSteps: 10,
 *   writable: getWritable(),
 * });
 * ```
 */
export class Agent {
	constructor(private config: AgentConfig) {}

	async run(history: UIMessage[], runConfig: AgentRunConfig = {}): Promise<AgentRunResult> {
		const { maxSteps = 20, writable } = runConfig;

		const stepConfig: StepExecutorConfig = {
			stepOptions: this.config.stepOptions,
			streamOptions: this.config.streamOptions,
			writable,
		};

		let modelMessages: ModelMessage[] = await convertToModelMessages(history);
		let stepCount = 0;
		let shouldContinue = true;
		let allParts: MessagePart[] = [];

		while (shouldContinue && stepCount < maxSteps) {
			const result = await executeAgentStep(modelMessages, stepConfig);

			allParts = [...allParts, ...result.responseMessage.parts];
			modelMessages = [...modelMessages, ...(await convertToModelMessages([result.responseMessage]))];

			shouldContinue = result.shouldContinue;
			stepCount++;
		}

		return { parts: allParts, stepCount };
	}
}

/**
 * Step executor with "use step" directive.
 * Separated from class because "use step" only works in standalone functions.
 * @internal
 */
async function executeAgentStep(messages: ModelMessage[], config: StepExecutorConfig): Promise<AgentStepResult> {
	"use step";

	const tools = toolSets[config.stepOptions.tools];

	const resultStream = streamText({
		model: aiConfig.getModel(config.stepOptions.model),
		system: config.stepOptions.system,
		tools,
		messages,
		providerOptions: config.stepOptions.providerOptions,
	});

	let responseMessage: UIMessage | null = null;

	const uiStream = resultStream.toUIMessageStream({
		sendStart: config.streamOptions?.sendStart ?? false,
		sendFinish: config.streamOptions?.sendFinish ?? false,
		sendReasoning: config.streamOptions?.sendReasoning ?? false,
		sendSources: config.streamOptions?.sendSources ?? false,
		onFinish: ({ responseMessage: msg }) => {
			responseMessage = msg;
		},
	});

	if (config.writable) {
		await pipeToWritable(uiStream, config.writable);
	} else {
		await consumeStream(uiStream);
	}

	await resultStream.consumeStream();
	const finishReason = await resultStream.finishReason;

	if (!responseMessage) {
		throw new Error("No response message received from stream");
	}

	const shouldContinue = finishReason === "tool-calls";

	return { shouldContinue, responseMessage, finishReason };
}

async function consumeStream<T>(stream: ReadableStream<T>): Promise<void> {
	const reader = stream.getReader();
	try {
		while (true) {
			const { done } = await reader.read();
			if (done) break;
		}
	} finally {
		reader.releaseLock();
	}
}

async function pipeToWritable<T>(readable: ReadableStream<T>, writable: WritableStream<T>): Promise<void> {
	const writer = writable.getWriter();
	const reader = readable.getReader();

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			await writer.write(value);
		}
	} finally {
		reader.releaseLock();
		writer.releaseLock();
	}
}

export function createAgent(config: AgentConfig): Agent {
	return new Agent(config);
}
````

## Creating Agent Instances

Create specialized agents with different configurations:

```typescript
// src/lib/ai/chat-agent.ts
import { Agent } from "./agent";

export const chatAgent = new Agent({
	stepOptions: {
		model: "gpt-4o",
		system: `You are a helpful AI assistant. You can help users with a variety of tasks including research and drafting content.

When users ask you to research something, use your available tools to search for information.
When users ask you to draft content, use your drafting tools to save documents.

Be concise but thorough in your responses.`,
		tools: "research",
	},
	streamOptions: {
		sendReasoning: false,
		sendSources: false,
	},
});
```

For specialized agents with provider options:

```typescript
// src/lib/ai/research-agent.ts
import { Agent } from "./agent";

export const researchAgent = new Agent({
	stepOptions: {
		model: "google/gemini-3-pro-preview",
		system: "You are a research agent...",
		tools: "research",
		providerOptions: {
			google: {
				thinkingConfig: {
					thinkingBudget: 8000,
					includeThoughts: true,
				},
			},
		},
	},
	streamOptions: {
		sendReasoning: true,
		sendSources: true,
	},
});
```

## Running in a Workflow

```typescript
import { getWorkflowMetadata, getWritable } from "workflow";
import { chatAgent } from "@/lib/ai/chat-agent";

export async function chatWorkflow({ chatId, userMessage }) {
	"use workflow";

	const { workflowRunId } = getWorkflowMetadata();

	// Persist user message, create assistant placeholder
	await persistUserMessage({ chatId, message: userMessage });
	const messageId = await createAssistantMessage({
		chatId,
		runId: workflowRunId,
	});

	// Get full message history
	const history = await getMessageHistory(chatId);

	// Run the agent with streaming
	const { parts } = await chatAgent.run(history, {
		maxSteps: 10,
		writable: getWritable(),
	});

	// Persist the assistant message parts
	await persistMessageParts({ chatId, messageId, parts });

	// Clear the runId to mark the message as complete
	await removeRunId(messageId);
}
```

## Running Outside a Workflow

The agent works outside workflows too - useful for testing or non-durable contexts:

```typescript
import { chatAgent } from "@/lib/ai/chat-agent";

// Option 1: Just get the parts (no streaming)
const { parts, stepCount } = await chatAgent.run(history);
console.log(`Completed in ${stepCount} steps`);

// Option 2: Stream to a custom writable
const chunks: UIMessageChunk[] = [];
const writable = new WritableStream({
	write(chunk) {
		chunks.push(chunk);
		if (chunk.type === "text-delta") {
			process.stdout.write(chunk.textDelta);
		}
	},
});

await chatAgent.run(history, { writable });
```

## When to Use Each

**Use `DurableAgent`** for most use cases - it's simpler and provides inline tool definitions, callbacks, and `prepareStep`.

**Use this custom agent** when you need `sendReasoning`/`sendSources` streaming or direct `UIMessage` format for persistence.

## Key Implementation Details

### Why Tools Are Referenced by Key

Workflow runtimes serialize step inputs/outputs. Function references can't be serialized, so tools are stored in a `toolSets` object and looked up by key inside the step executor:

```typescript
const toolSets = {
	research: researchTools,
	drafting: draftingTools,
} as const;

// Inside executeAgentStep:
const tools = toolSets[config.stepOptions.tools];
```

### Why the Step Executor Is Separate

The `"use step"` directive only works in standalone functions, not class methods. The step executor is extracted from the class:

```typescript
// This works:
async function executeAgentStep(...) {
  "use step";
  // ...
}

// This does NOT work:
class Agent {
  async executeStep(...) {
    "use step"; // Error: directive not supported in methods
  }
}
```

### Tool Loop Logic

The agent continues executing steps until the model stops making tool calls:

```typescript
while (shouldContinue && stepCount < maxSteps) {
	const result = await executeAgentStep(modelMessages, stepConfig);
	// ...
	shouldContinue = result.finishReason === "tool-calls";
	stepCount++;
}
```

## See Also

- [Resumable AI Streams](/recipes/resumable-ai-streams) - Full recipe using this agent
- [DurableAgent Documentation](https://useworkflow.dev/docs/api-reference/workflow-ai/durable-agent) - Built-in alternative
- [AI SDK streamText](https://ai-sdk.dev/docs/ai-sdk-core/generating-text#streamtext) - Underlying streaming API

---

# Working with Workflows

Create and run durable workflows with steps, streaming, and agent execution. Covers starting, resuming, and persisting workflow results.

## Working with Workflows

Create and run durable workflows with steps, streaming, and agent execution. Covers starting, resuming, and persisting workflow results.

**See:**

- Resource: `using-workflows` in Fullstack Recipes
- URL: https://fullstackrecipes.com/recipes/using-workflows

---

### Workflow Folder Structure

Each workflow has its own subfolder in `src/workflows/`:

```plain
src/workflows/
  chat/
    index.ts       # Workflow orchestration function ("use workflow")
    steps/         # Step functions ("use step")
      history.ts
      logger.ts
      name-chat.ts
    types.ts       # Workflow-specific types
```

- **`index.ts`** - Contains the main workflow function with the `"use workflow"` directive. Orchestrates the workflow by calling step functions.
- **`steps/`** - Contains individual step functions with the `"use step"` directive. Each step is a durable checkpoint.
- **`types.ts`** - Type definitions for the workflow's UI messages.

---

### Creating a Workflow

Define workflows with the `"use workflow"` directive:

```typescript
// src/workflows/chat/index.ts
import { getWorkflowMetadata, getWritable } from "workflow";
import { chatAgent } from "@/lib/ai/chat-agent";

export async function chatWorkflow({ chatId, userMessage }) {
	"use workflow";

	const { workflowRunId } = getWorkflowMetadata();

	// Persist user message
	await persistUserMessage({ chatId, message: userMessage });

	// Create assistant placeholder with runId for resumption
	const messageId = await createAssistantMessage({
		chatId,
		runId: workflowRunId,
	});

	// Get message history
	const history = await getMessageHistory(chatId);

	// Run agent with streaming
	const { parts } = await chatAgent.run(history, {
		maxSteps: 10,
		writable: getWritable(),
	});

	// Persist and finalize
	await persistMessageParts({ chatId, messageId, parts });
	await removeRunId(messageId);
}
```

### Starting a Workflow

Use the `start` function from `workflow/api`:

```typescript
import { start } from "workflow/api";
import { chatWorkflow } from "@/workflows/chat";

const run = await start(chatWorkflow, [{ chatId, userMessage }]);

// run.runId - unique identifier for this run
// run.readable - stream of UI message chunks
```

### Resuming a Workflow Stream

Use `getRun` to reconnect to an in-progress or completed workflow:

```typescript
import { getRun } from "workflow/api";

const run = await getRun(runId);
const readable = await run.getReadable({ startIndex });
```

### Using Steps

Steps are durable checkpoints that persist their results:

```typescript
async function getMessageHistory(chatId: string) {
	"use step";

	const dbMessages = await getChatMessages(chatId);
	return convertDbMessagesToUIMessages(dbMessages);
}
```

### Streaming from Workflows

Use `getWritable()` to stream data to clients:

```typescript
import { getWritable } from "workflow";

export async function chatWorkflow({ chatId }) {
	"use workflow";

	const writable = getWritable();

	// Pass to agent for streaming
	await chatAgent.run(history, { writable });
}
```

### Getting Workflow Metadata

Access the current run's metadata:

```typescript
import { getWorkflowMetadata } from "workflow";

export async function chatWorkflow({ chatId }) {
	"use workflow";

	const { workflowRunId } = getWorkflowMetadata();

	// Store runId for resumption
	await createAssistantMessage({ chatId, runId: workflowRunId });
}
```

### Workflow-Safe Logging

The workflow runtime doesn't support Node.js modules. Wrap logger calls in steps:

```typescript
// src/workflows/chat/steps/logger.ts
import { logger } from "@/lib/logging/logger";

export async function log(
	level: "info" | "warn" | "error" | "debug",
	message: string,
	data?: Record<string, unknown>,
): Promise<void> {
	"use step";

	if (data) {
		logger[level](data, message);
	} else {
		logger[level](message);
	}
}
```

### Running Agents in Workflows

Use the custom `Agent` class for full streaming control:

```typescript
import { getWritable } from "workflow";
import { chatAgent } from "@/lib/ai/chat-agent";

export async function chatWorkflow({ chatId, userMessage }) {
	"use workflow";

	const history = await getMessageHistory(chatId);

	const { parts } = await chatAgent.run(history, {
		maxSteps: 10,
		writable: getWritable(),
	});

	await persistMessageParts({ chatId, messageId, parts });
}
```

### Persisting Workflow Results

Save agent output using step functions. The `assertChatAgentParts` function validates that generic `UIMessage["parts"]` (returned by agents) match your application's specific tool and data types:

```typescript
// src/workflows/chat/steps/history.ts
import type { UIMessage } from "ai";
import { insertMessageParts } from "@/lib/chat/queries";
import { assertChatAgentParts, type ChatAgentUIMessage } from "../types";

export async function persistMessageParts({
	chatId,
	messageId,
	parts,
}: {
	chatId: string;
	messageId: string;
	parts: UIMessage["parts"];
}): Promise<void> {
	"use step";

	assertChatAgentParts(parts);

	await insertMessageParts(chatId, messageId, parts);

	// Update chat timestamp
	await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, chatId));
}
```

---

## References

- [Workflow Development Kit](https://useworkflow.dev/docs)
- [Workflow API Reference](https://useworkflow.dev/docs/api-reference)

---

# Multi-Agent Workflows

Build resumable multi-agent workflows with durable execution, tool loops, and automatic stream recovery on client reconnection.

## Workflow Development Kit Setup

Install and configure the Workflow Development Kit for resumable, durable AI agent workflows with step-level persistence, stream resumption, and agent orchestration.

### Step 1: Install the packages

```bash
bun add workflow @workflow/ai
```

### Step 2: Create the workflows folder

Create a `src/workflows/` folder to organize workflow code:

```plain
src/workflows/
```

Each workflow gets its own subfolder with a `steps/` directory for step functions and an `index.ts` for the orchestration function:

```plain
src/workflows/
  chat/
    index.ts       # Workflow orchestration function
    steps/         # Step functions ("use step")
      history.ts
      logger.ts
      name-chat.ts
    types.ts       # Workflow-specific types
```

### Step 3: Update Next.js config

Update the Next.js configuration:

```ts
// next.config.ts
import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
};

export default withWorkflow(nextConfig);
```

---

## The Chat Workflow

Create the main workflow that processes user messages and generates AI responses:

```typescript
// src/workflows/chat/index.ts
import { getWorkflowMetadata, getWritable } from "workflow";
import type { ChatAgentUIMessage } from "./types";
import {
	persistUserMessage,
	createAssistantMessage,
	getMessageHistory,
	removeRunId,
	persistMessageParts,
} from "./steps/history";
import { log } from "./steps/logger";
import { nameChatStep } from "./steps/name-chat";
import { chatAgent } from "@/lib/ai/chat-agent";

/**
 * Main chat workflow that processes user messages and generates AI responses.
 * Uses runId for stream resumability on client reconnection.
 */
export async function chatWorkflow({ chatId, userMessage }: { chatId: string; userMessage: ChatAgentUIMessage }) {
	"use workflow";

	const { workflowRunId } = getWorkflowMetadata();

	await log("info", "Starting chat workflow", { chatId, runId: workflowRunId });

	// Persist the user message
	await persistUserMessage({ chatId, message: userMessage });

	// Create a placeholder assistant message with runId for resumability
	const messageId = await createAssistantMessage({
		chatId,
		runId: workflowRunId,
	});

	// Get full message history
	const history = await getMessageHistory(chatId);

	// Run the agent with streaming
	const { parts } = await chatAgent.run(history, {
		maxSteps: 10,
		writable: getWritable(),
	});

	// Persist the assistant message parts
	await persistMessageParts({ chatId, messageId, parts });

	// Clear the runId to mark the message as complete
	await removeRunId(messageId);

	// Generate a chat title if this is the first message
	await nameChatStep(chatId, userMessage);

	await log("info", "Chat workflow completed", {
		chatId,
		runId: workflowRunId,
		partsCount: parts.length,
	});
}
```

---

## History Steps

Create step functions for message persistence:

```typescript
// src/workflows/chat/steps/history.ts
import type { UIMessage } from "ai";
import { db } from "@/lib/db/client";
import { messages, chats } from "@/lib/chat/schema";
import {
	persistMessage,
	insertMessageParts,
	getChatMessages,
	convertDbMessagesToUIMessages,
	clearMessageRunId,
} from "@/lib/chat/queries";
import { eq } from "drizzle-orm";
import { assertChatAgentParts, type ChatAgentUIMessage } from "../types";
import { v7 as uuidv7 } from "uuid";

/**
 * Persist a user message to the database.
 */
export async function persistUserMessage({
	chatId,
	message,
}: {
	chatId: string;
	message: ChatAgentUIMessage;
}): Promise<void> {
	"use step";

	await persistMessage({ chatId, message });

	// Update chat timestamp
	await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, chatId));
}

/**
 * Create a placeholder assistant message with a runId for stream resumption.
 * Parts will be added later when streaming completes.
 */
export async function createAssistantMessage({ chatId, runId }: { chatId: string; runId: string }): Promise<string> {
	"use step";

	const [{ messageId }] = await db
		.insert(messages)
		.values({
			id: uuidv7(),
			chatId,
			role: "assistant",
			runId,
		})
		.returning({ messageId: messages.id });

	return messageId;
}

/**
 * Persist message parts after streaming completes.
 * Validates and narrows generic UIMessage parts to ChatAgentUIMessage parts.
 */
export async function persistMessageParts({
	chatId,
	messageId,
	parts,
}: {
	chatId: string;
	messageId: string;
	parts: UIMessage["parts"];
}): Promise<void> {
	"use step";

	assertChatAgentParts(parts);

	await insertMessageParts(chatId, messageId, parts);

	// Update chat timestamp
	await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, chatId));
}

/**
 * Get message history for a chat, converted to UI message format.
 */
export async function getMessageHistory(chatId: string): Promise<ChatAgentUIMessage[]> {
	"use step";

	const dbMessages = await getChatMessages(chatId);
	return convertDbMessagesToUIMessages(dbMessages);
}

/**
 * Clear the runId from a message after streaming is complete.
 * This marks the message as finalized.
 */
export async function removeRunId(messageId: string): Promise<void> {
	"use step";

	await clearMessageRunId(messageId);
}
```

---

## Logging in Workflows

Workflow functions run in a restricted environment that doesn't support Node.js modules like `fs`, `events`, or `worker_threads`. Since pino uses these modules, you cannot import the logger directly in workflow functions.

Instead, wrap logger calls in a step function:

```ts
// src/workflows/chat/steps/logger.ts
import { logger } from "@/lib/logging/logger";

type LogLevel = "info" | "warn" | "error" | "debug";

/**
 * Workflow-safe logger step.
 * Wraps pino logger calls in a step function to avoid bundling
 * Node.js modules (fs, events, worker_threads) into workflow functions.
 */
export async function log(level: LogLevel, message: string, data?: Record<string, unknown>): Promise<void> {
	"use step";

	if (data) {
		logger[level](data, message);
	} else {
		logger[level](message);
	}
}
```

This pattern applies to any library that uses Node.js modules. Move the import and usage into a step function to isolate it from the workflow runtime.

---

## References

- [Workflow Development Kit Documentation](https://useworkflow.dev/docs)
- [Getting Started on Next.js](https://useworkflow.dev/docs/getting-started/next)

---

## Resumable AI Response Streams

Add automatic stream recovery to AI chat with WorkflowChatTransport, start/resume API endpoints, and the useResumableChat hook.

### Start Workflow Endpoint

Create the endpoint to start workflow runs:

```typescript
// src/app/api/chats/[chatId]/messages/route.ts
import { headers } from "next/headers";
import { ensureChatExists } from "@/lib/chat/queries";
import { auth } from "@/lib/auth/server";
import { chatWorkflow } from "@/workflows/chat";
import { start } from "workflow/api";
import { createUIMessageStreamResponse } from "ai";
import type { ChatAgentUIMessage } from "@/workflows/chat/types";

export async function POST(request: Request) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return new Response("Unauthorized", { status: 401 });
	}

	const { chatId, message } = (await request.json()) as {
		chatId: string;
		message: ChatAgentUIMessage;
	};

	if (!chatId || !message) {
		return new Response("Missing chatId or message", { status: 400 });
	}

	// Ensure chat exists (create if needed) and verify ownership
	const isAuthorized = await ensureChatExists(chatId, session.user.id);
	if (!isAuthorized) {
		return new Response("Forbidden", { status: 403 });
	}

	// Start workflow with user message
	const run = await start(chatWorkflow, [
		{
			chatId,
			userMessage: message,
		},
	]);

	// Return stream with runId for resumability
	return createUIMessageStreamResponse({
		stream: run.readable,
		headers: {
			"x-workflow-run-id": run.runId,
		},
	});
}
```

### Resume Stream Endpoint

Create the endpoint to resume workflow streams:

```typescript
// src/app/api/chats/[chatId]/messages/[runId]/stream/route.ts
import { headers } from "next/headers";
import { getRun } from "workflow/api";
import { createUIMessageStreamResponse } from "ai";
import { auth } from "@/lib/auth/server";
import { verifyChatOwnership } from "@/lib/chat/queries";

/**
 * GET /api/chats/:chatId/messages/:runId/stream
 * Resume endpoint for workflow streams
 *
 * Query params:
 *   - startIndex: optional chunk index to resume from
 */
export async function GET(request: Request, { params }: { params: Promise<{ chatId: string; runId: string }> }) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return new Response("Unauthorized", { status: 401 });
	}

	const { chatId, runId } = await params;

	if (!runId) {
		return new Response("Missing runId parameter", { status: 400 });
	}

	const isAuthorized = await verifyChatOwnership(chatId, session.user.id);
	if (!isAuthorized) {
		return new Response("Forbidden", { status: 403 });
	}

	const { searchParams } = new URL(request.url);
	const startIndexParam = searchParams.get("startIndex");
	const startIndex = startIndexParam !== null ? parseInt(startIndexParam, 10) : undefined;

	const run = await getRun(runId);
	const readable = await run.getReadable({ startIndex });

	return createUIMessageStreamResponse({
		stream: readable,
	});
}
```

### Key Workflow API Functions

**`start(workflow, args)`**

Starts a new workflow run:

- Returns `{ runId, readable }`
- `runId` uniquely identifies this run for resumption
- `readable` is a `ReadableStream` of UI message chunks

**`getRun(runId)`**

Gets an existing workflow run:

- Returns a run object with `getReadable({ startIndex? })`
- `startIndex` allows resuming from a specific chunk

### Response Headers

The `x-workflow-run-id` header is critical for resumability:

```typescript
return createUIMessageStreamResponse({
	stream: run.readable,
	headers: {
		"x-workflow-run-id": run.runId,
	},
});
```

The client captures this header and uses it for reconnection.

### Authorization

Both endpoints verify:

1. User is authenticated (session exists)
2. User owns the chat (`ensureChatExists` / `verifyChatOwnership`)

This prevents unauthorized access to other users' workflow streams.

---

## Workflow Client Integration

The client uses `WorkflowChatTransport` for automatic stream resumption.

### Resumable Chat Hook

**Install via shadcn registry:**

```bash
bunx --bun shadcn@latest add https://fullstackrecipes.com/r/use-resumable-chat.json
```

**Or copy the source code:**

`hooks/use-resumable-chat.ts`:

```typescript
"use client";

import { useChat } from "@ai-sdk/react";
import { WorkflowChatTransport } from "@workflow/ai";
import { v7 as uuidv7 } from "uuid";
import type { ChatAgentUIMessage } from "@/workflows/chat/types";
import { useRef } from "react";

interface UseResumableChatOptions {
	chatId: string;
	messageHistory: ChatAgentUIMessage[];
	/** Initial workflow run ID for resuming an interrupted stream */
	initialRunId?: string;
}

/**
 * Custom hook that wraps useChat with WorkflowChatTransport for resumable streaming.
 *
 * Uses useStateRef to track the active workflow run ID, enabling automatic
 * reconnection to interrupted streams without stale closure issues.
 */
export function useResumableChat({ chatId, messageHistory, initialRunId }: UseResumableChatOptions) {
	const activeRunIdRef = useRef<string | undefined>(initialRunId);

	const chatResult = useChat<ChatAgentUIMessage>({
		messages: messageHistory,
		resume: !!initialRunId,
		transport: new WorkflowChatTransport({
			// Send new messages
			prepareSendMessagesRequest: ({ messages }) => ({
				api: `/api/chats/${chatId}/messages`,
				body: {
					chatId,
					message: messages[messages.length - 1],
				},
			}),

			// Store the workflow run ID when a message is sent
			onChatSendMessage: (response) => {
				const workflowRunId = response.headers.get("x-workflow-run-id");
				if (workflowRunId) {
					activeRunIdRef.current = workflowRunId;
				}
			},

			// Configure reconnection to use the ref for the latest value
			prepareReconnectToStreamRequest: ({ api, ...rest }) => {
				const currentRunId = activeRunIdRef.current;
				if (!currentRunId) {
					throw new Error("No active workflow run ID found for reconnection");
				}
				return {
					...rest,
					api: `/api/chats/${chatId}/messages/${encodeURIComponent(currentRunId)}/stream`,
				};
			},

			// Clear the workflow run ID when the chat stream ends
			onChatEnd: () => {
				activeRunIdRef.current = undefined;
			},

			// Retry up to 5 times on reconnection errors
			maxConsecutiveErrors: 5,
		}),
		id: chatId,
		generateId: () => uuidv7(),
	});

	return {
		...chatResult,
	};
}
```

Create the hook:

```typescript
// src/hooks/use-resumable-chat.ts
"use client";

import { useChat } from "@ai-sdk/react";
import { WorkflowChatTransport } from "@workflow/ai";
import { v7 as uuidv7 } from "uuid";
import type { ChatAgentUIMessage } from "@/workflows/chat/types";
import { useRef } from "react";

interface UseResumableChatOptions {
	chatId: string;
	messageHistory: ChatAgentUIMessage[];
	/** Initial workflow run ID for resuming an interrupted stream */
	initialRunId?: string;
}

/**
 * Custom hook that wraps useChat with WorkflowChatTransport for resumable streaming.
 *
 * Uses useStateRef to track the active workflow run ID, enabling automatic
 * reconnection to interrupted streams without stale closure issues.
 */
export function useResumableChat({ chatId, messageHistory, initialRunId }: UseResumableChatOptions) {
	const activeRunIdRef = useRef<string | undefined>(initialRunId);

	const chatResult = useChat<ChatAgentUIMessage>({
		messages: messageHistory,
		resume: !!initialRunId,
		transport: new WorkflowChatTransport({
			// Send new messages
			prepareSendMessagesRequest: ({ messages }) => ({
				api: `/api/chats/${chatId}/messages`,
				body: {
					chatId,
					message: messages[messages.length - 1],
				},
			}),

			// Store the workflow run ID when a message is sent
			onChatSendMessage: (response) => {
				const workflowRunId = response.headers.get("x-workflow-run-id");
				if (workflowRunId) {
					activeRunIdRef.current = workflowRunId;
				}
			},

			// Configure reconnection to use the ref for the latest value
			prepareReconnectToStreamRequest: ({ api, ...rest }) => {
				const currentRunId = activeRunIdRef.current;
				if (!currentRunId) {
					throw new Error("No active workflow run ID found for reconnection");
				}
				return {
					...rest,
					api: `/api/chats/${chatId}/messages/${encodeURIComponent(currentRunId)}/stream`,
				};
			},

			// Clear the workflow run ID when the chat stream ends
			onChatEnd: () => {
				activeRunIdRef.current = undefined;
			},

			// Retry up to 5 times on reconnection errors
			maxConsecutiveErrors: 5,
		}),
		id: chatId,
		generateId: () => uuidv7(),
	});

	return {
		...chatResult,
	};
}
```

### Chat Page with Resumption Detection

Create or update the chat page with resumption detection:

```typescript
// src/app/chats/[chatId]/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Chat } from "@/components/chat/chat";
import {
  convertDbMessagesToUIMessages,
  ensureChatExists,
  getChatMessages,
} from "@/lib/chat/queries";
import { auth } from "@/lib/auth/server";
import { UserMenu } from "@/components/auth/user-menu";
import { ThemeSelector } from "@/components/themes/selector";

export const metadata: Metadata = {
  title: "Chat",
  description: "Continue your AI-powered conversation.",
};

interface PageProps {
  params: Promise<{
    chatId: string;
  }>;
}

export default async function ChatPage({ params }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { chatId } = await params;
  const userId = session.user.id;

  const isAuthorized = await ensureChatExists(chatId, userId);
  if (!isAuthorized) {
    redirect("/");
  }

  // Fetch all messages for this chat
  const persistedMessages = await getChatMessages(chatId);

  // Check if the last message is an incomplete assistant message (has runId but no parts)
  // This happens when a workflow was interrupted mid-stream
  const lastMessage = persistedMessages.at(-1);
  const isIncompleteMessage =
    lastMessage?.role === "assistant" &&
    lastMessage?.runId &&
    lastMessage?.parts.length === 0;

  // If incomplete, extract the runId for resumption and remove the empty message from history
  const initialRunId = isIncompleteMessage ? lastMessage.runId : undefined;
  const messagesToConvert = isIncompleteMessage
    ? persistedMessages.slice(0, -1)
    : persistedMessages;

  const history = convertDbMessagesToUIMessages(messagesToConvert);

  return (
    <div className="h-dvh bg-gradient-to-b from-background via-background to-muted/20 grid grid-rows-[auto_1fr]">
      <header className="z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/chats"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only text-sm font-medium">
                Back to chats
              </span>
            </Link>
            <span className="text-border hidden sm:inline">|</span>
            <span className="hidden sm:block font-mono text-lg font-semibold tracking-tight">
              AI Chat
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSelector />
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="min-h-0 overflow-hidden">
        <Chat
          messageHistory={history}
          chatId={chatId}
          initialRunId={initialRunId ?? undefined}
        />
      </main>
    </div>
  );
}
```

### How Resumption Detection Works

1. **On page load**, fetch all messages for the chat
2. **Check last message** - if it's an assistant message with `runId` but no parts, it's incomplete
3. **Extract `runId`** - pass to client for resumption
4. **Remove empty message** - don't show the incomplete message in UI
5. **Client resumes** - `WorkflowChatTransport` reconnects using the `runId`

### WorkflowChatTransport Options

| Option | Description |
| `prepareSendMessagesRequest` | Configure the initial message send request |
| `onChatSendMessage` | Callback when message is sent (capture `runId`) |
| `prepareReconnectToStreamRequest` | Configure reconnection request URL |
| `onChatEnd` | Callback when stream completes |
| `maxConsecutiveErrors` | Number of reconnection retries |

### Using the Hook in Components

```tsx
"use client";

import { useResumableChat } from "@/hooks/use-resumable-chat";

export function Chat({ chatId, messageHistory, initialRunId }) {
	const { messages, sendMessage, status } = useResumableChat({
		chatId,
		messageHistory,
		initialRunId,
	});

	// Render messages and input...
}
```

---

## Custom Durable Agent

Build a custom durable AI agent with full control over streamText options, provider configs, and tool loops. Compatible with the Workflow Development Kit.

## Why a Custom Agent?

The built-in [`DurableAgent`](https://useworkflow.dev/docs/api-reference/workflow-ai/durable-agent) from `@workflow/ai/agent` covers most use cases. This custom agent is needed when:

1. **Streaming reasoning/sources** - `DurableAgent` doesn't expose `sendReasoning` or `sendSources` options
2. **UIMessage persistence** - `DurableAgent.onFinish` provides `ModelMessage[]`, but this agent provides `UIMessage` with its `parts` array directly via `toUIMessageStream().onFinish`

## How It Works

The `Agent` class wraps the AI SDK's `streamText` with a tool loop. It uses `toUIMessageStream()` internally to capture `responseMessage: UIMessage` in each step.

Key design decisions:

1. **Serializable config** - Tool functions are referenced by key and resolved inside the step executor
2. **Standalone step executor** - The `"use step"` directive only works in standalone functions, not class methods

## Defining an Agent

**Install via shadcn registry:**

```bash
bunx --bun shadcn@latest add https://fullstackrecipes.com/r/durable-agent.json
```

**Or copy the source code:**

`lib/ai/agent.ts`:

````typescript
import {
	streamText,
	convertToModelMessages,
	type FinishReason,
	type UIMessage,
	type UIMessageChunk,
	type ModelMessage,
} from "ai";
import type { ProviderOptions } from "@ai-sdk/provider-utils";
import { researchTools, draftingTools } from "./tools";

type MessagePart = UIMessage["parts"][number];

export type ToolsKey = "research" | "drafting";

const toolSets = {
	research: researchTools,
	drafting: draftingTools,
} as const;

/**
 * Serializable stream options (excludes callbacks like onFinish).
 */
export interface StreamOptions {
	sendStart?: boolean;
	sendFinish?: boolean;
	sendReasoning?: boolean;
	sendSources?: boolean;
}

/**
 * Serializable options for streamText (excludes callbacks and messages).
 */
export interface StepOptions {
	model: string;
	system: string;
	/** Tool set key - resolved to actual tools inside the step executor */
	tools: ToolsKey;
	providerOptions?: ProviderOptions;
}

/**
 * All properties must be serializable for workflow compatibility.
 */
export interface AgentConfig {
	stepOptions: StepOptions;
	streamOptions?: StreamOptions;
}

export interface AgentRunConfig {
	/** @default 20 */
	maxSteps?: number;
	/** Pass getWritable() in workflows, or any WritableStream outside */
	writable?: WritableStream<UIMessageChunk>;
}

export interface AgentRunResult {
	parts: MessagePart[];
	stepCount: number;
}

interface AgentStepResult {
	shouldContinue: boolean;
	responseMessage: UIMessage;
	finishReason: FinishReason;
}

interface StepExecutorConfig {
	stepOptions: StepOptions;
	streamOptions?: StreamOptions;
	writable?: WritableStream<UIMessageChunk>;
}

/**
 * AI agent that executes streamText in a tool loop.
 *
 * Configuration is fully serializable for workflow compatibility.
 * Tools are referenced by key and resolved inside the step executor.
 *
 * @example
 * ```ts
 * const draftingAgent = new Agent({
 *   stepOptions: {
 *     model: "google/gemini-3-pro-preview",
 *     system: "You are a drafting agent...",
 *     tools: "drafting",
 *   },
 *   streamOptions: { sendReasoning: true },
 * });
 *
 * const { parts } = await draftingAgent.run(history, {
 *   maxSteps: 10,
 *   writable: getWritable(),
 * });
 * ```
 */
export class Agent {
	constructor(private config: AgentConfig) {}

	async run(history: UIMessage[], runConfig: AgentRunConfig = {}): Promise<AgentRunResult> {
		const { maxSteps = 20, writable } = runConfig;

		const stepConfig: StepExecutorConfig = {
			stepOptions: this.config.stepOptions,
			streamOptions: this.config.streamOptions,
			writable,
		};

		let modelMessages: ModelMessage[] = await convertToModelMessages(history);
		let stepCount = 0;
		let shouldContinue = true;
		let allParts: MessagePart[] = [];

		while (shouldContinue && stepCount < maxSteps) {
			const result = await executeAgentStep(modelMessages, stepConfig);

			allParts = [...allParts, ...result.responseMessage.parts];
			modelMessages = [...modelMessages, ...(await convertToModelMessages([result.responseMessage]))];

			shouldContinue = result.shouldContinue;
			stepCount++;
		}

		return { parts: allParts, stepCount };
	}
}

/**
 * Step executor with "use step" directive.
 * Separated from class because "use step" only works in standalone functions.
 * @internal
 */
async function executeAgentStep(messages: ModelMessage[], config: StepExecutorConfig): Promise<AgentStepResult> {
	"use step";

	const tools = toolSets[config.stepOptions.tools];

	const resultStream = streamText({
		model: config.stepOptions.model,
		system: config.stepOptions.system,
		tools,
		messages,
		providerOptions: config.stepOptions.providerOptions,
	});

	let responseMessage: UIMessage | null = null;

	const uiStream = resultStream.toUIMessageStream({
		sendStart: config.streamOptions?.sendStart ?? false,
		sendFinish: config.streamOptions?.sendFinish ?? false,
		sendReasoning: config.streamOptions?.sendReasoning ?? false,
		sendSources: config.streamOptions?.sendSources ?? false,
		onFinish: ({ responseMessage: msg }) => {
			responseMessage = msg;
		},
	});

	if (config.writable) {
		await pipeToWritable(uiStream, config.writable);
	} else {
		await consumeStream(uiStream);
	}

	await resultStream.consumeStream();
	const finishReason = await resultStream.finishReason;

	if (!responseMessage) {
		throw new Error("No response message received from stream");
	}

	const shouldContinue = finishReason === "tool-calls";

	return { shouldContinue, responseMessage, finishReason };
}

async function consumeStream<T>(stream: ReadableStream<T>): Promise<void> {
	const reader = stream.getReader();
	try {
		while (true) {
			const { done } = await reader.read();
			if (done) break;
		}
	} finally {
		reader.releaseLock();
	}
}

async function pipeToWritable<T>(readable: ReadableStream<T>, writable: WritableStream<T>): Promise<void> {
	const writer = writable.getWriter();
	const reader = readable.getReader();

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			await writer.write(value);
		}
	} finally {
		reader.releaseLock();
		writer.releaseLock();
	}
}

export function createAgent(config: AgentConfig): Agent {
	return new Agent(config);
}
````

Create the agent class:

````typescript
// src/lib/ai/agent.ts
import {
	streamText,
	convertToModelMessages,
	type FinishReason,
	type UIMessage,
	type UIMessageChunk,
	type ModelMessage,
} from "ai";
import type { ProviderOptions } from "@ai-sdk/provider-utils";
import { researchTools, draftingTools } from "./tools";
import { aiConfig } from "./config";

type MessagePart = UIMessage["parts"][number];

export type ToolsKey = "research" | "drafting";

const toolSets = {
	research: researchTools,
	drafting: draftingTools,
} as const;

/**
 * Serializable stream options (excludes callbacks like onFinish).
 */
export interface StreamOptions {
	sendStart?: boolean;
	sendFinish?: boolean;
	sendReasoning?: boolean;
	sendSources?: boolean;
}

/**
 * Serializable options for streamText (excludes callbacks and messages).
 */
export interface StepOptions {
	model: string;
	system: string;
	/** Tool set key - resolved to actual tools inside the step executor */
	tools: ToolsKey;
	providerOptions?: ProviderOptions;
}

/**
 * All properties must be serializable for workflow compatibility.
 */
export interface AgentConfig {
	stepOptions: StepOptions;
	streamOptions?: StreamOptions;
}

export interface AgentRunConfig {
	/** @default 20 */
	maxSteps?: number;
	/** Pass getWritable() in workflows, or any WritableStream outside */
	writable?: WritableStream<UIMessageChunk>;
}

export interface AgentRunResult {
	parts: MessagePart[];
	stepCount: number;
}

interface AgentStepResult {
	shouldContinue: boolean;
	responseMessage: UIMessage;
	finishReason: FinishReason;
}

interface StepExecutorConfig {
	stepOptions: StepOptions;
	streamOptions?: StreamOptions;
	writable?: WritableStream<UIMessageChunk>;
}

/**
 * AI agent that executes streamText in a tool loop.
 *
 * Configuration is fully serializable for workflow compatibility.
 * Tools are referenced by key and resolved inside the step executor.
 *
 * @example
 * ```ts
 * const draftingAgent = new Agent({
 *   stepOptions: {
 *     model: "gpt-4o",
 *     system: "You are a drafting agent...",
 *     tools: "drafting",
 *   },
 *   streamOptions: { sendReasoning: true },
 * });
 *
 * const { parts } = await draftingAgent.run(history, {
 *   maxSteps: 10,
 *   writable: getWritable(),
 * });
 * ```
 */
export class Agent {
	constructor(private config: AgentConfig) {}

	async run(history: UIMessage[], runConfig: AgentRunConfig = {}): Promise<AgentRunResult> {
		const { maxSteps = 20, writable } = runConfig;

		const stepConfig: StepExecutorConfig = {
			stepOptions: this.config.stepOptions,
			streamOptions: this.config.streamOptions,
			writable,
		};

		let modelMessages: ModelMessage[] = await convertToModelMessages(history);
		let stepCount = 0;
		let shouldContinue = true;
		let allParts: MessagePart[] = [];

		while (shouldContinue && stepCount < maxSteps) {
			const result = await executeAgentStep(modelMessages, stepConfig);

			allParts = [...allParts, ...result.responseMessage.parts];
			modelMessages = [...modelMessages, ...(await convertToModelMessages([result.responseMessage]))];

			shouldContinue = result.shouldContinue;
			stepCount++;
		}

		return { parts: allParts, stepCount };
	}
}

/**
 * Step executor with "use step" directive.
 * Separated from class because "use step" only works in standalone functions.
 * @internal
 */
async function executeAgentStep(messages: ModelMessage[], config: StepExecutorConfig): Promise<AgentStepResult> {
	"use step";

	const tools = toolSets[config.stepOptions.tools];

	const resultStream = streamText({
		model: aiConfig.getModel(config.stepOptions.model),
		system: config.stepOptions.system,
		tools,
		messages,
		providerOptions: config.stepOptions.providerOptions,
	});

	let responseMessage: UIMessage | null = null;

	const uiStream = resultStream.toUIMessageStream({
		sendStart: config.streamOptions?.sendStart ?? false,
		sendFinish: config.streamOptions?.sendFinish ?? false,
		sendReasoning: config.streamOptions?.sendReasoning ?? false,
		sendSources: config.streamOptions?.sendSources ?? false,
		onFinish: ({ responseMessage: msg }) => {
			responseMessage = msg;
		},
	});

	if (config.writable) {
		await pipeToWritable(uiStream, config.writable);
	} else {
		await consumeStream(uiStream);
	}

	await resultStream.consumeStream();
	const finishReason = await resultStream.finishReason;

	if (!responseMessage) {
		throw new Error("No response message received from stream");
	}

	const shouldContinue = finishReason === "tool-calls";

	return { shouldContinue, responseMessage, finishReason };
}

async function consumeStream<T>(stream: ReadableStream<T>): Promise<void> {
	const reader = stream.getReader();
	try {
		while (true) {
			const { done } = await reader.read();
			if (done) break;
		}
	} finally {
		reader.releaseLock();
	}
}

async function pipeToWritable<T>(readable: ReadableStream<T>, writable: WritableStream<T>): Promise<void> {
	const writer = writable.getWriter();
	const reader = readable.getReader();

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			await writer.write(value);
		}
	} finally {
		reader.releaseLock();
		writer.releaseLock();
	}
}

export function createAgent(config: AgentConfig): Agent {
	return new Agent(config);
}
````

## Creating Agent Instances

Create specialized agents with different configurations:

```typescript
// src/lib/ai/chat-agent.ts
import { Agent } from "./agent";

export const chatAgent = new Agent({
	stepOptions: {
		model: "gpt-4o",
		system: `You are a helpful AI assistant. You can help users with a variety of tasks including research and drafting content.

When users ask you to research something, use your available tools to search for information.
When users ask you to draft content, use your drafting tools to save documents.

Be concise but thorough in your responses.`,
		tools: "research",
	},
	streamOptions: {
		sendReasoning: false,
		sendSources: false,
	},
});
```

For specialized agents with provider options:

```typescript
// src/lib/ai/research-agent.ts
import { Agent } from "./agent";

export const researchAgent = new Agent({
	stepOptions: {
		model: "google/gemini-3-pro-preview",
		system: "You are a research agent...",
		tools: "research",
		providerOptions: {
			google: {
				thinkingConfig: {
					thinkingBudget: 8000,
					includeThoughts: true,
				},
			},
		},
	},
	streamOptions: {
		sendReasoning: true,
		sendSources: true,
	},
});
```

## Running in a Workflow

```typescript
import { getWorkflowMetadata, getWritable } from "workflow";
import { chatAgent } from "@/lib/ai/chat-agent";

export async function chatWorkflow({ chatId, userMessage }) {
	"use workflow";

	const { workflowRunId } = getWorkflowMetadata();

	// Persist user message, create assistant placeholder
	await persistUserMessage({ chatId, message: userMessage });
	const messageId = await createAssistantMessage({
		chatId,
		runId: workflowRunId,
	});

	// Get full message history
	const history = await getMessageHistory(chatId);

	// Run the agent with streaming
	const { parts } = await chatAgent.run(history, {
		maxSteps: 10,
		writable: getWritable(),
	});

	// Persist the assistant message parts
	await persistMessageParts({ chatId, messageId, parts });

	// Clear the runId to mark the message as complete
	await removeRunId(messageId);
}
```

## Running Outside a Workflow

The agent works outside workflows too - useful for testing or non-durable contexts:

```typescript
import { chatAgent } from "@/lib/ai/chat-agent";

// Option 1: Just get the parts (no streaming)
const { parts, stepCount } = await chatAgent.run(history);
console.log(`Completed in ${stepCount} steps`);

// Option 2: Stream to a custom writable
const chunks: UIMessageChunk[] = [];
const writable = new WritableStream({
	write(chunk) {
		chunks.push(chunk);
		if (chunk.type === "text-delta") {
			process.stdout.write(chunk.textDelta);
		}
	},
});

await chatAgent.run(history, { writable });
```

## When to Use Each

**Use `DurableAgent`** for most use cases - it's simpler and provides inline tool definitions, callbacks, and `prepareStep`.

**Use this custom agent** when you need `sendReasoning`/`sendSources` streaming or direct `UIMessage` format for persistence.

## Key Implementation Details

### Why Tools Are Referenced by Key

Workflow runtimes serialize step inputs/outputs. Function references can't be serialized, so tools are stored in a `toolSets` object and looked up by key inside the step executor:

```typescript
const toolSets = {
	research: researchTools,
	drafting: draftingTools,
} as const;

// Inside executeAgentStep:
const tools = toolSets[config.stepOptions.tools];
```

### Why the Step Executor Is Separate

The `"use step"` directive only works in standalone functions, not class methods. The step executor is extracted from the class:

```typescript
// This works:
async function executeAgentStep(...) {
  "use step";
  // ...
}

// This does NOT work:
class Agent {
  async executeStep(...) {
    "use step"; // Error: directive not supported in methods
  }
}
```

### Tool Loop Logic

The agent continues executing steps until the model stops making tool calls:

```typescript
while (shouldContinue && stepCount < maxSteps) {
	const result = await executeAgentStep(modelMessages, stepConfig);
	// ...
	shouldContinue = result.finishReason === "tool-calls";
	stepCount++;
}
```

## See Also

- [Resumable AI Streams](/recipes/resumable-ai-streams) - Full recipe using this agent
- [DurableAgent Documentation](https://useworkflow.dev/docs/api-reference/workflow-ai/durable-agent) - Built-in alternative
- [AI SDK streamText](https://ai-sdk.dev/docs/ai-sdk-core/generating-text#streamtext) - Underlying streaming API

---

## Working with Workflows

Create and run durable workflows with steps, streaming, and agent execution. Covers starting, resuming, and persisting workflow results.

## Working with Workflows

Create and run durable workflows with steps, streaming, and agent execution. Covers starting, resuming, and persisting workflow results.

**See:**

- Resource: `using-workflows` in Fullstack Recipes
- URL: https://fullstackrecipes.com/recipes/using-workflows

---

### Workflow Folder Structure

Each workflow has its own subfolder in `src/workflows/`:

```plain
src/workflows/
  chat/
    index.ts       # Workflow orchestration function ("use workflow")
    steps/         # Step functions ("use step")
      history.ts
      logger.ts
      name-chat.ts
    types.ts       # Workflow-specific types
```

- **`index.ts`** - Contains the main workflow function with the `"use workflow"` directive. Orchestrates the workflow by calling step functions.
- **`steps/`** - Contains individual step functions with the `"use step"` directive. Each step is a durable checkpoint.
- **`types.ts`** - Type definitions for the workflow's UI messages.

---

### Creating a Workflow

Define workflows with the `"use workflow"` directive:

```typescript
// src/workflows/chat/index.ts
import { getWorkflowMetadata, getWritable } from "workflow";
import { chatAgent } from "@/lib/ai/chat-agent";

export async function chatWorkflow({ chatId, userMessage }) {
	"use workflow";

	const { workflowRunId } = getWorkflowMetadata();

	// Persist user message
	await persistUserMessage({ chatId, message: userMessage });

	// Create assistant placeholder with runId for resumption
	const messageId = await createAssistantMessage({
		chatId,
		runId: workflowRunId,
	});

	// Get message history
	const history = await getMessageHistory(chatId);

	// Run agent with streaming
	const { parts } = await chatAgent.run(history, {
		maxSteps: 10,
		writable: getWritable(),
	});

	// Persist and finalize
	await persistMessageParts({ chatId, messageId, parts });
	await removeRunId(messageId);
}
```

### Starting a Workflow

Use the `start` function from `workflow/api`:

```typescript
import { start } from "workflow/api";
import { chatWorkflow } from "@/workflows/chat";

const run = await start(chatWorkflow, [{ chatId, userMessage }]);

// run.runId - unique identifier for this run
// run.readable - stream of UI message chunks
```

### Resuming a Workflow Stream

Use `getRun` to reconnect to an in-progress or completed workflow:

```typescript
import { getRun } from "workflow/api";

const run = await getRun(runId);
const readable = await run.getReadable({ startIndex });
```

### Using Steps

Steps are durable checkpoints that persist their results:

```typescript
async function getMessageHistory(chatId: string) {
	"use step";

	const dbMessages = await getChatMessages(chatId);
	return convertDbMessagesToUIMessages(dbMessages);
}
```

### Streaming from Workflows

Use `getWritable()` to stream data to clients:

```typescript
import { getWritable } from "workflow";

export async function chatWorkflow({ chatId }) {
	"use workflow";

	const writable = getWritable();

	// Pass to agent for streaming
	await chatAgent.run(history, { writable });
}
```

### Getting Workflow Metadata

Access the current run's metadata:

```typescript
import { getWorkflowMetadata } from "workflow";

export async function chatWorkflow({ chatId }) {
	"use workflow";

	const { workflowRunId } = getWorkflowMetadata();

	// Store runId for resumption
	await createAssistantMessage({ chatId, runId: workflowRunId });
}
```

### Workflow-Safe Logging

The workflow runtime doesn't support Node.js modules. Wrap logger calls in steps:

```typescript
// src/workflows/chat/steps/logger.ts
import { logger } from "@/lib/logging/logger";

export async function log(
	level: "info" | "warn" | "error" | "debug",
	message: string,
	data?: Record<string, unknown>,
): Promise<void> {
	"use step";

	if (data) {
		logger[level](data, message);
	} else {
		logger[level](message);
	}
}
```

### Running Agents in Workflows

Use the custom `Agent` class for full streaming control:

```typescript
import { getWritable } from "workflow";
import { chatAgent } from "@/lib/ai/chat-agent";

export async function chatWorkflow({ chatId, userMessage }) {
	"use workflow";

	const history = await getMessageHistory(chatId);

	const { parts } = await chatAgent.run(history, {
		maxSteps: 10,
		writable: getWritable(),
	});

	await persistMessageParts({ chatId, messageId, parts });
}
```

### Persisting Workflow Results

Save agent output using step functions. The `assertChatAgentParts` function validates that generic `UIMessage["parts"]` (returned by agents) match your application's specific tool and data types:

```typescript
// src/workflows/chat/steps/history.ts
import type { UIMessage } from "ai";
import { insertMessageParts } from "@/lib/chat/queries";
import { assertChatAgentParts, type ChatAgentUIMessage } from "../types";

export async function persistMessageParts({
	chatId,
	messageId,
	parts,
}: {
	chatId: string;
	messageId: string;
	parts: UIMessage["parts"];
}): Promise<void> {
	"use step";

	assertChatAgentParts(parts);

	await insertMessageParts(chatId, messageId, parts);

	// Update chat timestamp
	await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, chatId));
}
```

---

## References

- [Workflow Development Kit](https://useworkflow.dev/docs)
- [Workflow API Reference](https://useworkflow.dev/docs/api-reference)
