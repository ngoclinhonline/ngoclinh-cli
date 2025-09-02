#!/bin/bash

# Kiểm tra có nhập message không
if [ -z "$1" ]
then
  echo "❌ Vui lòng nhập commit message!"
  echo "👉 Ví dụ: sh push.sh 'Add LICENSE file'"
  exit 1
fi

# Add toàn bộ file thay đổi
git add .

# Commit với message truyền vào
git commit -m "$1"

# Push lên branch main
git push origin main