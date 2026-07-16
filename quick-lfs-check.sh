#!/bin/bash

echo "=== Quick LFS Diagnostic ==="
echo "Repository: $(pwd)"
echo "Git LFS Version: $(git lfs version 2>/dev/null || echo 'NOT INSTALLED')"
echo ""

echo "Hero video file check:"
if [ -f "app/static/AccraGhanaClipped.mp4" ]; then
    file_size=$(ls -lh app/static/AccraGhanaClipped.mp4 | awk '{print $5}')
    echo "✅ AccraGhanaClipped.mp4 exists ($file_size)"
    
    # Check if it's a text pointer (LFS not pulled)
    if file app/static/AccraGhanaClipped.mp4 | grep -q "text"; then
        echo "❌ File is a text pointer - LFS files not downloaded"
        echo "💡 Run: git lfs pull"
    else
        echo "✅ File is actual video content"
    fi
else
    echo "❌ AccraGhanaClipped.mp4 missing"
fi

echo ""
echo "LFS status:"
git lfs ls-files | head -5
echo "... (showing first 5 LFS files)"

echo ""
echo "If video still not showing, check browser developer tools for 404 errors."
