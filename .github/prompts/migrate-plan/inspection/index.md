# 巡检管理模块 提示词

## 001 开始大批量的完成巡检模块的初步迁移

1. 阅读 `docs\reports\vue2-route-navigation-map.md` 的 `巡检管理流程模块` 部分，了解清楚该模块有那些页面需要迁移，以及各个页面的关系。
2. 阅读 `.github\prompts\route-migration-map.yml` 的 `inspection_modules` 部分，明确清楚新页面和旧页面之间的映射关系。
3. 适当的阅读 `.claude\skills` 技能文件，在迁移时，务必遵守这些技能文件的要求。
4. 新建任务清单：
   - 为了避免你丢失任务信息和上下文，我要求你在 `.github\prompts\migrate-plan\inspection` 目录内，新建一个迁移目标，迁移任务清单的文件。避免你因为上下文合并或者是其他意外情况，导致丢失任务进度信息。
   - 请你先完成这样的清单文件新建。然后再开始下一步的迁移任务。

## <!-- TODO: --> 初始化强类型路由

你的路由跳转实现 `uni-mini-router` ，完全错了，本项目跳转路由时，用的不是这个方案。实现迁移时，请认真阅读 `.claude\skills\route-migration` 的路由跳转方案。

1. 阅读清楚正确的 `route-migration` 路由迁移技能。
2. 按照技能，初始化强类型的路由
3. 去更改 `src\pages-sub\inspection` 目录内全部的页面，使用正确的写法。避免使用不存在的 `uni-mini-router` 。

## <!-- TODO: --> 初始化业务类型、mock 接口、与 api

## <!-- TODO: --> 移动 `src\pages-sub\inspection\types.ts` 类型文件到正确的位置

1. 按照 `.claude\skills\api-migration\类型定义规范.md` ，移动该类型文件到正确的位置。
