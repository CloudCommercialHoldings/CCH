#!/bin/bash

echo "=== Git LFS Repository Verification Script ==="
echo ""

# Check if Git LFS is installed
if ! command -v git-lfs &> /dev/null; then
    echo "❌ Git LFS is not installed. Please install it first:"
    echo "   brew install git-lfs"
    echo "   git lfs install"
    exit 1
fi

echo "✅ Git LFS is installed"

# Check if Git LFS is initialized for this repo
if [ ! -f .gitattributes ]; then
    echo "❌ No .gitattributes file found"
    exit 1
fi

echo "✅ .gitattributes file exists"

# Check LFS tracking patterns
echo ""
echo "📁 Current LFS tracking patterns:"
git lfs track

# Check if video files exist and are tracked
echo ""
echo "🎥 Video file verification:"

if [ -f "app/static/AccraGhana.mp4" ]; then
    echo "✅ AccraGhana.mp4 exists"
    file_size=$(ls -lh app/static/AccraGhana.mp4 | awk '{print $5}')
    echo "   Size: $file_size"
else
    echo "❌ AccraGhana.mp4 missing"
fi

if [ -f "app/static/AccraGhanaClipped.mp4" ]; then
    echo "✅ AccraGhanaClipped.mp4 exists"
    file_size=$(ls -lh app/static/AccraGhanaClipped.mp4 | awk '{print $5}')
    echo "   Size: $file_size"
else
    echo "❌ AccraGhanaClipped.mp4 missing"
fi

# Check if files are tracked by LFS
echo ""
echo "🔗 LFS tracking verification:"
lfs_files=$(git lfs ls-files | grep -i accra)
if [ -n "$lfs_files" ]; then
    echo "✅ Video files are tracked by LFS:"
    echo "$lfs_files"
else
    echo "❌ Video files are NOT tracked by LFS"
fi

# Check if LFS files are up to date on remote
echo ""
echo "☁️  Remote LFS status:"
echo "Checking if all LFS files are uploaded to remote..."

# Try to push LFS files (this will only upload missing ones)
git lfs push --all origin

echo ""
echo "📋 Summary for team members:"
echo "1. Install Git LFS: brew install git-lfs (macOS) or download from git-lfs.github.io"
echo "2. Initialize LFS in their local repo: git lfs install"
echo "3. Clone or pull the repository: git clone <repo-url> or git pull"
echo "4. Pull LFS files: git lfs pull"
echo ""
echo "If video still doesn't show:"
echo "- Check browser developer tools for 404 errors"
echo "- Verify the Flask static file serving is working"
echo "- Check that the video file path in index.html is: /static/AccraGhanaClipped.mp4"
