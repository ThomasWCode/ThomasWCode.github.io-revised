import { createReadStream } from "node:fs";
import { access, readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stripFrontMatter } from "./site-files.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".mp3", "audio/mpeg"],
  [".mp4", "video/mp4"],
  [".pdf", "application/pdf"],
  [".png", "image/png"],
  [".webm", "video/webm"],
  [".webp", "image/webp"],
  [".woff2", "font/woff2"],
]);

async function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, "http://localhost").pathname);

  if (pathname === "/") {
    return path.join(root, "index.html");
  }

  if (pathname.endsWith("/")) {
    const pagePath = path.join(root, `${pathname.slice(1, -1)}.html`);
    try {
      await access(pagePath);
      return pagePath;
    } catch {
      return path.join(root, pathname.slice(1), "index.html");
    }
  }

  return path.join(root, pathname.slice(1));
}

async function requestHandler(request, response) {
  const filePath = await resolveRequestPath(request.url || "/");
  const relativePath = path.relative(root, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    response.writeHead(404).end("Not found");
    return;
  }

  try {
    await access(filePath);
    const fileStats = await stat(filePath);

    if (!fileStats.isFile()) {
      throw new Error("Not a file");
    }

    const extension = path.extname(filePath).toLowerCase();
    response.setHeader("Content-Type", mimeTypes.get(extension) || "application/octet-stream");

    if (extension === ".html") {
      const html = stripFrontMatter(await readFile(filePath, "utf8"));
      response.writeHead(200).end(request.method === "HEAD" ? undefined : html);
      return;
    }

    response.writeHead(200);
    if (request.method === "HEAD") {
      response.end();
    } else {
      createReadStream(filePath).pipe(response);
    }
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

export function startServer({ host = "127.0.0.1", port = 4173 } = {}) {
  const server = createServer(requestHandler);
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => resolve(server));
  });
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4173);
  const server = await startServer({ port });
  console.log(`Test server listening on http://127.0.0.1:${port}`);

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => server.close(() => process.exit(0)));
  }
}
