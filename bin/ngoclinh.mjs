#!/usr/bin/env node
import { Command } from "commander";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import importFrom from "import-from-esm";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function getPkg() {
  const pkgData = await readFile(resolve(__dirname, "../package.json"), "utf-8");
  return JSON.parse(pkgData);
}

const program = new Command();

(async () => {
  const pkg = await getPkg();

  program
    .name("ngoclinh")
    .description("NgocLinh CLI - Công cụ gọi framework trong hệ sinh thái NgocLinh")
    .version(pkg.version, "-v, --version", "Hiển thị phiên bản NgocLinh CLI");

  // Lệnh info
  program
    .command("info")
    .description("Thông tin về CLI và tác giả")
    .action(() => {
      console.log("NgocLinh CLI");
      console.log("Phiên bản CLI:", pkg.version);
      console.log("Website      :", "https://ngoclinh.online");
      console.log("Email        :", "admin@ngoclinh.online");
    });

  // Lệnh list
  program
    .command("list")
    .description("Danh sách package framework được hỗ trợ")
    .action(() => {
      console.log("Framework NgocLinh hỗ trợ:");
      console.log("- build-email (kế thừa Maizzle framework + CLI)");
    });

  // Forward toàn bộ lệnh sang build-email
  program
    .command("build-email [args...]")
    .allowUnknownOption()
    .description("Chạy command từ build-email framework (build, serve, make:*)")
    .action(async (args) => {
      try {
        // Lấy version của build-email từ package.json
        const { version: beVersion } = await importFrom(
          process.cwd(),
          "build-email/package.json"
        );

        // Nếu chỉ gọi `ngoclinh build-email --version`
        if (args.includes("--version") || args.includes("-v")) {
          console.log(`Build-email framework v${beVersion}`);
          return;
        }

        // Import CLI entry của build-email
        const bootstrap = await importFrom(
          process.cwd(),
          "build-email/src/index.js"
        );

        if (bootstrap.default) {
          // Forward args sang build-email
          process.argv = ["node", "build-email", ...args];
          await bootstrap.default();
        } else {
          console.error("Không tìm thấy entry CLI trong build-email.");
        }
      } catch (err) {
        console.error("Lỗi khi chạy build-email:", err.message);
      }
    });

  program.helpOption("-h, --help", "Hiển thị hướng dẫn sử dụng");
  program.parse(process.argv);
})();