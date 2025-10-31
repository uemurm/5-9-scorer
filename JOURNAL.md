# Development Journal

## Todo

* [x] Make the current rack stand out.
* [x] Set up configuration page and make this app a two-screen app.
* [ ] Select current player by drop-down list and re-arrange components.
* [ ] Configure
  * [x] Player names
  * [ ] Player order
  * [ ] Reverse order
  * [ ] Rack count
  * [ ] Point balls for each player

## 2025-10-31 Fri
- Develop setup page and make this app a two-screen app.
- Configure Player names.

## 2025-10-29 Wed
Github Pages にデプロイするために`gh-pages`のインストール、`package.json`や`vite.config.js`の変更を、誤って`gh-pages`ブランチで行ってしまったので、そのリカバリーが大変だった。

## 2025-10-28 Tue
- ローカルで Make the current rack stand out. を実現した。
- `npm install gh-pages`などして、Github Pages でアプリを動作させた。

## 2025-10-26 Sun
Divide each cell in two rows and print pocket history in the lower row.
Pushed to `origin/gh-pages` and deployed.

## 2025-08-19 Tue
- Edited App.jsx to split a cell to also display points in upper tr. JSX is more complicated than writing in HTML so let Gemini do that.

## 2025-08-13 Wed

- Gemini had me check console output on Dev Tools on the browser and even set breakpoints. But point history was not displayed so rolled back the changes.

## 2025-08-13 Wed

- Initialized the project using Vite and React, with the help from Gemini CLI.
- Updated `README.md` with project-specific details and removed the generic template content.

## 2025-08-15 Fri

- let users select between 9-ball and 5-ball by radio buttons then click a button of Side or Corner pocket. the control is displayed for each player.
