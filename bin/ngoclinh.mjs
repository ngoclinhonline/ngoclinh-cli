#!/usr/bin/env node
import { Command } from "commander";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

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
    .description("NgocLinh CLI - Công cụ hỗ trợ phát triển")
    .version(pkg.version, "-v, --version", "Hiển thị phiên bản CLI");

  // Lệnh info
  program
    .command("info")
    .description("Thông tin về CLI và tác giả")
    .action(() => {
      console.log("NgocLinh CLI");
      console.log("Phiên bản:", pkg.version);
      console.log("Website  :", "https://ngoclinh.online");
      console.log("Email    :", "admin@ngoclinh.online");
    });

  // Lệnh list
  program
    .command("list")
    .description("Danh sách package được hỗ trợ")
    .action(() => {
      console.log("Danh sách package NgocLinh hỗ trợ:");
      console.log("- build-email-template");
      console.log("- (sẽ bổ sung thêm sau)");
    });

  // Giữ help mặc định
  program.helpOption("-h, --help", "Hiển thị hướng dẫn sử dụng");

  // Không cho Commander crash khi option sai
  program.exitOverride();

  try {
    program.parse(process.argv);
  } catch (err) {
    if (err.code === "commander.unknownOption") {
      console.log("Tùy chọn không hợp lệ:", err.optionName);
      console.log("Dùng: ngoclinh --help để xem hướng dẫn.");
    } else {
      console.log("Có lỗi xảy ra:", err.message);
    }
    process.exit(1);
  }
})();