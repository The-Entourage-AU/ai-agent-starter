#!/bin/bash
# 🚦 Pre-push guard (Claude Code PreToolUse hook on Bash).
# Before any `git push`: checks the remote is the right one, blocks force pushes,
# and runs the repo's checks. Exit 2 blocks the push and tells Claude why.

# The only remote this repo may push to. Exact URL or a glob, e.g. git@github.com:my-org/*
EXPECTED_REMOTE="*The-Entourage-AU/ai-agent-starter*"
# Check command. Empty = auto: `npm run build` if it exists, else `npm run lint`.
CHECK_CMD=""

input=$(cat)
cmd=$(jq -r '.tool_input.command // empty' <<<"$input")
cwd=$(jq -r '.cwd // empty' <<<"$input")

grep -qE '(^|[;&|[:space:]])git([[:space:]]+-C[[:space:]]+("[^"]+"|[^[:space:]]+))?[[:space:]]+push' <<<"$cmd" || exit 0

block() { echo "🚦 Push blocked: $1" >&2; exit 2; }

# Work out which repo is being pushed: `git -C <dir>`, else `cd <dir> &&`, else the session folder.
dir=""
re_cq='git[[:space:]]+-C[[:space:]]+"([^"]+)"'; re_c='git[[:space:]]+-C[[:space:]]+([^[:space:]]+)'
re_dq='^cd[[:space:]]+"([^"]+)"'; re_d='^cd[[:space:]]+([^[:space:];&]+)'
if [[ $cmd =~ $re_cq ]] || [[ $cmd =~ $re_c ]] || [[ $cmd =~ $re_dq ]] || [[ $cmd =~ $re_d ]]; then dir=${BASH_REMATCH[1]}; fi
dir=${dir/#\~/$HOME}  # expand a leading ~ (the shell would; the regex doesn't)
case "$dir" in "") dir="$cwd" ;; /*) ;; *) dir="$cwd/$dir" ;; esac

repo=$(git -C "$dir" rev-parse --show-toplevel 2>/dev/null) || block "not inside a git repo ($dir). Run the push from the repo folder."

# Look only at the push itself (up to the next ; & |), so a "+" or "-f" in a commit message isn't a force push.
push_part=$(grep -oE 'git([[:space:]]+-C[[:space:]]+("[^"]+"|[^[:space:]]+))?[[:space:]]+push[^;&|]*' <<<"$cmd")
grep -qE -- '(--force|[[:space:]]-f([[:space:]]|$)|[[:space:]]\+[^[:space:]])' <<<"$push_part" && block "force push. Ask the owner first."

[[ "$EXPECTED_REMOTE" == "{{SET_AT_SETUP}}" || -z "$EXPECTED_REMOTE" ]] && block "EXPECTED_REMOTE isn't set in .claude/hooks/pre-push-guard.sh. Set it to this repo's origin, then push."
remote=$(git -C "$repo" remote get-url origin 2>/dev/null)
# shellcheck disable=SC2053  # glob match on purpose
shopt -s nocasematch  # GitHub owner/repo names are case-insensitive
[[ "$remote" == $EXPECTED_REMOTE ]] || block "origin is '$remote', not '$EXPECTED_REMOTE'. Tell the owner."

cd "$repo" || block "can't open $repo"
# Packages missing (fresh clone)? Install them instead of failing the check.
[[ -f package.json && ! -d node_modules ]] && npm install --no-audit --no-fund --loglevel=error >/dev/null 2>&1
if [[ -z "$CHECK_CMD" && -f package.json ]]; then
  if jq -e '.scripts.build' package.json >/dev/null 2>&1; then CHECK_CMD="npm run build"
  elif jq -e '.scripts.lint' package.json >/dev/null 2>&1; then CHECK_CMD="npm run lint"; fi
fi
[[ -z "$CHECK_CMD" ]] && exit 0
if ! out=$(bash -c "$CHECK_CMD" 2>&1); then
  echo "🚦 Push blocked: '$CHECK_CMD' failed in $(basename "$repo"). Fix it, then push again. If you can't, explain it to the person and, if it needs IT, write a message for Abdo or Fatma (it@the-entourage.com)." >&2
  tail -n 30 <<<"$out" >&2
  exit 2
fi
exit 0
