/**
 * 块类型
 */
export interface BlockType {
  id: number
  x: number // 块的横坐标 ,通过xy坐标确定块在哪一个格子里面
  y: number // 块的纵坐标
  level: number // 第几层,数字越大层数越高
  type: string // 是什么类型的图片,比如说是🐔
  // 0 - 正常, 1 - 已点击(已进槽), 2 - 已消除
  status: 0 | 1 | 2
  // 下面的块,压住的其他块
  downBlocks: BlockType[]
  // 上面的块,被哪些块压住（为空表示可点击）
  upBlocks: BlockType[]
}

/**
 * 每个格子单元类型
 */
export interface ChessBoardUnitType {
  // 放到当前格子里的块（层级越高下标越大）
  blocks: BlockType[]
}

/**
 * 游戏配置类型
 */
export interface GameConfigType {
  // 槽容量
  slotNum: number
  // 需要多少个一样块的才能合成
  composeNum: number
  // 动物类别数
  typeNum: number
  // 边界收缩步长
  borderStep: number
  // 总层(批)数（最小为 2）
  levelNum: number
  // 每层(批)块数（大致）
  levelBlockNum: number
  // 随机区块数（数组长度代表随机区数量，值表示每个随机区生产多少块）
  randomBlocks: number[]
  // 动物数组
  animals: string[]
  // 最上层块数（已废弃）
  // topBlockNum: 40,
  // 最下层块数最小值（已废弃）
  // minBottomBlockNum: 20,
}

/**
 * 技能类型
 */
export interface SkillType {
  name: string
  desc: string
  icon: string
  action: () => void
}

/**
 * 游戏模式
 */
export enum GameMode {
  EASY = '简单模式',
  MIDDLE = '中等模式',
  HARD = '困难模式',
  LUNATIC = '地狱模式',
  SKY = '天狱模式',
  YANG = '羊了个羊模式',
  CUSTOM = '自定义模式',
}

// 游戏状态
export enum GameStatus {
  INIT = 0, // 初始化
  PLAYING = 1, // 进行中
  STOP_FAIL = 2, // 失败结束
  STOP_WIN = 3, // 胜利结束
}
