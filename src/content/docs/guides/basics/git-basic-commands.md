---
title: Git Basic Commands
slug: guides/basics/git-basic-commands
description: Git Basic Commands
sidebar:
  order: 2
---



### Git Clone

```bash
git clone <branch_url>

# Example
git clone git@github.com:maratib/learn-react-native.git
```

### Create local branch

- `b` stands for `branch`
```bash
git checkout -b <branch_name>

# Example
git checkout -b add-login-feature
```

# Delete local branch

- `d` stands for delete
```bash
git branch -d <branch_name>

# Example
git branch -d add-login-feature
```

# Push changes to branch 
```bash
git push origin <branch_name>

# Example
git push origin main
```

# Pull changes from branch 
```bash
git pull origin <branch_name>
```

# Merge branch 

```bash
git checkout <branch_name_in_which_you_want_merge>
git merge <branch_name_which_you_want_to_merge_in_current_branch>

# Example : lets suppose you want to merge add-login-branch to main branch
# First change to main branch 
git checkout main
# Then merge the other branch to main 
git merge add-login-feature

```

## Essential Git Commands for Daily Use

| Command | Description | Example |
|---------|-------------|---------|
| `git init` | Initialize a new Git repository | `git init` |
| `git clone` | Clone a remote repository | `git clone https://github.com/user/repo.git` |
| `git status` | Show the working tree status | `git status` |
| `git add` | Add files to staging area | `git add file.txt` or `git add .` |
| `git commit` | Commit changes to repository | `git commit -m "Commit message"` |
| `git push` | Push changes to remote repository | `git push origin main` |
| `git pull` | Fetch and integrate from remote repository | `git pull origin main` |
| `git fetch` | Download objects from remote repository | `git fetch origin` |
| `git branch` | List, create, or delete branches | `git branch new-feature` |
| `git checkout` | Switch branches or restore files | `git checkout develop` |
| `git switch` | Switch branches (newer alternative to checkout) | `git switch develop` |
| `git merge` | Join two development histories together | `git merge feature-branch` |
| `git log` | Show commit logs | `git log --oneline` |
| `git diff` | Show changes between commits | `git diff HEAD~1` |
| `git stash` | Stash changes for later use | `git stash` or `git stash pop` |
| `git remote` | Manage remote repositories | `git remote -v` |
| `git reset` | Reset current HEAD to specified state | `git reset --soft HEAD~1` |
| `git revert` | Revert existing commits | `git revert abc1234` |
| `git rm` | Remove files from working tree and index | `git rm file.txt` |
| `git mv` | Move or rename a file | `git mv old.txt new.txt` |
| `git tag` | Create and manage tags | `git tag v1.0.0` |
| `git show` | Show various types of objects | `git show abc1234` |
| `git config` | Configure Git settings | `git config --global user.name "Your Name"` |
| `git help` | Display help information | `git help commit` |



