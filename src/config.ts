
export const getEnv = (key: string, def?: string): string  => {
  const { env } = process
  const value = env[key] || def;
  if(typeof value !== 'string'){
    throw new Error(`env ${key} did not found in env`)
  }
  return value
}


export const sequence_id = getEnv("CRAWLORA_SEQUENCE_ID"); // provided by default

export const apikey = getEnv('CRAWLORA_AUTH_KEY'); // provided by default
export const showBrowser = getEnv('SHOW_BROWSER', 'false') === 'true' 
