/**
 * Pretty print any data to the console for debugging (TypeScript version).
 * @param  {...unknown} args - Values to dump
 */
export function dump(...args: unknown[]): void {

  console.log('\x1b[34m%s\x1b[0m',"══════════ DUMP START ══════════");
  
  args.forEach((arg, index) => {
    const type = Array.isArray(arg) ? "array" : typeof arg;
    console.log(`\n[${index + 1}] Type: ${type}`);
    try {
      console.log('\x1b[33m%s\x1b[0m',JSON.stringify(arg, null, 2));
    } catch {
      console.log(arg); // Fallback for circular structures
    }
  });

  console.log('\x1b[34m%s\x1b[0m',"══════════ DUMP END ════════════");
}


export function toLowerNoSpaces(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '');
}
