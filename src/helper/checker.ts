import axios from "axios";

export function checker(version: string) {
  axios
    .get("https://api.metehanstudio.com/api/npm/metusdb-test")
    .then((response) => {
      if (response.data?.version !== version)
        console.error(
          `Please use our current version ${response.data?.version}`
        );
      console.warn(
        "\x1b[33m%s\x1b[0m",
        "Please download the current version of the module: npm install metus.db"
      );

      process.exit(0);
    });
}
