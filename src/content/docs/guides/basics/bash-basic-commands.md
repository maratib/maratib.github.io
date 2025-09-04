---
title: Bash Basic Commands
slug: guides/basics/bash-basic-commands
description: Bash Basic Commands
sidebar:
  order: 1
---

- Let's learn `Bash` basic commands for day to day work.  
- We also call it Linux commands, or Terminal commands


<br>

### Check your current working directory
- `pwd` stands `print working directory`
```bash
pwd
```

### Goto `home` directory
- `cd` stands for `change directory`
- `~` Tilde stands for default home directory

```bash
cd ~
```

### Change directory
- `iwork/learn` is a relative path where we want to go after change directory

```bash
cd iwork/learn
```

### List all files/folders
- `ls` stands for list directory 
```bash
ls
```
### Make new directory
- `mkdir` stands for `Make Directory`

```bash
mkdir <directory_name>
```

### Remove directory
- `rm` stands for `remove`
- `-rf` are options `r` recursive `f` force, 
```bash
rm -rf <directory_name>
```
- Above command means delete the folder and all its files and sub folders recursively and don't ask for permission hence `force` used

## Essential Bash Commands for Daily Use

| Command | Description | Example |
|---------|-------------|---------|
| `ls` | List directory contents | `ls -la` |
| `cd` | Change directory | `cd ~/Documents` |
| `pwd` | Print working directory | `pwd` |
| `mkdir` | Create a new directory | `mkdir new_folder` |
| `rm` | Remove files/directories | `rm file.txt` |
| `cp` | Copy files/directories | `cp file.txt backup/` |
| `mv` | Move/rename files | `mv old.txt new.txt` |
| `cat` | Display file content | `cat file.txt` |
| `grep` | Search text patterns | `grep "search" file.txt` |
| `find` | Search for files | `find . -name "*.txt"` |
| `chmod` | Change file permissions | `chmod +x script.sh` |
| `ps` | Display running processes | `ps aux` |
| `kill` | Terminate processes | `kill 1234` |
| `top` | Display system processes | `top` |
| `df` | Disk space usage | `df -h` |
| `du` | Directory space usage | `du -sh *` |
| `head` | Show first lines of file | `head -n 10 file.txt` |
| `tail` | Show last lines of file | `tail -f log.txt` |
| `wc` | Word count | `wc -l file.txt` |
| `tar` | Archive files | `tar -czf archive.tar.gz folder/` |
| `ssh` | Secure shell connection | `ssh user@host` |
| `scp` | Secure copy | `scp file.txt user@host:/path/` |
| `history` | Command history | `history \| grep ssh` |
| `man` | Manual pages | `man ls` |
| `echo` | Display message | `echo "Hello"` |
| `export` | Set environment variable | `export PATH=$PATH:/new/path` |

