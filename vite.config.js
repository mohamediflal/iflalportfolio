import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";

// Custom dev server API plugin to manage JSON storage and file uploads
const jsonApiPlugin = () => ({
  name: "json-api",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // Intercept /api/data/:file
      if (req.url.startsWith("/api/data/")) {
        const fileName = req.url.slice("/api/data/".length);
        // Ensure no directory traversal
        const safeName = path.basename(fileName);
        const filePath = path.resolve(__dirname, `./src/data/${safeName}.json`);

        if (req.method === "GET") {
          try {
            if (fs.existsSync(filePath)) {
              const data = fs.readFileSync(filePath, "utf-8");
              res.setHeader("Content-Type", "application/json");
              res.statusCode = 200;
              res.end(data);
            } else {
              res.statusCode = 404;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "File not found" }));
            }
          } catch (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        if (req.method === "POST" || req.method === "PUT") {
          try {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk.toString();
            });
            req.on("end", () => {
              fs.writeFileSync(filePath, body, "utf-8");
              res.setHeader("Content-Type", "application/json");
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true }));
            });
          } catch (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }
      }

      // Intercept /api/upload
      if (req.url === "/api/upload" && (req.method === "POST" || req.method === "PUT")) {
        try {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            try {
              const payload = JSON.parse(body);
              const { filename, base64 } = payload;
              
              if (!filename || !base64) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Filename and base64 data are required" }));
                return;
              }

              // Extract raw base64 data
              const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
              const buffer = Buffer.from(base64Data, "base64");

              const imagesDir = path.resolve(__dirname, "./public/images");
              if (!fs.existsSync(imagesDir)) {
                fs.mkdirSync(imagesDir, { recursive: true });
              }

              const cleanFilename = Date.now() + "_" + filename.replace(/[^a-zA-Z0-9.-]/g, "_");
              const writePath = path.join(imagesDir, cleanFilename);
              fs.writeFileSync(writePath, buffer);

              res.setHeader("Content-Type", "application/json");
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, url: `/images/${cleanFilename}` }));
            } catch (jsonErr) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Invalid JSON format" }));
            }
          });
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: err.message }));
        }
        return;
      }

      // Fallback
      next();
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), jsonApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
