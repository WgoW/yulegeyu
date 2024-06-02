### 添加shadcn组件功能
```shell
npx shadcn-ui@latest init

✔ Would you like to use TypeScript (recommended)? … yes
✔ Which style would you like to use? › Default
✔ Which color would you like to use as base color? › Slate
✔ Where is your global CSS file? … app/globals.css
✔ Would you like to use CSS variables for colors? … yes
✔ Are you using a custom tailwind prefix eg. tw-? (Leave blank if not) …
✔ Where is your tailwind.config.js located? … tailwind.config.js
✔ Configure the import alias for components: … @/components
✔ Configure the import alias for utils: … @/lib/utils
✔ Are you using React Server Components? … no
✔ Write configuration to components.json. Proceed? … yes

✔ Writing components.json...
✔ Initializing project...
✔ Installing dependencies...

Success! Project initialization completed. You may now add
```
### 界面介绍
- 棋盘(层叠区), 最上面的打乱了层级和位置的 block 摆放区
- 随机区,只有一张显示出来的棋子
- 插槽区,棋子点击后放置的位置
- 功能区,各种道具功能

### 名字介绍
- box: 格子,棋盘上的一个格子
- block: 一张图片就是一个块,一个块占 3*3的格子

### 功能区

- 撤回,撤销上一步骤
- 移出,将底部块移出棋盘 todo
- 洗牌,将棋盘中的棋子所在在层级和所在棋盘位置重新随机
- 破坏,从棋盘上随机删掉几个块
- 圣光,棋盘上的下一点击动作无视块所在的层级
- 透视,查看随机区的块
