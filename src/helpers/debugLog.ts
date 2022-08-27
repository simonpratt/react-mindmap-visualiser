const DEBUG_ENABLED = false;

export const debugLog = (message?: any, ...optionalParams: any[]) => {
  if (DEBUG_ENABLED) {
    console.debug(message, optionalParams);
  }
};
