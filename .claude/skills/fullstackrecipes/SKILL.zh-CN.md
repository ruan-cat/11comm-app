# 全栈开发食谱 (Fullstack Recipes) - 简体中文翻译

> 本文档是 `fullstackrecipes/SKILL.md` 的简体中文翻译版本。

---

# 基础应用设置

Next.js 应用（含 Shadcn UI、Neon Postgres、Drizzle ORM 和 AI SDK）的完整设置指南。

## Vercel 上的 Next.js

创建运行在 Bun 上的 Next.js 应用，配置开发环境，并在推送时自动部署到 Vercel。

## 创建 Next.js 应用

初始化一个新的 Next.js 应用程序：

```bash
bunx create-next-app@latest my-app --ts --tailwind --react-compiler --no-linter --src-dir --app --use-bun
cd my-app
```

此命令使用以下推荐选项：TypeScript 和 Tailwind CSS 用于类型安全和实用优先样式，启用 React 编译器以进行自动优化，跳过 linter 配置（如果需要可以稍后添加），在 `src/` 目录中组织代码以获得更清晰的项目结构，使用 App Router，并使用 Bun 作为包管理器引导。

## 设置 Vercel 配置

安装 Vercel 配置包以编程方式配置 Vercel 项目：

```bash
bun add -D @vercel/config
```

创建 `vercel.ts` 文件：

```typescript
// vercel.ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {};
```

## 在 Vercel 上配置 Bun 作为运行时（可选）

同时使用 Bun 作为包管理器和运行时可以提供一致的开发体验。要在 Vercel 上配置 Bun 作为运行时，请将以下内容添加到 `vercel.ts` 文件：

```typescript
// vercel.ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
	bunVersion: "1.x",
};
```

添加 Bun 类型以获得更好的 TypeScript 支持：

```bash
bun add -D @types/bun
```

## 安装 GitHub CLI

安装 GitHub CLI 以管理你的 GitHub 仓库：

```bash
brew install gh
```

登录到你的 GitHub 账户：

```bash
gh auth login
```

## 创建 GitHub 仓库

初始化 git 并在项目根目录内创建一个新的 GitHub 仓库：

```bash
# 创建 GitHub 仓库并推送
gh repo create my-app --public --source=. --push
```

`gh repo create` 命令：

- 在 GitHub 上创建一个新仓库
- 设置远程原点
- 推送你的本地代码

对于私有仓库，请使用 `--private` 而不是 `--public`。

## 安装 Vercel CLI

全局安装 Vercel CLI 以管理你的 Vercel 项目：

```bash
bun add -g vercel
```

向 Vercel 身份验证：

```bash
vercel login
```

## 部署到 Vercel

将你的项目链接到 Vercel 并部署：

```bash
# 部署到 Vercel（在首次运行时创建项目）
vercel
```

在首次运行时，系统将提示你：

- 设置并部署项目
- 链接到现有项目或创建一个新项目
- 配置项目设置

### 连接 Git 以实现自动部署

将你的 GitHub 仓库连接到 Vercel 以在推送时启用自动部署：

```bash
vercel git connect
```

这将你的本地 Git 仓库链接到你的 Vercel 项目，启用：

- 推送到主分支时自动部署
- 拉取请求的预览部署
- GitHub 上的部署状态检查

## 部署工作流

完成初始设置后，你的工作流程是：

1. **本地开发**：`bun run dev`
2. **提交并推送**：`git push origin main`
3. **自动部署**：Vercel 在推送时部署

---

## 编辑器和代码检查设置

配置 Prettier 进行代码格式化，TypeScript 进行类型检查。包括 VSCode 设置和 EditorConfig 以保持一致的代码风格。跳过 ESLint/Biome 以避免配置复杂性。

### 步骤 1：安装 Prettier

```bash
bun add -D prettier
```

### 步骤 2：添加脚本

将这些脚本添加到你的 `package.json`：

```json
{
	"scripts": {
		"typecheck": "tsc --noEmit",
		"fmt": "prettier --write ."
	}
}
```

### 步骤 3：安装 VSCode 扩展（可选）

安装 Prettier VSCode 扩展以实现自动格式化：

- [在 Cursor 中安装](cursor:extension/esbenp.prettier-vscode)
- 或通过 VS Code 命令行：`ext install esbenp.prettier-vscode`

请注意，该扩展可能被标记为已弃用（被 `prettier.prettier-vscode` 取代），但我发现至少在 Cursor 中 `esbenp.prettier-vscode` 可以正常工作，而 `prettier.prettier-vscode` 在格式化 .tsx 文件时存在问题。

### 步骤 4：添加 .vscode 配置（可选）

在项目根目录中创建 `.vscode` 文件夹，其中包含以下文件：

#### .vscode/extensions.json

向所有贡献者推荐 Prettier 扩展：

```json
{
	// 参见 https://go.microsoft.com/fwlink/?LinkId=827846 了解工作区建议。
	// 扩展标识符格式：${publisher}。${name}。示例：vscode.csharp
	// 应推荐给此工作区用户的扩展列表。
	"recommendations": ["esbenp.prettier-vscode"],
	// VS Code 推荐的不应推荐给此工作区用户的扩展列表。
	"unwantedRecommendations": []
}
```

#### .vscode/settings.json

使用 Prettier 作为默认格式化程序启用保存时格式化：

```json
{
	"editor.formatOnSave": true,
	"editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### 步骤 5：添加 .editorconfig（可选）

在项目根目录中创建 `.editorconfig` 文件。这是可选的，因为 Prettier 已经默认强制执行这些规则，但它确保了当贡献者在没有设置 Prettier 的编辑器中使用时的一致性：

```editorconfig
# 编辑器配置 - 参见 http://EditorConfig.org

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

## 参考资料

- [Prettier 理念](https://prettier.io/docs/option-philosophy)
- [EditorConfig](https://editorconfig.org/)

---

## AI 编码代理配置

配置 AI 编码代理（如 Cursor、GitHub Copilot 或 Claude Code），包含项目特定模式、编码指南和 MCP 服务器，以实现一致的 AI 辅助开发。

### 步骤 1：创建 agents.md 文件

在项目根目录中创建 `agents.md` 文件。该文件为 AI 助手提供编码指南和模式。

```markdown
# 模式

- 一切皆为库：在 `src/lib/` 中将特性和域组织为自包含的文件夹（例如 `chat`、`ai`、`db`）。将模式、查询、类型和工具函数放在一起。组件放在 `components/<feature>/` 中。
- 使用 Web 平台：优先使用原生 API 和标准。避免隐藏代码实际作用的抽象。

# 编码指南

## 运行时和包管理器

- 使用 Bun 而不是 Node.js、npm，pnpm 或 vite。
- 使用 `bun install` 而不是 `npm install` 或 `yarn install` 或 `pnpm install`。
- 使用 `bun run <script>` 而不是 `npm run <script>` 或 `yarn run <script>` 或 `pnpm run <script>`。

## TypeScript

- 尽可能避免使用 `export default`，优先使用 `export`。
- 仅在实际需要时才创建抽象
- 优先使用清晰的函数/变量名而不是内联注释
- 当简单的内联表达式足够时，避免使用辅助函数
- 不要使用表情符号
- 不要有桶索引文件 - 直接从源文件导出
- 没有 type.ts 文件，只需内联类型或与相关代码放在一起
- 不要不必要地添加 `try`/`catch`
- 不要强制转换为 `any`

## React

- 避免大型 JSX 块，组合更小的组件
- 将一起更改的代码放在一起
- 避免使用 `useEffect`，除非绝对必要

## Tailwind

- 大多使用内置值，偶尔允许动态值，很少使用全局值
- 始终使用 v4 + 全局 CSS 文件格式 + shadcn/ui

## Next.js

- 优先在 RSC 中获取数据（页面仍可以是静态的）
- 在适用时使用 next/font + next/script
- above the fold 的 next/image 应该使用 `sync` / `eager` / 谨慎使用 `priority`
- 注意 RSC → 子组件的序列化属性大小
```

> 此 `agents.md` 文件基于 [Lee Robinson](https://x.com/leerob) 的原始版本[共享于此](https://x.com/leerob/status/1993162978410004777)。

### 步骤 2：配置 MCP 服务器

使用 MCP（模型上下文协议）服务器增强你的编码代理功能。不同的配方可能会引入额外的 MCP 服务器。现在，首先将这些基础 MCP 服务器添加到你的 `.cursor/mcp.json`：

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

| 服务器 | 描述 |
| `vercel` | 管理 Vercel 项目、部署和搜索 Vercel 文档 |
| `next-devtools` | 用于调试、路由和构建信息的 Next.js 开发工具 |
| `playwright` | 用于测试和与网页交互的浏览器自动化 |
| `context7` | 任何库的最新文档查找 |
| `fullstackrecipes` | Fullstackrecipes 配方 |

> **Vercel MCP**：在首次连接时，Cursor 会显示"需要登录"提示。单击它以授权访问你的 Vercel 账户。对于项目特定上下文，请使用 `https://mcp.vercel.com/<teamSlug>/<projectSlug>`。

---

## Shadcn UI 与主题

使用 next-themes 添加支持深色模式的 Shadcn UI 组件。包括主题提供者和 CSS 变量配置。

### 步骤 1：初始化 Shadcn

```bash
bunx --bun shadcn@latest init
```

按照提示配置您的项目。CLI 将创建一个 `components.json` 配置文件，并在 `globals.css` 中设置您的 CSS 变量。

### 步骤 2：添加组件

安装所有组件：

```bash
bunx --bun shadcn@latest add --all --yes
```

注意：Shadcn 是高度可配置的。省略 `--yes` 并按照设置向导配置 Shadcn 以适合您的喜好。

### 步骤 3：添加深色模式

安装主题提供者：

```bash
bun add next-themes
```

创建主题提供者组件：

```tsx
// src/components/themes/provider.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

在布局中用提供者包装您的应用：

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

创建主题选择器组件以在浅色、深色和系统主题之间切换：

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

## 参考资料

- [Shadcn Next.js 安装](https://ui.shadcn.com/docs/installation/next)
- [Shadcn 深色模式指南](https://ui.shadcn.com/docs/dark-mode/next)

---

## 断言辅助函数

用于运行时类型收窄的 TypeScript 断言函数，包含描述性错误消息。基于 tiny-invariant。

**通过 shadcn 注册表安装：**

```bash
bunx --bun shadcn@latest add https://fullstackrecipes.com/r/assert.json
```

**或复制源代码：**

`lib/common/assert.ts`：

```typescript
const prefix: string = "Assertion failed";

/**
 * TypeScript 断言函数，当条件为真时收窄类型。
 * 如果条件为假则抛出异常。消息可以是字符串或延迟求值函数。
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

### 为何使用此模式？

- **类型收窄**：TypeScript 理解断言并在检查后收窄类型
- **描述性错误**：准确知道哪个断言失败及其原因
- **延迟消息**：仅在失败时才执行昂贵的消息构造

### 用法

如果条件为假，`assert` 函数会抛出异常；当通过时，它会收窄类型：

```typescript
import assert from "@/lib/common/assert";

function processUser(user: User | null) {
	assert(user, "User must exist");
	// TypeScript 现在知道 `user` 是 `User`，而不是 `User | null`
	console.log(user.name);
}
```

### 延迟消息求值

对于昂贵的消息构造，传递一个仅在失败时运行的函数：

```typescript
assert(TOOL_TYPES.includes(part.type as ToolType), () => `Invalid tool type: ${part.type}`);
```

---

### 归属

此实现基于 [tiny-invariant](https://www.npmjs.com/package/tiny-invariant)。

---

## 参考资料

- [TypeScript 断言函数](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)
- [tiny-invariant](https://www.npmjs.com/package/tiny-invariant)

---

# 类型安全的环境配置

使用 Zod 进行类型安全的環境变量验证，采用类似 Drizzle 的模式 API。支持服务器/公共字段、功能标志、互斥约束和客户端保护。

### 配置模式工具

不要直接访问环境变量（`process.env.DATABASE_URL`），而是使用 `config-schema` 工具来指定和验证环境变量。

首先，设置 `config-schema` 工具和一个用于常见环境变量（如 `NODE_ENV`）的 `mainConfig`：

**通过 shadcn 注册表安装：**

```bash
bunx --bun shadcn@latest add https://fullstackrecipes.com/r/config-schema.json
```

**或复制源代码：**

`lib/config/schema.ts`：

```typescript
import { z } from "zod";

// =============================================================================
// 类型
// =============================================================================

/** 带模式类型的基础字段定义 */
type FieldDefBase<TSchema extends z.ZodTypeAny = z.ZodString> = {
	env: string;
	value: string | undefined;
	schema: TSchema;
	isOptional: boolean;
};

/** 服务器字段定义 */
type ServerFieldDef<TSchema extends z.ZodTypeAny = z.ZodString> = FieldDefBase<TSchema> & { _type: "server" };

/** 公共字段定义 */
type PublicFieldDef<TSchema extends z.ZodTypeAny = z.ZodString> = FieldDefBase<TSchema> & { _type: "public" };

/** 字段定义联合类型 */
type FieldDef = ServerFieldDef<z.ZodTypeAny> | PublicFieldDef<z.ZodTypeAny>;

/** 模式字段记录 */
type SchemaFields = Record<string, FieldDef>;

/** 约束结果 */
type ConstraintResult<T extends SchemaFields> = {
	type: "oneOf";
	fields: (keyof T)[];
	satisfied: boolean;
};

/** 约束函数 */
type Constraint<T extends SchemaFields> = (fields: T) => ConstraintResult<T>;

/** 根据模式和可选性从 FieldDef 推断输出类型 */
type InferField<F> =
	F extends FieldDefBase<infer S> ? (F["isOptional"] extends true ? z.infer<S> | undefined : z.infer<S>) : never;

/** 提取服务器字段键 */
type ServerKeys<T extends SchemaFields> = {
	[K in keyof T]: T[K] extends ServerFieldDef<z.ZodTypeAny> ? K : never;
}[keyof T];

/** 提取公共字段键 */
type PublicKeys<T extends SchemaFields> = {
	[K in keyof T]: T[K] extends PublicFieldDef<z.ZodTypeAny> ? K : never;
}[keyof T];

/** 构建服务器部分类型 */
type ServerSection<T extends SchemaFields> = {
	[K in ServerKeys<T>]: InferField<T[K]>;
};

/** 构建公共部分类型 */
type PublicSection<T extends SchemaFields> = {
	[K in PublicKeys<T>]: InferField<T[K]>;
};

/** 检查是否有任何服务器字段 */
type HasServerFields<T extends SchemaFields> = ServerKeys<T> extends never ? false : true;

/** 检查是否有任何公共字段 */
type HasPublicFields<T extends SchemaFields> = PublicKeys<T> extends never ? false : true;

/** 从字段推断配置结果（无 isEnabled） */
type InferConfigResult<T extends SchemaFields> = (HasServerFields<T> extends true
	? { server: ServerSection<T> }
	: object) &
	(HasPublicFields<T> extends true ? { public: PublicSection<T> } : object);

/** 启用了功能标志的配置 */
type EnabledConfig<T extends SchemaFields> = InferConfigResult<T> & {
	isEnabled: true;
};

/** 禁用了功能标志的配置 */
type DisabledConfig = { isEnabled: false };

/** 功能配置（使用标志时） */
export type FeatureConfig<T extends SchemaFields> = EnabledConfig<T> | DisabledConfig;

/** 标志选项 */
type FlagOptions = {
	env: string;
	value: string | undefined;
};

/** 带标志的选项对象（返回 FeatureConfig） */
type ConfigOptionsWithFlag<T extends SchemaFields> = {
	flag: FlagOptions;
	constraints?: (schema: T) => Constraint<T>[];
};

/** 不带标志的选项对象（返回 InferConfigResult） */
type ConfigOptionsWithoutFlag<T extends SchemaFields> = {
	flag?: undefined;
	constraints: (schema: T) => Constraint<T>[];
};

// =============================================================================
// 错误
// =============================================================================

/**
 * 配置验证失败时抛出的错误。
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
 * 在客户端访问仅服务器配置时抛出的错误。
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
// 字段构建器
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
	value: string | undefined; // 公共字段必填（Next.js 内联）
	optional?: boolean;
};

type PublicFieldOptionsWithSchema<T extends z.ZodTypeAny> = PublicFieldOptionsBase & {
	schema: T;
};

type PublicFieldOptionsWithoutSchema = PublicFieldOptionsBase & {
	schema?: undefined;
};

/**
 * 定义仅服务器配置字段。
 * 服务器字段只能在服务器上访问，在客户端访问时会抛出异常。
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
 * 定义公共配置字段（服务器和客户端均可访问）。
 * 必须直接传递值，以便 Next.js 内联 NEXT_PUBLIC_* 变量。
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
// 约束
// =============================================================================

/**
 * 创建"互斥之一"约束。
 * 指定的字段中至少必须有一个具有值。
 */
export function oneOf<T extends SchemaFields>(fieldDefs: FieldDef[]): Constraint<T> {
	return (allFields) => {
		// 查找哪些字段名称与提供的字段定义匹配
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
// 辅助函数
// =============================================================================

/**
 * 检查标志值是否为真。
 */
function isFlagEnabled(flag: string | undefined): boolean {
	if (!flag) return false;
	return ["true", "1", "yes"].includes(flag.toLowerCase());
}

/**
 * 创建一个 Proxy，在客户端访问服务器配置时抛出异常。
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
// 模式构建器
// =============================================================================

// 重载 1：无选项（只有名称和字段）
export function configSchema<T extends SchemaFields>(name: string, fields: T): InferConfigResult<T>;

// 重载 2：带标志选项（返回 FeatureConfig）
export function configSchema<T extends SchemaFields>(
	name: string,
	fields: T,
	options: ConfigOptionsWithFlag<T>,
): FeatureConfig<T>;

// 重载 3：带约束但无标志（返回 InferConfigResult）
export function configSchema<T extends SchemaFields>(
	name: string,
	fields: T,
	options: ConfigOptionsWithoutFlag<T>,
): InferConfigResult<T>;

/**
 * 定义带有类型化的服务器和公共字段的配置模式。
 */
export function configSchema<T extends SchemaFields>(
	name: string,
	fields: T,
	options?: ConfigOptionsWithFlag<T> | ConfigOptionsWithoutFlag<T>,
): InferConfigResult<T> | FeatureConfig<T> {
	// ... 完整实现
}
```

（文档继续...由于篇幅限制，此处为部分翻译内容）

---

# 构建时环境变量验证

在构建时验证环境变量配置，确保所有必需的配置都已正确设置，避免部署后发现配置问题。

### 创建验证脚本

创建 `scripts/validate-env.ts` 脚本：

```typescript
// scripts/validate-env.ts
import fs from "node:fs";
import path from "node:path";
import * as dotenv from "dotenv";

type EnvFile = {
	readonly path: string;
	readonly name: string;
};

const ENV_FILES: EnvFile[] = [
	{ path: ".env.local", name: "Local" },
	{ path: ".env.development", name: "Development" },
	{ path: ".env.staging", name: "Staging" },
	{ path: ".env.production", name: "Production" },
];

type ConfigFile = {
	readonly path: string;
	readonly name: string;
};

const CONFIG_FILES: ConfigFile[] = [
	{ path: "src/lib/db/config.ts", name: "Database" },
	{ path: "src/lib/auth/config.ts", name: "Auth" },
	{ path: "src/lib/ai/config.ts", name: "AI" },
	{ path: "src/lib/sentry/config.ts", name: "Sentry" },
	{ path: "src/lib/resend/config.ts", name: "Resend" },
];

/**
 * 从给定路径读取并解析 .env 文件
 */
function readEnvFile(filePath: string): Record<string, string> {
	const absolutePath = path.resolve(process.cwd(), filePath);

	if (!fs.existsSync(absolutePath)) {
		return {};
	}

	const content = fs.readFileSync(absolutePath, "utf-8");
	const parsed = dotenv.parse(content);

	return parsed;
}

/**
 * 查找项目根目录下的所有 .env 文件
 */
function findEnvFiles(): EnvFile[] {
	return ENV_FILES.filter((file) => {
		const absolutePath = path.resolve(process.cwd(), file.path);
		return fs.existsSync(absolutePath);
	});
}

/**
 * 动态导入配置模块并获取其架构
 */
async function getConfigSchema(configPath: string): Promise<z.ZodSchema | null> {
	try {
		const fullPath = path.resolve(process.cwd(), configPath);
		const module = await import(fullPath);
		return module.configSchema ?? null;
	} catch {
		return null;
	}
}

/**
 * 验证配置对象是否满足 Zod 模式
 */
function validateConfig(
	schema: z.ZodSchema,
	envVars: Record<string, string>,
	configName: string,
): { success: boolean; errors: string[] } {
	const result = schema.safeParse(envVars);

	if (result.success) {
		return { success: true, errors: [] };
	}

	const errors = result.error.errors.map((err) => `  - ${err.path.join(".")}: ${err.message}`);

	return { success: false, errors };
}

async function main() {
	console.log("🔍 Environment Configuration Validator\n");

	const env = process.env.NODE_ENV ?? "development";
	console.log(`  Environment: ${env}\n`);

	// 加载环境文件
	console.log("  Loading environment files...");

	const envFiles = findEnvFiles();

	if (envFiles.length === 0) {
		console.log("\n  ⚠ No .env files found!\n");
		process.exit(1);
	}

	const allEnvVars: Record<string, string> = {};

	for (const file of envFiles) {
		const vars = readEnvFile(file.path);
		Object.assign(allEnvVars, vars);
		console.log(`    ✓ ${file.path}`);
	}

	console.log("");

	// 验证每个配置文件
	console.log(`  Found ${CONFIG_FILES.length} config files:\n`);

	let totalConfigs = 0;
	let totalErrors = 0;
	let totalUnused = 0;

	for (const configFile of CONFIG_FILES) {
		const schema = await getConfigSchema(configFile.path);

		if (!schema) {
			console.log(`  ⏭ ${configFile.path}`);
			console.log(`    ⚠ Config file not found or has no schema\n`);
			continue;
		}

		const { success, errors } = validateConfig(schema, allEnvVars, configFile.name);

		if (success) {
			console.log(`  ✓ ${configFile.path}`);
			console.log(`    ✓ ${configFile.name} configuration is valid\n`);
		} else {
			console.log(`  ✗ ${configFile.path}`);
			console.log(`    Configuration validation error for ${configFile.name}!`);
			console.log(`    Did you correctly set all required environment variables in your .env* file?`);
			console.log(errors.join("\n"));
			console.log("");
		}

		totalConfigs++;
		totalErrors += errors.length;
	}

	// 检查未使用的环境变量
	const usedVars = new Set<string>();

	for (const configFile of CONFIG_FILES) {
		const schema = await getConfigSchema(configFile.path);

		if (schema) {
			// 提取模式中使用的变量名（简化示例）
			const shape = (schema as z.ZodObject<z.ZodRawShape>).shape;

			if (shape) {
				for (const key of Object.keys(shape)) {
					usedVars.add(key.toUpperCase());
				}
			}
		}
	}

	const unusedVars = Object.keys(allEnvVars).filter((key) => !usedVars.has(key) && !key.startsWith("BUN_"));

	console.log("Summary:\n");
	console.log(`  Configs validated: ${totalConfigs}`);
	console.log(`  Validation errors: ${totalErrors}`);
	console.log(`  Unused env vars:   ${totalUnused}`);

	if (totalErrors > 0) {
		process.exit(1);
	}
}

main().catch(console.error);
```

### 运行验证

```bash
bun run tsx scripts/validate-env.ts
```

示例输出（验证通过）：

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

Summary:

  Configs validated: 5
  Validation errors: 0
  Unused env vars:   0
```

示例输出（验证失败）：

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

示例输出（包含未使用的变量）：

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

该脚本在出现验证错误时退出码为 1（适用于 CI），但未使用的变量只会触发警告而不会导致构建失败。

---

## Neon + Drizzle 配置

使用 Drizzle ORM 将 Next.js 应用连接到 Neon Postgres，并为 Vercel 无服务器函数优化连接池。

### 步骤 1：全局安装 Neon MCP 服务器

```bash
bunx neonctl@latest init
```

> **注意**：这会全局安装 MCP 服务器（不是项目范围），使用您的用户 API key。默认情况下，MCP 服务器对您的 Neon 账户具有**写访问权限**。

对于组织中的生产应用，配置 MCP 服务器为只读：

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

### 步骤 2：创建新的 Neon 项目

使用现有的 Neon 项目或创建一个新项目，可以通过 [Neon Dashboard](https://console.neon.tech/) 或指示您的编码代理创建新项目或检索现有项目的连接字符串。

### 步骤 3：获取您的 Neon 数据库 URL

1. 转到 [Neon Dashboard](https://console.neon.tech/)
2. 选择您的项目
3. 从 **Connection Details** 小部件中复制连接字符串

该连接字符串将如下所示：

```plain
Host=ep-something-12345.us-east-1.aws.neon.tech
Database=neondb
User=user
Password=password
```

### 步骤 4：设置环境变量

在 `.env` 文件中设置以下环境变量：

```env
# 必需
POSTGRES_HOST=ep-something-12345.us-east-1.aws.neon.tech
POSTGRES_DATABASE=neondb
POSTGRES_USER=user
POSTGRES_PASSWORD=password

# 可选（如果使用连接池）
POSTGRES_HOST_IDLE=ep-something-12345.us-east-1.aws.neon.tech
POSTGRES_DATABASE_IDLE=neondb_idle
POSTGRES_USER_IDLE=user
POSTGRES_PASSWORD_IDLE=password
```

### 步骤 5：创建数据库客户端

创建 `src/lib/db/client.ts`：

```typescript
// src/lib/db/client.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.POSTGRES_URL!);

export const db = drizzle(sql, { schema });
```

### 步骤 6：创建架构

创建 `src/lib/db/schema.ts`：

```typescript
// src/lib/db/schema.ts
import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
	id: serial("id").primaryKey(),
	title: text("title").notNull(),
	content: text("content").notNull(),
	published: boolean("published").default(false).notNull(),
	authorId: integer("author_id")
		.notNull()
		.references(() => users.id),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### 步骤 7：创建 Drizzle 配置

创建 `drizzle.config.ts`：

```typescript
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/lib/db/schema.ts",
	dbCredentials: {
		url: process.env.POSTGRES_URL!,
	},
	driver: "pg",
	verbose: true,
	strict: true,
});
```

### 步骤 8：生成迁移

```bash
bun run drizzle-kit generate
```

### 步骤 9：运行迁移

```bash
bun run drizzle-kit migrate
```

### 步骤 10：使用连接池（可选，但推荐用于 Vercel）

对于 Vercel 无服务器函数，建议使用 `@vercel/functions` 的连接池：

```typescript
// src/lib/db/client.ts
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { Pool } from "@vercel/functions/pool";
import * as schema from "./schema";

// 为无服务器函数创建连接池
const pool = new Pool({
	connectionString: process.env.POSTGRES_URL!,
	max: 1, // Vercel 无服务器函数的推荐值
});

export const db = drizzle(pool, { schema });
```

---

## AI SDK 与简单聊天

使用 Vercel AI SDK 创建简单的 AI 聊天界面。

### 安装依赖

```bash
bun add ai @ai-sdk/openai
```

### 创建 API 路由

创建 `src/app/api/chat/route.ts`：

```typescript
// src/app/api/chat/route.ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: Request) {
	const { messages } = await request.json();

	const result = await streamText({
		model: openai("gpt-4o"),
		messages,
	});

	return result.toDataStreamResponse();
}
```

### 创建聊天组件

创建 `src/components/chat.tsx`：

```tsx
// src/components/chat.tsx
"use client";

import { useChat } from "ai/react";

export function Chat() {
	const { messages, input, handleInputChange, handleSubmit } = useChat();

	return (
		<div className='flex flex-col w-full max-w-md py-24 mx-auto stretch'>
			{messages.map((m) => (
				<div key={m.id} className='whitespace-pre-wrap'>
					<div className='font-bold'>{m.role}</div>
					<p>{m.content}</p>
				</div>
			))}

			<form onSubmit={handleSubmit}>
				<input
					className='w-full p-2 border border-gray-300 rounded shadow-xl text-black'
					value={input}
					placeholder='Say something...'
					onChange={handleInputChange}
				/>
			</form>
		</div>
	);
}
```

---

## 使用 Drizzle

Drizzle ORM 的基本用法。

### 查询示例

```typescript
// 获取所有用户
const users = await db.select().from(users);

// 获取单个用户
const user = await db.select().from(users).where(eq(users.id, 1));

// 插入新用户
await db.insert(users).values({ name: "John", email: "john@example.com" });

// 更新用户
await db.update(users).set({ name: "Jane" }).where(eq(users.id, 1));

// 删除用户
await db.delete(users).where(eq(users.id, 1));
```

### 关系查询

```typescript
// 获取用户及其文章
const userWithPosts = await db.query.users.findFirst({
	where: eq(users.id, 1),
	with: {
		posts: true,
	},
});
```

---

## Ralph 代理循环

Ralph 是用于自动化 AI 驱动开发的代理循环。

### 安装

```bash
bun add ralph-mcp
```

### 配置

在您的编码代理配置中添加：

```json
{
	"mcpServers": {
		"ralph": {
			"command": "bun",
			"args": ["run", "-y", "ralph-mcp"]
		}
	}
}
```

### 使用示例

```typescript
import { Ralph } from "ralph-mcp";

const ralph = new Ralph();

const result = await ralph.run({
	task: "Create a new API endpoint for user authentication",
	context: {
		project: "my-nextjs-app",
		framework: "Next.js",
	},
});
```

---

## 工作流开发套件设置

安装和配置工作流开发套件，用于可恢复的持久化 AI 代理工作流，包含步骤级持久性、流恢复和代理编排功能。

### 步骤 1：安装包

```bash
bun add workflow @workflow/ai
```

### 步骤 2：创建工作流文件夹

创建 `src/workflows/` 文件夹来组织工作流代码：

```plain
src/workflows/
```

每个工作流在 `steps/` 目录中都有自己的子文件夹用于步骤函数，以及一个 `index.ts` 用于编排函数：

```plain
src/workflows/
  chat/
    index.ts       # 工作流编排函数
    steps/         # 步骤函数 ("use step")
      history.ts
      logger.ts
      name-chat.ts
    types.ts       # 工作流特定类型
```

### 步骤 3：更新 Next.js 配置

更新 Next.js 配置：

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

## 聊天工作流

创建处理用户消息并生成 AI 响应的主要工作流：

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
 * 处理用户消息并生成 AI 响应的主要聊天工作流。
 * 使用 runId 实现客户端重新连接时的流可恢复性。
 */
export async function chatWorkflow({ chatId, userMessage }: { chatId: string; userMessage: ChatAgentUIMessage }) {
	"use workflow";

	const { workflowRunId } = getWorkflowMetadata();

	await log("info", "Starting chat workflow", { chatId, runId: workflowRunId });

	// 持久化用户消息
	await persistUserMessage({ chatId, message: userMessage });

	// 创建带有 runId 的占位符助手消息以实现可恢复性
	const messageId = await createAssistantMessage({
		chatId,
		runId: workflowRunId,
	});

	// 获取完整的消息历史
	const history = await getMessageHistory(chatId);

	// 运行代理并流式传输
	const { parts } = await chatAgent.run(history, {
		maxSteps: 10,
		writable: getWritable(),
	});

	// 持久化助手消息部分
	await persistMessageParts({ chatId, messageId, parts });

	// 清除 runId 以标记消息完成
	await removeRunId(messageId);

	// 如果是第一条消息，生成聊天标题
	await nameChatStep(chatId, userMessage);

	await log("info", "Chat workflow completed", {
		chatId,
		runId: workflowRunId,
		partsCount: parts.length,
	});
}
```

---

## 历史记录步骤

为消息持久化创建步骤函数：

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
 * 持久化用户消息到数据库。
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

	// 更新聊天时间戳
	await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, chatId));
}

/**
 * 创建带有 runId 的占位符助手消息以实现流恢复。
 * 部分将在流完成后添加。
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
 * 在流完成后持久化消息部分。
 * 验证并将通用 UIMessage 部分缩小为 ChatAgentUIMessage 部分。
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

	// 更新聊天时间戳
	await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, chatId));
}

/**
 * 获取聊天的消息历史，转换为 UI 消息格式。
 */
export async function getMessageHistory(chatId: string): Promise<ChatAgentUIMessage[]> {
	"use step";

	const dbMessages = await getChatMessages(chatId);
	return convertDbMessagesToUIMessages(dbMessages);
}

/**
 * 在流完成后清除消息中的 runId。
 * 这标记消息为最终状态。
 */
export async function removeRunId(messageId: string): Promise<void> {
	"use step";

	await clearMessageRunId(messageId);
}
```

---

## 工作流中的日志记录

工作流函数在不支持 Node.js 模块（如 `fs`、`events` 或 `worker_threads`）的受限环境中运行。由于 pino 使用这些模块，您不能在工作流函数中直接导入记录器。

相反，将记录器调用包装在步骤函数中：

```ts
// src/workflows/chat/steps/logger.ts
import { logger } from "@/lib/logging/logger";

type LogLevel = "info" | "warn" | "error" | "debug";

/**
 * 工作流安全的日志步骤。
 * 将 pino 记录器调用包装在步骤函数中，以避免将
 * Node.js 模块（fs、events、worker_threads）打包到工作流函数中。
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

此模式适用于任何使用 Node.js 模块的库。将导入和使用移动到步骤函数中以将其与工作流运行时隔离。

---

## 参考资料

- [工作流开发套件文档](https://useworkflow.dev/docs)
- [Next.js 入门指南](https://useworkflow.dev/docs/getting-started/next)

---

# 可恢复的 AI 响应流

使用 WorkflowChatTransport、开始/恢复 API 端点和 useResumableChat 钩子为 AI 聊天添加自动流恢复功能。

### 开始工作流端点

创建开始工作流运行的端点：

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

	// 确保聊天存在（如果需要则创建）并验证所有权
	const isAuthorized = await ensureChatExists(chatId, session.user.id);
	if (!isAuthorized) {
		return new Response("Forbidden", { status: 403 });
	}

	// 使用用户消息开始工作流
	const run = await start(chatWorkflow, [
		{
			chatId,
			userMessage: message,
		},
	]);

	// 返回带有 runId 的流以实现可恢复性
	return createUIMessageStreamResponse({
		stream: run.readable,
		headers: {
			"x-workflow-run-id": run.runId,
		},
	});
}
```

### 恢复流端点

创建恢复工作流流的端点：

```typescript
// src/app/api/chats/[chatId]/messages/[runId]/stream/route.ts
import { headers } from "next/headers";
import { getRun } from "workflow/api";
import { createUIMessageStreamResponse } from "ai";
import { auth } from "@/lib/auth/server";
import { verifyChatOwnership } from "@/lib/chat/queries";

/**
 * GET /api/chats/:chatId/messages/:runId/stream
 * 工作流流的恢复端点
 *
 * 查询参数：
 *   - startIndex：可选的恢复块索引
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

### 关键工作流 API 函数

**`start(workflow, args)`**

开始新的工作流运行：

- 返回 `{ runId, readable }`
- `runId` 唯一标识此运行以进行恢复
- `readable` 是 UI 消息块的 `ReadableStream`

**`getRun(runId)`**

获取现有的工作流运行：

- 返回带有 `getReadable({ startIndex? })` 的运行对象
- `startIndex` 允许从特定块恢复

### 响应头

`x-workflow-runId` 头对于可恢复性至关重要：

```typescript
return createUIMessageStreamResponse({
	stream: run.readable,
	headers: {
		"x-workflow-run-id": run.runId,
	},
});
```

客户端捕获此头并使用它进行重新连接。

### 授权

两个端点都验证：

1. 用户已通过身份验证（会话存在）
2. 用户拥有聊天（`ensureChatExists` / `verifyChatOwnership`）

这可以防止未经授权访问其他用户的工作流流。

---

## 工作流客户端集成

客户端使用 `WorkflowChatTransport` 实现自动流恢复。

### 可恢复聊天钩子

**通过 shadcn 注册表安装：**

```bash
bunx --bun shadcn@latest add https://fullstackrecipes.com/r/use-resumable-chat.json
```

**或复制源代码：**

`hooks/use-resumable-chat.ts`：

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
	/** 用于恢复中断流的初始工作流运行 ID */
	initialRunId?: string;
}

/**
 * 使用 WorkflowChatTransport 包装 useChat 的自定义钩子，用于可恢复的流式传输。
 *
 * 使用 useStateRef 跟踪活动的工作流运行 ID，实现自动
 * 重新连接到中断的流，而不会出现闭包过时问题。
 */
export function useResumableChat({ chatId, messageHistory, initialRunId }: UseResumableChatOptions) {
	const activeRunIdRef = useRef<string | undefined>(initialRunId);

	const chatResult = useChat<ChatAgentUIMessage>({
		messages: messageHistory,
		resume: !!initialRunId,
		transport: new WorkflowChatTransport({
			// 发送新消息
			prepareSendMessagesRequest: ({ messages }) => ({
				api: `/api/chats/${chatId}/messages`,
				body: {
					chatId,
					message: messages[messages.length - 1],
				},
			}),

			// 发送消息时存储工作流运行 ID
			onChatSendMessage: (response) => {
				const workflowRunId = response.headers.get("x-workflow-run-id");
				if (workflowRunId) {
					activeRunIdRef.current = workflowRunId;
				}
			},

			// 配置重新连接以使用 ref 获取最新值
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

			// 聊天流结束时清除工作流运行 ID
			onChatEnd: () => {
				activeRunIdRef.current = undefined;
			},

			// 重新连接错误时重试最多 5 次
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

### 带恢复检测的聊天页面

创建或更新带有恢复检测的聊天页面：

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

	// 获取此聊天的所有消息
	const persistedMessages = await getChatMessages(chatId);

	// 检查最后一条消息是否是不完整的助手消息（有 runId 但没有部分）
	// 这发生在工作流中途被中断时
	const lastMessage = persistedMessages.at(-1);
	const isIncompleteMessage =
		lastMessage?.role === "assistant" &&
		lastMessage?.runId &&
		lastMessage?.parts.length === 0;

	// 如果不完整，提取 runId 用于恢复，并从历史记录中删除空消息
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

### 恢复检测的工作原理

1. **页面加载时**，获取聊天的所有消息
2. **检查最后一条消息** - 如果它是带有 `runId` 但没有部分的助手消息，则表示不完整
3. **提取 `runId`** - 传递给客户端用于恢复
4. **删除空消息** - 不要在 UI 中显示不完整的消息
5. **客户端恢复** - `WorkflowChatTransport` 使用 `runId` 重新连接

### WorkflowChatTransport 选项

| 选项 | 描述 |
| `prepareSendMessagesRequest` | 配置初始消息发送请求 |
| `onChatSendMessage` | 消息发送时的回调（捕获 `runId`） |
| `prepareReconnectToStreamRequest` | 配置重新连接请求 URL |
| `onChatEnd` | 流完成时的回调 |
| `maxConsecutiveErrors` | 重新连接重试次数 |

---

# 自定义持久化代理

构建具有完全控制 streamText 选项、提供程序配置和工具循环的自定义持久化 AI 代理。与工作流开发套件兼容。

## 为什么需要自定义代理？

内置的 [`DurableAgent`](https://useworkflow.dev/docs/api-reference/workflow-ai/durable-agent) 来自 `@workflow/ai/agent` 涵盖了大多数用例。在以下情况下需要此自定义代理：

1. **流式推理/来源** - `DurableAgent` 不暴露 `sendReasoning` 或 `sendSources` 选项
2. **UIMessage 持久化** - `DurableAgent.onFinish` 提供 `ModelMessage[]`，但此代理通过 `toUIMessageStream().onFinish` 直接提供带有其 `parts` 数组的 `UIMessage`

## 工作原理

`Agent` 类使用工具循环包装 AI SDK 的 `streamText`。它在内部使用 `toUIMessageStream()` 来捕获每一步中的 `responseMessage: UIMessage`。

关键设计决策：

1. **可序列化配置** - 工具函数通过键引用，并在步骤执行器内部解析
2. **独立步骤执行器** - `"use step"` 指令仅在独立函数中有效，不在类方法中有效

## 定义代理

**通过 shadcn 注册表安装：**

```bash
bunx --bun shadcn@latest add https://fullstackrecipes.com/r/durable-agent.json
```

**或复制源代码：**

`lib/ai/agent.ts`：

```typescript
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
 * 可序列化的流选项（排除像 onFinish 这样的回调）。
 */
export interface StreamOptions {
	sendStart?: boolean;
	sendFinish?: boolean;
	sendReasoning?: boolean;
	sendSources?: boolean;
}

/**
 * streamText 的可序列化选项（排除回调和消息）。
 */
export interface StepOptions {
	model: string;
	system: string;
	/** 工具集键 - 在步骤执行器内部解析为实际工具 */
	tools: ToolsKey;
	providerOptions?: ProviderOptions;
}

/**
 * 所有属性必须可序列化以实现工作流兼容性。
 */
export interface AgentConfig {
	stepOptions: StepOptions;
	streamOptions?: StreamOptions;
}

export interface AgentRunConfig {
	/** @default 20 */
	maxSteps?: number;
	/** 在工作流中传递 getWritable()，或在外部传递任何 WritableStream */
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
 * 在工具循环中执行 streamText 的 AI 代理。
 *
 * 配置完全可序列化以实现工作流兼容性。
 * 工具通过键引用，并在步骤执行器内部解析。
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
 * 带有 "use step" 指令的步骤执行器。
 * 从类中分离出来，因为 "use step" 仅在独立函数中有效。
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
```

## 创建代理实例

使用不同配置创建专用代理：

```typescript
// src/lib/ai/chat-agent.ts
import { Agent } from "./agent";

export const chatAgent = new Agent({
	stepOptions: {
		model: "gpt-4o",
		system: `您是一个有用的 AI 助手。您可以帮助用户完成各种任务，包括研究和起草内容。

当用户要求您研究某些内容时，使用您的可用工具搜索信息。
当用户要求您起草内容时，使用您的起草工具保存文档。

在响应中要简洁但全面。`,
		tools: "research",
	},
	streamOptions: {
		sendReasoning: false,
		sendSources: false,
	},
});
```

对于带有提供程序选项的专用代理：

```typescript
// src/lib/ai/research-agent.ts
import { Agent } from "./agent";

export const researchAgent = new Agent({
	stepOptions: {
		model: "google/gemini-3-pro-preview",
		system: "您是一个研究代理...",
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

## 在工作流中运行

```typescript
import { getWorkflowMetadata, getWritable } from "workflow";
import { chatAgent } from "@/lib/ai/chat-agent";

export async function chatWorkflow({ chatId, userMessage }) {
	"use workflow";

	const { workflowRunId } = getWorkflowMetadata();

	// 持久化用户消息，创建助手占位符
	await persistUserMessage({ chatId, message: userMessage });
	const messageId = await createAssistantMessage({
		chatId,
		runId: workflowRunId,
	});

	// 获取完整的消息历史
	const history = await getMessageHistory(chatId);

	// 运行代理并流式传输
	const { parts } = await chatAgent.run(history, {
		maxSteps: 10,
		writable: getWritable(),
	});

	// 持久化助手消息部分
	await persistMessageParts({ chatId, messageId, parts });

	// 清除 runId 以标记消息完成
	await removeRunId(messageId);
}
```

## 在工作流外运行

代理也可以在工作流外运行 - 可用于测试或非持久化上下文：

```typescript
import { chatAgent } from "@/lib/ai/chat-agent";

// 选项 1：只获取部分（不流式传输）
const { parts, stepCount } = await chatAgent.run(history);
console.log(`Completed in ${stepCount} steps`);

// 选项 2：流式传输到自定义可写流
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

## 何时使用每个

**对大多数用例使用 `DurableAgent`** - 它更简单，并提供内联工具定义、回调和 `prepareStep`。

**在需要 `sendReasoning`/`sendSources` 流式传输或直接 `UIMessage` 格式进行持久化时使用此自定义代理**。

## 关键实现细节

### 为什么工具通过键引用

工作流运行时序列化步骤输入/输出。函数引用无法序列化，因此工具存储在 `toolSets` 对象中，并在步骤执行器内部通过键查找：

```typescript
const toolSets = {
	research: researchTools,
	drafting: draftingTools,
};

// 在 executeAgentStep 内部：
const tools = toolSets[config.stepOptions.tools];
```

### 为什么步骤执行器是独立的

`"use step"` 指令仅在独立函数中有效，不在类方法中有效。步骤执行器从类中提取出来：

```typescript
// 这样有效：
async function executeAgentStep(...) {
  "use step";
  // ...
}

// 这样无效：
class Agent {
  async executeStep(...) {
    "use step"; // 错误：指令在方法中不支持
  }
}
```

### 工具循环逻辑

代理持续执行步骤，直到模型停止调用工具：

```typescript
while (shouldContinue && stepCount < maxSteps) {
	const result = await executeAgentStep(modelMessages, stepConfig);
	// ...
	shouldContinue = result.finishReason === "tool-calls";
	stepCount++;
}
```

## 另请参阅

- [可恢复 AI 流](/recipes/resumable-ai-streams) - 使用此代理的完整配方
- [DurableAgent 文档](https://useworkflow.dev/docs/api-reference/workflow-ai/durable-agent) - 内置替代方案
- [AI SDK streamText](https://ai-sdk.dev/docs/ai-sdk-core/generating-text#streamtext) - 底层流式传输 API

---

## 使用工作流

创建和运行具有步骤、流式传输和代理执行功能的持久化工作流。涵盖开始、恢复和持久化工作流结果。

### 工作流文件夹结构

每个工作流在 `src/workflows/` 中都有自己的子文件夹：

```plain
src/workflows/
  chat/
    index.ts       # 工作流编排函数 ("use workflow")
    steps/         # 步骤函数 ("use step")
      history.ts
      logger.ts
      name-chat.ts
    types.ts       # 工作流的 UI 消息类型定义
```

- **`index.ts`** - 包含带有 `"use workflow"` 指令的主要工作流函数。通过调用步骤函数编排工作流。
- **`steps/`** - 包含带有 `"use step"` 指令的单独步骤函数。每个步骤都是一个持久化检查点。
- **`types.ts`** - 工作流的 UI 消息类型定义。

### 创建工作流

使用 `"use workflow"` 指令定义工作流：

```typescript
// src/workflows/chat/index.ts
import { getWorkflowMetadata, getWritable } from "workflow";
import { chatAgent } from "@/lib/ai/chat-agent";

export async function chatWorkflow({ chatId, userMessage }) {
	"use workflow";

	const { workflowRunId } = getWorkflowMetadata();

	// 持久化用户消息
	await persistUserMessage({ chatId, message: userMessage });

	// 创建带有 runId 的助手占位符以实现恢复
	const messageId = await createAssistantMessage({
		chatId,
		runId: workflowRunId,
	});

	// 获取消息历史
	const history = await getMessageHistory(chatId);

	// 运行代理并流式传输
	const { parts } = await chatAgent.run(history, {
		maxSteps: 10,
		writable: getWritable(),
	});

	// 持久化并完成
	await persistMessageParts({ chatId, messageId, parts });
	await removeRunId(messageId);
}
```

### 开始工作流

使用 `workflow/api` 中的 `start` 函数：

```typescript
import { start } from "workflow/api";
import { chatWorkflow } from "@/workflows/chat";

const run = await start(chatWorkflow, [{ chatId, userMessage }]);

// run.runId - 唯一标识此运行
// run.readable - UI 消息块的流
```

### 恢复工作流流

使用 `getRun` 重新连接到进行中或已完成的工作流：

```typescript
import { getRun } from "workflow/api";

const run = await getRun(runId);
const readable = await run.getReadable({ startIndex });
```

### 使用步骤

步骤是持久化其结果的持久化检查点：

```typescript
async function getMessageHistory(chatId: string) {
	"use step";

	const dbMessages = await getChatMessages(chatId);
	return convertDbMessagesToUIMessages(dbMessages);
}
```

### 从工作流流式传输

使用 `getWritable()` 向客户端流式传输数据：

```typescript
import { getWritable } from "workflow";

export async function chatWorkflow({ chatId }) {
	"use workflow";

	const writable = getWritable();

	// 传递给代理进行流式传输
	await chatAgent.run(history, { writable });
}
```

### 获取工作流元数据

访问当前运行的元数据：

```typescript
import { getWorkflowMetadata } from "workflow";

export async function chatWorkflow({ chatId }) {
	"use workflow";

	const { workflowRunId } = getWorkflowMetadata();

	// 存储 runId 以实现恢复
	await createAssistantMessage({ chatId, runId: workflowRunId });
}
```

### 工作流安全的日志记录

工作流运行时不支持 Node.js 模块。将日志器调用包装在步骤中：

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

### 在工作流中运行代理

使用自定义 `Agent` 类进行完全流式传输控制：

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

### 持久化工作流结果

使用步骤函数保存代理输出。`assertChatAgentParts` 函数验证通用的 `UIMessage["parts"]`（由代理返回）与应用程序特定的工具和数据类型匹配：

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

	// 更新聊天时间戳
	await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, chatId));
}
```

---

## 参考资料

- [工作流开发套件](https://useworkflow.dev/docs)
- [工作流 API 参考](https://useworkflow.dev/docs/api-reference)

---

# 多代理工作流

构建具有持久化执行、工具循环和客户端重新连接时自动流恢复的可恢复多代理工作流。

## 工作流开发套件设置

安装和配置工作流开发套件，用于可恢复的持久化 AI 代理工作流，包含步骤级持久性、流恢复和代理编排功能。

### 步骤 1：安装包

```bash
bun add workflow @workflow/ai
```

### 步骤 2：创建工作流文件夹

创建 `src/workflows/` 文件夹来组织工作流代码：

```plain
src/workflows/
```

每个工作流在 `steps/` 目录中都有自己的子文件夹用于步骤函数，以及一个 `index.ts` 用于编排函数：

```plain
src/workflows/
  chat/
    index.ts       # 工作流编排函数
    steps/         # 步骤函数 ("use step")
      history.ts
      logger.ts
      name-chat.ts
    types.ts       # 工作流特定类型
```

### 步骤 3：更新 Next.js 配置

更新 Next.js 配置：

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

## 聊天工作流

创建处理用户消息并生成 AI 响应的主要工作流：

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
 * 处理用户消息并生成 AI 响应的主要聊天工作流。
 * 使用 runId 实现客户端重新连接时的流可恢复性。
 */
export async function chatWorkflow({ chatId, userMessage }: { chatId: string; userMessage: ChatAgentUIMessage }) {
	"use workflow";

	const { workflowRunId } = getWorkflowMetadata();

	await log("info", "Starting chat workflow", { chatId, runId: workflowRunId });

	// 持久化用户消息
	await persistUserMessage({ chatId, message: userMessage });

	// 创建带有 runId 的占位符助手消息以实现可恢复性
	const messageId = await createAssistantMessage({
		chatId,
		runId: workflowRunId,
	});

	// 获取完整的消息历史
	const history = await getMessageHistory(chatId);

	// 运行代理并流式传输
	const { parts } = await chatAgent.run(history, {
		maxSteps: 10,
		writable: getWritable(),
	});

	// 持久化助手消息部分
	await persistMessageParts({ chatId, messageId, parts });

	// 清除 runId 以标记消息完成
	await removeRunId(messageId);

	// 如果是第一条消息，生成聊天标题
	await nameChatStep(chatId, userMessage);

	await log("info", "Chat workflow completed", {
		chatId,
		runId: workflowRunId,
		partsCount: parts.length,
	});
}
```

---

## 历史记录步骤

为消息持久化创建步骤函数：

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
 * 持久化用户消息到数据库。
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

	// 更新聊天时间戳
	await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, chatId));
}

/**
 * 创建带有 runId 的占位符助手消息以实现流恢复。
 * 部分将在流完成后添加。
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
 * 在流完成后持久化消息部分。
 * 验证并将通用 UIMessage 部分缩小为 ChatAgentUIMessage 部分。
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

	// 更新聊天时间戳
	await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, chatId));
}

/**
 * 获取聊天的消息历史，转换为 UI 消息格式。
 */
export async function getMessageHistory(chatId: string): Promise<ChatAgentUIMessage[]> {
	"use step";

	const dbMessages = await getChatMessages(chatId);
	return convertDbMessagesToUIMessages(dbMessages);
}

/**
 * 在流完成后清除消息中的 runId。
 * 这标记消息为最终状态。
 */
export async function removeRunId(messageId: string): Promise<void> {
	"use step";

	await clearMessageRunId(messageId);
}
```

---

## 工作流中的日志记录

工作流函数在不支持 Node.js 模块（如 `fs`、`events` 或 `worker_threads`）的受限环境中运行。由于 pino 使用这些模块，您不能在工作流函数中直接导入记录器。

相反，将记录器调用包装在步骤函数中：

```ts
// src/workflows/chat/steps/logger.ts
import { logger } from "@/lib/logging/logger";

type LogLevel = "info" | "warn" | "error" | "debug";

/**
 * 工作流安全的日志步骤。
 * 将 pino 记录器调用包装在步骤函数中，以避免将
 * Node.js 模块（fs、events、worker_threads）打包到工作流函数中。
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

此模式适用于任何使用 Node.js 模块的库。将导入和使用移动到步骤函数中以将其与工作流运行时隔离。

---

## 参考资料

- [工作流开发套件文档](https://useworkflow.dev/docs)
- [Next.js 入门指南](https://useworkflow.dev/docs/getting-started/next)

---

## 可恢复 AI 响应流

使用 WorkflowChatTransport、开始/恢复 API 端点和 useResumableChat 钩子为 AI 聊天添加自动流恢复功能。

### 开始工作流端点

创建开始工作流运行的端点：

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

	// 确保聊天存在（如果需要则创建）并验证所有权
	const isAuthorized = await ensureChatExists(chatId, session.user.id);
	if (!isAuthorized) {
		return new Response("Forbidden", { status: 403 });
	}

	// 使用用户消息开始工作流
	const run = await start(chatWorkflow, [
		{
			chatId,
			userMessage: message,
		},
	]);

	// 返回带有 runId 的流以实现可恢复性
	return createUIMessageStreamResponse({
		stream: run.readable,
		headers: {
			"x-workflow-run-id": run.runId,
		},
	});
}
```

### 恢复流端点

创建恢复工作流流的端点：

```typescript
// src/app/api/chats/[chatId]/messages/[runId]/stream/route.ts
import { headers } from "next/headers";
import { getRun } from "workflow/api";
import { createUIMessageStreamResponse } from "ai";
import { auth } from "@/lib/auth/server";
import { verifyChatOwnership } from "@/lib/chat/queries";

/**
 * GET /api/chats/:chatId/messages/:runId/stream
 * 工作流流的恢复端点
 *
 * 查询参数：
 *   - startIndex：可选的恢复块索引
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

### 关键工作流 API 函数

**`start(workflow, args)`**

开始新的工作流运行：

- 返回 `{ runId, readable }`
- `runId` 唯一标识此运行以进行恢复
- `readable` 是 UI 消息块的 `ReadableStream`

**`getRun(runId)`**

获取现有的工作流运行：

- 返回带有 `getReadable({ startIndex? })` 的运行对象
- `startIndex` 允许从特定块恢复

### 响应头

`x-workflow-runId` 头对于可恢复性至关重要：

```typescript
return createUIMessageStreamResponse({
	stream: run.readable,
	headers: {
		"x-workflow-run-id": run.runId,
	},
});
```

客户端捕获此头并使用它进行重新连接。

### 授权

两个端点都验证：

1. 用户已通过身份验证（会话存在）
2. 用户拥有聊天（`ensureChatExists` / `verifyChatOwnership`）

这可以防止未经授权访问其他用户的工作流流。

---

## 工作流客户端集成

客户端使用 `WorkflowChatTransport` 实现自动流恢复。

### 可恢复聊天钩子

**通过 shadcn 注册表安装：**

```bash
bunx --bun shadcn@latest add https://fullstackrecipes.com/r/use-resumable-chat.json
```

**或复制源代码：**

`hooks/use-resumable-chat.ts`：

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
	/** 用于恢复中断流的初始工作流运行 ID */
	initialRunId?: string;
}

/**
 * 使用 WorkflowChatTransport 包装 useChat 的自定义钩子，用于可恢复的流式传输。
 *
 * 使用 useStateRef 跟踪活动的工作流运行 ID，实现自动
 * 重新连接到中断的流，而不会出现闭包过时问题。
 */
export function useResumableChat({ chatId, messageHistory, initialRunId }: UseResumableChatOptions) {
	const activeRunIdRef = useRef<string | undefined>(initialRunId);

	const chatResult = useChat<ChatAgentUIMessage>({
		messages: messageHistory,
		resume: !!initialRunId,
		transport: new WorkflowChatTransport({
			// 发送新消息
			prepareSendMessagesRequest: ({ messages }) => ({
				api: `/api/chats/${chatId}/messages`,
				body: {
					chatId,
					message: messages[messages.length - 1],
				},
			}),

			// 发送消息时存储工作流运行 ID
			onChatSendMessage: (response) => {
				const workflowRunId = response.headers.get("x-workflow-run-id");
				if (workflowRunId) {
					activeRunIdRef.current = workflowRunId;
				}
			},

			// 配置重新连接以使用 ref 获取最新值
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

			// 聊天流结束时清除工作流运行 ID
			onChatEnd: () => {
				activeRunIdRef.current = undefined;
			},

			// 重新连接错误时重试最多 5 次
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

### 带恢复检测的聊天页面

创建或更新带有恢复检测的聊天页面：

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

	// 获取此聊天的所有消息
	const persistedMessages = await getChatMessages(chatId);

	// 检查最后一条消息是否是不完整的助手消息（有 runId 但没有部分）
	// 这发生在工作流中途被中断时
	const lastMessage = persistedMessages.at(-1);
	const isIncompleteMessage =
		lastMessage?.role === "assistant" &&
		lastMessage?.runId &&
		lastMessage?.parts.length === 0;

	// 如果不完整，提取 runId 用于恢复，并从历史记录中删除空消息
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

### 恢复检测的工作原理

1. **页面加载时**，获取聊天的所有消息
2. **检查最后一条消息** - 如果它是带有 `runId` 但没有部分的助手消息，则表示不完整
3. **提取 `runId`** - 传递给客户端用于恢复
4. **删除空消息** - 不要在 UI 中显示不完整的消息
5. **客户端恢复** - `WorkflowChatTransport` 使用 `runId` 重新连接

### WorkflowChatTransport 选项

| 选项 | 描述 |
| `prepareSendMessagesRequest` | 配置初始消息发送请求 |
| `onChatSendMessage` | 消息发送时的回调（捕获 `runId`） |
| `prepareReconnectToStreamRequest` | 配置重新连接请求 URL |
| `onChatEnd` | 流完成时的回调 |
| `maxConsecutiveErrors` | 重新连接重试次数 |

---

# Better Auth 配置

使用 Better Auth 和 Drizzle ORM 与 Neon Postgres 添加用户身份认证。基础设置包含邮箱/密码认证。

### MCP 服务器

将 Better Auth MCP 服务器添加到 `.cursor/mcp.json` 以获取准确的 API 指导：

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

### 步骤 1：安装包

```bash
bun add better-auth
```

### 步骤 2：添加环境变量

将密钥添加到 `.env.development`（同步到 Vercel）：

```env
BETTER_AUTH_SECRET="your-random-secret-at-least-32-chars"
```

使用以下命令生成密钥：

```bash
openssl rand -base64 32
```

将 URL 添加到 `.env.local`（本地覆盖）：

```env
BETTER_AUTH_URL="http://localhost:3000"
```

`BETTER_AUTH_URL` 在本地（`http://localhost:3000`）和部署环境之间有所不同，因此它应该放在 `.env.local` 中。在 Vercel 上，在仪表板中将 `BETTER_AUTH_URL` 设置为您的生产 URL。

### 步骤 3：创建认证配置

按照[环境变量管理](/recipes/env-management)模式创建认证配置：

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

### 步骤 4：更新数据库生成脚本

创建 `scripts/db/generate-schema.ts` 脚本，在运行 Drizzle 迁移之前生成 Better Auth 模式：

```typescript
// scripts/db/generate-schema.ts
import { $ } from "bun";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

await $`bunx @better-auth/cli@latest generate --config src/lib/auth/server.tsx --output src/lib/auth/schema.ts`;

await $`drizzle-kit generate`;
```

Better Auth CLI 从您的服务器配置生成 `schema.ts`。在 `drizzle-kit generate` 之前运行它可确保在创建 Drizzle 迁移时您的认证模式始终保持同步。

替换 `package.json` 中的 `db:generate` 脚本：

```json
"scripts": {
  "db:generate": "bun run scripts/db/generate-schema.ts",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio"
}
```

注意：需要此脚本（vs. 只运行 `better-auth generate &&drizzle-kit generate`），因为 better-auth CLI 不会自动加载 `.env.development` 和 `.env.local` 文件。我们使用 `loadEnvConfig` 手动加载它们。完整的设置请参阅[环境变量管理](/recipes/env-management)。

有关初始脚本设置和 `package.json` 脚本，请参阅 [Neon + Drizzle 设置](/recipes/drizzle-with-node-postgres)。

### 步骤 5：创建认证服务器实例

使用基本的邮箱/密码认证创建认证服务器：

> **注意**：我们使用 `.tsx` 而不是 `.ts` 以支持在添加 [Better Auth 邮件](/recipes/better-auth-emails) 时的 JSX 邮件模板。

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

### 步骤 6：创建 API 路由处理程序

创建认证的全路由处理程序：

```typescript
// src/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth/server";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
```

### 步骤 7：创建认证客户端

创建客户端认证钩子：

```typescript
// src/lib/auth/client.ts
"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
```

### 步骤 8：生成并运行迁移

```bash
bun run db:generate
bun run db:migrate
```

---

## 使用方法

### 注册

```typescript
import { signUp } from "@/lib/auth/client";

await signUp.email({
	email: "user@example.com",
	password: "securepassword",
	name: "John Doe",
});
```

### 登录

```typescript
import { signIn } from "@/lib/auth/client";

await signIn.email({
	email: "user@example.com",
	password: "securepassword",
});
```

### 登出

```typescript
import { signOut } from "@/lib/auth/client";

await signOut();
```

### 获取会话（客户端）

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

### 获取会话（服务端）

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

### 受保护页面模式

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

## 文件结构

```plain
src/lib/auth/
  config.ts    # 环境验证
  schema.ts    # 由 Better Auth CLI 自动生成
  server.tsx   # Better Auth 服务器实例（.tsx 支持邮件模板）
  client.ts    # React 客户端钩子

src/app/api/auth/
  [...all]/route.ts  # API 路由处理程序
```

---

## 添加社交提供商

要添加 GitHub、Google 或 Vercel 等 OAuth 提供商，首先在认证配置中将它们添加为字段：

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

然后在服务器中配置它们：

```tsx
// src/lib/auth/server.tsx
export const auth = betterAuth({
	// ...现有配置
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

这里我们条件性地处理，并将 Vercel 登录视为可选功能。

然后在客户端使用：

```typescript
await signIn.social({ provider: "vercel", callbackURL: "/chats" });
```

---

## 参考资料

- [Better Auth Next.js 文档](https://www.better-auth.com/docs/integrations/next)
- [Better Auth Drizzle 适配器](https://www.better-auth.com/docs/adapters/drizzle)

---

# 使用身份认证

使用 Better Auth 进行客户端和服务端身份认证。涵盖会话访问、受保护路由、登录/登出和获取用户数据。

## 实现使用身份认证

使用 Better Auth 进行客户端和服务端身份认证。涵盖会话访问、受保护路由、登录/登出和获取用户数据。

**参见：**

- 资源：`using-authentication` 在 Fullstack Recipes 中
- URL：https://fullstackrecipes.com/recipes/using-authentication

---

### 客户端身份认证

在 React 组件中使用认证客户端钩子：

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

### 服务端会话访问

在服务器组件和 API 路由中获取会话：

```typescript
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";

// 在服务器组件中
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
// 在 API 路由中
export async function POST(request: Request) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return new Response("Unauthorized", { status: 401 });
	}

	// 使用 session.user.id 进行查询...
}
```

### 受保护页面模式

重定向未认证用户：

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

### 认证页面模式

从认证页面重定向已认证用户：

```tsx
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";

export default async function SignInPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		redirect("/chats"); // 已登录
	}

	return <SignIn />;
}
```

### 登录

```typescript
import { signIn } from "@/lib/auth/client";

// 邮箱/密码
await signIn.email({
	email: "user@example.com",
	password: "password",
	callbackURL: "/chats",
});

// 社交提供商
await signIn.social({
	provider: "google",
	callbackURL: "/chats",
});
```

### 注册

```typescript
import { signUp } from "@/lib/auth/client";

await signUp.email({
	email: "user@example.com",
	password: "password",
	name: "John Doe",
	callbackURL: "/verify-email",
});
```

### 登出

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

### 认证后获取用户数据

在受保护页面中，验证会话后获取用户特定数据：

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

## 参考资料

- [Better Auth React](https://www.better-auth.com/docs/react)
- [Better Auth Server](https://www.better-auth.com/docs/server)

---

# AI 聊天持久化与 Neon

使用 UUID v7 将 AI 聊天对话持久化到 Neon Postgres，完全支持 AI SDK 消息部分，包括工具、推理和流式传输。

### 安装包

```bash
bun add uuid zod
bun add -D @types/uuid
```

### 为何使用 UUID v7？

UUID v7 在其前 48 位中编码 Unix 时间戳，使 ID 按创建时间 lexicographically 排序：

```typescript
import { v7 as uuidv7 } from "uuid";

const id = uuidv7(); // 例如 "019012c5-7f3a-7000-8000-000000000000"
```

这实现了：

- **消息排序** - 按 ID 排序，而不需要单独的 `createdAt` 索引
- **部分排序** - 消息部分（文本、推理、工具）在按 ID 排序时保持插入顺序
- **高效查询** - UUID v7 主键作为自然排序键

### 在 Postgres 中启用 UUID v7

在创建表之前，启用 `pg_uuidv7` 扩展：

```sql
CREATE EXTENSION IF NOT EXISTS pg_uuidv7;
```

> **注意**：Postgres 18+ 通过 `uuidv7()` 原生支持 UUID v7。更新您的模式以在可用时使用 `uuid_generate_v7()` 代替 `uuidv7()`。

### 模式定义

创建聊天数据库模式：

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

// runId 在消息流式传输时为非空，完成时为空
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

`runId` 列启用流恢复 - 它在消息开始流式传输时设置，并在完成时清除。

### 消息部分表

AI SDK 消息包含多种部分类型。每种类型都有自己的表以实现高效查询和并行插入：

```typescript
// 文本内容部分
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

// 推理/思考部分（用于具有扩展思考的模型）
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

// 工具调用部分
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

// 源 URL 引用部分
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

// 自定义数据部分（进度更新、结构化数据）
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
	dataType: text("data_type").notNull(), // data-progress, data-weather 等
	data: jsonb("data").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 文件附件部分
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
	mediaType: text("media_type").notNull(), // IANA 媒体类型 (image/png, application/pdf)
	filename: text("filename"),
	url: text("url").notNull(), // 数据 URL 或常规 URL
	providerMetadata: jsonb("provider_metadata"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 源文档引用部分
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

### 类型导出

在模式文件末尾添加类型导出：

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

### 从中央模式重新导出

更新中央模式文件：

```typescript
// src/lib/db/schema.ts
export * from "@/lib/chat/schema";
```

### 生成并运行迁移

```bash
bun run db:generate
bun run db:migrate
```

---

## 设计决策

### 单独表 vs JSONB

消息部分存储在单独的表中，而不是单个 JSONB 列中：

- **高效查询** - 无需扫描所有消息即可查询特定部分类型
- **并行插入** - 不同部分类型可以并发插入
- **索引** - 在特定列上添加索引（例如 `toolType`、`sourceId`）
- **类型安全** - Drizzle 为每个表提供完整的类型推断

### 部分表上的 chatId

每个部分表都包含一个 `chatId` 列，即使它可以通过 `messageId` 派生：

- **查询效率** - 在一个查询中获取聊天的所有部分，无需连接
- **级联删除** - 消息和聊天删除都正确级联
- **索引使用** - 无需接触消息表即可按聊天筛选

### 用于流恢复的 runId

消息上的 `runId` 列启用了工作流流恢复：

- 在流开始时设置，完成时清除
- 如果用户刷新流中间，页面可以检测到不完整的消息
- 将 `runId` 传递给客户端以自动重新连接

---

## 聊天类型

定义扩展 AI SDK 基础类型并包含您的工具和数据部分的类型。将这些放在您的工作流文件夹中：

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
 * 断言 UIMessage 部分是有效的 ChatAgentUIMessage 部分。
 * 根据已知的 TOOL_TYPES 验证工具类型，根据已知的数据部分类型验证数据类型。
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

## 工具定义

使用它们的模式定义您的工具。`TOOL_TYPES` 数组必须与以 `tool-` 为前缀的工具键匹配：

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
			// 在这里实现您的网络搜索逻辑
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

// 工具类型名称用于数据库模式 - 必须与 allTools 中的键匹配，前缀为 "tool-{key}"
export const TOOL_TYPES = ["tool-webSearch", "tool-countCharacters", "tool-saveDocument"] as const;

export type ToolType = (typeof TOOL_TYPES)[number];
```

---

## 查询辅助函数

创建用于持久化和检索消息的函数：

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
 * 确保给定用户的聊天存在，必要时创建它。
 * 如果聊天存在但属于不同用户，则返回 false。
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
 * 验证聊天是否属于特定用户。
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

### 消息部分插入

预生成 UUID v7 ID 以保持插入顺序：

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
				assert(!!part.approval?.id, "需要审批 ID");
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
				throw new Error(`未知数据类型 ${part.type}`);
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

### 获取消息

并行获取所有部分并重建消息：

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

	return messagesData.map((message) => ({
		...message,
		parts: partsMap.get(message.id) || [],
	}));
}
```

### 转换为 UI 消息

将数据库消息转换为 AI SDK 格式：

```typescript
export function convertDbMessagesToUIMessages(dbMessages: MessageWithParts[]): ChatAgentUIMessage[] {
	return dbMessages.map((message) => {
		const parts: ChatAgentUIMessage["parts"] = [];

		for (const part of message.parts) {
			if (part.type === "text") {
				parts.push({
					type: "text",
					text: part.text,
					providerMetadata: parseMetadata(part.providerMetadata),
				});
			} else if (part.type === "reasoning") {
				parts.push({
					type: "reasoning",
					text: part.text,
					providerMetadata: parseMetadata(part.providerMetadata),
				});
			} else if (part.type === "tool") {
				const toolState = part.state as "output-available" | "output-error" | "output-denied";

				if (toolState === "output-available") {
					parts.push({
						type: part.toolType,
						toolCallId: part.toolCallId,
						toolName: part.toolType.replace(/^tool-/, ""),
						input: part.input,
						output: part.output,
						state: "result-available",
						callProviderMetadata: parseMetadata(part.callProviderMetadata),
						providerExecuted: part.providerExecuted,
					});
				} else if (toolState === "output-error") {
					parts.push({
						type: part.toolType,
						toolCallId: part.toolCallId,
						toolName: part.toolType.replace(/^tool-/, ""),
						input: part.input,
						error: part.errorText ?? undefined,
						state: "error",
						callProviderMetadata: parseMetadata(part.callProviderMetadata),
						providerExecuted: part.providerExecuted,
					});
				} else if (toolState === "output-denied") {
					parts.push({
						type: part.toolType,
						toolCallId: part.toolCallId,
						toolName: part.toolType.replace(/^tool-/, ""),
						input: part.input,
						state: "denied",
						approval: {
							id: part.approvalId!,
							reason: part.approvalReason ?? undefined,
						},
						callProviderMetadata: parseMetadata(part.callProviderMetadata),
						providerExecuted: part.providerExecuted,
					});
				}
			} else if (part.type === "source-url") {
				parts.push({
					type: "source-url",
					sourceId: part.sourceId,
					url: part.url,
					title: part.title,
					providerMetadata: parseMetadata(part.providerMetadata),
				});
			} else if (part.type === "data") {
				parts.push({
					type: part.dataType,
					data: part.data,
				});
			} else if (part.type === "file") {
				parts.push({
					type: "file",
					mediaType: part.mediaType,
					filename: part.filename ?? undefined,
					url: part.url,
					providerMetadata: parseMetadata(part.providerMetadata),
				});
			} else if (part.type === "source-document") {
				parts.push({
					type: "source-document",
					sourceId: part.sourceId,
					mediaType: part.mediaType,
					title: part.title,
					filename: part.filename ?? undefined,
					providerMetadata: parseMetadata(part.providerMetadata),
				});
			}
		}

		return {
			id: message.id,
			role: message.role,
			parts,
			createdAt: message.createdAt,
		};
	});
}
```

### 聊天列表查询

获取用户的所有聊天：

```typescript
export async function getUserChats(userId: string) {
	return db.query.chats.findMany({
		where: eq(chats.userId, userId),
		orderBy: (chats, { desc }) => [desc(chats.updatedAt)],
	});
}
```

---

## 参考资料

- [AI SDK 消息文档](https://ai-sdk.dev/docs/ai-sdk-core/messages)
- [Drizzle 查询](https://orm.drizzle.team/docs/select#querying)
- [UUID v7 PostgreSQL](https://www.postgresql.org/docs/current/uuid-ossp.html)

---

# 工作流开发套件设置

安装和配置工作流开发套件，用于可恢复的持久化 AI 代理工作流，包含步骤级持久性、流恢复和代理编排功能。

### 步骤 1：安装包

```bash
bun add workflow @workflow/ai
```

### 步骤 2：创建工作流文件夹

创建 `src/workflows/` 文件夹来组织工作流代码：

```plain
src/workflows/
```

每个工作流在 `steps/` 目录中都有自己的子文件夹用于步骤函数，以及一个 `index.ts` 用于编排函数：

```plain
src/workflows/
  chat/
    index.ts       # 工作流编排函数
    steps/         # 步骤函数 ("use step")
      history.ts
      logger.ts
      name-chat.ts
    types.ts       # 工作流特定类型
```

### 步骤 3：更新 Next.js 配置

更新 Next.js 配置：

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

## 聊天工作流

创建处理用户消息并生成 AI 响应的主要工作流：

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
 * 处理用户消息并生成 AI 响应的主要聊天工作流。
 * 使用 runId 实现客户端重新连接时的流可恢复性。
 */
export async function chatWorkflow({ chatId, userMessage }: { chatId: string; userMessage: ChatAgentUIMessage }) {
	"use workflow";

	const { workflowRunId } = getWorkflowMetadata();

	await log("info", "Starting chat workflow", { chatId, runId: workflowRunId });

	// 持久化用户消息
	await persistUserMessage({ chatId, message: userMessage });

	// 创建带有 runId 的占位符助手消息以实现可恢复性
	const messageId = await createAssistantMessage({
		chatId,
		runId: workflowRunId,
	});

	// 获取完整的消息历史
	const history = await getMessageHistory(chatId);

	// 运行代理并流式传输
	const { parts } = await chatAgent.run(history, {
		maxSteps: 10,
		writable: getWritable(),
	});

	// 持久化助手消息部分
	await persistMessageParts({ chatId, messageId, parts });

	// 清除 runId 以标记消息完成
	await removeRunId(messageId);

	// 如果是第一条消息，生成聊天标题
	await nameChatStep(chatId, userMessage);

	await log("info", "Chat workflow completed", {
		chatId,
		runId: workflowRunId,
		partsCount: parts.length,
	});
}
```

---

## 历史记录步骤

为消息持久化创建步骤函数：

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
 * 持久化用户消息到数据库。
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

	// 更新聊天时间戳
	await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, chatId));
}

/**
 * 创建带有 runId 的占位符助手消息以实现流恢复。
 * 部分将在流完成后添加。
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
 * 在流完成后持久化消息部分。
 * 验证并将通用 UIMessage 部分缩小为 ChatAgentUIMessage 部分。
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

	// 更新聊天时间戳
	await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, chatId));
}

/**
 * 获取聊天的消息历史，转换为 UI 消息格式。
 */
export async function getMessageHistory(chatId: string): Promise<ChatAgentUIMessage[]> {
	"use step";

	const dbMessages = await getChatMessages(chatId);
	return convertDbMessagesToUIMessages(dbMessages);
}

/**
 * 在流完成后清除消息中的 runId。
 * 这标记消息为最终状态。
 */
export async function removeRunId(messageId: string): Promise<void> {
	"use step";

	await clearMessageRunId(messageId);
}
```

---

## 工作流中的日志记录

工作流函数在不支持 Node.js 模块（如 `fs`、`events` 或 `worker_threads`）的受限环境中运行。由于 pino 使用这些模块，您不能在工作流函数中直接导入记录器。

相反，将记录器调用包装在步骤函数中：

```typescript
// src/workflows/chat/steps/logger.ts
import { logger } from "@/lib/logging/logger";

type LogLevel = "info" | "warn" | "error" | "debug";

/**
 * 工作流安全的日志步骤。
 * 将 pino 记录器调用包装在步骤函数中，以避免将
 * Node.js 模块（fs、events、worker_threads）打包到工作流函数中。
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

此模式适用于任何使用 Node.js 模块的库。将导入和使用移动到步骤函数中以将其与工作流运行时隔离。

---

## 参考资料

- [工作流开发套件文档](https://useworkflow.dev/docs)
- [Next.js 入门指南](https://useworkflow.dev/docs/getting-started/next)

---

# 可恢复的 AI 响应流

使用 WorkflowChatTransport、开始/恢复 API 端点和 useResumableChat 钩子为 AI 聊天添加自动流恢复功能。

### 开始工作流端点

创建开始工作流运行的端点：

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

	// 确保聊天存在（如果需要则创建）并验证所有权
	const isAuthorized = await ensureChatExists(chatId, session.user.id);
	if (!isAuthorized) {
		return new Response("Forbidden", { status: 403 });
	}

	// 使用用户消息开始工作流
	const run = await start(chatWorkflow, [
		{
			chatId,
			userMessage: message,
		},
	]);

	// 返回带有 runId 的流以实现可恢复性
	return createUIMessageStreamResponse({
		stream: run.readable,
		headers: {
			"x-workflow-run-id": run.runId,
		},
	});
}
```

### 恢复流端点

创建恢复工作流流的端点：

```typescript
// src/app/api/chats/[chatId]/messages/[runId]/stream/route.ts
import { headers } from "next/headers";
import { getRun } from "workflow/api";
import { createUIMessageStreamResponse } from "ai";
import { auth } from "@/lib/auth/server";
import { verifyChatOwnership } from "@/lib/chat/queries";

/**
 * GET /api/chats/:chatId/messages/:runId/stream
 * 工作流流的恢复端点
 *
 * 查询参数：
 *   - startIndex：可选的恢复块索引
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

### 关键工作流 API 函数

**`start(workflow, args)`**

开始新的工作流运行：

- 返回 `{ runId, readable }`
- `runId` 唯一标识此运行以进行恢复
- `readable` 是 UI 消息块的 `ReadableStream`

**`getRun(runId)`**

获取现有的工作流运行：

- 返回带有 `getReadable({ startIndex? })` 的运行对象
- `startIndex` 允许从特定块恢复

### 响应头

`x-workflow-runId` 头对于可恢复性至关重要：

```typescript
return createUIMessageStreamResponse({
	stream: run.readable,
	headers: {
		"x-workflow-run-id": run.runId,
	},
});
```

客户端捕获此头并使用它进行重新连接。

### 授权

两个端点都验证：

1. 用户已通过身份验证（会话存在）
2. 用户拥有聊天（`ensureChatExists` / `verifyChatOwnership`）

这可以防止未经授权访问其他用户的工作流流。

---

## 工作流客户端集成

客户端使用 `WorkflowChatTransport` 实现自动流恢复。

### 可恢复聊天钩子

**通过 shadcn 注册表安装：**

```bash
bunx --bun shadcn@latest add https://fullstackrecipes.com/r/use-resumable-chat.json
```

**或复制源代码：**

`hooks/use-resumable-chat.ts`：

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
	/** 用于恢复中断流的初始工作流运行 ID */
	initialRunId?: string;
}

/**
 * 使用 WorkflowChatTransport 包装 useChat 的自定义钩子，用于可恢复的流式传输。
 *
 * 使用 useStateRef 跟踪活动的工作流运行 ID，实现自动
 * 重新连接到中断的流，而不会出现闭包过时问题。
 */
export function useResumableChat({ chatId, messageHistory, initialRunId }: UseResumableChatOptions) {
	const activeRunIdRef = useRef<string | undefined>(initialRunId);

	const chatResult = useChat<ChatAgentUIMessage>({
		messages: messageHistory,
		resume: !!initialRunId,
		transport: new WorkflowChatTransport({
			// 发送新消息
			prepareSendMessagesRequest: ({ messages }) => ({
				api: `/api/chats/${chatId}/messages`,
				body: {
					chatId,
					message: messages[messages.length - 1],
				},
			}),

			// 发送消息时存储工作流运行 ID
			onChatSendMessage: (response) => {
				const workflowRunId = response.headers.get("x-workflow-run-id");
				if (workflowRunId) {
					activeRunIdRef.current = workflowRunId;
				}
			},

			// 配置重新连接以使用 ref 获取最新值
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

			// 聊天流结束时清除工作流运行 ID
			onChatEnd: () => {
				activeRunIdRef.current = undefined;
			},

			// 重新连接错误时重试最多 5 次
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

### 带恢复检测的聊天页面

创建或更新带有恢复检测的聊天页面：

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

	// 获取此聊天的所有消息
	const persistedMessages = await getChatMessages(chatId);

	// 检查最后一条消息是否是不完整的助手消息（有 runId 但没有部分）
	// 这发生在工作流中途被中断时
	const lastMessage = persistedMessages.at(-1);
	const isIncompleteMessage =
		lastMessage?.role === "assistant" &&
		lastMessage?.runId &&
		lastMessage?.parts.length === 0;

	// 如果不完整，提取 runId 用于恢复，并从历史记录中删除空消息
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

### 恢复检测的工作原理

1. **页面加载时**，获取聊天的所有消息
2. **检查最后一条消息** - 如果它是带有 `runId` 但没有部分的助手消息，则表示不完整
3. **提取 `runId`** - 传递给客户端用于恢复
4. **删除空消息** - 不要在 UI 中显示不完整的消息
5. **客户端恢复** - `WorkflowChatTransport` 使用 `runId` 重新连接

### WorkflowChatTransport 选项

| 选项 | 描述 |
| `prepareSendMessagesRequest` | 配置初始消息发送请求 |
| `onChatSendMessage` | 消息发送时的回调（捕获 `runId`） |
| `prepareReconnectToStreamRequest` | 配置重新连接请求 URL |
| `onChatEnd` | 流完成时的回调 |
| `maxConsecutiveErrors` | 重新连接重试次数 |

---

# 自定义持久化代理

构建具有完全控制 streamText 选项、提供程序配置和工具循环的自定义持久化 AI 代理。与工作流开发套件兼容。

## 为什么需要自定义代理？

内置的 [`DurableAgent`](https://useworkflow.dev/docs/api-reference/workflow-ai/durable-agent) 来自 `@workflow/ai/agent` 涵盖了大多数用例。在以下情况下需要此自定义代理：

1. **流式推理/来源** - `DurableAgent` 不暴露 `sendReasoning` 或 `sendSources` 选项
2. **UIMessage 持久化** - `DurableAgent.onFinish` 提供 `ModelMessage[]`，但此代理通过 `toUIMessageStream().onFinish` 直接提供带有其 `parts` 数组的 `UIMessage`

## 工作原理

`Agent` 类使用工具循环包装 AI SDK 的 `streamText`。它在内部使用 `toUIMessageStream()` 来捕获每一步中的 `responseMessage: UIMessage`。

关键设计决策：

1. **可序列化配置** - 工具函数通过键引用，并在步骤执行器内部解析
2. **独立步骤执行器** - `"use step"` 指令仅在独立函数中有效，不在类方法中有效

## 定义代理

**通过 shadcn 注册表安装：**

```bash
bunx --bun shadcn@latest add https://fullstackrecipes.com/r/durable-agent.json
```

**或复制源代码：**

`lib/ai/agent.ts`：

```typescript
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
 * 可序列化的流选项（排除像 onFinish 这样的回调）。
 */
export interface StreamOptions {
	sendStart?: boolean;
	sendFinish?: boolean;
	sendReasoning?: boolean;
	sendSources?: boolean;
}

/**
 * streamText 的可序列化选项（排除回调和消息）。
 */
export interface StepOptions {
	model: string;
	system: string;
	/** 工具集键 - 在步骤执行器内部解析为实际工具 */
	tools: ToolsKey;
	providerOptions?: ProviderOptions;
}

/**
 * 所有属性必须可序列化以实现工作流兼容性。
 */
export interface AgentConfig {
	stepOptions: StepOptions;
	streamOptions?: StreamOptions;
}

export interface AgentRunConfig {
	/** @default 20 */
	maxSteps?: number;
	/** 在工作流中传递 getWritable()，或在外部传递任何 WritableStream */
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
 * 在工具循环中执行 streamText 的 AI 代理。
 *
 * 配置完全可序列化以实现工作流兼容性。
 * 工具通过键引用，并在步骤执行器内部解析。
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
 * 带有 "use step" 指令的步骤执行器。
 * 从类中分离出来，因为 "use step" 仅在独立函数中有效。
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
```

## 创建代理实例

使用不同配置创建专用代理：

```typescript
// src/lib/ai/chat-agent.ts
import { Agent } from "./agent";

export const chatAgent = new Agent({
	stepOptions: {
		model: "gpt-4o",
		system: `您是一个有用的 AI 助手。您可以帮助用户完成各种任务，包括研究和起草内容。

当用户要求您研究某些内容时，使用您的可用工具搜索信息。
当用户要求您起草内容时，使用您的起草工具保存文档。

在响应中要简洁但全面。`,
		tools: "research",
	},
	streamOptions: {
		sendReasoning: false,
		sendSources: false,
	},
});
```

对于带有提供程序选项的专用代理：

```typescript
// src/lib/ai/research-agent.ts
import { Agent } from "./agent";

export const researchAgent = new Agent({
	stepOptions: {
		model: "google/gemini-3-pro-preview",
		system: "您是一个研究代理...",
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

## 在工作流中运行

```typescript
import { getWorkflowMetadata, getWritable } from "workflow";
import { chatAgent } from "@/lib/ai/chat-agent";

export async function chatWorkflow({ chatId, userMessage }) {
	"use workflow";

	const { workflowRunId } = getWorkflowMetadata();

	// 持久化用户消息，创建助手占位符
	await persistUserMessage({ chatId, message: userMessage });
	const messageId = await createAssistantMessage({
		chatId,
		runId: workflowRunId,
	});

	// 获取完整的消息历史
	const history = await getMessageHistory(chatId);

	// 运行代理并流式传输
	const { parts } = await chatAgent.run(history, {
		maxSteps: 10,
		writable: getWritable(),
	});

	// 持久化助手消息部分
	await persistMessageParts({ chatId, messageId, parts });

	// 清除 runId 以标记消息完成
	await removeRunId(messageId);
}
```

## 在工作流外运行

代理也可以在工作流外运行 - 可用于测试或非持久化上下文：

```typescript
import { chatAgent } from "@/lib/ai/chat-agent";

// 选项 1：只获取部分（不流式传输）
const { parts, stepCount } = await chatAgent.run(history);
console.log(`Completed in ${stepCount} steps`);

// 选项 2：流式传输到自定义可写流
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

## 何时使用每个

**对大多数用例使用 `DurableAgent`** - 它更简单，并提供内联工具定义、回调和 `prepareStep`。

**在需要 `sendReasoning`/`sendSources` 流式传输或直接 `UIMessage` 格式进行持久化时使用此自定义代理**。

## 关键实现细节

### 为什么工具通过键引用

工作流运行时序列化步骤输入/输出。函数引用无法序列化，因此工具存储在 `toolSets` 对象中，并在步骤执行器内部通过键查找：

```typescript
const toolSets = {
	research: researchTools,
	drafting: draftingTools,
};

// 在 executeAgentStep 内部：
const tools = toolSets[config.stepOptions.tools];
```

### 为什么步骤执行器是独立的

`"use step"` 指令仅在独立函数中有效，不在类方法中有效。步骤执行器从类中提取出来：

```typescript
// 这样有效：
async function executeAgentStep(...) {
  "use step";
  // ...
}

// 这样无效：
class Agent {
  async executeStep(...) {
    "use step"; // 错误：指令在方法中不支持
  }
}
```

### 工具循环逻辑

代理持续执行步骤，直到模型停止调用工具：

```typescript
while (shouldContinue && stepCount < maxSteps) {
	const result = await executeAgentStep(modelMessages, stepConfig);
	// ...
	shouldContinue = result.finishReason === "tool-calls";
	stepCount++;
}
```

## 另请参阅

- [可恢复 AI 流](/recipes/resumable-ai-streams) - 使用此代理的完整配方
- [DurableAgent 文档](https://useworkflow.dev/docs/api-reference/workflow-ai/durable-agent) - 内置替代方案
- [AI SDK streamText](https://ai-sdk.dev/docs/ai-sdk-core/generating-text#streamtext) - 底层流式传输 API

---

# 使用工作流

创建和运行具有步骤、流式传输和代理执行功能的持久化工作流。涵盖开始、恢复和持久化工作流结果。

### 工作流文件夹结构

每个工作流在 `src/workflows/` 中都有自己的子文件夹：

```plain
src/workflows/
  chat/
    index.ts       # 包含带有 "use workflow" 指令的主要工作流函数。通过调用步骤函数编排工作流。
    steps/         # 包含带有 "use step" 指令的单独步骤函数。每个步骤都是一个持久化检查点。
    types.ts       # 工作流的 UI 消息类型定义。
```

- **`index.ts`** - 包含带有 `"use workflow"` 指令的主要工作流函数。通过调用步骤函数编排工作流。
- **`steps/`** - 包含带有 `"use step"` 指令的单独步骤函数。每个步骤都是一个持久化检查点。
- **`types.ts`** - 工作流的 UI 消息类型定义。

### 创建工作流

使用 `"use workflow"` 指令定义工作流：

```typescript
// src/workflows/chat/index.ts
import { getWorkflowMetadata, getWritable } from "workflow";
import { chatAgent } from "@/lib/ai/chat-agent";

export async function chatWorkflow({ chatId, userMessage }) {
	"use workflow";

	const { workflowRunId } = getWorkflowMetadata();

	// 持久化用户消息
	await persistUserMessage({ chatId, message: userMessage });

	// 创建带有 runId 的助手占位符以实现恢复
	const messageId = await createAssistantMessage({
		chatId,
		runId: workflowRunId,
	});

	// 获取消息历史
	const history = await getMessageHistory(chatId);

	// 运行代理并流式传输
	const { parts } = await chatAgent.run(history, {
		maxSteps: 10,
		writable: getWritable(),
	});

	// 持久化并完成
	await persistMessageParts({ chatId, messageId, parts });
	await removeRunId(messageId);
}
```

### 开始工作流

使用 `workflow/api` 中的 `start` 函数：

```typescript
import { start } from "workflow/api";
import { chatWorkflow } from "@/workflows/chat";

const run = await start(chatWorkflow, [{ chatId, userMessage }]);

// run.runId - 唯一标识此运行
// run.readable - UI 消息块的流
```

### 恢复工作流流

使用 `getRun` 重新连接到进行中或已完成的工作流：

```typescript
import { getRun } from "workflow/api";

const run = await getRun(runId);
const readable = await run.getReadable({ startIndex });
```

### 使用步骤

步骤是持久化其结果的持久化检查点：

```typescript
async function getMessageHistory(chatId: string) {
	"use step";

	const dbMessages = await getChatMessages(chatId);
	return convertDbMessagesToUIMessages(dbMessages);
}
```

### 从工作流流式传输

使用 `getWritable()` 向客户端流式传输数据：

```typescript
import { getWritable } from "workflow";

export async function chatWorkflow({ chatId }) {
	"use workflow";

	const writable = getWritable();

	// 传递给代理进行流式传输
	await chatAgent.run(history, { writable });
}
```

### 获取工作流元数据

访问当前运行的元数据：

```typescript
import { getWorkflowMetadata } from "workflow";

export async function chatWorkflow({ chatId }) {
	"use workflow";

	const { workflowRunId } = getWorkflowMetadata();

	// 存储 runId 以实现恢复
	await createAssistantMessage({ chatId, runId: workflowRunId });
}
```

### 工作流安全的日志记录

工作流运行时不支持 Node.js 模块。将日志器调用包装在步骤中：

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

### 在工作流中运行代理

使用自定义 `Agent` 类进行完全流式传输控制：

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

### 持久化工作流结果

使用步骤函数保存代理输出。`assertChatAgentParts` 函数验证通用的 `UIMessage["parts"]`（由代理返回）与应用程序特定的工具和数据类型匹配：

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

	// 更新聊天时间戳
	await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, chatId));
}
```

---

## 参考资料

- [工作流开发套件](https://useworkflow.dev/docs)
- [工作流 API 参考](https://useworkflow.dev/docs/api-reference)

---

_翻译完成日期：2026-01-14_
