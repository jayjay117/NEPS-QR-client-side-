# NEPS-QR-client-side-
# 🧾 🔐 Team Git Rules – Version 1.0
**For:** All Developers, Designers, and Contributors  
**Owner:** Innovative Technologies  
**Startup Standard Branch:** `main`

---

## 🧱 1. Branch Naming & Usage

| Purpose         | Branch Name           | Rules |
|----------------|-----------------------|-------|
| Main production | `main`                | ✅ All stable, deployable code must be here. |
| Feature work    | `feature/<name>`      | ✅ Use for isolated features. Merge back into `main`. |
| Fixes/Hotfixes  | `fix/<bug-name>`      | ✅ For bugs, small patches. |
| Backend work    | `main` in backend repo| ❌ Don't push to random branches like `super`. Use `main` unless told otherwise. |

> ❌ Never create arbitrary branches like `super`, `my-dev-branch`, etc. unless approved.

---

## 💡 2. Before You Push

- ✅ Pull latest from `main`:
  ```bash
  git checkout main
  git pull origin main
  ```

- ✅ Run and test locally

- ✅ Make meaningful commit messages:
  ```bash
  git commit -m "Add payment API integration"
  ```

---

## 🔁 3. Pull Request Workflow (Recommended)

1. **Create feature branch:**
   ```bash
   git checkout -b feature/user-auth
   ```

2. **Push branch:**
   ```bash
   git push origin feature/user-auth
   ```

3. **Create Pull Request** → Target: `main`

4. **Assign reviewer (optional)**

---

## 🚀 4. Deployment Rules

- Frontend deploys from: `main` (Netlify)
- Backend deploys from: `main` (Render, Railway, etc.)

**Make sure your code is in `main` before asking for deployment.**

---

## 🛡 5. Protection & Best Practice

- Enable branch protection on `main`
  - ✅ Require PR before merging
  - ✅ Require passing tests (if using CI/CD)
  - ✅ Prevent force-push

- Optional GitHub Actions: run formatters, linters, tests before merge

---

## 🧾 6. Roles & Responsibilities

| Role         | Responsibility |
|--------------|----------------|
| CEO (JJ)     | Final approval, vision |
| COO          | Workflow enforcement |
| Devs         | Branch discipline, code quality |
| CMO/Design   | Stay out of Git 😅 unless you know what you're doing |

---

## 📌 Summary

- Use `main` as the default, production-ready branch
- Feature work → feature branches, then PR into `main`
- Never push major changes to weird branches
- Keep deployment predictable
