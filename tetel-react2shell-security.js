#!/usr/bin/env node
/**
 * Script oficial TetelPontocom – Correção de segurança React2Shell / CVE-2025-66478
 * Modo:
 *   node tetel-react2shell-security.js scan  -> só verifica
 *   node tetel-react2shell-security.js fix   -> verifica e corrige
 *
 * Ajuste o array PROJECTS com os caminhos das pastas dos projetos.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// 👉 AJUSTE AQUI: liste os projetos que você quer varrer
const PROJECTS = [
  // Exemplo (troque para o seu caminho real):
  "C:/Users/Funcionário IA/Documents/GitHub/ACHADINHOS-SHOPEE-LP",
];

const PATCHED_NEXT = {
  "15.0": "15.0.5",
  "15.1": "15.1.9",
  "15.2": "15.2.6",
  "15.3": "15.3.6",
  "15.4": "15.4.8",
  "15.5": "15.5.7",
  "16.0": "16.0.7",
};

// Versão React estável corrigida (pode ser ajustada no futuro, se necessário)
const PATCHED_REACT = "19.2.1";

function normalizeVersion(v) {
  if (!v) return null;
  // Remove ^, ~, >= etc
  return v.replace(/^[^\d]*/, "").trim();
}

function compareSemver(a, b) {
  // retorna -1 se a < b, 0 se igual, 1 se a > b
  const pa = (a || "0.0.0").split(".").map((n) => parseInt(n, 10) || 0);
  const pb = (b || "0.0.0").split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i++) {
    if (pa[i] < pb[i]) return -1;
    if (pa[i] > pb[i]) return 1;
  }
  return 0;
}

function checkNextStatus(pkg) {
  const dep =
    (pkg.dependencies && pkg.dependencies.next) ||
    (pkg.devDependencies && pkg.devDependencies.next);

  if (!dep) {
    return { status: "missing", message: "Next.js não encontrado nas dependências." };
  }

  const original = dep;
  const v = normalizeVersion(dep);
  if (!v) {
    return { status: "unknown", current: original, message: "Não foi possível ler a versão de Next.js." };
  }

  const [major, minor] = v.split(".").map((n) => parseInt(n, 10) || 0);
  const key = `${major}.${minor}`;
  const patched = PATCHED_NEXT[key];

  if (!patched) {
    // não é uma linha 15.x ou 16.0.x conhecida como afetada
    return {
      status: "not-affected",
      current: original,
      message: `Linha de versão ${key} não está mapeada como afetada pelo script.`,
    };
  }

  const cmp = compareSemver(v, patched);
  if (cmp >= 0) {
    return {
      status: "ok",
      current: original,
      target: patched,
      message: `Next.js já está em versão corrigida ou superior (${v} >= ${patched}).`,
    };
  }

  return {
    status: "vulnerable",
    current: original,
    target: patched,
    message: `Next.js vulnerável (${v}) – precisa atualizar para pelo menos ${patched}.`,
  };
}

function ensureReactPatched(pkg, field) {
  if (!pkg[field]) pkg[field] = {};
  const deps = pkg[field];

  const react = deps.react;
  const reactDom = deps["react-dom"];

  function shouldUpdate(v) {
    if (!v) return true;
    const nv = normalizeVersion(v);
    return compareSemver(nv, PATCHED_REACT) < 0;
  }

  let changed = false;

  if (shouldUpdate(react)) {
    deps.react = PATCHED_REACT;
    changed = true;
  }
  if (shouldUpdate(reactDom)) {
    deps["react-dom"] = PATCHED_REACT;
    changed = true;
  }

  return changed;
}

function updateNextVersion(pkg, target) {
  let changed = false;
  if (pkg.dependencies && pkg.dependencies.next) {
    const original = pkg.dependencies.next;
    const prefix = original.trim().match(/^[^\d]*/) ? original.trim().match(/^[^\d]*/)[0] : "";
    pkg.dependencies.next = `${prefix}${target}`;
    changed = true;
  } else if (pkg.devDependencies && pkg.devDependencies.next) {
    const original = pkg.devDependencies.next;
    const prefix = original.trim().match(/^[^\d]*/) ? original.trim().match(/^[^\d]*/)[0] : "";
    pkg.devDependencies.next = `${prefix}${target}`;
    changed = true;
  }
  return changed;
}

function scanProject(projectPath) {
  const pkgPath = path.join(projectPath, "package.json");
  if (!fs.existsSync(pkgPath)) {
    console.log(`\n❌ [${projectPath}] – package.json não encontrado.`);
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const nextStatus = checkNextStatus(pkg);

  console.log(`\n📁 Projeto: ${projectPath}`);
  console.log(`   ➤ Next.js: ${nextStatus.current || "não encontrado"}`);
  console.log(`   ➤ Status: ${nextStatus.status}`);
  console.log(`   ➤ Detalhe: ${nextStatus.message}`);

  return { pkg, pkgPath, nextStatus };
}

function fixProject(projectPath) {
  const result = scanProject(projectPath);
  if (!result) return;

  const { pkg, pkgPath, nextStatus } = result;

  if (nextStatus.status === "missing" || nextStatus.status === "unknown") {
    console.log("   ⚠ Não será feita alteração automática neste projeto.");
    return;
  }

  if (nextStatus.status === "not-affected" || nextStatus.status === "ok") {
    console.log("   ✅ Sem ação necessária para Next.js neste projeto.");
  } else if (nextStatus.status === "vulnerable") {
    console.log("   🔧 Atualizando Next.js para versão corrigida:", nextStatus.target);
    const changedNext = updateNextVersion(pkg, nextStatus.target);
    if (!changedNext) {
      console.log("   ⚠ Não foi possível atualizar o campo de Next.js automaticamente.");
    }
  }

  // Garantir React / ReactDOM corrigidos
  let reactChanged = false;
  reactChanged = ensureReactPatched(pkg, "dependencies") || reactChanged;
  reactChanged = ensureReactPatched(pkg, "devDependencies") || reactChanged;

  if (reactChanged) {
    console.log(`   🔧 Ajustando React/ReactDOM para pelo menos ${PATCHED_REACT}.`);
  }

  // Salvar package.json caso tenha havido alguma mudança
  if (
    nextStatus.status === "vulnerable" ||
    reactChanged
  ) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), "utf8");
    console.log("   💾 package.json atualizado.");

    // Rodar npm install para sincronizar node_modules e lockfile
    try {
      console.log("   ⏳ Executando npm install ...");
      execSync("npm install", {
        cwd: projectPath,
        stdio: "inherit",
      });
      console.log("   ✅ npm install concluído.");
    } catch (err) {
      console.error("   ❌ Erro ao executar npm install:", err.message);
    }
  } else {
    console.log("   ✅ Nenhuma alteração necessária neste projeto.");
  }
}

// ---------------- EXECUÇÃO ----------------

const mode = process.argv[2] || "scan";

if (!PROJECTS.length) {
  console.log("⚠ O array PROJECTS está vazio. Edite o script e coloque os caminhos dos projetos.");
  process.exit(1);
}

console.log("============================================");
console.log(" Script de Segurança TetelPontocom – Next.js");
console.log("============================================");
console.log("Modo:", mode === "fix" ? "CORREÇÃO (fix)" : "VARREDURA (scan)");

for (const projectPath of PROJECTS) {
  try {
    if (mode === "fix") {
      fixProject(projectPath);
    } else {
      scanProject(projectPath);
    }
  } catch (err) {
    console.error(`\n❌ Erro ao processar projeto ${projectPath}:`, err.message);
  }
}

console.log("\n🏁 Fim da execução.\n");
