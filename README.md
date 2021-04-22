# 🗜️ Icons Squeeze machine

![Preview](README-img/preview.jpg)

A Figma plugin that allows you to merge multiple `SVG` paths into a single one for selected icons and then save them as a `JSON` file.

---

## 🕹 [Install plugin](https://www.figma.com/community/plugin/961245776147091630/ICONS-SQUEEZE-MACHINE)

#### 🤖 [Icons to test](https://www.figma.com/file/r5TqC09BRHtNanD8vSBkqA/%F0%9F%97%9C%EF%B8%8F-Icons-Squeeze-machine-TEST-ICONS?node-id=1%3A768)

#### 📺 [Youtube demo](https://youtu.be/po-FzKP7wjc)

---

## What is the plugin for

In case if you use icons in a project as an `Icon` component, important to store all assets in one place and as compact as possible. In this case it better to load only one `path d` instead of store multiple paths for one SVG icon.

**If you not familiar with the method [check this article](https://david-gilbertson.medium.com/icons-as-react-components-de3e33cb8792)**

So the plugin cuts the chain ⛓️: **_export icons → load to icomoon.io → export and save font → extract `JSON` → clean it. 🏁_**

With the plugin the chain should be ⛓️: **_export icons. 🏁_**

---

## How to use

1. Run the plugin.
2. Select your icons set.
   Important — icons should be selected, not the only one frame where they are. In this case the plugin will try to merge all icons into one within this frame.
3. Click on the `Preview` button.
4. Check that all icons are displayed as they should.
5. Click on the `Download JSON` button.

Plugin will generate `ZIP` folder with `JSON` file and `HTML` file that will preview all icons from the saved `JSON`.

---

## Possible issues

- **Failed union Boolean operation.** Icon elements were merged incorrectly. Solution — fix paths manually — flatten paths and outline curves.

- **You selected a frame with icons but not icons**. Please, note that you need to select icons, not the parent frame.

![select icons](README-img/select-icons.jpg)

---
