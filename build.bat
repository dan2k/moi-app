@echo off
echo list file before update ........
ssh administrator@172.16.246.228 "ls -lat '/mnt/controldata/mpsicc/moi-app/client/'"
echo remove source on server ..........
ssh administrator@172.16.246.228 "rm -rf /mnt/controldata/mpsicc/moi-app/client/* "
ssh administrator@172.16.246.228 "ls -lat '/mnt/controldata/mpsicc/moi-app/client/'"
echo up source to server ..........
scp -r dist/* administrator@172.16.246.228:/mnt/controldata/mpsicc/moi-app/client/
echo +++ up load finish +++

