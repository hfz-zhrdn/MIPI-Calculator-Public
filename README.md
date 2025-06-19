# Lattice HTML Video Bandwidth Calculator

This is a web-based Video Bandwidth Calculator for end-user to find out the required/range of parameters that they can implement into their design in Lattice Radiant Software.

## Description

This README will guide the reader step-by-step to view the webpage pulled from this repository. As of time of writing, there are two (2) branches: `main` and `hafiz`. `main` should be the one to be pulled into your project folder while the other branch(es) will be used for testing features.

### Pre-Requisites

Guide on how to install the listed requirements will be included below this section.

1. Git (Tested on v2.49.0.windows.1)
2. Microsoft Visual Studio Code
3. Live Server VSCode Extension (Install in VisualStudio Code Application, further details below)
4. Web browser (Tested on Microsoft Edge)
5. Winget (Should be pre-installed with Windows by default)

## Installing the Pre-Requisites

### Git

1. Open a Command Prompt terminal. 

![Search "Command Prompt" in the search bar.](/imgs/readme/git1.png "Should be first result in search")

2. Run the command `winget install git.git.` 

![Running the command winget git.git in Command Prompt.](/imgs/readme/git2.png "Make sure it's git.git")

3. Let it run until installation is complete.

### Microsoft Visual Studio Code

1. Open Self-Service Portal. 

![](/imgs/readme/vscode1.png)

2. Look for **Microsoft Visual Studio Code** and click Install 

![](/imgs/readme/vscode2.png)

### Live Server VSCode Extension

1. Launch **Microsoft Visual Studio Code**
2. Go to the **Extensions** tab. 

![](/imgs/readme/live1.png)

3. Search for **Live Server** and install the extension. 

![](/imgs/readme/live2.png)

## Viewing the calculator

1. Connect to Lattice VPN (Important!)
2. Launch Microsoft Visual Studio Code
3. Click **Open Folder** and choose a folder to place all the project files into (recommended a new one) 

![](/imgs/readme/open1.png)

4. Open a Terminal within the Visual Studio Code application (Top left of the window) 

![](/imgs/readme/terminal1.png)

5. Enter the commands below step by step into the terminal (**Press Enter after each line!**)

```
git init
git remote add origin http://git.latticesemi.com/hafiz.zaharudin/HTML-Video-Bandwidth-Calculator
git pull origin main
```

![](/imgs/readme/terminal2.png)

5. Right click index.html > Open with Live Server 

![](/imgs/readme/terminal3.png)

## Help

For assistance, e-mail or send a message through Teams to:

Ai Ling Ng (Rachel)

Hafiz Zaharudin
