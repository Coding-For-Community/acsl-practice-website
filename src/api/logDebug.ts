export function logDebug(msg: any, json?: any) {
  if (import.meta.env.PROD) {
    return
  }
  if (json == null) {
    console.log(msg)
  } else {
    console.log(msg + JSON.stringify(json))
  }
}
