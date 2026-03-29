# 杂项提示词

各类杂七杂八的提示词，不一定和本项目有关。

## 001 <!-- TODO: --> 处理 cursor 无法识别读取 claude code 插件商城 sh 脚本并反复打开的问题

我在 cursor 每次实现对话时，每次都会自动打开 C:\Users\pc.claude\plugins\cache\ruan-cat-tools\common-tools\3.2.0\scripts\user-prompt-logger.sh 和 C:\Users\pc.claude\plugins\cache\ruan-cat-tools\common-tools\3.2.0\scripts\task-complete-notifier.sh 文件，我知道我在 cursor 内配置了读取是被 claude code 的插件商城，读取识别了全局的 hooks 并执行，但是我很不满意这个自动打开文件的做法。这导致页面不断的打开最新发布的 claude code 插件商城 sh 脚本，打断了我开发的心流状态。很影响我的开发状态；

是这个文件无法识别执行么？是里面的工作目录或者是环境变量写法，导致 cursor 无法执行 claude code 插件商城的 hooks sh 脚本么？

还是什么缘故？

我要修改的事 cursor 配置？还是去合理的修改这两个 .sh 的逻辑呢？

这两个 .sh 实际上来自于： D:\code\github-desktop-store\gh.ruancat.monorepo\ai-plugins\common-tools\scripts 项目提供的 sh 脚本。你看看是不是有写法不兼容的问题，导致 cursor 无法实现默认识别读取的故障？
