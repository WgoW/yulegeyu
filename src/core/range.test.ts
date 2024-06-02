import { assert, expect, it } from 'vitest'
import { ChessBoard } from '@/core/chessBoard.ts'
import { Range } from '@/core/range.ts'

it('测试 shrink', () => {
  const chessBoard = new ChessBoard()
  const range = chessBoard.getBlockInBoxRange()

  console.log(range)
  assert.deepEqual(range, new Range({ x: 0, y: 0 }, { x: 21, y: 21 }))
  const step = 2// 收缩步长
  // 收缩一次
  const range1 = range.shrink(0, step)
  assert.deepEqual(range1, new Range({ x: 2, y: 0 }, { x: 21, y: 21 }))
  // 收缩两次
  const range2 = range1.shrink(1, step)
  assert.deepEqual(range2, new Range({ x: 2, y: 0 }, { x: 21, y: 19 }))
  // 收缩三次
  const range3 = range2.shrink(2, step)
  assert.deepEqual(range3, new Range({ x: 2, y: 0 }, { x: 19, y: 19 }))
  // 收缩四次
  const range4 = range3.shrink(3, step)
  assert.deepEqual(range4, new Range({ x: 2, y: 2 }, { x: 19, y: 19 }))
  // 收缩五次
  const range5 = range4.shrink(4, step)
  assert.deepEqual(range5, new Range({ x: 4, y: 2 }, { x: 19, y: 19 }))
})

it('测试 random', () => {
  const range = new Range({ x: 2, y: 2 }, { x: 21, y: 19 })
  for (let i = 0; i < 100000; i++) {
    const x = range.randomX()
    expect(x >= 0 && x <= 21).toBe(true)
    const y = range.randomY()
    expect(y >= 0 && y <= 19).toBe(true)
  }
})
