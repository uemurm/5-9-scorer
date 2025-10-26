# 5-9 Scorer Game Rules

## Definitions

* **Points**: The base value gained by a player for pocketing a ball.

  * 5-ball: 1 point
  * 9-ball: 2 points
  * These points are doubled if the ball is pocketed in a side pocket.
  * These "points" are used for the "I/X" history display in the scoreboard.
* **Score**: The numeric total of points accumulated by a player.

  * This includes "points" gained from pocketing balls and "points" gained/lost from the "collect points" rule.
  * **Collect Points Rule**: When a player pockets any ball, they gain "points" from each other player equal to the "points" value of the ball pocketed (doubled if pocketed in a side pocket). Each of the other players loses these "points".

## パラメーター

* ９番ダブル (True)
* マスワリはダブル (False)
  * 裏マスでもダブル (False)
* ツー出し (True)
  * 出来なかったら次マスのブレイクは次のプレーヤー。
  * 出来なかったら９番シングル。
  * 出来なかったら９番のポケットは認められない。
  * 現状ブレイク (False)
* 倍マス (True) 全員同点なら次マスは倍
