import axios from "axios";

//! burası ilerideki versiyonlar için ayarlanmışttır şu anlık kullanılmıyor.

/**
 * 
 * @param webhookUrl The URL of the webhook to set.
 * @example
 * ```typescript
 * import { setLogger } from "metus.db";
 * setLogger('https://example.com/webhook')
 * ```
 * @returns 
 */
export function setLogger(webhookUrl: string): Promise<string> {
  const data = {
    embeds: [{ title: "asdasd", description: "asdasd" }],
  };

  return axios
    .post(webhookUrl, data)
    .then((response) => {
      console.log(response.data);
      return "Webhook set successfully!";
    })
    .catch((error) => {
      console.error(error);
      throw new Error("Failed to set webhook");
    });
}
