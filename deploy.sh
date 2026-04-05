#!/bin/bash

# Weather Compare - Easy Deploy to Vercel
# Usage: ./deploy.sh "Your commit message"

set -e

if [ -z "$1" ]; then
  echo "Usage: ./deploy.sh \"Your commit message\""
  exit 1
fi

COMMIT_MSG="$1"

echo "🚀 Deploying Weather Compare to Vercel..."
echo ""

# Check git status
if ! git diff-index --quiet HEAD --; then
  echo "📝 Staging changes..."
  git add .
else
  echo "✅ No changes to stage"
fi

echo "💾 Committing: $COMMIT_MSG"
git commit -m "$COMMIT_MSG" || echo "⚠️  Nothing to commit"

echo "📤 Pushing to GitHub..."
git push

echo ""
echo "✨ Vercel will deploy automatically!"
echo "📊 Check deployment: https://vercel.com/dashboard"
echo ""
