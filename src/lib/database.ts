import path from "path";
import fs from "fs";

type ApproveMessage =
  | "Projenizdeki verilerden tamamen siz sorumlusunuz. Bu veriler silinecektir. Onaylıyor musunuz? (onaylıyorum)";

export class Database {
  private dbfile: string;

  constructor(filePath?: string) {
    const dir = path.join(process.cwd(), "metusdb");
    this.dbfile = path.join(dir, filePath || "database.json");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(this.dbfile)) {
      fs.writeFileSync(this.dbfile, JSON.stringify({}, null, 2), "utf-8");
    }
  }

  private readDB(): Record<string, any> {
    return JSON.parse(fs.readFileSync(this.dbfile, "utf-8"));
  }

  private writeDB(content: any): void {
    fs.writeFileSync(this.dbfile, JSON.stringify(content, null, 2), "utf-8");
  }

  set(key: string, value: any): void {
    const dbContent = this.readDB();
    const keys = key.split(".");
    let current = dbContent;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]] || typeof current[keys[i]] !== "object") {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    this.writeDB(dbContent);
  }

  get(key: string): any {
    const dbContent = this.readDB();
    const keys = key.split(".");
    let current = dbContent;

    for (const part of keys) {
      if (current[part] === undefined) return null;
      current = current[part];
    }

    return current;
  }

  getAll(): Record<string, any> {
    return this.readDB();
  }

  has(key: string): boolean {
    const dbContent = this.readDB();
    const keys = key.split(".");
    let current = dbContent;

    for (const part of keys) {
      if (current[part] === undefined) return false;
      current = current[part];
    }

    return true;
  }

  delete(key: string): void {
    const dbContent = this.readDB();
    const keys = key.split(".");
    let current = dbContent;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]] || typeof current[keys[i]] !== "object") return;
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    if (current[lastKey] !== undefined) {
      delete current[lastKey];
      this.writeDB(dbContent);
    }
  }

  deleteAll(message: ApproveMessage): string | void {
    if (!message) {
      return "You must provide a confirmation message to delete all data.";
    }

    this.writeDB({});
  }

  push(key: string, value: any): void {
    const dbContent = this.readDB();
    const keys = key.split(".");
    let current = dbContent;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]] || typeof current[keys[i]] !== "object") {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    if (!Array.isArray(current[lastKey])) {
      current[lastKey] = [];
    }

    current[lastKey].push(value);
    this.writeDB(dbContent);
  }

  unpush(key: string, value?: any): void {
    const dbContent = this.readDB();
    const keys = key.split(".");
    let current = dbContent;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]] || typeof current[keys[i]] !== "object") return;
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    if (Array.isArray(current[lastKey])) {
      if (value === undefined) {
        delete current[lastKey];
      } else {
        current[lastKey] = current[lastKey].filter(
          (item: any) => item !== value
        );
      }
      this.writeDB(dbContent);
    }
  }
}
