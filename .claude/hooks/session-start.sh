#!/bin/bash
# 🧰 Session start (Claude Code SessionStart hook).
# Gets the repo ready so nobody is blocked: installs missing packages, checks tools,
# and tells Claude about anything the person needs to do. Never fails the session.

cd "${CLAUDE_PROJECT_DIR:-$PWD}" 2>/dev/null || exit 0
notes=()

# 1. Packages: install when node_modules is missing or older than package-lock.json.
if [[ -f package.json ]] && command -v npm >/dev/null 2>&1; then
  if [[ ! -d node_modules ]] || [[ -f package-lock.json && package-lock.json -nt node_modules/.package-lock.json ]]; then
    if timeout 240 npm install --no-audit --no-fund --loglevel=error >/dev/null 2>&1; then
      notes+=("Installed the project's packages (npm install) so checks and the dev server work.")
    else
      notes+=("npm install failed. Run it yourself and read the error. If it is about access, the network or Node itself, give the person a ready-to-send message for IT (Abdo or Fatma, it@the-entourage.com) and keep working on anything else.")
    fi
  fi
elif [[ -f package.json ]]; then
  notes+=("Node.js/npm is not installed on this computer, so checks and the dev server can't run. Guide the person, one step at a time, to install the LTS version from https://nodejs.org, then restart Claude Code. If they can't install software, give them a ready-to-send message for IT (Abdo or Fatma, it@the-entourage.com).")
fi

# 2. jq: the push guard needs it to read commands.
if ! command -v jq >/dev/null 2>&1; then
  notes+=("jq is missing, so the push guard (.claude/hooks/pre-push-guard.sh) can't check pushes. Before every push, run 'npm run build' yourself and only push if it passes. Help the person install jq when convenient (macOS: brew install jq; Windows: use WSL or Git Bash). Not a blocker.")
fi

# 3. One-time upgrade notice per computer.
flag=".claude/.setup-kit-v3-seen"
if [[ ! -f "$flag" ]]; then
  notes+=("IT upgraded this repo to the company Claude setup (Setup Kit v3.2) on 2026-10-16. At the start of your first reply, tell the person in 2 to 3 plain lines: you now pick a lane (🟢🟡🔴) for each change, helper agents do some of the work, and a push guard checks every push (right repo, no force push, npm run build passes). Then continue with what they asked. Nothing about how they work changes.")
  touch "$flag" 2>/dev/null
fi

notes+=("Rule: never leave the person blocked. If something stops you (permissions, a failing check you can't fix, a missing secret, access), explain it in one plain line, give the shortest fix one step at a time, and if it needs IT, write a ready-to-send message for Abdo or Fatma (it@the-entourage.com). Keep building whatever doesn't depend on it.")

ctx=$(printf -- '- %s\n' "${notes[@]}")
if command -v jq >/dev/null 2>&1; then
  jq -n --arg c "$ctx" '{hookSpecificOutput:{hookEventName:"SessionStart",additionalContext:$c}}'
else
  printf '%s\n' "$ctx"
fi
exit 0
